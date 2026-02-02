// Store data (embedded for simplicity - can be loaded from stores.json or Google Sheets)
const defaultStoresData = [
  {
    "name": "Murcia",
    "sales": {"budget": 1600000, "last_year": 1800000},
    "soh": 180,
    "reusable_bags": 40,
    "tell_primark": 75,
    "store_vs_depot": 35,
    "growth_up": "N/A",
    "ras": 8,
    "s_and_d": 0.3
  },
  {
    "name": "Cartagena",
    "sales": {"budget": 1200000, "last_year": 1300000

    },
    "soh": 180,
    "reusable_bags": 250,
    "tell_primark": 100,
    "store_vs_depot": 40,
    "growth_up": "N/A",
    "ras": 10,
    "s_and_d": 0.18
  },
  {
    "name": "Alicante",
    "sales": {"budget": 1500000, "last_year": 1100000},
    "soh": 200,
    "reusable_bags": 60,
    "tell_primark": 80,
    "store_vs_depot": 45,
    "growth_up": "N/A",
    "ras": 7,
    "s_and_d": 0.11
  },
  {
    "name": "Castellon",
    "sales": {"budget": 1000000, "last_year": 850000},
    "soh": 150,
    "reusable_bags": 50,
    "tell_primark": 70,
    "store_vs_depot": 38,
    "growth_up": "N/A",
    "ras": 6,
    "s_and_d": 0.08
  },
  {
    "name": "Valencia Ruzafa",
    "sales": {"budget": 250000, "last_year": 200000},
    "soh": 300,
    "reusable_bags": 70,
    "tell_primark": 85,
    "store_vs_depot": 50,
    "growth_up": "N/A",
    "ras": 9,
    "s_and_d": 0.4
  },
  {
    "name": "Valencia Bonaire",
    "sales": {"budget": 2400000, "last_year": 2100000},
    "soh": 280,
    "reusable_bags": 65,
    "tell_primark": 88,
    "store_vs_depot": 48,
    "growth_up": "7.3",
    "ras": 7,
    "s_and_d": 0.5
  },
  {
    "name": "Palma de Mallorca",
    "sales": {"budget": 300000, "last_year": 250000},
    "soh": 350,
    "reusable_bags": 80,
    "tell_primark": 90,
    "store_vs_depot": 55,
    "growth_up": "N/A",
    "ras": 8,
    "s_and_d": 6
  },
  {
    "name": "Plaza Cataluña",
    "sales": {"budget": 300000, "last_year": 270000},
    "soh": 400,
    "reusable_bags": 75,
    "tell_primark": 92,
    "store_vs_depot": 60,
    "growth_up": "N/A",
    "ras": 9,
    "s_and_d": 0.7
  },
  {
    "name": "Orihuela",
    "sales": {"budget": 90000, "last_year": 80000},
    "soh": 140,
    "reusable_bags": 45,
    "tell_primark": 65,
    "store_vs_depot": 42,
    "growth_up": 6,
    "ras": 6,
    "s_and_d": 0.6
  },
  {
    "name": "Lorca",
    "sales": {"budget": 950000, "last_year": 1500000},
    "soh": 90,
    "reusable_bags": 250,
    "tell_primark": 60,
    "store_vs_depot": 30,
    "growth_up": 10,
    "ras": 5,
    "s_and_d": 0.2
  }
];

// Load data from localStorage if available, otherwise use default
let storesData = loadStoresData();

/**
 * Load stores data from localStorage or default
 */
function loadStoresData() {
    try {
        const savedData = localStorage.getItem('primark_stores_data');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            console.log('✅ Datos cargados desde localStorage');
            return parsed;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    
    console.log('📊 Usando datos por defecto');
    return [...defaultStoresData];
}

/**
 * Save stores data to localStorage
 */
function saveStoresData(data) {
    try {
        localStorage.setItem('primark_stores_data', JSON.stringify(data));
        console.log('✅ Datos guardados en localStorage');
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Update stores data and save
 */
function updateStoresData(newData) {
    storesData = newData;
    saveStoresData(newData);
}

/**
 * Reset to default data
 */
function resetToDefaultData() {
    storesData = [...defaultStoresData];
    localStorage.removeItem('primark_stores_data');
    console.log('🔄 Datos restablecidos a valores por defecto');
}

// Function to load data from JSON file (optional)
async function loadStoresFromJSON() {
    try {
        const response = await fetch('data/stores.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading stores data:', error);
        return storesData; // Fallback to embedded data
    }
}

// Function to load data from Google Sheets (placeholder)
async function loadStoresFromGoogleSheets() {
    // This would require Google Sheets API integration
    // For now, return embedded data
    console.log('Google Sheets integration not yet implemented');
    return storesData;
}

// Export data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { storesData, loadStoresFromJSON, loadStoresFromGoogleSheets, updateStoresData, saveStoresData, resetToDefaultData };
}