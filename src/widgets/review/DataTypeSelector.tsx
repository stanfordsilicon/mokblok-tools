import { useTranslation } from 'react-i18next';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import Tab from '@shared/Tab';

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
          <Tab
            key={page}
            label={t(`dataPage.${page}`)}
            option={page}
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
          <Tab
            label={t('dataSection.allOf', {
              section: t(`dataPage.${selectedPage}`),
            })}
            option={DataSection.All}
            selected={selectedSection}
            setSelected={(newSection) => updateURLParams({ section: newSection })}
          />
          {sections.map((dataType) => (
            <Tab
              key={dataType}
              label={t(`dataSection.${dataType}`)}
              option={dataType}
              selected={selectedSection}
              setSelected={(newSection) => updateURLParams({ section: newSection })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DataTypeSelector;
