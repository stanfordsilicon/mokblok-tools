import { useTranslation } from 'react-i18next';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import ProgressCircle from './ProgressCircle';

const DataTypeSelector: React.FC = () => {
  return (
    <div
      className="flex flex-col gap-2 "
      style={{
        width: 'fit-content',
        padding: '0em 1em',
        fontSize: '0.75rem',
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
  const highlightBackground =
    selectedPage === page || (selectedPage === DataPage.All && page !== DataPage.FullTable);

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
          className={'px-1 py-1 text-base text-sm' + (highlightBackground ? ' selected' : '')}
          onClick={() => updateURLParams({ page, section: DataSection.All })}
          style={{ width: '12em' }}
        >
          {t(`dataPage.${page}`)}{' '}
          {page !== DataPage.All && page !== DataPage.FullTable && (
            <div
              style={{
                display: 'inline-block',
                transition: 'transform 0.5s',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            >
              ▼
            </div>
          )}
        </button>
        <ProgressCircle page={page} />
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
  const { t } = useTranslation();
  const { section: selectedSection, updateURLParams } = useURLParams();
  const sections = getSectionsForPage(page);

  return (
    <div className="flex flex-col gap-1" style={{ marginTop: '0.5em', paddingLeft: '2em' }}>
      {sections.map((section) => (
        <div key={section} style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
          <button
            className={
              'px-1 py-1 text-sm' +
              (selectedSection === section || selectedSection === DataSection.All
                ? ' selected'
                : '')
            }
            onClick={() => updateURLParams({ section, page })}
            style={{ width: '10.5em' }}
          >
            {t(`dataSection.${section}`)}
          </button>
          <ProgressCircle page={page} section={section} />
        </div>
      ))}
    </div>
  );
};

export default DataTypeSelector;
