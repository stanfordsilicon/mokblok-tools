import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CoverageLevel, getCoverageLevelKey } from '@data/CoverageLevel';
import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import getBackgroundColor from '../getBackgroundColor';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function FullReviewTable() {
  const { findDataEntries } = useDataContext();
  const allEntries = findDataEntries({});
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [fieldFilter, setFieldFilter] = React.useState('');
  const [instanceFilter, setInstanceFilter] = React.useState('');
  const [lengthFilter, setLengthFilter] = React.useState('');
  const [variantFilter, setVariantFilter] = React.useState('');
  const [exampleNumFilter, setExampleNumFilter] = React.useState('');
  const [coverageLevelFilter, setCoverageLevelFilter] = React.useState<CoverageLevel | undefined>(
    undefined,
  );
  const { t } = useTranslation();

  const filteredEntries = useMemo(
    () =>
      allEntries.filter(
        (f) =>
          f.subject.includes(subjectFilter) &&
          f.field.includes(fieldFilter) &&
          f.instance.includes(instanceFilter) &&
          f.length.includes(lengthFilter) &&
          f.variant.includes(variantFilter) &&
          f.exampleNum.toString().includes(exampleNumFilter) &&
          (coverageLevelFilter === undefined || f.level === coverageLevelFilter),
      ),
    [
      allEntries,
      subjectFilter,
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
          <th>{t('review.subject')}</th>
          <th>{t('review.field')}</th>
          <th>{t('review.instance')}</th>
          <th>{t('review.length')}</th>
          <th>{t('review.variant')}</th>
          <th>{t('review.exampleNumber')}</th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{t('review.translated')}</th>
          <th>{t('settings.coverageLevel')}</th>
          <th>{t('review.fromXML')}</th>
        </tr>
        <tr>
          <FilterCell value={subjectFilter} onChange={setSubjectFilter} />
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
        {filteredEntries.map((entry) => (
          <TranslationRow key={entry.index} entry={entry} />
        ))}
      </tbody>
    </table>
  );
}

function FilterCell({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <td>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '2em' }} />
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
  const { t } = useTranslation();
  return (
    <td>
      <select
        value={coverageLevelFilter}
        onChange={(e) =>
          setCoverageLevelFilter(e.target.value ? Number(e.target.value) : undefined)
        }
        style={{ width: '5em' }}
      >
        <option value="">{t('coverageLevelName.Any')}</option>
        {Object.values(CoverageLevel)
          .filter((level) => typeof level === 'number')
          .map((level) => (
            <option key={level} value={level}>
              {t(`coverageLevelName.${getCoverageLevelKey(level)}`)}
            </option>
          ))}
      </select>
    </td>
  );
}

function TranslationRow({ entry }: { entry: DataEntry }) {
  const { getSourceData } = useDataContext();
  const { t } = useTranslation();
  return (
    <tr key={entry.index} style={{ backgroundColor: getBackgroundColor(entry) }}>
      <td>{entry.subject}</td>
      <td>{entry.field}</td>
      <td>{entry.instance}</td>
      <td>{entry.length}</td>
      <td>{entry.variant}</td>
      <td>{entry.exampleNum}</td>
      <SourceDataCell entry={entry} style={{ maxWidth: '15em' }} />
      <InputDataCell entry={entry} inputWidth="15em" />
      <td style={{ overflow: 'hidden' }}>
        {t(`coverageLevelName.${getCoverageLevelKey(entry.level)}`)}
      </td>
      <td>{getSourceData(entry)}</td>
    </tr>
  );
}

export default FullReviewTable;
