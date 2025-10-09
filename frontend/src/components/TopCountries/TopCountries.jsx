import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchCountryData, fetchCountries, formatNumber } from '../../utils/dataUtils';
import CountryFlag from '../CountryFlag';
import './TopCountries.css';

function TopCountries() {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [sortBy, setSortBy] = useState('confirmed');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger la liste des pays
  useEffect(() => {
    async function loadCountries() {
      try {
        setIsLoading(true);
        const countriesList = await fetchCountries();
        setCountries(countriesList.filter(country => country !== 'Global'));
        setError(null);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError(t('errors.loadingCountries', 'Error loading countries list'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCountries();
  }, [t]);

  // Charger les données des pays et les trier
  useEffect(() => {
    async function loadTopCountries() {
      if (!countries.length) return;

      try {
        setIsLoading(true);
        const countriesData = await Promise.all(
          countries.map(async (country) => {
            try {
              const data = await fetchCountryData(country);
              return {
                country,
                ...data
              };
            } catch (err) {
              console.error(`Error loading data for ${country}:`, err);
              return null;
            }
          })
        );

        // Filtrer les pays pour lesquels nous avons des données
        const validCountriesData = countriesData.filter(item => item !== null);

        // Trier les pays en fonction du critère de tri actuel
        const sortedCountries = validCountriesData.sort((a, b) => b[sortBy] - a[sortBy]);

        // Prendre les 5 premiers pays
        setTopCountries(sortedCountries.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error loading top countries data:', err);
        setError(t('errors.loadingData', 'Error loading countries data'));
      } finally {
        setIsLoading(false);
      }
    }

    loadTopCountries();
  }, [countries, sortBy, t]);

  // Gérer le changement de critère de tri
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Déterminer la couleur à utiliser pour le graphique en fonction du critère de tri
  const getBarColor = () => {
    switch (sortBy) {
      case 'deaths':
        return 'var(--deaths-color)';
      case 'recovered':
        return 'var(--recovered-color)';
      case 'active':
        return 'var(--active-color)';
      default:
        return 'var(--confirmed-color)';
    }
  };

  // Préparer les données pour le graphique à barres
  const prepareBarChartData = () => {
    return topCountries.map(item => ({
      country: item.country,
      value: item[sortBy]
    }));
  };

  return (
    <div className="top-countries-container">
      <h2 className="top-countries-title">
        {t('topCountries.title', 'Top 5 Countries')}
      </h2>
      
      {/* Sélecteur de critère de tri */}
      <div className="sort-controls">
        <span className="sort-label">{t('topCountries.sortBy', 'Sort by')}:</span>
        <div className="sort-buttons">
          <button 
            className={`sort-button ${sortBy === 'confirmed' ? 'active' : ''}`}
            onClick={() => handleSortChange('confirmed')}
          >
            {t('dashboard.totalCases', 'Confirmed')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'deaths' ? 'active' : ''}`}
            onClick={() => handleSortChange('deaths')}
          >
            {t('dashboard.deaths', 'Deaths')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'recovered' ? 'active' : ''}`}
            onClick={() => handleSortChange('recovered')}
          >
            {t('dashboard.recovered', 'Recovered')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'active' ? 'active' : ''}`}
            onClick={() => handleSortChange('active')}
          >
            {t('dashboard.activeCases', 'Active')}
          </button>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && <div className="loading-indicator">{t('common.loading', 'Loading data...')}</div>}
      
      {/* Message d'erreur */}
      {error && <div className="error-message">{error}</div>}

      {/* Tableau des 5 premiers pays */}
      {!isLoading && !error && topCountries.length > 0 && (
        <div className="top-countries-table-container">
          <table className="top-countries-table">
            <thead>
              <tr>
                <th className="rank-column">{t('topCountries.rank', 'Rank')}</th>
                <th className="country-column">{t('topCountries.country', 'Country')}</th>
                <th className="value-column">
                  {sortBy === 'confirmed' && t('dashboard.totalCases', 'Confirmed')}
                  {sortBy === 'deaths' && t('dashboard.deaths', 'Deaths')}
                  {sortBy === 'recovered' && t('dashboard.recovered', 'Recovered')}
                  {sortBy === 'active' && t('dashboard.activeCases', 'Active')}
                </th>
              </tr>
            </thead>
            <tbody>
              {topCountries.map((item, index) => (
                <tr key={item.country}>
                  <td className="rank-column">{index + 1}</td>
                  <td className="country-column">
                    <div className="country-info">
                      <CountryFlag country={item.country} size="small" />
                      <span className="country-name">{item.country}</span>
                    </div>
                  </td>
                  <td className="value-column">
                    <span className={`value ${sortBy}`}>
                      {formatNumber(item[sortBy])}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Graphique à barres */}
      {!isLoading && !error && topCountries.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">
            {t('topCountries.chartTitle', 'Top 5 Countries by {{metric}}', { 
              metric: sortBy === 'confirmed' ? t('dashboard.totalCases', 'Confirmed Cases') :
                      sortBy === 'deaths' ? t('dashboard.deaths', 'Deaths') :
                      sortBy === 'recovered' ? t('dashboard.recovered', 'Recovered') :
                      t('dashboard.activeCases', 'Active Cases')
            })}
          </h3>
          <div className="bar-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={prepareBarChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis 
                  dataKey="country"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: 'var(--text-color)', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-color)', fontSize: 12 }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  formatter={(value) => formatNumber(value)}
                  labelStyle={{ color: 'var(--text-color)' }}
                />
                <Bar 
                  dataKey="value"
                  fill={getBarColor()}
                  name={
                    sortBy === 'confirmed' ? t('dashboard.totalCases', 'Confirmed') :
                    sortBy === 'deaths' ? t('dashboard.deaths', 'Deaths') :
                    sortBy === 'recovered' ? t('dashboard.recovered', 'Recovered') :
                    t('dashboard.activeCases', 'Active')
                  }
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopCountries;