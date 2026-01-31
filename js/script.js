// Google Sheets Integration (Optional)
// This file provides functions to integrate with Google Sheets API

/**
 * Configuration for Google Sheets API
 */
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
    spreadsheetId: 'YOUR_SPREADSHEET_ID', // Replace with your spreadsheet ID
    range: 'Sheet1!A1:J100', // Adjust range as needed
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
};

/**
 * Initialize Google Sheets API
 */
function initGoogleSheetsAPI() {
    gapi.load('client', initClient);
}

/**
 * Initialize the API client
 */
async function initClient() {
    try {
        await gapi.client.init({
            apiKey: GOOGLE_SHEETS_CONFIG.apiKey,
            discoveryDocs: GOOGLE_SHEETS_CONFIG.discoveryDocs
        });
        
        console.log('Google Sheets API initialized');
        
        // Optionally load data immediately
        // await loadDataFromSheets();
    } catch (error) {
        console.error('Error initializing Google Sheets API:', error);
    }
}

/**
 * Load data from Google Sheets
 * @returns {Promise<Array>} Array of store objects
 */
async function loadDataFromSheets() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: GOOGLE_SHEETS_CONFIG.range
        });
        
        const range = response.result;
        if (!range || !range.values || range.values.length === 0) {
            console.log('No data found in Google Sheets');
            return [];
        }
        
        // Parse the data
        const stores = parseSheetData(range.values);
        console.log('Loaded stores from Google Sheets:', stores);
        
        return stores;
    } catch (error) {
        console.error('Error loading data from Google Sheets:', error);
        return [];
    }
}

/**
 * Parse sheet data into store objects
 * @param {Array} rows - Raw rows from Google Sheets
 * @returns {Array} Array of store objects
 */
function parseSheetData(rows) {
    // Expected columns:
    // A: Store Name
    // B: Budget
    // C: Last Year Sales
    // D: SOH
    // E: Reusable Bags
    // F: Tell Primark
    // G: Store vs Depot
    // H: Growth Up
    // I: RAS
    // J: S&D
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => {
        // Ensure all values are present
        if (row.length < 10) {
            console.warn('Incomplete row:', row);
            return null;
        }
        
        return {
            name: row[0] || 'Unknown',
            sales: {
                budget: parseFloat(row[1]) || 0,
                last_year: parseFloat(row[2]) || 0
            },
            soh: parseInt(row[3]) || 0,
            reusable_bags: parseInt(row[4]) || 0,
            tell_primark: parseFloat(row[5]) || 0,
            store_vs_depot: parseFloat(row[6]) || 0,
            growth_up: parseFloat(row[7]) || 0,
            ras: parseFloat(row[8]) || 0,
            s_and_d: parseFloat(row[9]) || 0
        };
    }).filter(store => store !== null);
}

/**
 * Update dashboard with Google Sheets data
 */
async function updateDashboardFromSheets() {
    const stores = await loadDataFromSheets();
    
    if (stores.length > 0) {
        // Update global stores data
        storesData.length = 0;
        storesData.push(...stores);
        
        // Re-render dashboard
        renderKPICards(storesData);
        renderStoresTable(storesData);
        updateCharts(storesData);
        
        // Update filter
        populateStoreFilter();
        
        console.log('Dashboard updated with Google Sheets data');
    }
}

/**
 * Setup auto-refresh from Google Sheets
 * @param {number} intervalMinutes - Refresh interval in minutes
 */
function setupAutoRefresh(intervalMinutes = 5) {
    setInterval(async () => {
        console.log('Auto-refreshing data from Google Sheets...');
        await updateDashboardFromSheets();
    }, intervalMinutes * 60 * 1000);
}

/**
 * Write data back to Google Sheets (requires auth)
 * @param {Array} data - Data to write
 * @param {string} range - Range to write to
 */
async function writeDataToSheets(data, range) {
    try {
        // This requires OAuth authentication
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: {
                values: data
            }
        });
        
        console.log('Data written to Google Sheets:', response);
        return response;
    } catch (error) {
        console.error('Error writing to Google Sheets:', error);
        throw error;
    }
}

/**
 * Instructions for setting up Google Sheets integration
 */
function showGoogleSheetsSetupInstructions() {
    console.log(`
    ====================================
    GOOGLE SHEETS INTEGRATION SETUP
    ====================================
    
    1. Create a Google Cloud Project:
       - Go to https://console.cloud.google.com
       - Create a new project
    
    2. Enable Google Sheets API:
       - In the project, enable "Google Sheets API"
    
    3. Create API Credentials:
       - Go to "Credentials" section
       - Create an API key
       - Copy the API key
    
    4. Update Configuration:
       - Replace 'YOUR_GOOGLE_API_KEY' in GOOGLE_SHEETS_CONFIG
       - Replace 'YOUR_SPREADSHEET_ID' with your Sheet ID
    
    5. Set up your Google Sheet:
       - Create a sheet with columns:
         A: Store Name
         B: Budget
         C: Last Year Sales
         D: SOH
         E: Reusable Bags
         F: Tell Primark
         G: Store vs Depot
         H: Growth Up
         I: RAS
         J: S&D
    
    6. Make sheet publicly readable:
       - Share > Anyone with the link can view
    
    7. Load the API:
       - Add to your HTML: <script src="https://apis.google.com/js/api.js"></script>
       - Call initGoogleSheetsAPI() on page load
    
    8. Test:
       - Call loadDataFromSheets() to test connection
    
    ====================================
    `);
}

// Uncomment to see setup instructions
// showGoogleSheetsSetupInstructions();

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGoogleSheetsAPI,
        loadDataFromSheets,
        parseSheetData,
        updateDashboardFromSheets,
        setupAutoRefresh,
        writeDataToSheets,
        showGoogleSheetsSetupInstructions
    };
}