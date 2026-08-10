import React, { useMemo } from 'react';

import { CoverageLevel, getCoverageLevelKey } from '@data/CoverageLevel';
import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import useBackgroundColor from '../input/getBackgroundColor';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function FullReviewTable() {
  const { findDataEntries } = useDataContext();
  const allEntries = findDataEntries({});
  const [pageFilter, setPageFilter] = React.useState('');
  const [sectionFilter, setSectionFilter] = React.useState('');
  const [groupFilter, setGroupFilter] = React.useState('');
  const [fieldFilter, setFieldFilter] = React.useState('');
  const [instanceFilter, setInstanceFilter] = React.useState('');
  const [lengthFilter, setLengthFilter] = React.useState('');
  const [variantFilter, setVariantFilter] = React.useState('');
  const [exampleNumFilter, setExampleNumFilter] = React.useState('');
  const [coverageLevelFilter, setCoverageLevelFilter] = React.useState<CoverageLevel | undefined>(
    undefined,
  );
  const { uitext } = useInterfaceTranslation();

  const filteredEntries = useMemo(
    () =>
      allEntries.filter(
        (f) =>
          f.page.includes(pageFilter) &&
          f.section.includes(sectionFilter) &&
          f.group.includes(groupFilter) &&
          f.field.includes(fieldFilter) &&
          f.instance.includes(instanceFilter) &&
          f.length.includes(lengthFilter) &&
          f.variant.includes(variantFilter) &&
          f.exampleNum.toString().includes(exampleNumFilter) &&
          (coverageLevelFilter === undefined || f.level === coverageLevelFilter),
      ),
    [
      allEntries,
      pageFilter,
      sectionFilter,
      groupFilter,
      fieldFilter,
      instanceFilter,
      lengthFilter,
      variantFilter,
      exampleNumFilter,
      coverageLevelFilter,
    ],
  );

  return (
    <table className="FullReviewTable">
      <thead>
        <tr>
          <th>{uitext('review.page')}</th>
          <th>{uitext('review.section')}</th>
          <th>{uitext('review.group')}</th>
          <th>{uitext('review.field')}</th>
          <th>{uitext('review.instance')}</th>
          <th>{uitext('review.length')}</th>
          <th>{uitext('review.variant')}</th>
          <th>{uitext('review.exampleNumber')}</th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{uitext('review.translated')}</th>
          <th>{uitext('settings.coverageLevel')}</th>
          <th>{uitext('review.fromXML')}</th>
        </tr>
        <tr>
          <FilterCell value={pageFilter} onChange={setPageFilter} />
          <FilterCell value={sectionFilter} onChange={setSectionFilter} />
          <FilterCell value={groupFilter} onChange={setGroupFilter} />
          <FilterCell value={fieldFilter} onChange={setFieldFilter} />
          <FilterCell value={instanceFilter} onChange={setInstanceFilter} />
          <FilterCell value={lengthFilter} onChange={setLengthFilter} />
          <FilterCell value={variantFilter} onChange={setVariantFilter} />
          <FilterCell value={exampleNumFilter} onChange={setExampleNumFilter} />
          <td />
          <td />
          <FilterCoverageLevelCell
            coverageLevelFilter={coverageLevelFilter}
            setCoverageLevelFilter={setCoverageLevelFilter}
          />
          <td />
        </tr>
      </thead>
      <tbody>
        {filteredEntries.slice(0, 100).map((entry) => (
          <TranslationRow key={entry.index} entry={entry} />
        ))}
      </tbody>
    </table>
  );
}

function FilterCell({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <td>
      <input
        className="border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '2em' }}
      />
    </td>
  );
}

function FilterCoverageLevelCell({
  coverageLevelFilter,
  setCoverageLevelFilter,
}: {
  coverageLevelFilter: CoverageLevel | undefined;
  setCoverageLevelFilter: (value: CoverageLevel | undefined) => void;
}) {
  const { uitext } = useInterfaceTranslation();
  return (
    <td>
      <select
        value={coverageLevelFilter}
        onChange={(e) =>
          setCoverageLevelFilter(e.target.value ? Number(e.target.value) : undefined)
        }
        style={{ width: '5em' }}
      >
        <option value="">{uitext('coverageLevelName.Any')}</option>
        {Object.values(CoverageLevel)
          .filter((level) => typeof level === 'number')
          .map((level) => (
            <option key={level} value={level}>
              {uitext(`coverageLevelName.${getCoverageLevelKey(level)}`)}
            </option>
          ))}
      </select>
    </td>
  );
}

function TranslationRow({ entry }: { entry: DataEntry }) {
  const { uitext } = useInterfaceTranslation();
  const { getSourceData } = useDataContext();
  const getBackgroundColor = useBackgroundColor();
  return (
    <tr key={entry.index} style={{ backgroundColor: getBackgroundColor(entry) }}>
      <td style={{ maxWidth: '5em' }}>{uitext(`dataPage.${entry.page}`)}</td>
      <td style={{ maxWidth: '5em' }}>{uitext(`dataSection.${entry.section}`)}</td>
      <td style={{ maxWidth: '5em' }}>{entry.group}</td>
      <td style={{ maxWidth: '5em' }}>{entry.field}</td>
      <td style={{ maxWidth: '5em' }}>{entry.instance}</td>
      <td>{entry.length}</td>
      <td>{entry.variant}</td>
      <td>{entry.exampleNum}</td>
      <SourceDataCell entry={entry} style={{ maxWidth: '15em' }} />
      <InputDataCell entry={entry} inputWidth="15em" />
      <td style={{ overflow: 'hidden' }}>
        {uitext(`coverageLevelName.${getCoverageLevelKey(entry.level)}`)}
      </td>
      <td>{getSourceData(entry)}</td>
    </tr>
  );
}

export default FullReviewTable;
