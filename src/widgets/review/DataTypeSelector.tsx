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
        }}
      >
        {Object.values(DataPage).map((page) => (
          <MaybeProgressBar page={page} key={page}>
            <Tab
              key={page}
              label={t(`dataPage.${page}`)}
              option={page}
              selected={selectedPage}
              setSelected={(newPage) => updateURLParams({ page: newPage })}
            />
          </MaybeProgressBar>
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
