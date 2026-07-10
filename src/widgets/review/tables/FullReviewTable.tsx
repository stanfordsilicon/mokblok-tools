import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CoverageLevel, getCoverageLevelKey } from '@data/CoverageLevel';
import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import getBackgroundColor from '../getBackgroundColor';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function FullReviewTable() {
  const { findDataFields } = useDataContext();
  const allFields = findDataFields({});
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

  const filteredFields = useMemo(
    () =>
      allFields.filter(
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
      allFields,
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
        </tr>
      </thead>
      <tbody>
        {filteredFields.map((field) => (
          <TranslationRow key={field.index} field={field} />
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

function TranslationRow({ field }: { field: DataField }) {
  const { t } = useTranslation();
  return (
    <tr key={field.index} style={{ backgroundColor: getBackgroundColor(field) }}>
      <td>{field.subject}</td>
      <td>{field.field}</td>
      <td>{field.instance}</td>
      <td>{field.length}</td>
      <td>{field.variant}</td>
      <td>{field.exampleNum}</td>
      <SourceDataCell data={field} style={{ maxWidth: '15em' }} />
      <InputDataCell data={field} inputWidth="15em" />
      <td style={{ overflow: 'hidden' }}>
        {t(`coverageLevelName.${getCoverageLevelKey(field.level)}`)}
      </td>
    </tr>
  );
}

export default FullReviewTable;
