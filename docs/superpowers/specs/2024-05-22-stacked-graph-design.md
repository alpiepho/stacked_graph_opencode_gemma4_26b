# Design Document: Stacked Graph PWA

## Overview
A lightweight, highly interactive Progressive Web App (PWA) designed to visualize financial transaction data from a CSV format using stacked bar charts. The app allows users to paste, edit, and generate sample CSV data, with real-time chart updates and persistent settings.

## Core Features
- **CSV Input**: A collapsible, editable text area for pasting or manually entering CSV data.
- **Sample Data Generation**: A single-click utility to populate the text area with valid, structured transaction data for testing.
- **Reactive Visualizations**: A stacked bar chart (using Mermaid.js `xychart-beta`) that updates automatically as the CSV is modified.
- **Data Aggregation**: Automatic parsing of CSV rows into monthly bins (format: `yyyy-mm-dd`).
- **Interactive Filtering**: A color key with checkboxes to toggle specific data series (e.g., specific accounts or categories) on/off.
- **Rich Tooltips**: Hover interactions showing detailed breakdowns (Black, Blue, Red amounts, and Total).
- **Persistence**: All user configurations (CSV content, active filters, etc.) are saved to and loaded from `localStorage`.
- **PWA Capabilities**: Offline support, manifest for installation, and deployment via GitHub Pages.

## Technical Stack
- **Build Tool**: Vite
- **Language**: Vanilla JavaScript (ES6+)
- **Chart Engine**: Mermaid.js (`xychart-beta`)
- **PWA Plugin**: `vite-plugin-pwa`
- **Styling**: Standard CSS (or CSS Modules)
- **Deployment**: GitHub Pages (via GitHub Actions)

## Architecture (Approach 1: Single-Source Single-Event)
The application follows a reactive, unidirectional data flow pattern.

### 1. State Management
A central `state` object serves as the Single Source of Truth:
```javascript
const state = {
  rawCSV: "",           // The current text in the text area
  parsedData: [],       // Structured, aggregated monthly data
  activeFilters: [],    // Set of currently visible series/categories
  lastUpdated: null     // Timestamp for sync/persistence
};
```

### 2. Data Flow
1.  **Input/Trigger**: User edits CSV, clicks "Generate Sample", or toggs a checkbox.
2.  **Debounced Parsing**: 
    - A `debounce` function waits for a pause in user input.
    - The `Parser` module reads `state.rawCSV`.
    - It calculates monthly aggregates based on `yyyy-mm-dd`.
3.  **Update State**: `state.parsedData` and `state.activeFilters` are updated.
4.  **Render**:
    - The `ChartEngine` regenerates the Mermaid.js chart string and updates the DOM.
    - The `UIController` updates the color key checkboxes and text area value.
5.  **Persist**: `state` is serialized to `localStorage`.

### 3. Components
- **`CSVEditor`**: Man    - **`CSVEditor`**: Manages the text area and its expand/collapse state.
- **`DataGenerator`**: Logic for creating placeholder transaction rows.
- **`ChartRenderer`**: The bridge between the parsed data and the Mermaid.js rendering logic.
- **`FilterLegend`**: Generates the interactive color key/checkboxes.
- **`StorageManager`**: Handles `localStorage` reads/writes.

## Data Schema (Source CSV)
The input CSV is expected to have the following columns:
`statement_type, statement_date, account, entry_type, transaction_date, effective_date, category, description, amount`

## Implementation Details: Charting
The chart will use the Mermaid `xychart-beta` syntax.
**Example generated syntax**:
```mermaid
xychart-beta
    title "Monthly Transactions"
    x-axis ["Jan", "Feb", "Mar"]
    yguard [0, 500, 1000]
    bar [100, 200, 300]
    bar [50, 150, 250]
```

## Success Criteria
- Chart updates within 300ms of text editing (post-debounce).
- Toggling a checkbox immediately recalculates and redraws the stacks.
- Refreshing the page restores the exact same CSV content and filter state.
- The app is installable on mobile/desktop via the PWA manifest.
