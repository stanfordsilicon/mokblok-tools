import { useTranslation } from 'react-i18next';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import Tab from '@shared/Tab';

const DataTypeSelector: React.FC<{
  selectedPage: DataPage | undefined;
  setPage: (dataPage: DataPage | undefined) => void;
  selectedSection: DataSection | undefined;
  setSection: (dataType: DataSection | undefined) => void;
}> = ({ selectedPage, setPage, selectedSection, setSection }) => {
  const sections = selectedPage ? getSectionsForPage(selectedPage) : Object.values(DataSection);
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
        <Tab
          label={t('dataPage.all')}
          option={undefined}
          selected={selectedPage}
          setSelected={setPage}
        />
        {Object.values(DataPage).map((page) => (
          <Tab
            key={page}
            label={t(`dataPage.${page}`)}
            option={page}
            selected={selectedPage}
            setSelected={setPage}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '0.25em 1em',
          flexWrap: 'wrap',
          borderBottom: '2px solid #eee',
          marginBottom: '0.5em',
        }}
      >
        {selectedPage !== DataPage.FullTable && (
          <Tab
            label={t('dataSection.allOf', {
              section: t(`dataPage.${selectedPage}`),
            })}
            option={undefined}
            selected={selectedSection}
            setSelected={setSection}
          />
        )}
        {sections.map((dataType) => (
          <Tab
            key={dataType}
            label={t(`dataSection.${dataType}`)}
            option={dataType}
            selected={selectedSection}
            setSelected={setSection}
          />
        ))}
      </div>
    </div>
  );
};

export default DataTypeSelector;
