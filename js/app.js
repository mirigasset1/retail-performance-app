// Main Application Logic

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

/**
 * Initialize the dashboard
 */
function initDashboard() {
    // Populate store filter
    populateStoreFilter();
    
    // Render initial KPI cards and table
    renderKPICards(storesData);
    renderStoresTable(storesData);
    
    // Render initial charts
    renderBarChart(storesData);
    renderLineChart(storesData);
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Populate store filter dropdown
 */
function populateStoreFilter() {
    const storeFilter = document.getElementById('storeFilter');
    if (!storeFilter) return;
    
    storesData.forEach(store => {
        const option = document.createElement('option');
        option.value = store.name;
        option.textContent = store.name;
        storeFilter.appendChild(option);
    });
}

/**
 * Render KPI summary cards
 * @param {Array} stores - Array of store objects
 */
function renderKPICards(stores) {
    const kpiCards = document.getElementById('kpiCards');
    if (!kpiCards) return;
    
    const avgKPIs = calculateAverageKPIs(stores);
    
    kpiCards.innerHTML = `
        <div class="kpi-card">
            <h3>Total Budget</h3>
            <p class="kpi-value">${formatCurrency(avgKPIs.totalBudget)}</p>
            <span class="kpi-label">Presupuesto mensual total</span>
        </div>
        <div class="kpi-card">
            <h3>Crecimiento</h3>
            <p class="kpi-value ${avgKPIs.growth >= 15 ? 'good' : avgKPIs.growth >= 0 ? 'warning' : 'bad'}">
                ${avgKPIs.growth >= 0 ? '+' : ''}${avgKPIs.growth}%
            </p>
            <span class="kpi-label">vs año pasado</span>
        </div>
        <div class="kpi-card">
            <h3>Tell Primark</h3>
            <p class="kpi-value ${getKPIStatus('tellPrimark', avgKPIs.tellPrimark)}">${avgKPIs.tellPrimark}%</p>
            <span class="kpi-label">Promedio de satisfacción</span>
        </div>
        <div class="kpi-card">
            <h3>Bolsas Reutilizables</h3>
            <p class="kpi-value">${avgKPIs.reusableBags}</p>
            <span class="kpi-label">Promedio por tienda</span>
        </div>
        <div class="kpi-card">
            <h3>RAS</h3>
            <p class="kpi-value ${getKPIStatus('ras', avgKPIs.ras)}">${avgKPIs.ras}%</p>
            <span class="kpi-label">Promedio de la red</span>
        </div>
        <div class="kpi-card">
            <h3>S&D</h3>
            <p class="kpi-value ${getKPIStatus('soiledDamaged', avgKPIs.soiledDamaged)}">${avgKPIs.soiledDamaged}%</p>
            <span class="kpi-label">Promedio de la red</span>
        </div>
    `;
}

/**
 * Render stores table
 * @param {Array} stores - Array of store objects
 */
function renderStoresTable(stores) {
    const tableBody = document.getElementById('storesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    stores.forEach(store => {
        const kpis = calculateKPIs(store);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><a href="store.html?store=${encodeURIComponent(store.name)}" class="store-link">${store.name}</a></td>
            <td class="${kpis.growth >= 10 ? 'good' : kpis.growth >= 0 ? 'warning' : 'bad'}">
                ${formatCurrency(store.sales.budget)} (${kpis.growth >= 0 ? '+' : ''}${kpis.growth}%)
            </td>
            <td class="${getKPIStatus('tellPrimark', store.tell_primark)}">${store.tell_primark}%</td>
            <td>${store.reusable_bags}</td>
            <td class="${getKPIStatus('ras', store.ras)}">${store.ras}%</td>
            <td class="${getKPIStatus('soiledDamaged', store.s_and_d)}">${store.s_and_d}%</td>
            <td>${store.soh}</td>
            <td>
                <a href="store.html?store=${encodeURIComponent(store.name)}" class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                    Ver Detalles
                </a>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Store filter
    const storeFilter = document.getElementById('storeFilter');
    if (storeFilter) {
        storeFilter.addEventListener('change', handleStoreFilter);
    }
    
    // Export CSV button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Import Excel button
    const importExcelBtn = document.getElementById('importExcelBtn');
    if (importExcelBtn) {
        importExcelBtn.addEventListener('click', importFromExcel);
    }
    
    // Export Template button
    const exportTemplateBtn = document.getElementById('exportTemplateBtn');
    if (exportTemplateBtn) {
        exportTemplateBtn.addEventListener('click', exportTemplateExcel);
    }
    
    // Reset Data button
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', resetData);
    }
    
    // AI Recommendations button
    const aiRecommendBtn = document.getElementById('aiRecommendBtn');
    if (aiRecommendBtn) {
        aiRecommendBtn.addEventListener('click', () => {
            const currentData = window.storesData || storesData;
            console.log('AI button clicked, using data:', currentData);
            generateAIRecommendations(currentData);
        });
    }
}

/**
 * Handle store filter change
 * @param {Event} event - Change event
 */
function handleStoreFilter(event) {
    const selectedStore = event.target.value;
    
    let filteredStores;
    if (selectedStore === 'all') {
        filteredStores = storesData;
    } else {
        filteredStores = storesData.filter(store => store.name === selectedStore);
    }
    
    // Update KPI cards, table, and charts
    renderKPICards(filteredStores);
    renderStoresTable(filteredStores);
    updateCharts(filteredStores);
}

/**
 * Export table data to CSV
 */
function exportToCSV() {
    const headers = ['Tienda', 'Presupuesto', 'Año Pasado', 'Crecimiento %', 'Tell Primark %', 'Bolsas Reutilizables', 'RAS %', 'S&D %', 'SOH', 'NOOS %'];
    
    const rows = storesData.map(store => {
        const kpis = calculateKPIs(store);
        return [
            store.name,
            store.sales.budget,
            store.sales.last_year,
            kpis.growth,
            store.tell_primark,
            store.reusable_bags,
            store.ras,
            store.s_and_d,
            store.soh,
            store.store_vs_depot
        ];
    });
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `retail_kpis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Load data from Google Sheets (placeholder)
 */
async function loadFromGoogleSheets() {
    try {
        // This would require Google Sheets API setup
        console.log('Google Sheets integration not yet configured');
        
        // Example implementation:
        /*
        const SHEET_ID = 'your-sheet-id';
        const API_KEY = 'your-api-key';
        const RANGE = 'Sheet1!A1:J100';
        
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
        );
        const data = await response.json();
        
        // Parse and transform data
        const stores = parseGoogleSheetsData(data.values);
        return stores;
        */
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        return null;
    }
}

/**
 * Parse Google Sheets data into store objects
 * @param {Array} rows - Raw rows from Google Sheets
 * @returns {Array} Array of store objects
 */
function parseGoogleSheetsData(rows) {
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => ({
        name: row[0],
        sales: {
            budget: parseFloat(row[1]),
            last_year: parseFloat(row[2])
        },
        soh: parseInt(row[3]),
        reusable_bags: parseInt(row[4]),
        tell_primark: parseFloat(row[5]),
        store_vs_depot: parseFloat(row[6]),
        growth_up: parseFloat(row[7]),
        ras: parseFloat(row[8]),
        s_and_d: parseFloat(row[9])
    }));
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        populateStoreFilter,
        renderKPICards,
        renderStoresTable,
        handleStoreFilter,
        exportToCSV,
        loadFromGoogleSheets,
        parseGoogleSheetsData
    };
}