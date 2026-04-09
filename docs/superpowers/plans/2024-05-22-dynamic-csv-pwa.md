# Dynamic CSV Stacked Graph PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a PWA that allows dynamic selection of CSV columns to generate a stacked bar chart.

**Architecture:** Single-page application with a central state object, a reactive parser, and a Chart.js renderer.

**Tech Stack:** Vanilla JS, Chart.js, Vite, vite-plugin-pwa.

---

### Task 1: Project Scaffolding & Base UI

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `src/main.js`
- Test: `index.html`

- [ ] **Step 1: Write basic HTML structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSV Stacked Graph</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <div id="editor-container">
            <textarea id="csv-input" placeholder="Paste CSV here..."></textarea>
            <button id="generate-sample">Generate Sample</button>
        </div>
        <div id="config-container" class="hidden">
            <div class="config-group">
                <label>Date Column</label>
                <select id="date-col"></select>
            </div>
            <div class="config-group">
                <label>Series Column</label>
                <select id="series-col"></select>
            </div>
            <div class="config-group">
                <label>Value Column</label>
                <select id="value-col"></select>
            </div>
        </div>
        <div id="chart-container">
            <canvas id="chart-canvas"></canvas>
        </div>
        <div id="legend-container"></div>
        <div id="error-container" class="hidden"></div>
    </div>
    <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write basic CSS**

```css
body { font-family: sans-serif; margin: 20px; background: #f4f4f9; }
#app { display: flex; flex-direction: column; gap: 20px; }
#editor-container { display: flex; flex-direction: column; gap: 10px; }
#csv-input { height: 150px; font-family: monospace; }
.hidden { display: none; }
#config-container { display: flex; gap: 20px; padding: 10px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.config-group { display: flex; flex-direction: column; }
#chart-container { background: #fff; padding: 10px; border-radius: 8px; }
#error-container { color: red; font-weight: bold; }
```

- [ ] **Step 3: Implement minimal JS to load and verify**

```javascript
import './style.css';
console.log('App initialized');
```

- [ ] **Step 4: Run and verify**

Run: `npm run dev`
Expected: Page loads with textarea and buttons.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css src/main.js
git commit -m "feat: initial scaffolding and basic UI"
```

### Task 2: CSV Parser & State Management

**Files:**
- Modify: `src/main.js`
- Test: `src/parser.test.js` (will create)

- [ ] **Step 1: Implement CSV Parsing logic**

```javascript
export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
    });
    return { headers, rows };
}
```

- [ ] **Step 2: Integrate parser with UI and localStorage**

```javascript
// src/main.js snippet
let state = JSON.parse(localStorage.getItem('csv_state')) || {
    csvText: '',
    mappings: { date: '', series: '', value: '' },
    filters: []
};

function updateState(newState) {
    state = { ...state, ...newState };
    localStorage.setItem('csv_state', JSON.stringify(state));
    render();
}
// ... implementation of parsing and UI updates ...
```

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: implement CSV parser and state persistence"
```

### Task 3: Chart Rendering (Chart.js)

**Files:**
- Modify: `src/main.js`
- Install: `chart.js` (already in node_modules)

- [ ] **Step 1: Implement aggregation logic**

```javascript
function aggregateData(rows, mappings) {
    const groups = {}; // { '2023-01': { 'SeriesA': 10, 'SeriesB': 5 } }
    rows.forEach(row => {
        const date = row[mappings.date];
        const series = row[mappings.series];
        const val = parseFloat(row[mappings.value]);
        if (!date || !series || isNaN(val)) return;

        const month = date.substring(0, 7); // yyyy-mm
        if (!groups[month]) groups[month] = {};
        groups[month][series] = (groups[month][series] || 0) + val;
    });
    return groups;
}
```

- [ ] **Step 2: Implement Chart.js rendering**

```javascript
import Chart from 'chart.js/auto';

function renderChart(aggregatedData) {
    const ctx = document.getElementById('chart-canvas').getContext('2d');
    // Logic to convert groups to Chart.js datasets...
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: implement Chart.js integration and data aggregation"
```

### Task 4: Final Polish & PWA

- [ ] **Step 1: Add Legend/Filter functionality**
- [ ] **Step 2: Configure vite-plugin-pwa**
- [ ] **Step 3: Final Verify and Commit**
