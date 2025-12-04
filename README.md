# Keybr-style Typing Trainer

A small, dependency-free typing trainer inspired by [keybr.com].  
Built with plain HTML, CSS and JavaScript. No frameworks, no AI, no backend.

The goal of this project is to recreate the feel of keybr’s lesson screen:
pseudo-word stream, per-key heatmap, clean dark UI, and simple learning
metrics you can actually read.



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



## Tech stack

- HTML5
- CSS3 (no preprocessors, no frameworks)
- Vanilla JavaScript (ES6+)
- `localStorage` for daily goal tracking



## Getting started

Clone the repo:

```bash
git clone https://github.com/<your-username>/keybr-style-typing-trainer.git
cd keybr-style-typing-trainer
```
