// AI Recommendations Module
// This module generates AI-powered recommendations based on store KPIs
// Can be integrated with OpenAI or Gemini API in the future

/**
 * Generate AI recommendations for all stores
 * @param {Array} stores - Array of store objects
 */
function generateAIRecommendations(stores) {
    const aiResults = document.getElementById('aiResults');
    if (!aiResults) return;
    
    // Show loading state
    aiResults.classList.remove('hidden');
    aiResults.innerHTML = '<div class="loading"></div> Generando recomendaciones...';
    
    // Simulate AI processing delay
    setTimeout(() => {
        const recommendations = analyzeStoresAndRecommend(stores);
        displayRecommendations(recommendations, aiResults);
    }, 1500);
}

/**
 * Generate AI recommendations for a specific store
 * @param {Object} store - Store object
 */
function generateStoreAIRecommendations(store) {
    const aiResults = document.getElementById('aiStoreResults');
    if (!aiResults) return;
    
    // Show loading state
    aiResults.classList.remove('hidden');
    aiResults.innerHTML = '<div class="loading"></div> Analizando datos de la tienda...';
    
    // Simulate AI processing delay
    setTimeout(() => {
        const recommendations = analyzeStoreAndRecommend(store);
        displayRecommendations(recommendations, aiResults);
    }, 1500);
}

/**
 * Analyze all stores and generate recommendations
 * @param {Array} stores - Array of store objects
 * @returns {Array} Array of recommendation objects
 */
function analyzeStoresAndRecommend(stores) {
    const recommendations = [];
    
    // Identify stores with low Tell Primark scores
    const lowSatisfactionStores = stores.filter(s => s.tell_primark < 75);
    if (lowSatisfactionStores.length > 0) {
        recommendations.push({
            priority: 'high',
            category: 'Satisfacción del Cliente',
            message: `${lowSatisfactionStores.length} tienda(s) tienen Tell Primark por debajo del 75%: ${lowSatisfactionStores.map(s => s.name).join(', ')}. Recomendación: Revisar experiencia de cliente, formación del personal y tiempo de espera en caja.`
        });
    }
    
    // Identify stores with high S&D
    const highSDStores = stores.filter(s => s.s_and_d > 6);
    if (highSDStores.length > 0) {
        recommendations.push({
            priority: 'high',
            category: 'Soiled & Damaged',
            message: `${highSDStores.length} tienda(s) superan el 6% en S&D: ${highSDStores.map(s => s.name).join(', ')}. Recomendación: Mejorar procesos de manipulación de stock, revisar almacenamiento y capacitar al equipo en manejo de productos.`
        });
    }
    
    // Identify stores with low reusable bags
    const avgBags = stores.reduce((sum, s) => sum + s.reusable_bags, 0) / stores.length;
    const lowBagsStores = stores.filter(s => s.reusable_bags < avgBags * 0.7);
    if (lowBagsStores.length > 0) {
        recommendations.push({
            priority: 'medium',
            category: 'Sostenibilidad',
            message: `${lowBagsStores.length} tienda(s) tienen ventas de bolsas reutilizables por debajo de la media: ${lowBagsStores.map(s => s.name).join(', ')}. Recomendación: Incrementar visibilidad en punto de venta, formar al personal en ventas sugestivas de bolsas reutilizables.`
        });
    }
    
    // Identify stores with low NOOS (Store vs Depot)
    const lowNOOSStores = stores.filter(s => s.store_vs_depot < 40);
    if (lowNOOSStores.length > 0) {
        recommendations.push({
            priority: 'medium',
            category: 'Stock Disponibilidad',
            message: `${lowNOOSStores.length} tienda(s) tienen NOOS por debajo del 40%: ${lowNOOSStores.map(s => s.name).join(', ')}. Recomendación: Revisar procesos de reposición, coordinar mejor con depósito, optimizar gestión de inventario.`
        });
    }
    
    // Identify top performers
    const topStores = [...stores].sort((a, b) => b.tell_primark - a.tell_primark).slice(0, 3);
    recommendations.push({
        priority: 'low',
        category: 'Mejores Prácticas',
        message: `Top 3 tiendas en Tell Primark: ${topStores.map(s => `${s.name} (${s.tell_primark}%)`).join(', ')}. Recomendación: Compartir best practices de estas tiendas con el resto de la red.`
    });
    
    // Overall network performance
    const avgTellPrimark = stores.reduce((sum, s) => sum + s.tell_primark, 0) / stores.length;
    const totalBudget = stores.reduce((sum, s) => sum + s.sales.budget, 0);
    const totalLastYear = stores.reduce((sum, s) => sum + s.sales.last_year, 0);
    const networkGrowth = ((totalBudget / totalLastYear) * 100 - 100).toFixed(1);
    
    recommendations.push({
        priority: 'low',
        category: 'Resumen General',
        message: `La red tiene un Tell Primark promedio de ${avgTellPrimark.toFixed(1)}% y un crecimiento del ${networkGrowth}% vs año pasado. ${networkGrowth > 15 ? '¡Excelente rendimiento!' : 'Hay oportunidad de mejora en ventas.'}`
    });
    
    return recommendations;
}

/**
 * Analyze a specific store and generate recommendations
 * @param {Object} store - Store object
 * @returns {Array} Array of recommendation objects
 */
function analyzeStoreAndRecommend(store) {
    const recommendations = [];
    const kpis = calculateKPIs(store);
    
    // Tell Primark analysis
    if (store.tell_primark < 75) {
        recommendations.push({
            priority: 'high',
            category: 'Satisfacción del Cliente',
            message: `Tell Primark está en ${store.tell_primark}%, por debajo del objetivo del 80%. Acciones recomendadas: (1) Reducir tiempo de espera en cajas, (2) Mejorar disponibilidad de tallas, (3) Capacitar al equipo en atención al cliente.`
        });
    } else if (store.tell_primark >= 90) {
        recommendations.push({
            priority: 'low',
            category: 'Satisfacción del Cliente',
            message: `¡Excelente! Tell Primark está en ${store.tell_primark}%. Mantener el enfoque en la experiencia del cliente y compartir best practices con otras tiendas.`
        });
    }
    
    // S&D analysis
    if (store.s_and_d > 6) {
        recommendations.push({
            priority: 'high',
            category: 'Soiled & Damaged',
            message: `S&D está en ${store.s_and_d}%, superior al objetivo del 5%. Acciones: (1) Revisar procesos de manipulación en recepción, (2) Mejorar almacenamiento en backroom, (3) Capacitar equipo en prevención de daños.`
        });
    }
    
    // RAS analysis
    if (store.ras > 8) {
        recommendations.push({
            priority: 'medium',
            category: 'Rate of Sale',
            message: `RAS está en ${store.ras}%, por encima del 5% objetivo. Considerar: (1) Revisar pricing strategy, (2) Analizar productos con baja rotación, (3) Implementar promociones focalizadas.`
        });
    }
    
    // Reusable bags analysis
    const avgBags = 80; // Network average (adjust based on actual data)
    if (store.reusable_bags < avgBags * 0.7) {
        recommendations.push({
            priority: 'medium',
            category: 'Sostenibilidad',
            message: `Ventas de bolsas reutilizables (${store.reusable_bags}) están por debajo de la media de la red. Acciones: (1) Aumentar visibilidad en punto de venta, (2) Formar al equipo en venta sugestiva, (3) Crear displays atractivos cerca de cajas.`
        });
    }
    
    // NOOS analysis
    if (store.store_vs_depot < 40) {
        recommendations.push({
            priority: 'high',
            category: 'Disponibilidad de Stock',
            message: `NOOS está en ${store.store_vs_depot}%, por debajo del 50% objetivo. Acciones urgentes: (1) Revisar procesos de reposición diaria, (2) Coordinar mejor con depósito, (3) Analizar quiebres de stock recurrentes.`
        });
    }
    
    // SOH analysis
    if (store.soh < 150) {
        recommendations.push({
            priority: 'medium',
            category: 'Stock Level',
            message: `SOH está en ${store.soh} unidades, nivel bajo. Considerar: (1) Revisar previsión de demanda, (2) Aumentar pedidos para categorías clave, (3) Coordinar transferencias entre tiendas.`
        });
    }
    
    // Growth analysis
    if (parseFloat(kpis.growth) < 10) {
        recommendations.push({
            priority: 'medium',
            category: 'Crecimiento de Ventas',
            message: `Crecimiento vs año pasado está en ${kpis.growth}%. Para mejorar: (1) Analizar competencia local, (2) Revisar mix de producto, (3) Implementar acciones de marketing local, (4) Optimizar visual merchandising.`
        });
    } else {
        recommendations.push({
            priority: 'low',
            category: 'Crecimiento de Ventas',
            message: `¡Excelente crecimiento de ${kpis.growth}% vs año pasado! Mantener el momentum con acciones similares y compartir estrategias exitosas.`
        });
    }
    
    return recommendations;
}

/**
 * Display recommendations in the UI
 * @param {Array} recommendations - Array of recommendation objects
 * @param {HTMLElement} container - Container element to display recommendations
 */
function displayRecommendations(recommendations, container) {
    if (recommendations.length === 0) {
        container.innerHTML = '<p>No se encontraron recomendaciones en este momento.</p>';
        return;
    }
    
    // Sort by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    let html = '<h3>🤖 Recomendaciones AI</h3><ul>';
    
    recommendations.forEach(rec => {
        const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        html += `
            <li>
                <strong>${priorityIcon} ${rec.category}:</strong><br>
                ${rec.message}
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
}

/**
 * Future: Integration with OpenAI API
 * @param {Array} stores - Array of store objects
 */
async function getOpenAIRecommendations(stores) {
    // Placeholder for OpenAI integration
    // This would make an API call to OpenAI with store data
    console.log('OpenAI integration coming soon...');
    
    // Example implementation:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `Analyze this retail data and provide actionable recommendations: ${JSON.stringify(stores)}`
            }]
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
    */
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateAIRecommendations,
        generateStoreAIRecommendations,
        analyzeStoresAndRecommend,
        analyzeStoreAndRecommend,
        displayRecommendations,
        getOpenAIRecommendations
    };
}