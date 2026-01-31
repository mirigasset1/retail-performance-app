// Chart rendering functions using Chart.js

let barChartInstance = null;
let lineChartInstance = null;
let storeBarChartInstance = null;
let storeTrendChartInstance = null;

/**
 * Render bar chart comparing stores - RAS vs S&D
 * @param {Array} stores - Array of store objects
 */
function renderBarChart(stores) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (barChartInstance) {
        barChartInstance.destroy();
    }
    
    const labels = stores.map(s => s.name);
    const rasData = stores.map(s => s.ras);
    const sdData = stores.map(s => s.s_and_d);
    
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'RAS (%)',
                    data: rasData,
                    backgroundColor: 'rgba(0, 164, 206, 0.8)',
                    borderColor: 'rgba(0, 164, 206, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                },
                {
                    label: 'S&D (%)',
                    data: sdData,
                    backgroundColor: 'rgba(255, 136, 0, 0.8)',
                    borderColor: 'rgba(255, 136, 0, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 13,
                            weight: '600'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'IBM Plex Sans',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'IBM Plex Sans',
                        size: 13
                    },
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                        afterLabel: function(context) {
                            const datasetLabel = context.dataset.label;
                            const value = context.parsed.y;
                            
                            if (datasetLabel === 'RAS (%)') {
                                return value <= 5 ? '✅ Objetivo cumplido' : '⚠️ Por encima del objetivo (5%)';
                            } else if (datasetLabel === 'S&D (%)') {
                                return value <= 5 ? '✅ Objetivo cumplido' : '⚠️ Por encima del objetivo (5%)';
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 12,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render line chart showing KPI trends - Budget vs Last Year
 * @param {Array} stores - Array of store objects
 */
function renderLineChart(stores) {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }
    
    const labels = stores.map(s => s.name);
    const budgetData = stores.map(s => s.sales.budget);
    const lastYearData = stores.map(s => s.sales.last_year);
    
    lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Budget 2026',
                    data: budgetData,
                    borderColor: '#00a4ce',
                    backgroundColor: 'rgba(0, 164, 206, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00a4ce',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#008fb5',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'Last Year (LY)',
                    data: lastYearData,
                    borderColor: '#ff8800',
                    backgroundColor: 'rgba(255, 136, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ff8800',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#e67700',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 13,
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'IBM Plex Sans',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'IBM Plex Sans',
                        size: 13
                    },
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            const percentage = context.datasetIndex === 0 && context.parsed.y && lastYearData[context.dataIndex] 
                                ? ((value / lastYearData[context.dataIndex] - 1) * 100).toFixed(1) 
                                : null;
                            
                            let displayLabel = label + ': €' + value.toLocaleString();
                            if (percentage !== null && context.datasetIndex === 0) {
                                displayLabel += ` (${percentage >= 0 ? '+' : ''}${percentage}% vs LY)`;
                            }
                            return displayLabel;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 12
                        },
                        callback: function(value) {
                            return '€' + (value / 1000).toFixed(0) + 'k';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render store detail bar chart
 * @param {Object} store - Store object
 */
function renderStoreBarChart(store) {
    const ctx = document.getElementById('storeBarChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (storeBarChartInstance) {
        storeBarChartInstance.destroy();
    }
    
    const labels = ['Tell Primark', 'RAS', 'S&D', 'NOOS'];
    const data = [
        store.tell_primark,
        store.ras,
        store.s_and_d,
        store.store_vs_depot
    ];
    
    const backgroundColors = [
        store.tell_primark >= 80 ? 'rgba(0, 200, 81, 0.8)' : 'rgba(255, 136, 0, 0.8)',
        store.ras <= 5 ? 'rgba(0, 200, 81, 0.8)' : 'rgba(255, 136, 0, 0.8)',
        store.s_and_d <= 5 ? 'rgba(0, 200, 81, 0.8)' : 'rgba(255, 136, 0, 0.8)',
        store.store_vs_depot >= 50 ? 'rgba(0, 200, 81, 0.8)' : 'rgba(255, 136, 0, 0.8)'
    ];
    
    storeBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'KPI Value (%)',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'IBM Plex Sans',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'IBM Plex Sans',
                        size: 13
                    },
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render store sales trend chart (last 7 days - simulated)
 * @param {Object} store - Store object
 */
function renderStoreTrendChart(store) {
    const ctx = document.getElementById('storeTrendChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (storeTrendChartInstance) {
        storeTrendChartInstance.destroy();
    }
    
    // Generate simulated data for last 7 days
    const labels = [];
    const salesData = [];
    const budgetData = [];
    const dailyBudget = Math.round(store.sales.budget / 30);
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));
        
        // Simulate daily sales (80-120% of daily budget)
        const dailySales = Math.round(dailyBudget * (0.8 + Math.random() * 0.4));
        salesData.push(dailySales);
        budgetData.push(dailyBudget);
    }
    
    storeTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ventas Diarias',
                    data: salesData,
                    borderColor: '#00a4ce',
                    backgroundColor: 'rgba(0, 164, 206, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00a4ce',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Presupuesto Diario',
                    data: budgetData,
                    borderColor: '#ff8800',
                    backgroundColor: 'rgba(255, 136, 0, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 13,
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'IBM Plex Sans',
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'IBM Plex Sans',
                        size: 13
                    },
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': €' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 12
                        },
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'IBM Plex Sans',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update charts with filtered data
 * @param {Array} stores - Filtered array of store objects
 */
function updateCharts(stores) {
    renderBarChart(stores);
    renderLineChart(stores);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderBarChart,
        renderLineChart,
        renderStoreBarChart,
        renderStoreTrendChart,
        updateCharts
    };
}