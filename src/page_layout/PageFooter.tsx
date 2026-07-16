import { useTranslation } from 'react-i18next';

function PageFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer>
      <p>
        {t('footer.copyright', { year })}{' '}
        <a href="https://silicon.stanford.edu/">{t('footer.organizationName')}</a>.{' '}
        {t('allRightsReserved')}
      </p>
    </footer>
  );
}

export default PageFooter;
