import { I18nextProvider, useTranslation } from 'react-i18next';

import { URLParamsProvider } from '@settings/URLParams';

import i18n from './i18n';
import PageBody from './PageBody';

function App() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <URLParamsProvider>
      <I18nextProvider i18n={i18n}>
        <header>
          <h1>
            <a href="/">{t('title')}</a>
          </h1>
        </header>
        <div>
          <PageBody />
        </div>
        <footer>
          <p>
            {t('footer.copyright', { year })}{' '}
            <a href="https://silicon.stanford.edu/">{t('footer.organizationName')}</a>.{' '}
            {t('allRightsReserved')}
          </p>
        </footer>
      </I18nextProvider>
    </URLParamsProvider>
  );
}

export default App;
