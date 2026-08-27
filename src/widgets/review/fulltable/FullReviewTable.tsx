import React, { useMemo } from 'react';

import { CoverageLevel } from '@data/CoverageLevel';
import { PatternFormat } from '@data/PatternFormat';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { Worksheet } from '@data/worksheets/Worksheet';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import FilterCoverageLevelCell from './FilterCoverageLevelCell';
import FilterFormatPatternCell from './FilterFormatPatternCell';
import FilterWorksheetCell from './FilterWorksheetCell';
import FullReviewRow from './FullReviewRow';

function FullReviewTable() {
  const { findDataEntries } = useSourceDataContext();
  const allEntries = findDataEntries({});
  const [worksheetFilter, setWorksheetFilter] = React.useState<Worksheet | undefined>(undefined);
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
  const [patternFormatFilter, setPatternFormatFilter] = React.useState<PatternFormat | undefined>(
    undefined,
  );
  const [xpathFilter, setXpathFilter] = React.useState('');
  const { uitext } = useInterfaceTranslation();

  const filteredEntries = useMemo(
    () =>
      allEntries.filter(
        (f) =>
          (worksheetFilter === undefined || f.worksheet?.includes(worksheetFilter)) &&
          f.page.includes(pageFilter) &&
          f.section.includes(sectionFilter) &&
          f.group.includes(groupFilter) &&
          f.field.includes(fieldFilter) &&
          f.instance.includes(instanceFilter) &&
          f.length.includes(lengthFilter) &&
          f.variant.includes(variantFilter) &&
          f.exampleNum.toString().includes(exampleNumFilter) &&
          (coverageLevelFilter === undefined || f.level === coverageLevelFilter) &&
          (patternFormatFilter === undefined || f.patternFormat === patternFormatFilter) &&
          f.xpath.includes(xpathFilter),
      ),
    [
      allEntries,
      worksheetFilter,
      pageFilter,
      sectionFilter,
      groupFilter,
      fieldFilter,
      instanceFilter,
      lengthFilter,
      variantFilter,
      exampleNumFilter,
      coverageLevelFilter,
      patternFormatFilter,
      xpathFilter,
    ],
  );

  return (
    <div className="max-h-[75vh] overflow-y-auto ">
      <table className="FullReviewTable">
        <thead>
          <tr>
            <th>{uitext('import.files.Worksheet')}</th>
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
            <th>Formatted, from XML</th>
            <th>Pattern, from XML</th>
            <th>XPath</th>
            <th>{uitext('patternFormat.patternFormat')}</th>
          </tr>
          <tr>
            <FilterWorksheetCell
              worksheetFilter={worksheetFilter}
              setWorksheetFilter={setWorksheetFilter}
            />
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
            <td />
            <FilterCell value={xpathFilter} onChange={setXpathFilter} />
            <FilterFormatPatternCell
              patternFormatFilter={patternFormatFilter}
              setPatternFormatFilter={setPatternFormatFilter}
            />
          </tr>
        </thead>
        <tbody>
          {filteredEntries.slice(0, 100).map((entry) => (
            <FullReviewRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
    </div>
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

export default FullReviewTable;
