import { useState, useEffect, useRef } from 'react';
import './NavBar.css';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // Thèmes disponibles
  const themes = [
    { name: 'light', label: 'Mode clair', icon: 'sun' },
    { name: 'dark', label: 'Mode sombre', icon: 'moon' }
  ];

  // Fonction pour changer de thème
  const changeTheme = (theme) => {
    // Supprimer les classes de thème précédentes
    document.documentElement.classList.remove('theme-dark');
    
    // Ajouter la nouvelle classe de thème si ce n'est pas le thème par défaut (clair)
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    }
    
    // Sauvegarder le thème dans le localStorage
    localStorage.setItem('covid-dashboard-theme', theme);
    setCurrentTheme(theme);
  };
  
  // Charger le thème sauvegardé lors du chargement initial
  useEffect(() => {
    const savedTheme = localStorage.getItem('covid-dashboard-theme') || 'light';
    changeTheme(savedTheme);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <span>COVID-19 World Data Explorer</span>
        </div>

        <nav className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li className="active"><a href="/">Global Dashboard</a></li>
            <li><a href="/countries">Countries</a></li>
            <li><a href="/trends">Trends</a></li>
            <li><a href="/map">Map</a></li>
            <li><a href="/about">About</a></li>
          </ul>
          
          {/* Sélecteur de thème avec interrupteur à glissière */}
          <div className="theme-toggle">
            <label className="theme-toggle-switch" title={currentTheme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}>
              <input 
                type="checkbox" 
                checked={currentTheme === 'dark'}
                onChange={() => changeTheme(currentTheme === 'light' ? 'dark' : 'light')}
                aria-label={currentTheme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              />
              <span className="theme-toggle-slider">
                {/* Icône soleil (côté gauche) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon-sun">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                </svg>
                
                {/* Icône lune (côté droit) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon-moon">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </span>
            </label>
          </div>
        </nav>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'close' : 'menu'}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
}

export default NavBar;