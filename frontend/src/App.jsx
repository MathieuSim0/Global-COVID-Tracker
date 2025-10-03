import './App.css'
import { useTranslation } from 'react-i18next'
import NavBar from './components/NavBar'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import LanguageSwitcher from './components/LanguageSwitcher'

function App() {
  const { t } = useTranslation();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 1000 }}>
        <LanguageSwitcher />
      </div>
      <NavBar />
      <header style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1>{t('app.title')}</h1>
      </header>
      <MainContent style={{ flex: 1, paddingBottom: '0' }} />
      <Footer />
    </div>
  );
}

export default App;