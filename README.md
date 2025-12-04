# Keybr-style Typing Trainer

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
