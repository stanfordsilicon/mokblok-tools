import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

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
          f.exampleNum.toString().includes(exampleNumFilter),
      ),
    [
      allFields,
      subjectFilter,
      fieldFilter,
      instanceFilter,
      lengthFilter,
      variantFilter,
      exampleNumFilter,
    ],
  );

  return (
    <table>
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
        </tr>
        <tr>
          <FilterCell value={subjectFilter} onChange={setSubjectFilter} />
          <FilterCell value={fieldFilter} onChange={setFieldFilter} />
          <FilterCell value={instanceFilter} onChange={setInstanceFilter} />
          <FilterCell value={lengthFilter} onChange={setLengthFilter} />
          <FilterCell value={variantFilter} onChange={setVariantFilter} />
          <FilterCell value={exampleNumFilter} onChange={setExampleNumFilter} />
        </tr>
      </thead>
      <tbody>
        {filteredFields.map((field) => (
          <tr key={field.index} style={{ backgroundColor: getBackgroundColor(field) }}>
            <td>{field.subject}</td>
            <td>{field.field}</td>
            <td>{field.instance}</td>
            <td>{field.length}</td>
            <td>{field.variant}</td>
            <td>{field.exampleNum}</td>
            <SourceDataCell data={field} style={{ maxWidth: '15em' }} />
            <InputDataCell data={field} inputWidth="15em" />
          </tr>
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

export default FullReviewTable;
