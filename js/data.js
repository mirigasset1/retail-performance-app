// Store data (embedded for simplicity - can be loaded from stores.json or Google Sheets)
const storesData = [
  {
    "name": "Murcia",
    "sales": {"budget": 120000, "last_year": 90000},
    "soh": 180,
    "reusable_bags": 40,
    "tell_primark": 75,
    "store_vs_depot": 35,
    "growth_up": 20,
    "ras": 8,
    "s_and_d": 5
  },
  {
    "name": "Cartagena",
    "sales": {"budget": 120000, "last_year": 90000},
    "soh": 180,
    "reusable_bags": 250,
    "tell_primark": 100,
    "store_vs_depot": 40,
    "growth_up": 25,
    "ras": 10,
    "s_and_d": 7
  },
  {
    "name": "Alicante",
    "sales": {"budget": 150000, "last_year": 110000},
    "soh": 200,
    "reusable_bags": 60,
    "tell_primark": 80,
    "store_vs_depot": 45,
    "growth_up": 15,
    "ras": 7,
    "s_and_d": 6
  },
  {
    "name": "Castellon",
    "sales": {"budget": 100000, "last_year": 85000},
    "soh": 150,
    "reusable_bags": 50,
    "tell_primark": 70,
    "store_vs_depot": 38,
    "growth_up": 18,
    "ras": 6,
    "s_and_d": 8
  },
  {
    "name": "Valencia Ruzafa",
    "sales": {"budget": 250000, "last_year": 200000},
    "soh": 300,
    "reusable_bags": 70,
    "tell_primark": 85,
    "store_vs_depot": 50,
    "growth_up": 22,
    "ras": 9,
    "s_and_d": 4
  },
  {
    "name": "Valencia Bonaire",
    "sales": {"budget": 240000, "last_year": 210000},
    "soh": 280,
    "reusable_bags": 65,
    "tell_primark": 88,
    "store_vs_depot": 48,
    "growth_up": 19,
    "ras": 7,
    "s_and_d": 5
  },
  {
    "name": "Palma de Mallorca",
    "sales": {"budget": 300000, "last_year": 250000},
    "soh": 350,
    "reusable_bags": 80,
    "tell_primark": 90,
    "store_vs_depot": 55,
    "growth_up": 25,
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
    "growth_up": 28,
    "ras": 9,
    "s_and_d": 7
  },
  {
    "name": "Orihuela",
    "sales": {"budget": 90000, "last_year": 80000},
    "soh": 140,
    "reusable_bags": 45,
    "tell_primark": 65,
    "store_vs_depot": 42,
    "growth_up": 17,
    "ras": 6,
    "s_and_d": 6
  },
  {
    "name": "Lorca",
    "sales": {"budget": 17000, "last_year": 15000},
    "soh": 90,
    "reusable_bags": 250,
    "tell_primark": 60,
    "store_vs_depot": 30,
    "growth_up": 10,
    "ras": 5,
    "s_and_d": 4
  }
];

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
    module.exports = { storesData, loadStoresFromJSON, loadStoresFromGoogleSheets };
}