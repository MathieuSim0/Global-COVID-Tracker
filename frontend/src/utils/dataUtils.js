/**
 * Services pour récupérer et manipuler les données COVID-19
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Récupère la liste de tous les pays disponibles
 * @returns {Promise<string[]>} Liste des pays
 */
export const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

/**
 * Récupère les données d'un pays spécifique
 * @param {string} countryName - Nom du pays
 * @returns {Promise<Object>} Données du pays
 */
export const fetchCountryData = async (countryName) => {
  try {
    // Si countryName n'est pas fourni, retourne une erreur
    if (!countryName) {
      throw new Error("Country name is required");
    }
    
    // Encoder le nom du pays pour gérer les caractères spéciaux
    const encodedName = encodeURIComponent(countryName);
    const response = await fetch(`${API_BASE_URL}/country/${encodedName}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data for ${countryName}:`, error);
    throw error;
  }
};

/**
 * Formate les nombres avec des séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat().format(num);
};

/**
 * Calcule le pourcentage de changement entre deux valeurs
 * @param {number} current - Valeur actuelle
 * @param {number} previous - Valeur précédente
 * @returns {string} Pourcentage formaté avec signe + ou -
 */
export const calculateChangePercentage = (current, previous) => {
  if (!previous) return '+0%';
  
  const change = current - previous;
  const percentage = (change / previous) * 100;
  
  // Limiter à 1 décimale et ajouter le signe
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
};

/**
 * Extrait les données pour un graphique linéaire à partir des données de séries temporelles
 * @param {Array} timeseriesData - Données de séries temporelles
 * @returns {Object} Données formatées pour un graphique
 */
export const extractChartData = (timeseriesData) => {
  if (!timeseriesData || !Array.isArray(timeseriesData)) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  
  // Trier les données par date
  const sortedData = [...timeseriesData].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Extraire les labels (dates) et valeurs
  const labels = sortedData.map(item => item.date);
  const values = sortedData.map(item => item.value);
  
  return {
    labels,
    datasets: [
      {
        data: values,
        borderColor: '#0078b4',
        backgroundColor: 'rgba(0, 120, 180, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
};

/**
 * Fusionne les séries temporelles confirmed, deaths, recovered en un seul tableau pour la chart All
 * @param {Object} timeseries - { confirmed: [], deaths: [], recovered: [] }
 * @returns {Array} [{ date, confirmed, deaths, recovered }]
 */
export function mergeTimeseries(timeseries) {
  if (!timeseries || !timeseries.confirmed) return [];
  const byDate = {};
  timeseries.confirmed.forEach(pt => {
    byDate[pt.date] = { date: pt.date, confirmed: pt.value };
  });
  if (timeseries.deaths) {
    timeseries.deaths.forEach(pt => {
      if (!byDate[pt.date]) byDate[pt.date] = { date: pt.date };
      byDate[pt.date].deaths = pt.value;
    });
  }
  if (timeseries.recovered) {
    timeseries.recovered.forEach(pt => {
      if (!byDate[pt.date]) byDate[pt.date] = { date: pt.date };
      byDate[pt.date].recovered = pt.value;
    });
  }
  // Remplit les valeurs manquantes à 0
  return Object.values(byDate).map(obj => ({
    date: obj.date,
    confirmed: obj.confirmed || 0,
    deaths: obj.deaths || 0,
    recovered: obj.recovered || 0
  }));
}