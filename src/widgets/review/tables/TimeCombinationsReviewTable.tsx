import { useDataContext } from '@data/DataContext';
import { TimeCombinationsFormat } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function TimeCombinationsReviewTable() {
  const { timeCombinations } = useDataContext().data;

  return (
    <div>
      <h3>Time Combinations</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Morning</th>
            <th>Evening</th>
            <th>Pattern</th>
            <th>Morning</th>
            <th>Evening</th>
            <th>Pattern</th>
          </tr>
        </thead>
        <tbody>
          {timeCombinations
            ? Object.values(TimeCombinationsFormat).map((format) => (
                <tr key={format}>
                  <td>{format}</td>
                  <td>{getSourceLanguageData(timeCombinations[format]?.morning) || '-'}</td>
                  <td>{getSourceLanguageData(timeCombinations[format]?.evening) || '-'}</td>
                  <td>
                    <em>TODO</em>
                  </td>
                  <InputCell format={format} variant="morning" />
                  <InputCell format={format} variant="evening" />
                  <td>
                    <em>TODO</em>
                  </td>
                </tr>
              ))
            : 'Data not available'}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = {
  format: TimeCombinationsFormat;
  variant: 'morning' | 'evening';
};
function InputCell({ format, variant }: InputCellProps) {
  const {
    data: { timeCombinations },
    set,
  } = useDataContext();
  return (
    <td>
      <HighlightInput
        value={timeCombinations?.[format]?.[variant]?.translated || ''}
        onChange={(value) => set.timeCombinations(format, variant, value)}
        highlight={/\d+/g}
        style={{ width: '6em' }}
        disabled={!timeCombinations?.[format]?.[variant]}
      />
    </td>
  );
}

export default TimeCombinationsReviewTable;
