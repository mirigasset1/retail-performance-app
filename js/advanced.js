// Advanced Features Module
// Cool features to make the dashboard more impressive

/**
 * Initialize advanced features
 */
function initAdvancedFeatures() {
    createLiveStatsCounter();
    createTopPerformersWidget();
    createRankingTable();
    createProgressBars();
    setupRealTimeUpdates();
    addSearchFunctionality();
    createComparisonMode();
}

/**
 * Live Stats Counter - Animated numbers on load
 */
function createLiveStatsCounter() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    kpiValues.forEach(element => {
        const target = parseFloat(element.textContent.replace(/[^0-9.-]/g, ''));
        if (isNaN(target)) return;
        
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                current = target;
                clearInterval(timer);
            }
            
            // Format based on original content
            if (element.textContent.includes('€')) {
                element.textContent = '€' + Math.round(current).toLocaleString();
            } else if (element.textContent.includes('%')) {
                element.textContent = current.toFixed(1) + '%';
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, duration / steps);
    });
}

/**
 * Top Performers Widget - Shows best and worst stores
 */
function createTopPerformersWidget() {
    const container = document.createElement('section');
    container.className = 'top-performers-section';
    container.innerHTML = '<h2>🏆 Top & Bottom Performers</h2>';
    
    const grid = document.createElement('div');
    grid.className = 'performers-grid';
    
    // Top 3 by Tell Primark
    const topByTP = [...storesData]
        .sort((a, b) => b.tell_primark - a.tell_primark)
        .slice(0, 3);
    
    // Bottom 3 by Tell Primark
    const bottomByTP = [...storesData]
        .sort((a, b) => a.tell_primark - b.tell_primark)
        .slice(0, 3);
    
    // Top performers card
    const topCard = document.createElement('div');
    topCard.className = 'performer-card top-card';
    topCard.innerHTML = `
        <h3>✨ Best in Tell Primark</h3>
        <div class="performer-list">
            ${topByTP.map((store, idx) => `
                <div class="performer-item">
                    <span class="rank">#${idx + 1}</span>
                    <span class="store-name">${store.name}</span>
                    <span class="score good">${store.tell_primark}%</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Bottom performers card
    const bottomCard = document.createElement('div');
    bottomCard.className = 'performer-card bottom-card';
    bottomCard.innerHTML = `
        <h3>⚠️ Need Attention</h3>
        <div class="performer-list">
            ${bottomByTP.map((store, idx) => `
                <div class="performer-item">
                    <span class="rank warning">#${idx + 1}</span>
                    <span class="store-name">${store.name}</span>
                    <span class="score warning">${store.tell_primark}%</span>
                </div>
            `).join('')}
        </div>
    `;
    
    grid.appendChild(topCard);
    grid.appendChild(bottomCard);
    container.appendChild(grid);
    
    // Insert after KPI cards
    const kpiSection = document.querySelector('.kpi-grid');
    if (kpiSection) {
        kpiSection.parentNode.insertBefore(container, kpiSection.nextSibling);
    }
}

/**
 * Ranking Table - Interactive sortable ranking
 */
function createRankingTable() {
    const section = document.createElement('section');
    section.className = 'ranking-section';
    section.innerHTML = `
        <h2>📊 Ranking de Tiendas</h2>
        <div class="ranking-controls">
            <button class="btn-sort active" data-metric="tell_primark">Tell Primark</button>
            <button class="btn-sort" data-metric="ras">RAS</button>
            <button class="btn-sort" data-metric="growth_up">Crecimiento</button>
            <button class="btn-sort" data-metric="soh">SOH</button>
        </div>
        <div id="rankingList" class="ranking-list"></div>
    `;
    
    // Insert before AI section
    const aiSection = document.querySelector('.ai-section');
    if (aiSection) {
        aiSection.parentNode.insertBefore(section, aiSection);
    }
    
    // Setup sorting
    const sortButtons = section.querySelectorAll('.btn-sort');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateRanking(btn.dataset.metric);
        });
    });
    
    // Initial ranking
    updateRanking('tell_primark');
}

/**
 * Update ranking display
 */
function updateRanking(metric) {
    const metricNames = {
        tell_primark: 'Tell Primark',
        ras: 'RAS',
        growth_up: 'Crecimiento',
        soh: 'SOH'
    };
    
    const isLowerBetter = metric === 'ras' || metric === 's_and_d';
    
    const sorted = [...storesData].sort((a, b) => {
        if (isLowerBetter) {
            return a[metric] - b[metric];
        }
        return b[metric] - a[metric];
    });
    
    const rankingList = document.getElementById('rankingList');
    if (!rankingList) return;
    
    rankingList.innerHTML = sorted.map((store, idx) => {
        const value = store[metric];
        const kpis = calculateKPIs(store);
        const status = getKPIStatus(metric === 'growth_up' ? 'growth' : metric, value);
        
        return `
            <div class="ranking-item" data-rank="${idx + 1}">
                <div class="rank-badge ${idx < 3 ? 'top' : ''}">#${idx + 1}</div>
                <div class="rank-store">
                    <strong>${store.name}</strong>
                    <small>Budget: ${formatCurrency(store.sales.budget)}</small>
                </div>
                <div class="rank-value ${status}">
                    ${metric.includes('percent') || metric === 'ras' || metric === 'tell_primark' || metric === 'growth_up' 
                        ? value.toFixed(1) + '%' 
                        : value.toLocaleString()}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Progress Bars for KPIs
 */
function createProgressBars() {
    const stores = storesData;
    
    stores.forEach(store => {
        // This will be added to individual store pages
        const kpiWithProgress = {
            tell_primark: { target: 80, label: 'Tell Primark' },
            ras: { target: 5, label: 'RAS', inverse: true },
            store_vs_depot: { target: 50, label: 'NOOS' }
        };
    });
}

/**
 * Real-time clock and date
 */
function setupRealTimeUpdates() {
    const header = document.querySelector('header .container');
    if (!header) return;
    
    const dateTimeDiv = document.createElement('div');
    dateTimeDiv.className = 'datetime-widget';
    header.appendChild(dateTimeDiv);
    
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeDiv.innerHTML = `
            <div class="datetime-content">
                <span class="date">${now.toLocaleDateString('es-ES', options)}</span>
            </div>
        `;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
}

/**
 * Search functionality
 */
function addSearchFunctionality() {
    const filterSection = document.querySelector('.filter-left');
    if (!filterSection) return;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Buscar tienda...';
    searchInput.className = 'store-search';
    searchInput.style.cssText = `
        padding: 0.6rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 0.95rem;
        min-width: 200px;
        transition: border-color 0.2s;
    `;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#storesTableBody tr');
        
        rows.forEach(row => {
            const storeName = row.querySelector('.store-link')?.textContent.toLowerCase() || '';
            if (storeName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    filterSection.appendChild(searchInput);
}

/**
 * Comparison Mode - Compare two stores side by side
 */
function createComparisonMode() {
    const section = document.createElement('section');
    section.className = 'comparison-section';
    section.innerHTML = `
        <h2>⚖️ Comparar Tiendas</h2>
        <div class="comparison-controls">
            <select id="compareStore1" class="compare-select">
                <option value="">Seleccionar tienda 1</option>
                ${storesData.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
            </select>
            <span class="vs-text">VS</span>
            <select id="compareStore2" class="compare-select">
                <option value="">Seleccionar tienda 2</option>
                ${storesData.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
            </select>
            <button id="compareBtn" class="btn-primary">Comparar</button>
        </div>
        <div id="comparisonResults" class="comparison-results hidden"></div>
    `;
    
    const mainContent = document.querySelector('main .container');
    if (mainContent) {
        mainContent.appendChild(section);
    }
    
    // Setup comparison
    document.getElementById('compareBtn')?.addEventListener('click', performComparison);
}

/**
 * Perform store comparison
 */
function performComparison() {
    const store1Name = document.getElementById('compareStore1')?.value;
    const store2Name = document.getElementById('compareStore2')?.value;
    
    if (!store1Name || !store2Name) {
        showNotification('⚠️ Selecciona dos tiendas para comparar', 'warning');
        return;
    }
    
    if (store1Name === store2Name) {
        showNotification('⚠️ Selecciona tiendas diferentes', 'warning');
        return;
    }
    
    const store1 = storesData.find(s => s.name === store1Name);
    const store2 = storesData.find(s => s.name === store2Name);
    
    const results = document.getElementById('comparisonResults');
    if (!results) return;
    
    results.classList.remove('hidden');
    
    const metrics = [
        { key: 'tell_primark', label: 'Tell Primark', suffix: '%' },
        { key: 'ras', label: 'RAS', suffix: '%', inverse: true },
        { key: 'store_vs_depot', label: 'NOOS', suffix: '%' },
        { key: 'soh', label: 'SOH', suffix: '' },
        { key: 'reusable_bags', label: 'Bolsas Reutilizables', suffix: '' }
    ];
    
    results.innerHTML = `
        <div class="comparison-grid">
            <div class="comparison-header">${store1.name}</div>
            <div class="comparison-header metric-header">Métrica</div>
            <div class="comparison-header">${store2.name}</div>
            
            ${metrics.map(metric => {
                const val1 = store1[metric.key];
                const val2 = store2[metric.key];
                const winner1 = metric.inverse ? val1 < val2 : val1 > val2;
                const winner2 = metric.inverse ? val2 < val1 : val2 > val1;
                
                return `
                    <div class="comparison-value ${winner1 ? 'winner' : ''}">${val1}${metric.suffix}</div>
                    <div class="comparison-metric">${metric.label}</div>
                    <div class="comparison-value ${winner2 ? 'winner' : ''}">${val2}${metric.suffix}</div>
                `;
            }).join('')}
        </div>
    `;
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedFeatures);
} else {
    // Already loaded
    setTimeout(initAdvancedFeatures, 100);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAdvancedFeatures,
        createLiveStatsCounter,
        createTopPerformersWidget,
        createRankingTable,
        performComparison
    };
}