import './style.css';
import { parseCSV } from './main.js';

// --- State Management ---

/**
 * @typedef {Object} AppState
 * @property {string} csvText - The raw CSV string.
 * @property {Object} mappings - Column assignments: { date: string, series: string, value: string }.
 * @property {string[]} filters - Active series filters.
 * @property {string[]} headers - Parsed headers from the CSV.
 */

/** @type {AppState} */
let state = JSON.parse(localStorage.getItem('csv_state')) || {
    csvText: '',
    mappings: { date: '', series: '', value: '' },
    filters: [],
    headers: []
};

function saveState() {
    localStorage.setItem('csv_state', JSON.stringify(state));
}

// --- Parser & Logic ---

/**
 * Parses CSV text into an array of objects.
 * @param {string} text 
 * @returns {{headers: string[], rows: Object[]}}
 */
export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length === 0 || lines[0].trim() === '') {
        return { headers: [], rows: [] };
    }
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] !== undefined ? values[i] : '';
        });
        return obj;
    });
    return { headers, rows };
}

// --- UI Controller ---

function updateColumnSelectors(headers) {
    const selects = ['date-col', 'series-col', 'value-col'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        const currentVal = state.mappings[id.replace('-col', '')];
        el.innerHTML = '<option value="">-- Select --</option>' + 
            headers.map(h => `<option value="${h}" ${h === currentVal ? 'selected' : ''}>${h}</option>`).join('');
    });
}

function handleCSVChange(text) {
    state.csvText = text;
    const { headers, rows } = parseCSV(text);
    state.headers = headers;
    
    // Reset mappings if headers changed significantly
    if (state.mappings.date && !headers.includes(state.mappings.date)) {
        state.mappings.date = '';
    }
    if (state.mappings.series && !headers.includes(state.mappings.series)) {
        state.mappings.series = '';
    }
    if (state.mappings.value && !headers.includes(state.mappings.value)) {
        state.mappings.value = '';
    }

    saveState();
    updateColumnSelectors(headers);
    
    // Show/Hide config container
    const configContainer = document.getElementById('config-container');
    if (headers.length > 0) {
        configContainer.classList.remove('hidden');
    } else {
        configContainer.classList.add('hidden');
    }
}

function handleMappingChange(type, value) {
    state.mappings[type] = value;
    saveState();
    // In a real app, this would trigger a re-render of the chart
    console.log('Mapping updated:', state.mappings);
}

// --- Initialization ---

function init() {
    const input = document.getElementById('csv-input');
    const debugBtn = document.getElementById('generate-debug');
    
    // Load initial data
    input.value = state.csvText;
    handleCSVChange(state.csvText);

    input.addEventListener('input', (e) => handleCSVChange(e.target.value));

    debugBtn.addEventListener('click', () => {
        const sample = 'date,amount,category\n2023-01-01,100,Food\n2023-01-15,200,Rent\n2023-02-01,50,Food\n2023-02-15,300,Rent';
        input.value = sample;
        handleCSVChange(sample);
        console.log('Sample data loaded');
    });

    ['date-col', 'series-col', 'value-col'].forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
            const type = id.replace('-col', '');
            handleMappingChange(type, e.target.value);
        });
    });

    console.log('App initialized with state:', state);
}

document.addEventListener('DOMContentLoaded', init);
