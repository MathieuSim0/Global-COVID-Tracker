import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import { useTranslation } from 'react-i18next';

const filterOptions = [
  { value: 'confirmed', label: 'Confirmed Cases' },
  { value: 'deaths', label: 'Deaths' },
  { value: 'recovered', label: 'Recovered' },
];

function getColor(type, value) {
  if (type === 'confirmed') {
    if (value > 1000000) return '#d73027';
    if (value > 100000) return '#fc8d59';
    if (value > 10000) return '#fee08b';
    if (value > 1000) return '#91cf60';
    return '#1a9850';
  }
  if (type === 'deaths') {
    if (value > 50000) return '#800026';
    if (value > 10000) return '#BD0026';
    if (value > 1000) return '#E31A1C';
    return '#FFEDA0';
  }
  if (type === 'recovered') {
    if (value > 1000000) return '#006837';
    if (value > 100000) return '#31a354';
    if (value > 10000) return '#78c679';
    return '#c2e699';
  }
  return '#888';
}

export default function MapPage() {
  const [filter, setFilter] = useState('confirmed');
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Utilise directement l'API pour récupérer les statistiques par pays comme dans MapView
        const API_BASE_URL = 'http://localhost:3001/api';
        const res = await fetch(`${API_BASE_URL}/countries/stats`);
        if (!res.ok) throw new Error('Failed to fetch country stats');
        const data = await res.json();
        console.log("Country stats loaded:", data.length);
        setStats(data);
      } catch (err) {
        console.error("Error loading map data:", err);
        setStats([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fonction pour créer une icône personnalisée
  function getMarkerIcon(cases) {
    const color = getColor(filter, cases);
    return L.divIcon({
      className: '',
      html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px #0003;"></div>`
    });
  }
  
  // Composant pour le focus sur un pays
  function FlyToCountry({ countryStats, selectedCountry }) {
    const map = useMap();
    const country = countryStats?.find(c => c.country === selectedCountry);
    
    if (country && country.lat && country.long) {
      map.flyTo([country.lat, country.long], 5, { duration: 1.2 });
    }
    return null;
  }
  
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="map-filter-container">
        <h3 className="map-filter-title">{t('dashboard.filter', 'Filter Data')}</h3>
        <select 
          className="map-filter-select"
          value={filter} 
          onChange={e => setFilter(e.target.value)}
        >
          {filterOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{t(`dashboard.${opt.value}`, opt.label)}</option>
          ))}
        </select>
        {selectedCountry && (
          <div className="selected-country">
            <strong>{t('dashboard.selected', 'Selected')}: {selectedCountry}</strong>
            <button 
              className="reset-button"
              onClick={() => setSelectedCountry(null)}
            >
              {t('dashboard.reset', 'Reset')}
            </button>
          </div>
        )}
      </div>
      
      <MapContainer center={[20, 0]} zoom={2} style={{ width: '100vw', height: '100vh' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToCountry countryStats={stats} selectedCountry={selectedCountry} />
        
        {!loading && stats.map((c, idx) => (
          (c.lat && c.long) ? (
            <Marker 
              key={`marker-${idx}`} 
              position={[c.lat, c.long]}
              icon={getMarkerIcon(c[filter])}
              eventHandlers={{
                click: () => setSelectedCountry(c.country)
              }}
            >
              <Popup>
                <strong>{c.country}</strong><br />
                {t('dashboard.totalCases', 'Confirmed')}: {c.confirmed?.toLocaleString()}<br />
                {t('dashboard.deaths', 'Deaths')}: {c.deaths?.toLocaleString()}<br />
                {t('dashboard.recovered', 'Recovered')}: {c.recovered?.toLocaleString()}
              </Popup>
            </Marker>
          ) : null
        ))}
        
        {!loading && stats.map((c, idx) => (
          (c.lat && c.long) ? (
            <Circle
              key={`circle-${idx}`}
              center={[c.lat, c.long]}
              radius={Math.sqrt(c[filter]) * 500}
              pathOptions={{ 
                color: getColor(filter, c[filter]), 
                fillColor: getColor(filter, c[filter]), 
                fillOpacity: 0.25 
              }}
              eventHandlers={{
                click: () => setSelectedCountry(c.country)
              }}
            />
          ) : null
        ))}
      </MapContainer>
      
      {loading && (
        <div className="loading-overlay">
          <div>{t('map.loading', 'Chargement des données...')}</div>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
