import { useTranslation } from 'react-i18next';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { BackgroundStyle } from '@settings/BackgroundStyle';
import { useURLParams } from '@settings/URLParams';

import BackgroundProgressBar from '@shared/BackgroundProgressBar';
import Tab from '@shared/Tab';

import { getCompletionForSection } from './getDataEntriesForSection';

const DataTypeSelector: React.FC = () => {
  const { section: selectedSection, page: selectedPage, updateURLParams } = useURLParams();
  const sections = getSectionsForPage(selectedPage);
  const { t } = useTranslation();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '0.25em 1em',
          flexWrap: 'wrap',
          borderBottom: '2px solid #eee',
          marginBottom: '0.5em',
          flexDirection: 'column',
        }}
      >
        {Object.values(DataPage).map((page) => (
          <PageButton
            key={page}
            page={page}
            selected={selectedPage}
            setSelected={(newPage) => updateURLParams({ page: newPage })}
          />
        ))}
      </div>

      {selectedPage !== DataPage.FullTable && (
        <div
          style={{
            display: 'flex',
            gap: '0.25em 1em',
            flexWrap: 'wrap',
            borderBottom: '2px solid #eee',
            marginBottom: '0.5em',
          }}
        >
          <MaybeProgressBar page={selectedPage}>
            <Tab
              label={t('dataSection.All', {
                section: t(`dataPage.${selectedPage}`),
              })}
              option={DataSection.All}
              selected={selectedSection}
              setSelected={(newSection) => updateURLParams({ section: newSection })}
            />
          </MaybeProgressBar>
          {sections.map((section) => (
            <MaybeProgressBar key={section} page={selectedPage} section={section}>
              <Tab
                label={t(`dataSection.${section}`)}
                option={section}
                selected={selectedSection}
                setSelected={(newSection) => updateURLParams({ section: newSection })}
                style={{ backgroundColor: 'transparent' }}
              />
            </MaybeProgressBar>
          ))}
        </div>
      )}
    </div>
  );
};

const PageButton: React.FC<{
  page: DataPage;
}> = ({ page }) => {
  const { t } = useTranslation();
  const { page: selectedPage, updateURLParams } = useURLParams();
  // const [isExpanded, setIsExpanded] = useState(false);
  const isExpanded = selectedPage === page || selectedPage === DataPage.All;
  return (
    <div>
      <div>
        <button
          key={page}
          onClick={() => updateURLParams({ page })}
          style={{
            backgroundColor: selectedPage === page ? 'var(--color-button-selected)' : 'transparent',
            border: '1px solid #ccc',
            padding: '0.5em 1em',
            cursor: 'pointer',
            width: '12em',
          }}
        >
          {t(`dataPage.${page}`)}{' '}
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
        </button>
      </div>
      {page !== DataPage.All && (
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
        width: '12em',
        marginTop: '0.5em',
        paddingLeft: '2em',
      }}
    >
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => updateURLParams({ section, page })}
          style={{
            backgroundColor:
              selectedSection === section ? 'var(--color-button-selected)' : 'transparent',
            border: '1px solid #ccc',
            padding: '0.5em 1em',
            cursor: 'pointer',
          }}
        >
          {t(`dataSection.${section}`)}
        </button>
      ))}
    </div>
  );
};

type MaybeProgressBarProps = React.PropsWithChildren<{
  page: DataPage;
  section?: DataSection;
}>;

const MaybeProgressBar: React.FC<MaybeProgressBarProps> = ({ page, section, children }) => {
  const { bgStyle } = useURLParams();
  const completion = getCompletionForSection(page, section);
  if (bgStyle !== BackgroundStyle.Missing) return <>{children}</>;
  return (
    <BackgroundProgressBar percentage={completion} style={{ borderRadius: '.5em .5em 0 0' }}>
      {children}
    </BackgroundProgressBar>
  );
};

export default DataTypeSelector;
