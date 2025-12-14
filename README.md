# KeyFlow

A small, dependency-free typing trainer inspired by [keybr.com].  
Built with plain HTML, CSS and JavaScript. No frameworks, no AI, no backend.

The goal of this project is to recreate the feel of keybr’s lesson screen:
pseudo-word stream, per-key heatmap, clean dark UI, and simple learning
metrics you can actually read.
---
## Features

- **Keybr-like UI**
  - Dark minimalist layout
  - Dotted word separators (`word • word • word`)
  - Underline for current word and blinking caret on the current character
- **Typing metrics**
  - Live WPM, accuracy and score
  - Per-lesson summary (errors, typo percentage)
  - Simple “learning rate” based on previous lesson
- **Pseudo-word generator**
  - Random, pronounceable “words” built from syllables
  - Keeps the focus on finger movement, not English vocabulary
- **Per-key statistics**
  - Presses and errors tracked per key
  - “All keys” strip with per-key tiles
  - On-screen keyboard heatmap:
    - green = strong
    - yellow = needs work
    - red = weak
- **Daily goal**
  - Configurable daily target (default: 30 minutes)
  - Progress bar with percentage completed
  - Uses `localStorage` with date-based keys
- **Mobile-friendly**
  - Hidden input to summon virtual keyboard
  - Layout scales down for smaller screens
- **No build step**
  - Just open `index.html` in a browser
---
## Tech stack

- HTML5
- CSS3 (no preprocessors, no frameworks)
- Vanilla JavaScript (ES6+)
- `localStorage` for daily goal tracking
---
## Getting started

Clone the repo:

```bash
git clone https://github.com/<your-username>/keybr-style-typing-trainer.git
cd keybr-style-typing-trainer
```
Run it locally:

Option 1: double-click index.html and open it in your browser.

Option 2 (recommended): serve it with a tiny static server, e.g.:

# Python 3
python -m http.server 8000
# then visit http://localhost:8000

No additional setup is required.
---
Project structure
```
├── index.html   # main page, layout + markup
├── styles.css   # keybr-style dark theme + keyboard + metrics
└── script.js    # typing logic, metrics, heatmap, daily goal
```
---
## index.html
- Top metrics block (speed, accuracy, score, current key, daily goal)
- Typing line
- On-screen keyboard
- Footer controls (restart, new lesson)

## styles.css
- Keybr-like dark palette
- Layout for metrics and typing area
- Keyboard tiles and heatmap colors
- Caret animation and current-word underline

## script.js
- Pseudo-word generator
- Typing state machine
- Per-key stats and heatmap
- Lesson results, learning rate
- Daily goal persistence via `localStorage`
---
# Implementation details
## Pseudo-word generation

Words are generated from a small set of syllables:
```
const syllables = [
  "ka", "te", "lo", "mi", "su", "ra", "ve", "ni", "do", "fi",
  "la", "po", "re", "gi", "ta", "na", "si", "co", "lu", "za"
]; 
```
### Pseudo-word generation

For each word:

- Pick 2–3 random syllables
- Concatenate them
- Join all words with a normal space
- In the renderer, spaces are displayed as `•` so the line matches keybr’s look

Adjust the `syllables` array or word count to change the “language” or difficulty.

---

### Metrics

Runtime metrics are derived from:

- `correctCount`
- `errorCount`
- `totalTyped`
- `startTime`
---
### WPM calculation

WPM uses the standard “5 characters per word” formula:

```js
const words = correctCount / 5;
const minutes = elapsedSeconds / 60;
const wpm = Math.round(words / minutes);
```
#Score calculation

##Score is a simple combination of WPM and accuracy:
```
js
Copy code
const score = Math.round(wpm * (accuracy / 100));
```
### Per-key stats and heatmap

Each key is tracked inside `keyStats`:

```js
const keyStats = {
  a: { presses: 0, errors: 0 },
  // ...
};
```
---
Heatmap colors are derived from per-key accuracy:
```
accuracy = 1 - errors / presses;
```
## Accuracy bands:

` > 95% → green`
` > 80% → yellow`
- `otherwise → red`
- `Both the on-screen keyboard tiles and the “All keys” strip use this accuracy`
- `to display their color state.`
---
## Daily goal

Daily progress is stored under a date-based key:
```
const key = `tt_daily_${YYYY}-${M}-${D}`;
localStorage.setItem(key, totalSeconds);
```

Configuration:
```
const DAILY_GOAL_MINUTES = 30;
```
Here is the exact block rewritten with **proper Markdown bullet points and section formatting**, ready to paste into your README:
---
## Customisation

Quick places to tweak:

- **Lesson length**  
  Change the argument passed to `generatePseudoWords(wordCount)`.

- **Color scheme**  
  Edit the CSS custom properties inside `:root` in `styles.css`.

- **Syllable set / language feel**  
  Modify the `syllables` array in `script.js`.

- **Daily goal**  
  Update `DAILY_GOAL_MINUTES` in `script.js`.

---

## Roadmap / Ideas

Possible future enhancements:

- Support for multiple keyboard layouts (QWERTY / AZERTY / Colemak)
- Adjustable lesson length and difficulty levels
- Optional sound feedback for errors
- Per-session history and progress charts (client-side only)
- Export/import user settings and statistics

---

## Contributing

Issues and pull requests are welcome.

Guidelines:

- No build step or bundler  
- No external runtime dependencies  
- Keep the UI simple and close to the keybr style  

---

## License

MIT License. See `LICENSE` for details.
