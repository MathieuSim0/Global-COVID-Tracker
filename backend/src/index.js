const express = require('express');
const cors = require('cors');
const path = require('path');
const countriesService = require('./services/countries/countryService');
const countryDataService = require('./services/countries/countryDataService');


// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Endpoint to get all countries with coordinates and latest stats
app.get('/api/countries/stats', async (req, res) => {
  try {
    const stats = await countryDataService.getAllCountriesStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching countries stats:', error);
    res.status(500).json({ error: 'Failed to fetch countries stats' });
  }
});
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await countriesService.getCountries();
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Route pour récupérer les données d'un pays spécifique
app.get('/api/country/:name', async (req, res) => {
  try {
    const countryName = req.params.name;
    const countryData = await countryDataService.getCountryData(countryName);
    res.json(countryData);
  } catch (error) {
    console.error(`Error fetching data for country ${req.params.name}:`, error);
    res.status(500).json({ error: `Failed to fetch data for country: ${req.params.name}` });
  }
});

// Fallback route for any other requests
app.use((req, res) => {
  res.status(404).send('API endpoint not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
