import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    // Save the language preference to localStorage
    localStorage.setItem('covid-dashboard-language', lng);
  };

  // Handle clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('covid-dashboard-language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Get the current language display name
  const getCurrentLanguage = () => {
    const lang = languages.find(lang => lang.code === i18n.language);
    return lang ? lang : languages[0];
  };

  if (variant === 'buttons') {
    return (
      <div className="language-button-group">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`language-button ${i18n.language === lang.code ? 'active' : ''}`}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button 
        className="language-dropdown-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('navigation.language', 'Language')}
      >
        {getCurrentLanguage().flag} {getCurrentLanguage().code.toUpperCase()}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className={`language-dropdown-content ${isOpen ? 'show' : ''}`}>
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="language-option-flag">{lang.flag}</span>
            <span>{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;