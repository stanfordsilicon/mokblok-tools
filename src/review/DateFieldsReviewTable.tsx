import { useDataContext } from '../data/DataContext';
import { SourceLanguage } from '../data/DataTypes';
import { getSourceLanguageData } from './getSourceLanguageData';

const DateFieldsReviewTable: React.FC<{
  sourceLanguage: SourceLanguage;
}> = ({ sourceLanguage }) => {
  const { dateFieldsData } = useDataContext();
  return (
    <div>
      <h3>Date Fields</h3>
      <table>
        <thead>
          <tr>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              {Object.entries(SourceLanguage).find(([, value]) => value === sourceLanguage)?.[0]}
            </th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th>Wide</th>
            <th>Short</th>
            <th>Narrow</th>
            <th>Wide</th>
            <th>Short</th>
            <th>Narrow</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dateFieldsData).map(([fieldKey, fieldData]) => (
            <tr key={fieldKey}>
              <td>{getSourceLanguageData(fieldData.wide, sourceLanguage)}</td>
              <td>{getSourceLanguageData(fieldData.short, sourceLanguage)}</td>
              <td>{getSourceLanguageData(fieldData.narrow, sourceLanguage)}</td>
              <td>{fieldData.wide?.translated}</td>
              <td>{fieldData.short?.translated}</td>
              <td>{fieldData.narrow?.translated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DateFieldsReviewTable;
