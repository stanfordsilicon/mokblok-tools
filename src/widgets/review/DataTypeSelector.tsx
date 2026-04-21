import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';
import DataSectionLabel, { DataPageLabel } from '@data/DataSectionLabel';

import Tab from '@shared/Tab';

const DataTypeSelector: React.FC<{
  selectedPage: DataPage | undefined;
  setPage: (dataPage: DataPage | undefined) => void;
  selectedSection: DataSection | undefined;
  setSection: (dataType: DataSection | undefined) => void;
}> = ({ selectedPage, setPage, selectedSection, setSection }) => {
  const sections = selectedPage ? getSectionsForPage(selectedPage) : Object.values(DataSection);

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
        <Tab label="All Pages" option={undefined} selected={selectedPage} setSelected={setPage} />
        {Object.values(DataPage).map((page) => (
          <Tab
            key={page}
            label={<DataPageLabel dataPage={page} />}
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
            label={<>All {selectedPage ? <DataPageLabel dataPage={selectedPage} /> : 'Sections'}</>}
            option={undefined}
            selected={selectedSection}
            setSelected={setSection}
          />
        )}
        {sections.map((dataType) => (
          <Tab
            key={dataType}
            label={<DataSectionLabel dataSection={dataType} />}
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
