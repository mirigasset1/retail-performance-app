// KPI Calculation Functions

/**
 * Calculate all KPIs for a store
 * @param {Object} store - Store data object
 * @returns {Object} Calculated KPIs
 */
function calculateKPIs(store) {
    const growth = calculateGrowth(store.sales.budget, store.sales.last_year);
    const budgetVsLastYear = ((store.sales.budget / store.sales.last_year) * 100 - 100).toFixed(1);
    
    // Calculate UPT (Units Per Transaction) - simulated based on sales
    const estimatedTransactions = Math.round(store.sales.budget / 45); // Average transaction value ~€45
    const estimatedUnits = Math.round(estimatedTransactions * 2.5); // Average 2.5 units per transaction
    const upt = (estimatedUnits / estimatedTransactions).toFixed(1);
    
    // Calculate SCO Usage (Self-Checkout) - simulated
    const scoUsage = Math.round(40 + Math.random() * 30); // Between 40-70%
    
    return {
        growth: growth,
        budgetVsLastYear: budgetVsLastYear,
        upt: upt,
        tellPrimark: store.tell_primark,
        reusableBags: store.reusable_bags,
        ras: store.ras,
        soiledDamaged: store.s_and_d,
        soh: store.soh,
        storeVsDepot: store.store_vs_depot,
        scoUsage: scoUsage
    };
}

/**
 * Calculate growth percentage
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Growth percentage
 */
function calculateGrowth(current, previous) {
    if (previous === 0) return 0;
    return ((current / previous) * 100 - 100).toFixed(1);
}

/**
 * Calculate average KPIs across all stores
 * @param {Array} stores - Array of store objects
 * @returns {Object} Average KPIs
 */
function calculateAverageKPIs(stores) {
    const totalStores = stores.length;
    
    const avgTellPrimark = (stores.reduce((sum, s) => sum + s.tell_primark, 0) / totalStores).toFixed(1);
    const avgReusableBags = Math.round(stores.reduce((sum, s) => sum + s.reusable_bags, 0) / totalStores);
    const avgRAS = (stores.reduce((sum, s) => sum + s.ras, 0) / totalStores).toFixed(1);
    const avgSD = (stores.reduce((sum, s) => sum + s.s_and_d, 0) / totalStores).toFixed(1);
    const avgSOH = Math.round(stores.reduce((sum, s) => sum + s.soh, 0) / totalStores);
    const avgStoreVsDepot = (stores.reduce((sum, s) => sum + s.store_vs_depot, 0) / totalStores).toFixed(1);
    
    const totalBudget = stores.reduce((sum, s) => sum + s.sales.budget, 0);
    const totalLastYear = stores.reduce((sum, s) => sum + s.sales.last_year, 0);
    const avgGrowth = calculateGrowth(totalBudget, totalLastYear);
    
    return {
        tellPrimark: avgTellPrimark,
        reusableBags: avgReusableBags,
        ras: avgRAS,
        soiledDamaged: avgSD,
        soh: avgSOH,
        storeVsDepot: avgStoreVsDepot,
        growth: avgGrowth,
        totalBudget: totalBudget,
        totalLastYear: totalLastYear
    };
}

/**
 * Get KPI status (good, warning, bad)
 * @param {string} kpiName - Name of the KPI
 * @param {number} value - KPI value
 * @returns {string} Status class
 */
function getKPIStatus(kpiName, value) {
    const thresholds = {
        tellPrimark: { good: 80, warning: 70 },
        ras: { good: 5, warning: 8 },
        soiledDamaged: { good: 5, warning: 7 },
        growth: { good: 10, warning: 0 },
        storeVsDepot: { good: 50, warning: 40 }
    };
    
    if (!thresholds[kpiName]) return '';
    
    const { good, warning } = thresholds[kpiName];
    
    // For metrics where lower is better
    if (kpiName === 'ras' || kpiName === 'soiledDamaged') {
        if (value <= good) return 'good';
        if (value <= warning) return 'warning';
        return 'bad';
    }
    
    // For metrics where higher is better
    if (value >= good) return 'good';
    if (value >= warning) return 'warning';
    return 'bad';
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return `€${amount.toLocaleString('es-ES')}`;
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @returns {string} Formatted percentage
 */
function formatPercentage(value) {
    return `${value}%`;
}

/**
 * Get top performing stores
 * @param {Array} stores - Array of store objects
 * @param {string} metric - Metric to sort by
 * @param {number} limit - Number of stores to return
 * @returns {Array} Top performing stores
 */
function getTopStores(stores, metric = 'tell_primark', limit = 5) {
    return [...stores]
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, limit);
}

/**
 * Get stores needing attention (low performers)
 * @param {Array} stores - Array of store objects
 * @param {string} metric - Metric to sort by
 * @param {number} limit - Number of stores to return
 * @returns {Array} Stores needing attention
 */
function getStoresNeedingAttention(stores, metric = 'tell_primark', limit = 3) {
    return [...stores]
        .sort((a, b) => a[metric] - b[metric])
        .slice(0, limit);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateKPIs,
        calculateGrowth,
        calculateAverageKPIs,
        getKPIStatus,
        formatCurrency,
        formatPercentage,
        getTopStores,
        getStoresNeedingAttention
    };
}