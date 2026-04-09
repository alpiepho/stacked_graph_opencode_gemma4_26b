import { parseCSV } from './main.js';

describe('parseCSV', () => {
    test('parses simple CSV correctly', () => {
        const csv = 'date,amount,category\n2023-01-01,10,food\n2023-01-02,20,rent';
        const result = parseCSV(csv);
        expect(result.headers).toEqual(['date', 'amount', 'category']);
        expect(result.rows).toHaveLength(2);
        expect(result.rows[0]).toEqual({ date: '2023-01-01', amount: '10', category: 'food' });
    });

    test('handles empty CSV', () => {
        const csv = '';
        const result = parseCSV(csv);
        expect(result.headers).toEqual([]);
        expect(result.rows).toEqual([]);
    });

    test('handles missing values in rows', () => {
        const csv = 'date,amount\n2023-01-01,';
        const result = parseCSV(csv);
        expect(result.rows[0].amount).toBe('');
    });
});
