import { useTranslation } from 'react-i18next';
import CountryComparator from '../../components/CountryComparator';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';
import './CompareCountriesPage.css';

export default function CompareCountriesPage({ skipNavbar = false }) {
  const { t } = useTranslation();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {!skipNavbar && <NavBar />}
      <div className="compare-page">
        <h1>{t('comparePage.title', 'Compare COVID-19 Data Between Countries')}</h1>
        <p className="compare-page-description">
          {t('comparePage.description', 'Select up to three countries to compare their COVID-19 statistics and view trends side by side.')}
        </p>
        
        <CountryComparator />
      </div>
      {!skipNavbar && <Footer />}
    </div>
  );
}