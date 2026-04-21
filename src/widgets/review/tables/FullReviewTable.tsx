import React, { useMemo } from 'react';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

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
          <th>Subject</th>
          <th>Field</th>
          <th>Instance</th>
          <th>Length</th>
          <th>Variant</th>
          <th>Example #</th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>Translated</th>
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
          <tr key={field.index}>
            <td>{field.subject}</td>
            <td>{field.field}</td>
            <td>{field.instance}</td>
            <td>{field.length}</td>
            <td>{field.variant}</td>
            <td>{field.exampleNum}</td>
            <SourceDataCell data={field} />
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
