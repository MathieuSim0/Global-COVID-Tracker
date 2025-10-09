import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App.jsx';
import CompareCountriesPage from '../pages/CompareCountriesPage';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

export default function AppRoutes() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Récupère le thème enregistré dans localStorage ou utilise le thème clair par défaut
    const savedTheme = localStorage.getItem('covid-dashboard-theme') || 'light';
    setDarkMode(savedTheme === 'dark');
    
    // Applique le thème au chargement
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('covid-dashboard-theme', 'dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      localStorage.setItem('covid-dashboard-theme', 'light');
    }
  };

  return (
    <BrowserRouter>
      <div className={darkMode ? 'theme-dark' : ''} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<App skipNavbar={true} />} />
          <Route path="/map" element={<App skipNavbar={true} />} />
          <Route path="/compare" element={<CompareCountriesPage skipNavbar={true} />} />
          <Route path="*" element={<App skipNavbar={true} />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
