import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('en')} 
        className={i18n.language === 'en' ? 'active' : ''}
        style={{ marginRight: '5px', padding: '4px 8px', cursor: 'pointer' }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('fr')} 
        className={i18n.language === 'fr' ? 'active' : ''}
        style={{ marginRight: '5px', padding: '4px 8px', cursor: 'pointer' }}
      >
        FR
      </button>
      <button 
        onClick={() => changeLanguage('es')} 
        className={i18n.language === 'es' ? 'active' : ''}
        style={{ padding: '4px 8px', cursor: 'pointer' }}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;