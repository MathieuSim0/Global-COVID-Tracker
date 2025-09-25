import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
