import { I18nextProvider, useTranslation } from 'react-i18next';

import i18n from './i18n';
import PageBody from './PageBody';

function App() {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
      <header>
        <h1>{t('title')}</h1>
      </header>
      <div>
        <PageBody />
      </div>
      <footer>
        <p>
          © 2026 <a href="https://silicon.stanford.edu/">Stanford SILICON</a>.{' '}
          {t('allRightsReserved')}
        </p>
      </footer>
    </I18nextProvider>
  );
}

export default App;
