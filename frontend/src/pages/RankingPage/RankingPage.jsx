import { useTranslation } from 'react-i18next';
import TopCountries from '../../components/TopCountries';
import './RankingPage.css';

function RankingPage({ skipNavbar = false }) {
  const { t } = useTranslation();

  return (
    <div className="ranking-page">
      <h1 className="page-title">
        {t('rankingPage.title', 'COVID-19 Global Rankings')}
      </h1>
      <p className="page-description">
        {t('rankingPage.description', 'Visualize and compare the most affected countries by different COVID-19 metrics. View the top countries ranked by cases, deaths, recovered patients, and active cases.')}
      </p>

      <TopCountries />

      <div className="ranking-info-box">
        <h3>{t('rankingPage.aboutRanking', 'About This Ranking')}</h3>
        <p>{t('rankingPage.dataSource', 'Data is sourced from Johns Hopkins University CSSE COVID-19 Data Repository. Rankings are updated daily and may vary based on reporting frequency from different countries.')}</p>
        <p>{t('rankingPage.disclaimer', 'Note: COVID-19 reporting methodologies differ between countries. These rankings are based on reported figures and may not represent the complete epidemiological situation in each country.')}</p>
      </div>
    </div>
  );
}

export default RankingPage;