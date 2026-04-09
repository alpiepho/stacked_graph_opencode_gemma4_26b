import '../style.css';
import Chart from 'chart.js/auto';

/**
 * @typedef {Object} AppState
 * @property {string} csvText - The raw CSV string.
 * @property {Object} mappings - Column assignments: { date: string, series: string, value: string }.
 * @property {string[]} filters - Active series filters.
 * @property {string[]} headers - Parsed headers from the CSV.
 * @property {Object[]} rows - Parsed CSV rows.
 */

/** @type {AppState} */
let state = JSON.parse(localStorage.getItem('csv_state')) || {
    csvText: '',
    mappings: { date: '', series: '', value: '' },
    filters: [],
    headers: [],
    rows: []
};

function saveState() {
    localStorage.setItem('csv_state', JSON.stringify(state));
}

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

/**
 * Aggregates CSV rows into monthly buckets for a stacked bar chart.
 * @param {Object[]} rows - Array of parsed CSV rows.
 * @param {Object} mappings - Current column mappings.
 * @returns {{ labels: string[], datasets: Array<{label: string, data: number[]}> }}
 */
export function aggregateData(rows, mappings) {
    if (!mappings.date || !mappings.series || !mappings.value) return { labels: [], datasets: [] };

    const groups = {}; // { '2023-01': { 'Food': 100, 'Rent': 200 } }
    const allSeries = new Set();

    rows.forEach(row => {
        const dateStr = row[mappings.date];
        const series = row[mappings.series];
        const valStr = row[mappings.value];
        const val = parseFloat(valStr);

        if (!dateStr || !series || isNaN(val)) return;

        // Use YYYY-MM as the grouping key (assuming date format is YYYY-MM-DD)
        const month = dateStr.substring(0, 7); 
        
        if (!groups[month]) groups[month] = {};
        groups[month][series] = (groups[month][series] || 0) + val;
        allSeries.add(series);
    });

    const labels = Object.keys(groups).sort();
    const datasets = Array.from(allSeries).map(seriesName => {
        const data = labels.map(label => groups[label][seriesName] || 0);
        return {
            label: seriesName,
            data: data
        };
    });

    return { labels, datasets };
}

function updateColumnSelectors(headers) {
    const selects = ['date-col', 'series-col', 'value-col'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const type = id.replace('-col', '');
        const currentVal = state.mappings[type];
        el.innerHTML = '<option value="">-- Select --</option>' + 
            headers.map(h => `<option value="${h}" ${h === currentVal ? 'selected' : ''}>${h}</option>`).join('');
    });
}

function handleCSVChange(text) {
    state.csvText = text;
    const { headers, rows } = parseCSV(text);
    state.headers = headers;
    state.rows = rows;
    
    if (state.mappings.date && !headers.includes(state.mappings.date)) state.mappings.date = '';
    if (state.mappings.series && !headers.includes(state.mappings.series)) state.mappings.series = '';
    if (state.mappings.value && !headers.includes(state.mappings.value)) state.mappings.value = '';

    saveState();
    updateColumnSelectors(headers);
    
    const configContainer = document.getElementById('config-container');
    if (headers.length > 0) {
        configContainer.classList.remove('hidden');
    } else {
        configContainer.classList.add('hidden');
    }

    renderChart();
}

function handleMappingChange(type, value) {
    state.mappings[type] = value;
    saveState();
    handleCSVChange(state.csvText);
}

let chartInstance = null;

function renderChart() {
    const { labels, datasets } = aggregateData(state.rows, state.mappings);
    const ctx = document.getElementById('chart-canvas');
    if (!ctx) return;

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (labels.length === 0) return;

    const activeDatasets = datasets.filter(ds => !state.filters.includes(ds.label));

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: activeDatasets
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });

    updateLegend(datasets);
}

function updateLegend(datasets) {
    const container = document.getElementById('legend-container');
    if (!container) return;

    container.innerHTML = datasets.map(ds => `
        <label>
            <input type="checkbox" ${!state.filters.includes(ds.label) ? 'checked' : ''} 
                   data-series="${ds.label}">
            ${ds.label}
        </label>
    `).join('');

    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
            const series = e.target.dataset.series;
            if (e.target.checked) {
                state.filters = state.filters.filter(f => f !== series);
            } else {
                state.filters.push(series);
            }
            saveState();
            renderChart();
        });
    });
}

function init() {
    const input = document.getElementById('csv-input');
    const debugBtn = document.getElementById('generate-debug');
    
    input.value = state.csvText;
    handleCSVChange(state.csvText);

    input.addEventListener('input', (e) => handleCSVChange(e.target.value));

    if (debugBtn) {
        debugBtn.addEventListener('click', () => {
            const categories = ['Food', 'Rent', 'Utilities', 'Transport', 'Entertainment'];
            const rows = [];
            const startDate = new Date(2020, 0, 1);
            for (let i = 0; i < 500; i++) {
                const randomDay = Math.floor(Math.random() * 1500);
                const date = new Date(startDate.getTime() + randomDay * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                const amount = Math.floor(Math.random() * 200) + 10;
                const category = categories[Math.floor(Math.random() * categories.length)];
                rows.push(`${dateStr},${amount},${category}`);
            }
            const sample = `date,amount,category\n${rows.join('\n')}`;
            input.value = sample;
            handleCSVChange(sample);
        });
    }

    ['date-col', 'series-col', 'value-col'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => {
                const type = id.replace('-col', '');
                handleMappingChange(type, e.target.value);
            });
        }
    });

    console.log('App initialized');
}

document.addEventListener('DOMContentLoaded', init);
