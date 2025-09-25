import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

const MapView = () => {
  const [countryStats, setCountryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/countries/stats`);
        if (!res.ok) throw new Error('Failed to fetch country stats');
        const data = await res.json();
        setCountryStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fonction pour choisir la couleur selon le nombre de cas
  function getColor(cases) {
    if (cases > 1000000) return '#d73027'; // rouge foncé
    if (cases > 100000) return '#fc8d59'; // orange
    if (cases > 10000) return '#fee08b'; // jaune
    if (cases > 1000) return '#91cf60'; // vert
    return '#1a9850'; // vert foncé
  }

  // Fonction pour créer une icône personnalisée
  function getMarkerIcon(cases) {
    const color = getColor(cases);
    return L.divIcon({
      className: '',
      html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px #0003;"></div>`
    });
  }

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!loading && !error && countryStats.map((c, idx) => (
          (c.lat && c.long) ? (
            <>
              <Marker key={idx} position={[c.lat, c.long]} icon={getMarkerIcon(c.confirmed)}>
                <Popup>
                  <strong>{c.country}</strong><br />
                  Confirmed: {c.confirmed.toLocaleString()}<br />
                  Deaths: {c.deaths.toLocaleString()}<br />
                  Recovered: {c.recovered.toLocaleString()}
                </Popup>
              </Marker>
              <Circle
                center={[c.lat, c.long]}
                radius={Math.sqrt(c.confirmed) * 500} // rayon proportionnel
                pathOptions={{ color: getColor(c.confirmed), fillColor: getColor(c.confirmed), fillOpacity: 0.25 }}
              />
            </>
          ) : null
        ))}
      </MapContainer>
      {loading && <div style={{position:'absolute',top:10,left:10,background:'#fff',padding:'4px 8px',borderRadius:'4px',boxShadow:'0 1px 4px #0002'}}>Loading map data...</div>}
      {error && <div style={{position:'absolute',top:10,left:10,background:'#fff',padding:'4px 8px',borderRadius:'4px',color:'red',boxShadow:'0 1px 4px #0002'}}>Error: {error}</div>}
    </div>
  );
};

export default MapView;
