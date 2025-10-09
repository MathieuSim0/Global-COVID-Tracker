import { useState, useEffect } from 'react';
import './CountryFlag.css';

function CountryFlag({ country, size = 'small' }) {
  const [flagUrl, setFlagUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Liste des codes ISO alpha-2 pour quelques pays courants
  const commonCountryCodes = {
    'USA': 'us',
    'United States': 'us',
    'UK': 'gb',
    'United Kingdom': 'gb',
    'Russia': 'ru',
    'Brazil': 'br',
    'France': 'fr',
    'Germany': 'de',
    'Italy': 'it',
    'Spain': 'es',
    'India': 'in',
    'China': 'cn',
    'Japan': 'jp',
    'South Korea': 'kr',
    'Mexico': 'mx',
    'Canada': 'ca',
    'Australia': 'au',
  };

  useEffect(() => {
    async function loadFlag() {
      try {
        setIsLoading(true);
        // On essaie de déterminer le code ISO du pays
        let countryCode = commonCountryCodes[country] || country.substring(0, 2).toLowerCase();
        
        // URL de l'API des drapeaux
        const url = `https://flagcdn.com/${countryCode}.svg`;
        
        // On vérifie si l'image existe en créant une requête HEAD
        const response = await fetch(url, { method: 'HEAD' });
        
        if (response.ok) {
          setFlagUrl(url);
          setError(false);
        } else {
          throw new Error('Flag not found');
        }
      } catch (err) {
        console.error(`Error loading flag for ${country}:`, err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFlag();
  }, [country]);

  // Fallback pour afficher les initiales du pays si le drapeau n'est pas disponible
  const getInitials = () => {
    return country.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`country-flag ${size}`}>
      {isLoading ? (
        <div className="flag-loading"></div>
      ) : error ? (
        <div className="flag-placeholder" title={country}>
          {getInitials()}
        </div>
      ) : (
        <img 
          src={flagUrl} 
          alt={`${country} flag`} 
          className="flag-image" 
          title={country}
        />
      )}
    </div>
  );
}

export default CountryFlag;