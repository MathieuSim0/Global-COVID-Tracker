import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './CountrySelector.css';

/**
 * Composant de sélection de pays avec fonction de recherche
 * @param {Object} props - Les propriétés du composant
 * @param {string[]} props.countries - Liste des pays disponibles
 * @param {string} props.selectedCountry - Pays actuellement sélectionné
 * @param {function} props.onSelectCountry - Fonction appelée quand un pays est sélectionné
 * @param {boolean} props.isLoading - Indique si les données sont en cours de chargement
 * @param {string|null} props.error - Message d'erreur à afficher le cas échéant
 */
function CountrySelector({ countries, selectedCountry, onSelectCountry, isLoading, error }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  // Détecter le thème sombre pour ajuster les styles au besoin
  const isDarkTheme = document.body.classList.contains('theme-dark');

  // Filtrer les pays en fonction du terme de recherche
  useEffect(() => {
    if (!countries) return;
    
    if (!searchTerm) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country => 
        country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [countries, searchTerm]);

  // Gérer la fermeture du menu quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus sur l'input de recherche quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');  // Réinitialiser la recherche à chaque ouverture
  };

  const handleSelectCountry = (country) => {
    onSelectCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <div className="country-selector-loading">{t('countries.loading', 'Loading countries...')}</div>;
  }

  if (error) {
    return <div className="country-selector-error">{t('countries.error', error)}</div>;
  }

  return (
    <div className="country-selector-container" ref={dropdownRef}>
      <div className="country-selector-header">
        <h3>{t('countries.selectRegion', 'Select a region:')}</h3>
      </div>
      
      <div className="country-dropdown">
        <button 
          className="country-dropdown-toggle" 
          onClick={handleToggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedCountry}</span>
          <svg className={`dropdown-arrow ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="country-dropdown-menu">
            <div className="country-search-container">
              <input
                ref={searchInputRef}
                type="text"
                className="country-search-input"
                placeholder={t('countries.searchPlaceholder', 'Search countries...')}
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label={t('countries.searchAriaLabel', 'Search for a country')}
              />
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            
            <div className="country-list-container">
              <ul 
                className="country-list" 
                role="listbox"
                aria-label="Liste des pays"
              >
                {filteredCountries.length > 0 ? (
                  filteredCountries.map(country => (
                    <li 
                      key={country} 
                      className={`country-list-item ${country === selectedCountry ? 'selected' : ''}`}
                      onClick={() => handleSelectCountry(country)}
                      role="option"
                      aria-selected={country === selectedCountry}
                    >
                      {country}
                    </li>
                  ))
                ) : (
                  <li className="country-list-item no-results">{t('countries.noResults', 'No countries found')}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountrySelector;