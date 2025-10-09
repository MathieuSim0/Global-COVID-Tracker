import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchCountries, fetchCountryData, formatNumber } from '../../utils/dataUtils';
import './CountryComparator.css';

const MAX_COUNTRIES = 3;

function CountryComparator() {
  const { t } = useTranslation();
  const [availableCountries, setAvailableCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [countriesData, setCountriesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('confirmed');

  // Charger la liste des pays disponibles
  useEffect(() => {
    async function loadCountries() {
      try {
        setIsLoading(true);
        const countries = await fetchCountries();
        setAvailableCountries(countries.filter(country => country !== 'Global'));
        setError(null);
      } catch (err) {
        console.error("Error loading countries:", err);
        setError(t('errors.loadingCountries', 'Error loading countries list'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCountries();
  }, [t]);

  // Charger les données des pays sélectionnés
  useEffect(() => {
    async function loadCountriesData() {
      if (!selectedCountries.length) return;
      
      setIsLoading(true);
      try {
        const promises = selectedCountries.map(async country => {
          try {
            const data = await fetchCountryData(country);
            return { country, data };
          } catch (err) {
            console.error(`Error loading data for ${country}:`, err);
            return { country, error: err.message };
          }
        });

        const results = await Promise.all(promises);
        const newData = {};
        
        results.forEach(result => {
          if (!result.error) {
            newData[result.country] = result.data;
          }
        });
        
        setCountriesData(newData);
        setError(null);
      } catch (err) {
        console.error("Error loading country data:", err);
        setError(t('errors.loadingData', 'Error loading country data'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCountriesData();
  }, [selectedCountries, t]);

  // Gérer la sélection d'un pays
  const handleCountrySelect = (e) => {
    const country = e.target.value;
    if (!country) return;
    
    if (selectedCountries.length >= MAX_COUNTRIES) {
      alert(t('countryComparator.maxCountriesReached', `You can select maximum ${MAX_COUNTRIES} countries`));
      return;
    }
    
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
    }
    
    // Reset dropdown value
    e.target.value = "";
  };

  // Supprimer un pays de la sélection
  const handleRemoveCountry = (country) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
  };

  // Préparer les données pour le graphique comparatif
  const prepareChartData = () => {
    if (Object.keys(countriesData).length === 0) return [];
    
    const allTimeseries = {};
    
    // Collecter toutes les dates uniques de toutes les séries temporelles
    const allDates = new Set();
    Object.values(countriesData).forEach(countryData => {
      if (countryData.timeseries && countryData.timeseries[chartType]) {
        countryData.timeseries[chartType].forEach(entry => {
          allDates.add(entry.date);
        });
      }
    });
    
    // Créer un objet pour chaque date
    const sortedDates = Array.from(allDates).sort();
    sortedDates.forEach(date => {
      allTimeseries[date] = { date };
    });
    
    // Ajouter les valeurs de chaque pays pour chaque date
    Object.entries(countriesData).forEach(([country, data]) => {
      if (data.timeseries && data.timeseries[chartType]) {
        data.timeseries[chartType].forEach(entry => {
          allTimeseries[entry.date][country] = entry.value;
        });
      }
    });
    
    // Convertir en tableau pour Recharts
    return Object.values(allTimeseries);
  };

  // Générer des couleurs pour chaque pays
  const getCountryColor = (index) => {
    const colors = ['#0078b4', '#e53e3e', '#38a169', '#805ad5', '#dd6b20', '#3182ce'];
    return colors[index % colors.length];
  };

  return (
    <div className="country-comparator">
      <h2>{t('countryComparator.title', 'Compare Countries')}</h2>
      
      {/* Sélecteur de pays */}
      <div className="country-selector-container">
        <span className="label">{t('countryComparator.selectCountries', 'Select countries to compare')}:</span>
        <select 
          className="country-selector" 
          onChange={handleCountrySelect}
          disabled={selectedCountries.length >= MAX_COUNTRIES}
        >
          <option value="">{t('countryComparator.selectCountry', 'Select a country...')}</option>
          {availableCountries
            .filter(country => !selectedCountries.includes(country))
            .map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
        </select>
        
        {selectedCountries.length > 0 && (
          <div className="selected-countries">
            {selectedCountries.map((country, index) => (
              <span key={country} className="selected-country-tag" style={{ backgroundColor: getCountryColor(index) }}>
                {country}
                <button onClick={() => handleRemoveCountry(country)} className="remove-country">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Message d'erreur ou de chargement */}
      {error && <div className="error-message">{error}</div>}
      {isLoading && selectedCountries.length > 0 && <div className="loading-message">{t('countryComparator.loading', 'Loading country data...')}</div>}
      
      {/* Tableau comparatif des statistiques */}
      {selectedCountries.length > 0 && Object.keys(countriesData).length > 0 && (
        <table className="comparison-stats-table">
          <thead>
            <tr>
              <th>{t('countryComparator.country', 'Country')}</th>
              <th>{t('dashboard.totalCases', 'Confirmed')}</th>
              <th>{t('dashboard.deaths', 'Deaths')}</th>
              <th>{t('dashboard.recovered', 'Recovered')}</th>
              <th>{t('dashboard.activeCases', 'Active')}</th>
            </tr>
          </thead>
          <tbody>
            {selectedCountries.map(country => {
              const data = countriesData[country];
              return data ? (
                <tr key={country}>
                  <td className="country-name">{country}</td>
                  <td className="confirmed">{formatNumber(data.confirmed)}</td>
                  <td className="deaths">{formatNumber(data.deaths)}</td>
                  <td className="recovered">{formatNumber(data.recovered)}</td>
                  <td className="active">{formatNumber(data.active)}</td>
                </tr>
              ) : null;
            })}
          </tbody>
        </table>
      )}
      
      {/* Graphique comparatif */}
      {selectedCountries.length > 0 && Object.keys(countriesData).length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">
            {t('countryComparator.chartTitle', 'COVID-19 {{type}} Comparison', { 
              type: chartType === 'confirmed' ? 'Confirmed Cases' : 
                    chartType === 'deaths' ? 'Deaths' : 'Recovered Cases'
            })}
          </h3>
          
          {/* Contrôles du graphique */}
          <div className="chart-controls">
            <button 
              className={`btn-chart ${chartType === 'confirmed' ? 'active' : ''}`}
              onClick={() => setChartType('confirmed')}
            >
              {t('charts.confirmed', 'Confirmed')}
            </button>
            <button 
              className={`btn-chart ${chartType === 'deaths' ? 'active' : ''}`}
              onClick={() => setChartType('deaths')}
            >
              {t('charts.deaths', 'Deaths')}
            </button>
            <button 
              className={`btn-chart ${chartType === 'recovered' ? 'active' : ''}`}
              onClick={() => setChartType('recovered')}
            >
              {t('charts.recovered', 'Recovered')}
            </button>
          </div>
          
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={prepareChartData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(tick) => {
                    const date = new Date(tick);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [formatNumber(value), name]}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                {selectedCountries.map((country, index) => (
                  <Line
                    key={country}
                    type="monotone"
                    dataKey={country}
                    name={country}
                    stroke={getCountryColor(index)}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountryComparator;