# ece-master
Interactive Electronics Learning Platform

## Note Gate — Circuit Puzzle (Prototype)

This is a small browser prototype to teach the voltage divider (Ohm's law) using an interactive gate mechanic.

### Files
- `index.html` — main UI (open in browser)
- `style.css` — styles
- `simulation.js` — small simulation helper (UMD)
- `main.js` — UI logic and puzzle behavior
- `test_vout.js` — node test for `computeVout`

### How to run
- Open `index.html` in a modern browser to play.
- The prototype now includes multiple levels and a simple scoring system. Use the sliders to match the target Vout. When you match the target within the tolerance the gate opens and you can advance to the next level.
- If you have Node.js installed, run tests:

```powershell
node test_vout.js
```

### Design notes
- Level: beginner ECE (voltage dividers)
- Mechanic: adjust R1 and R2 to match a target Vout. Gate opens when within tolerance.

### Next steps (optional)
- Add more levels and scoring
- Add visual wiring/diagram
- Provide guided lessons and explanations
