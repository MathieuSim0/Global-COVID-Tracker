import './App.css'
import { useTranslation } from 'react-i18next'
import NavBar from './components/NavBar'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import MapPage from './pages/MapPage/MapPage.jsx'
import { useLocation } from 'react-router-dom'

function App() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <header style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1>{t('app.title')}</h1>
      </header>
      {/* Affiche MapPage si route /map, sinon MainContent */}
      {location.pathname === '/map' ? (
        <MapPage />
      ) : (
        <MainContent style={{ flex: 1, paddingBottom: '0' }} />
      )}
      <Footer />
    </div>
  );
}

export default App;