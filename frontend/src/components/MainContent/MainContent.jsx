import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './MainContent.css';
import CountrySelector from '../CountrySelector';
import { fetchCountries, fetchCountryData, formatNumber, extractChartData, mergeTimeseries } from '../../utils/dataUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MapView from '../MapView';

function MainContent({ style }) {
  const { t } = useTranslation();
  
  const [covidData, setCovidData] = useState({
    confirmed: 0,
    newConfirmed: 0,
    deaths: 0,
    newDeaths: 0,
    recovered: 0,
    newRecovered: 0,
    active: 0,
    newActive: 0
  });
  
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [countries, setCountries] = useState(['Global']);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('confirmed');
  
  // Charger la liste des pays
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const countriesList = await fetchCountries();
        setCountries(countriesList);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);
  
  // Charger les données du pays sélectionné
  useEffect(() => {
    const loadCountryData = async () => {
      if (!selectedCountry) return;
      
      try {
        setIsDataLoading(true);
        setDataError(null); // Réinitialiser l'erreur à chaque nouvelle requête
        
        const data = await fetchCountryData(selectedCountry);
        setDataError(null); // Réinitialise l'erreur dès qu'on a des données valides
        // Mettre à jour les données avec les valeurs reçues
        setCovidData({
          confirmed: data.confirmed || 0,
          newConfirmed: data.newConfirmed || 0,
          deaths: data.deaths || 0,
          newDeaths: data.newDeaths || 0,
          recovered: data.recovered || 0,
          newRecovered: data.newRecovered || 0,
          active: data.active || 0,
          newActive: data.newActive || 0,
          countryName: data.name || selectedCountry
        });
        
        if (data.timeseries) {
          // Process and set the timeseries data for charting
          setChartData(data.timeseries);
        }
      } catch (err) {
        console.error(`Error fetching data for ${selectedCountry}:`, err);
        // Ne pas setter d'erreur pour Global ou si err.message est vide/undefined
        if (selectedCountry !== 'Global' && err && err.message) {
          setDataError(`Failed to load data for ${selectedCountry}. Please try again later.`);
        } else {
          setDataError(null);
        }
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadCountryData();
  }, [selectedCountry]);
  
  // Réinitialise l'erreur à chaque changement de pays
  useEffect(() => {
    setDataError(null);
  }, [selectedCountry]);
  
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };
  
  // Handle chart type selection
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  return (
    <main className="main-content" style={style}>
      <div className="main-container">
        {/* Dashboard Title - Updates with selected country */}
        <h1 className="page-title">
          {selectedCountry === 'Global' 
            ? t('dashboard.titleGlobal', 'Global Dashboard') 
            : t('dashboard.titleCountry', '{{country}}', { country: selectedCountry })}
        </h1>
        
        {/* Country selector */}
        <CountrySelector
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={handleCountrySelect}
          isLoading={isLoading}
          error={error}
        />
        
        {/* Stats cards */}
        <div className="stats-grid">
          {dataError && (!covidData || !covidData.confirmed) && (
            <div className="data-error-message">{t('dashboard.dataError', dataError)}</div>
          )}
          
          {isDataLoading ? (
            <div className="data-loading">{t('dashboard.loadingData', 'Loading country data...')}</div>
          ) : (
            <>
              <div className="card confirmed">
                <h3>{t('dashboard.totalCases', 'Confirmed')}</h3>
                <div className="stats-value">
                  {formatNumber(covidData.confirmed)}
                </div>
                <div className="stats-change confirmed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5H7z"/>
                  </svg>
                  <span>+{formatNumber(covidData.newConfirmed)} {t('dashboard.new', 'new')}</span>
                </div>
              </div>
              
              <div className="card active">
                <h3>{t('dashboard.activeCases', 'Active')}</h3>
                <div className="stats-value">
                  {formatNumber(covidData.active)}
                </div>
                <div className="stats-change active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5H7z"/>
                  </svg>
                  <span>+{formatNumber(covidData.newActive)} {t('dashboard.new', 'new')}</span>
                </div>
              </div>
              
              <div className="card recovered">
                <h3>{t('dashboard.recovered', 'Recovered')}</h3>
                <div className="stats-value">
                  {formatNumber(covidData.recovered)}
                </div>
                <div className="stats-change recovered">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5H7z"/>
                  </svg>
                  <span>+{formatNumber(covidData.newRecovered)} {t('dashboard.new', 'new')}</span>
                </div>
              </div>
              
              <div className="card deaths">
                <h3>{t('dashboard.deaths', 'Deaths')}</h3>
                <div className="stats-value">
                  {formatNumber(covidData.deaths)}
                </div>
                <div className="stats-change deaths">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5H7z"/>
                  </svg>
                  <span>+{formatNumber(covidData.newDeaths)} {t('dashboard.new', 'new')}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* COVID-19 Trend Chart */}
        <div className="chart-container">
          <h3 className="chart-title">{t('charts.title', 'Daily Evolution: {{country}}', { country: selectedCountry })}</h3>
          
          {!chartData && isDataLoading ? (
            <div className="chart-loading">{t('charts.loading', 'Loading chart data...')}</div>
          ) : !chartData ? (
            <div className="chart-error">{t('charts.noData', 'No time series data available for {{country}}', { country: selectedCountry })}</div>
          ) : (
            <div className="chart-wrapper">
              <div className="chart-controls">
                <button 
                  className={`btn-chart ${chartType === 'confirmed' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('confirmed')}
                >
                  {t('charts.confirmed', 'Confirmed')}
                </button>
                <button 
                  className={`btn-chart ${chartType === 'deaths' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('deaths')}
                >
                  {t('charts.deaths', 'Deaths')}
                </button>
                <button 
                  className={`btn-chart ${chartType === 'recovered' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('recovered')}
                >
                  {t('charts.recovered', 'Recovered')}
                </button>
                <button 
                  className={`btn-chart ${chartType === 'all' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('all')}
                >
                  {t('charts.all', 'All')}
                </button>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartType === 'all' ? mergeTimeseries(chartData) : chartData?.[chartType] || []}
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
                  <YAxis yAxisId="left" />
                  {chartType === 'all' && <YAxis yAxisId="right" orientation="right" />}
                  <Tooltip
                    formatter={(value, name) => [formatNumber(value), name]}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  {/* Display based on chart type selection */}
                  {(chartType === 'confirmed' || chartType === 'all') && chartData?.confirmed && (
                    <Line
                      type="monotone"
                      dataKey={chartType === 'all' ? 'confirmed' : 'value'}
                      name="Confirmed Cases"
                      stroke="#0078b4"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                      data={chartType === 'all' ? undefined : chartData.confirmed}
                      isAnimationActive={true}
                      yAxisId="left"
                    />
                  )}
                  {/* Show Deaths line */}
                  {(chartType === 'deaths' || chartType === 'all') && chartData?.deaths && (
                    <Line
                      type="monotone"
                      dataKey={chartType === 'all' ? 'deaths' : 'value'}
                      name="Deaths"
                      stroke="#e53e3e"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                      data={chartType === 'all' ? undefined : chartData.deaths}
                      isAnimationActive={true}
                      yAxisId={chartType === 'all' ? 'right' : 'left'}
                    />
                  )}
                  {/* Show Recovered line */}
                  {(chartType === 'recovered' || chartType === 'all') && chartData?.recovered && (
                    <Line
                      type="monotone"
                      dataKey={chartType === 'all' ? 'recovered' : 'value'}
                      name="Recovered"
                      stroke="#38a169"
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                      data={chartType === 'all' ? undefined : chartData.recovered}
                      isAnimationActive={true}
                      yAxisId={chartType === 'all' ? 'right' : 'left'}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        {/* Leaflet Map */}
        <MapView onCountrySelect={setSelectedCountry} selectedCountry={selectedCountry} />
      </div>
    </main>
  );
}


export default MainContent;