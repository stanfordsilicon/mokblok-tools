import { useTranslation } from 'react-i18next';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import { getCompletionForSection } from './getDataEntriesForSection';

const DataTypeSelector: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5em',
        flexDirection: 'column',
        width: 'fit-content',
        padding: '0em 1em',
        fontSize: '0.8em',
      }}
    >
      {Object.values(DataPage).map((page) => (
        <PageButton key={page} page={page} />
      ))}
    </div>
  );
};

const PageButton: React.FC<{
  page: DataPage;
}> = ({ page }) => {
  const { t } = useTranslation();
  const { page: selectedPage, updateURLParams } = useURLParams();
  const isExpanded = selectedPage === page || selectedPage === DataPage.All;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em',
          justifyContent: 'space-between',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <button
          key={page}
          onClick={() => updateURLParams({ page, section: DataSection.All })}
          style={{
            backgroundColor: selectedPage === page ? 'var(--color-button-selected)' : 'transparent',
            border: '1px solid #ccc',
            padding: '0.5em 1em',
            cursor: 'pointer',
            width: '12em',
          }}
        >
          {t(`dataPage.${page}`)}{' '}
          {page !== DataPage.All && page !== DataPage.FullTable && (
            <div
              style={{
                display: 'inline-block',
                border: 'none',
                transition: 'transform 0.5s',
                cursor: 'pointer',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            >
              ▼
            </div>
          )}
        </button>
        <Progress page={page} />
      </div>
      {page !== DataPage.All && page !== DataPage.FullTable && (
        <div className={isExpanded ? 'verticalGrow' : 'verticalShrink'}>
          <PageSections page={page} />
        </div>
      )}
    </div>
  );
};

type PageSectionsProps = { page: DataPage };

const PageSections: React.FC<PageSectionsProps> = ({ page }) => {
  const { section: selectedSection, updateURLParams } = useURLParams();
  const sections = getSectionsForPage(page);
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.25em 1em',
        flexDirection: 'column',
        marginTop: '0.5em',
        paddingLeft: '2em',
      }}
    >
      {sections.map((section) => (
        <div key={section} style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
          <button
            onClick={() => updateURLParams({ section, page })}
            style={{
              backgroundColor:
                selectedSection === section ? 'var(--color-button-selected)' : 'transparent',
              border: '1px solid #ccc',
              padding: '0.5em 1em',
              cursor: 'pointer',
              width: '12em',
            }}
          >
            {t(`dataSection.${section}`)}
          </button>
          <Progress page={page} section={section} />
        </div>
      ))}
    </div>
  );
};

type ProgressProps = {
  page: DataPage;
  section?: DataSection;
};

const Progress: React.FC<ProgressProps> = ({ page, section }) => {
  const completion = getCompletionForSection(page, section);
  if (completion === undefined) return null;
  return (
    <div
      style={{
        backgroundColor: 'var(--color-button-background)',
        opacity: 0.5,
        width: '2.5em',
        height: '2.5em',
        borderRadius: '2em',
        textAlign: 'center',
        lineHeight: '2.5em',
        fontWeight: 200,
      }}
    >
      {completion.toFixed(0)}
      <span style={{ fontSize: '0.5em' }}>%</span>
    </div>
  );
};

export default DataTypeSelector;
