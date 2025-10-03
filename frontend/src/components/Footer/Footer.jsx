import './Footer.css';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ position: 'relative' }}>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{t('footer.appName', 'COVID-19 DataViz')}</h4>
            <p>{t('footer.description', 'Global visualization of COVID-19 pandemic data')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.dataSources', 'Data Sources')}</h4>
            <ul>
              <li><a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">{t('footer.jhuCsse', 'John Hopkins University CSSE')}</a></li>
              <li><a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports" target="_blank" rel="noopener noreferrer">{t('footer.whoReports', 'WHO Reports')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.quickLinks', 'Quick Links')}</h4>
            <ul>
              <li><a href="/">{t('navigation.globalDashboard', 'Dashboard')}</a></li>
              <li><a href="/countries">{t('navigation.countries', 'Countries')}</a></li>
              <li><a href="/about">{t('navigation.about', 'About')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} {t('footer.copyright', 'COVID-19 DataViz')}. {t('footer.rights', 'All rights reserved')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;