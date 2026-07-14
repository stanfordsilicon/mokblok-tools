import { I18nextProvider, useTranslation } from 'react-i18next';

import { DataProvider } from '@data/DataContext';
import { LinguisticsProvider } from '@data/LinguisticsContext';

import { URLParamsProvider } from '@settings/URLParams';

import i18n from './i18n';
import PageBody from './PageBody';
import PageTitle from './PageTitle';
import Sidebar from './Sidebar';

function App() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <URLParamsProvider>
      <I18nextProvider i18n={i18n}>
        <LinguisticsProvider>
          <DataProvider>
            <div style={{ display: 'flex', width: '100vw', overflow: 'hidden', height: '100vh' }}>
              <Sidebar />
              <div
                style={{ flex: 1, padding: '0em 1em', display: 'flex', flexDirection: 'column' }}
              >
                <PageTitle />
                <PageBody />
                <footer>
                  <p>
                    {t('footer.copyright', { year })}{' '}
                    <a href="https://silicon.stanford.edu/">{t('footer.organizationName')}</a>.{' '}
                    {t('allRightsReserved')}
                  </p>
                </footer>
              </div>
            </div>
          </DataProvider>
        </LinguisticsProvider>
      </I18nextProvider>
    </URLParamsProvider>
  );
}

export default App;
