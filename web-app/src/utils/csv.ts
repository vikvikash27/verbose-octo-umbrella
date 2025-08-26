// Utility to download data as CSV
export const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
        alert("No data to export.");
        return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                let cell = row[header] === null || row[header] === undefined ? '' : row[header];
                // Handle objects by JSON stringifying them, and escape quotes
                if (typeof cell === 'object') {
                    cell = JSON.stringify(cell);
                }
                const cellString = String(cell);
                // Wrap in quotes if it contains a comma, double quote, or newline
                if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
                    return `"${cellString.replace(/"/g, '""')}"`;
                }
                return cellString;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
