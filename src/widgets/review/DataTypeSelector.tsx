import DataTypeLabel from '@data/DataTypeLabel';
import { DataType } from '@data/DataTypes';

const DataTypeSelector: React.FC<{
  curDataType: DataType | undefined;
  setDataType: (dataType: DataType | undefined) => void;
}> = ({ curDataType, setDataType }) => {
  return (
    <div style={{ display: 'flex', gap: '0.25em 1em', flexWrap: 'wrap' }}>
      <DataTypeButton
        label="See all"
        targetDataType={undefined}
        currentDataType={curDataType}
        setDataType={setDataType}
      />
      {Object.values(DataType).map((dataType) => (
        <DataTypeButton
          key={dataType}
          label={<DataTypeLabel dataType={dataType} />}
          targetDataType={dataType}
          currentDataType={curDataType}
          setDataType={setDataType}
        />
      ))}
    </div>
  );
};

const DataTypeButton: React.FC<{
  label: React.ReactNode;
  targetDataType: DataType | undefined;
  currentDataType: DataType | undefined;
  setDataType: (dataType: DataType | undefined) => void;
}> = ({ label, targetDataType, currentDataType, setDataType }) => {
  const isCurrent = currentDataType === targetDataType;
  const border = isCurrent ? 'solid #ccc' : 'none';
  return (
    <button
      onClick={() => setDataType(targetDataType)}
      className={isCurrent ? 'selected' : ''}
      style={{
        borderRadius: '.5em .5em 0 0',
        borderTop: border,
        borderLeft: border,
        borderRight: border,
        padding: '.5em 1em',
      }}
    >
      {label}
    </button>
  );
};

export default DataTypeSelector;
