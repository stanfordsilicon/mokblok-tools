import useInterfaceTranslation from '@shared/useInterfaceTranslation';

function PageFooter() {
  const { uitext } = useInterfaceTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="px-2 pt-4 pb-1 text-sm text-(--silicon-ink-soft)">
      <p>
        {uitext('footer.copyright', { year })}{' '}
        <a href="https://silicon.stanford.edu/" className="font-semibold">
          {uitext('footer.organizationName')}
        </a>
        . {uitext('allRightsReserved')}
      </p>
    </footer>
  );
}

export default PageFooter;
