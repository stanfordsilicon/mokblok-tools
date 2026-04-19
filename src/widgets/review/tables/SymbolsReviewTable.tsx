import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function SymbolsReviewTable() {
  const { findDataFields } = useDataContext();
  const symbols = sortBy(findDataFields({ group: 'Symbols', field: 'symbols' }), (a) => a.length);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Components</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {symbols?.map((datum) => (
            <tr key={datum.index}>
              <td>
                {datum.instance} {datum.length}
              </td>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="3em" />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default SymbolsReviewTable;
