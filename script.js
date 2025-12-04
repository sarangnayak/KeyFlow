// ----- pseudo-word generator -----
const syllables = [
  "ka", "te", "lo", "mi", "su", "ra", "ve", "ni", "do", "fi",
  "la", "po", "re", "gi", "ta", "na", "si", "co", "lu", "za"
];

const textDisplay = document.getElementById("textDisplay");

// top metrics
const speedValue = document.getElementById("speedValue");
const speedDelta = document.getElementById("speedDelta");
const accuracyValue = document.getElementById("accuracyValue");
const accuracyDelta = document.getElementById("accuracyDelta");
const scoreValue = document.getElementById("scoreValue");
const scoreDelta = document.getElementById("scoreDelta");
const accuracySummary = document.getElementById("accuracySummary");

// current key / learning
const currentKeyBox = document.getElementById("currentKeyBox");
const lastKeySpeed = document.getElementById("lastKeySpeed");
const topKeySpeed = document.getElementById("topKeySpeed");
const learningRateEl = document.getElementById("learningRate");

// daily goal
const goalBarInner = document.getElementById("goalBarInner");
const goalText = document.getElementById("goalText");

// per lesson stats
const restartBtn = document.getElementById("restartBtn");
const newTextBtn = document.getElementById("newTextBtn");
const hiddenInput = document.getElementById("hiddenInput");

// all-keys strip and keyboard
const allKeysRow = document.getElementById("allKeysRow");
const keyboardKeys = document.querySelectorAll(".kb-key[data-key]");

const DAILY_GOAL_MINUTES = 30;

// typing state
let generatedText = "";
let currentIndex = 0;
let started = false;
let startTime = null;
let timerInterval = null;
let correctCount = 0;
let errorCount = 0;
let totalTyped = 0;

// lesson history (in memory only)
let lastLesson = null;
let bestWpm = 0;
let bestScore = 0;
let learningRate = 0; // very simple: (currentWpm - previousWpm)

// per key stats
const keyStats = {}; // { key: {presses, errors} }

// ----- helper: generate text -----
function generatePseudoWords(wordCount = 30) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    const syllableCount = Math.floor(Math.random() * 2) + 2; // 2–3 syllables
    let word = "";
    for (let j = 0; j < syllableCount; j++) {
      word += syllables[Math.floor(Math.random() * syllables.length)];
    }
    words.push(word);
  }
  return words.join(" ");
}

// ----- rendering -----
function renderText(text) {
  textDisplay.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const span = document.createElement("span");
    span.classList.add("char");
    span.dataset.index = i;

    if (ch === " ") {
      span.textContent = "•";
      span.classList.add("space");
    } else {
      span.textContent = ch;
    }
    textDisplay.appendChild(span);
  }

  const first = textDisplay.querySelector('.char[data-index="0"]');
  if (first) {
    first.classList.add("current");
    markCurrentWord(0);
    updateCurrentKeyUI(generatedText[0]);
  }
}

// ----- state reset -----
function resetState(newText = null) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  generatedText = newText || generatePseudoWords();
  currentIndex = 0;
  started = false;
  startTime = null;
  correctCount = 0;
  errorCount = 0;
  totalTyped = 0;

  renderText(generatedText);
  updateStats(0);
  updateTopMetricsDeltas(null);
}

// ----- timer and stats -----
function startTimer() {
  startTime = performance.now();
  timerInterval = setInterval(() => {
    const elapsed = getElapsedSeconds();
    updateStats(elapsed);
    updateDailyGoal(elapsed);
  }, 100);
}

function getElapsedSeconds() {
  if (!startTime) return 0;
  return (performance.now() - startTime) / 1000;
}

function updateStats(elapsedSeconds) {
  const mins = elapsedSeconds / 60;
  const words = correctCount / 5;
  let wpm = 0;
  if (mins > 0.01) {
    wpm = Math.round(words / mins);
  }
  speedValue.textContent = `${wpm || 0} wpm`;

  const accuracy =
    totalTyped === 0 ? 0 : Math.max(0, (correctCount / totalTyped) * 100);
  accuracyValue.textContent = `${accuracy.toFixed(0)}%`;

  const score = Math.round(wpm * (accuracy / 100));
  scoreValue.textContent = `${score}`;

  const typoPercent = totalTyped === 0 ? 0 : (errorCount / totalTyped) * 100;
  accuracySummary.textContent =
    `Current lesson: ${accuracy.toFixed(1)}% accuracy, ` +
    `${errorCount} errors (${typoPercent.toFixed(1)}% typos).`;

  // update numeric display in metrics row "Chars" & "Errors" if you kept them
  // We already show them inside score, but you can add separate DOM if needed.
}

// update top metrics deltas after lesson finish
function updateTopMetricsDeltas(result) {
  speedDelta.textContent = "";
  speedDelta.className = "metrics-delta";

  accuracyDelta.textContent = "";
  accuracyDelta.className = "metrics-delta";

  scoreDelta.textContent = "";
  scoreDelta.className = "metrics-delta";

  if (!result || !lastLesson) return;

  const dw = result.wpm - lastLesson.wpm;
  const da = result.accuracy - lastLesson.accuracy;
  const ds = result.score - lastLesson.score;

  const setDelta = (el, value, suffix) => {
    if (value === 0) return;
    const sign = value > 0 ? "+" : "";
    el.textContent = `(${sign}${value.toFixed(1)}${suffix})`;
    el.classList.add(value >= 0 ? "positive" : "negative");
  };

  setDelta(speedDelta, dw, " wpm");
  setDelta(accuracyDelta, da, "%");
  setDelta(scoreDelta, ds, "");
}

// ----- current char and word -----
function setCurrentChar(index) {
  const prev = textDisplay.querySelector(".char.current");
  if (prev) prev.classList.remove("current");

  const next = textDisplay.querySelector(`.char[data-index="${index}"]`);
  if (next) {
    next.classList.add("current");
  }
  markCurrentWord(index);

  const nextChar = generatedText[index] || " ";
  updateCurrentKeyUI(nextChar);
}

function markCurrentWord(index) {
  textDisplay
    .querySelectorAll(".char.current-word")
    .forEach((el) => el.classList.remove("current-word"));

  if (index < 0 || index >= generatedText.length) return;

  let start = index;
  while (start > 0 && generatedText[start - 1] !== " ") start--;
  let end = index;
  while (end < generatedText.length && generatedText[end] !== " ") end++;

  for (let i = start; i < end; i++) {
    const span = textDisplay.querySelector(`.char[data-index="${i}"]`);
    if (span) span.classList.add("current-word");
  }
}

// ----- key handling -----
function isPrintableKey(key) {
  if (key.length === 1) return true;
  if (key === " ") return true;
  return false;
}

function handleKey(e) {
  const key = e.key;

  // start timer on first printable key
  if (!started && isPrintableKey(key)) {
    started = true;
    startTimer();
  }

  // backspace
  if (key === "Backspace") {
    e.preventDefault();
    if (currentIndex === 0) return;

    currentIndex -= 1;
    const span = textDisplay.querySelector(
      `.char[data-index="${currentIndex}"]`
    );
    if (!span) return;

    if (span.classList.contains("incorrect")) {
      errorCount = Math.max(0, errorCount - 1);
      totalTyped = Math.max(0, totalTyped - 1);
    } else if (span.classList.contains("correct")) {
      correctCount = Math.max(0, correctCount - 1);
      totalTyped = Math.max(0, totalTyped - 1);
    }

    span.classList.remove("correct", "incorrect");
    setCurrentChar(currentIndex);
    updateStats(getElapsedSeconds());
    return;
  }

  // ignore other control keys
  if (!isPrintableKey(key)) return;
  if (currentIndex >= generatedText.length) return;

  const expectedChar = generatedText[currentIndex];
  const span = textDisplay.querySelector(
    `.char[data-index="${currentIndex}"]`
  );
  if (!span) return;

  totalTyped++;

  // key stats for heatmap
  const normKey = key.toLowerCase();
  if (!keyStats[normKey]) keyStats[normKey] = { presses: 0, errors: 0 };
  keyStats[normKey].presses++;

  if (key === expectedChar) {
    span.classList.add("correct");
    correctCount++;
  } else {
    span.classList.add("incorrect");
    errorCount++;
    keyStats[normKey].errors++;
  }

  currentIndex++;
  setCurrentChar(currentIndex);
  updateStats(getElapsedSeconds());
  updateHeatmap();

  // lesson finished
  if (currentIndex >= generatedText.length) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    finishLesson();
  }
}

// ----- lesson finish -----
function finishLesson() {
  const elapsed = getElapsedSeconds();
  const mins = elapsed / 60;
  const words = correctCount / 5;
  const wpm = mins > 0 ? Math.round(words / mins) : 0;
  const accuracy =
    totalTyped === 0 ? 0 : Math.max(0, (correctCount / totalTyped) * 100);
  const score = Math.round(wpm * (accuracy / 100));

  const result = { wpm, accuracy, score };

  if (lastLesson) {
    learningRate = result.wpm - lastLesson.wpm;
  } else {
    learningRate = 0;
  }
  lastLesson = result;

  if (wpm > bestWpm) bestWpm = wpm;
  if (score > bestScore) bestScore = score;

  learningRateEl.textContent = `${learningRate >= 0 ? "+" : ""}${learningRate.toFixed(
    1
  )} wpm/lesson`;

  updateTopMetricsDeltas(result);
  persistDailyGoal(elapsed);
}

// ----- heatmap (all keys row + keyboard) -----
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

function initAllKeysRow() {
  LETTERS.forEach((ch) => {
    const span = document.createElement("span");
    span.textContent = ch.toUpperCase();
    span.classList.add("key-badge");
    span.dataset.key = ch;
    allKeysRow.appendChild(span);
  });
}

function getKeyAccuracy(stat) {
  if (!stat || stat.presses === 0) return null;
  return 1 - stat.errors / stat.presses;
}

function classForAccuracy(acc) {
  if (acc === null) return "";
  if (acc > 0.95) return "good";
  if (acc > 0.8) return "mid";
  return "bad";
}

function shadeForAccuracy(acc) {
  if (acc === null) return "#34363a";
  if (acc > 0.95) return "var(--heat-good)";
  if (acc > 0.8) return "var(--heat-mid)";
  return "var(--heat-bad)";
}

function updateHeatmap() {
  // all keys row
  allKeysRow.querySelectorAll(".key-badge").forEach((el) => {
    const k = el.dataset.key;
    const acc = getKeyAccuracy(keyStats[k]);
    el.style.background = shadeForAccuracy(acc);
  });

  // keyboard tiles
  keyboardKeys.forEach((el) => {
    const key = (el.dataset.key || "").toLowerCase();
    const acc = getKeyAccuracy(keyStats[key]);
    el.classList.remove("good", "mid", "bad");
    if (acc === null) return;
    el.classList.add(classForAccuracy(acc));
  });
}

// current key UI
let lastActiveKeyEl = null;
function updateCurrentKeyUI(char) {
  currentKeyBox.t

