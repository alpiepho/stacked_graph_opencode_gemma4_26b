# Design Document: Dynamic CSV Stacked Graph PWA

## Overview
A highly interactive Progressive Web App (PWA) that visualizes CSV transaction data using stacked bar charts. Unlike static implementations, this version allows users to dynamically define which columns represent the date, the series (stacking category), and the numeric value after parsing the CSV.

## Core Features
- **Dynamic CSV Parsing**: Automatically detects headers from the provided CSV text.
- **User-driven Column Mapping**: Interactive selectors to assign **Date**, **Series**, and **Value** roles to existing CSV columns.
- **Dynamic Filtering**: Ability to toggle categories (series) on/off via a legend to focus on specific data subsets.
- **Persistent State**: Saves the CSV content and all configuration (column mappings, filters) to `localStorage`.
- **Responsive Visualization**: A Chart.js-powered stacked bar chart that updates in real-time as data or configuration changes.

## Technical Architecture

### Data Flow
1. **Input**: User edits CSV text in the editor.
2. **Parsing**: The parser identifies column headers.
3. **Configuration**: User selects which columns correspond to Date, Series, and Value.
4. **Aggregation**: The app aggregates the raw CSV rows into time-based buckets (monthly) based on the selected Date column.
5. **Rendering**: The Chart.js instance updates the stacked bar chart view.

### Component Breakdown
- **CSV Editor**: A text area for manual CSV manipulation.
- **Column Mapper**: A configuration UI to map CSV headers to functional roles (Date, Series, Value).
- **Chart Container**: The wrapper for the Chart.js canvas.
- **Legend/Filter UI**: A list of available series with checkboxes to toggle visibility.
- **Error/Notification System**: Displays parsing errors (e.g., invalid number formats) or confirmation of state changes.

### Data Schema (Internal)
- **Raw Data**: Array of objects representing CSV rows.
- **Mappings**: Object mapping roles (`date`, `_.series`, `value`) to column names.
- **Aggregated Data**:
  - `label`: The time period (e.g., "2023-10").
  - `datasets`: Array of objects, each containing a `label` (series name) and `data` (array of values).

## Implementation Details
- **Framework**: Vanilla JavaScript (for performance and lightness).
- **Charting Library**: Chart.js.
- **Storage**: Web `localStorage`.
- **Parsing Strategy**: Split by line, then by delimiter (comma), and map headers to values.

## Error Handling
- **Invalid Numeric Data**: If a row contains a non-numeric value in the selected "Value" column, a notification is triggered, and the row is skipped or treated as zero.
- **Missing Columns**: If a required mapping is missing, the UI prompts the user to complete the configuration.
- **Malformed CSV**: Textarea validation to ensure consistent delimiter usage.
