// Excel Import Module
// Allows Area Managers to upload Excel files and update dashboard data

/**
 * Load SheetJS library if not already loaded
 */
async function loadSheetJS() {
    if (typeof XLSX !== 'undefined') {
        return true;
    }
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
        script.onload = () => {
            console.log('✅ SheetJS library loaded');
            resolve(true);
        };
        script.onerror = () => {
            console.error('❌ Failed to load SheetJS');
            reject(false);
        };
        document.head.appendChild(script);
    });
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.getElementById('notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Import data from Excel file
 */
async function importFromExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        showNotification('📊 Procesando archivo Excel...', 'info');
        
        try {
            // Load SheetJS if not loaded
            await loadSheetJS();
            
            // Read the file
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Process each sheet (each store)
            const newStoresData = [];
            const skippedSheets = [];
            
            for (const sheetName of workbook.SheetNames) {
                // Skip non-store sheets
                if (sheetName.toLowerCase().includes('hoja') || 
                    sheetName.toLowerCase().includes('sheet') ||
                    sheetName.toLowerCase() === 'template') {
                    skippedSheets.push(sheetName);
                    continue;
                }
                
                const worksheet = workbook.Sheets[sheetName];
                
                // Parse store data from sheet
                const storeData = parseStoreSheet(worksheet, sheetName);
                
                if (storeData) {
                    newStoresData.push(storeData);
                }
            }
            
            if (newStoresData.length === 0) {
                showNotification('⚠️ No se encontraron datos válidos en el archivo', 'warning');
                return;
            }
            
            console.log(`✅ ${newStoresData.length} tiendas procesadas`);
            if (skippedSheets.length > 0) {
                console.log(`ℹ️ Hojas omitidas: ${skippedSheets.join(', ')}`);
            }
            
            // Update the dashboard
            updateDashboardWithNewData(newStoresData);
            
            showNotification(`✅ Datos actualizados: ${newStoresData.length} tiendas cargadas`, 'success');
            
        } catch (error) {
            console.error('Error importing Excel:', error);
            showNotification('❌ Error al procesar el archivo. Verifica el formato.', 'error');
        }
    };
    
    input.click();
}

/**
 * Parse data from a store sheet
 * Based on Primark Excel template with specific cell references
 * 
 * MAPEO DE CELDAS:
 * B4  → Ventas (Sales current period - absolute value)
 * D4  → LY % (Last Year percentage - 0.96 = 96% of LY)
 * H4  → Budget % (Budget achievement - 0.82 = 82% of budget)
 * B8  → UPT (Units Per Transaction)
 * B20 → NOOS (Store vs Depot % - 0.942 = 94.2%)
 * N16 → Reusable Bags % (0.4907 = 49.07%)
 * N20 → SOH (Stock on Hand - absolute value)
 * R20 → RAS (Rate of Sale %)
 * R24 → Tell Primark (Customer satisfaction %)
 * 
 * NOTA: Los porcentajes pueden venir como decimales (0.96) o con formato (96,9%)
 */
function parseStoreSheet(worksheet, sheetName) {
    // Helper function to get cell value
    const getCellValue = (cell) => {
        if (!worksheet[cell]) return null;
        let value = worksheet[cell].v;
        
        // Handle European number format (comma as decimal separator)
        if (typeof value === 'string') {
            value = value.replace(',', '.').replace('%', '');
            value = parseFloat(value);
        }
        
        return value;
    };
    
    // Helper to convert percentage (0.96 to 96 or keep as is if already > 1)
    const toPercentage = (value) => {
        if (!value) return 0;
        // If value is less than 1, it's in decimal format (0.96 = 96%)
        if (value < 1 && value > 0) {
            return parseFloat((value * 100).toFixed(2));
        }
        return parseFloat(value);
    };
    
    // Map store numbers to names
    const storeMapping = {
        '312': 'Lorca',
        '365': 'Orihuela',
        '369': 'Ruzafa',  // Valencia Ruzafa (duplicate with 389?)
        '412': 'Plaza Cataluña',
        '371': 'Castellón',
        '377': 'Alicante',
        '381': 'Valencia Bonaire',
        '383': 'Cartagena',
        '389': 'Valencia Ruzafa',
        '396': 'Murcia',
        '399': 'Palma de Mallorca'
    };
    
    try {
        // Extract values from specified cells
        const ventas = getCellValue('B4');           // Sales (absolute)
        const lyPercent = getCellValue('D4');         // LY % (decimal)
        const budgetPercent = getCellValue('H4');     // Budget % (decimal)
        const upt = getCellValue('B8');               // UPT
        const noos = getCellValue('B20');             // NOOS % (decimal)
        const reusableBagsPercent = getCellValue('N16'); // Reusable Bags % (decimal)
        const soh = getCellValue('N20');              // SOH (absolute)
        const ras = getCellValue('R20');              // RAS %
        const tellPrimark = getCellValue('R24');      // Tell Primark %
        
        // Calculate Last Year sales from current sales and LY%
        const lastYearSales = lyPercent ? Math.round(ventas / lyPercent) : ventas;
        
        // Calculate Budget from current sales and Budget%
        const budget = budgetPercent ? Math.round(ventas / budgetPercent) : ventas;
        
        // Convert reusable bags percentage to approximate units
        // Assuming average of 100 bags if 50% achieved
        const reusableBags = reusableBagsPercent ? Math.round(toPercentage(reusableBagsPercent) * 2) : 50;
        
        // Calculate growth
        const growth = lyPercent ? ((lyPercent - 1) * 100).toFixed(1) : 0;
        
        // S&D - not in Excel, using default
        const soiledDamaged = 5; // Default value
        
        // Get store name from mapping
        const storeName = storeMapping[sheetName] || sheetName;
        
        return {
            name: storeName,
            sales: {
                budget: parseFloat(budget) || 0,
                last_year: parseFloat(lastYearSales) || 0
            },
            soh: parseInt(soh) || 0,
            reusable_bags: parseInt(reusableBags) || 0,
            tell_primark: parseFloat(tellPrimark) || 0,
            store_vs_depot: toPercentage(noos) || 0,
            growth_up: parseFloat(growth) || 0,
            ras: parseFloat(ras) || 0,
            s_and_d: parseFloat(soiledDamaged) || 5
        };
    } catch (error) {
        console.error(`Error parsing sheet ${sheetName}:`, error);
        return null;
    }
}

/**
 * Update dashboard with new data
 */
function updateDashboardWithNewData(newData) {
    // Update global storesData
    updateStoresData(newData);
    
    // Re-render all components
    populateStoreFilter();
    renderKPICards(storesData);
    renderStoresTable(storesData);
    renderBarChart(storesData);
    renderLineChart(storesData);
    
    console.log('✅ Dashboard actualizado con nuevos datos');
}

/**
 * Export template Excel file
 */
function exportTemplateExcel() {
    showNotification('📥 Generando plantilla Excel...', 'info');
    
    try {
        // Load SheetJS
        loadSheetJS().then(() => {
            const wb = XLSX.utils.book_new();
            
            // Create a sheet for each store
            storesData.forEach(store => {
                const wsData = [
                    ['KPI', 'Valor'],
                    ['Store Name', store.name],
                    ['', ''],
                    ['VENTAS', ''],
                    ['Budget', store.sales.budget],
                    ['Last Year Sales', store.sales.last_year],
                    ['', ''],
                    ['INVENTORY', ''],
                    ['SOH', store.soh],
                    ['Reusable Bags', store.reusable_bags],
                    ['', ''],
                    ['KPIs', ''],
                    ['Tell Primark (%)', store.tell_primark],
                    ['Store vs Depot (%)', store.store_vs_depot],
                    ['Growth Up (%)', store.growth_up],
                    ['RAS (%)', store.ras],
                    ['S&D (%)', store.s_and_d]
                ];
                
                const ws = XLSX.utils.aoa_to_sheet(wsData);
                
                // Add some styling
                ws['!cols'] = [
                    { wch: 20 },
                    { wch: 15 }
                ];
                
                XLSX.utils.book_append_sheet(wb, ws, store.name);
            });
            
            // Generate Excel file
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `Primark_Stores_Template_${today}.xlsx`);
            
            showNotification('✅ Plantilla descargada. Edítala y súbela de nuevo.', 'success');
        });
        
    } catch (error) {
        console.error('Error exporting template:', error);
        showNotification('❌ Error al generar plantilla', 'error');
    }
}

/**
 * Reset data to defaults
 */
function resetData() {
    if (confirm('⚠️ ¿Estás seguro de restablecer los datos a valores por defecto? Esta acción no se puede deshacer.')) {
        resetToDefaultData();
        
        // Re-render dashboard
        populateStoreFilter();
        renderKPICards(storesData);
        renderStoresTable(storesData);
        renderBarChart(storesData);
        renderLineChart(storesData);
        
        showNotification('🔄 Datos restablecidos a valores por defecto', 'info');
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        importFromExcel,
        exportTemplateExcel,
        resetData,
        showNotification
    };
}