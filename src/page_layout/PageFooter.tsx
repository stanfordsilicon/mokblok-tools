import { useTranslation } from 'react-i18next';

function PageFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="px-2 pt-4 pb-1 text-sm text-(--silicon-ink-soft)">
      <p>
        {t('footer.copyright', { year })}{' '}
        <a href="https://silicon.stanford.edu/" className="font-semibold">
          {t('footer.organizationName')}
        </a>
        . {t('allRightsReserved')}
      </p>
    </footer>
  );
}

export default PageFooter;
