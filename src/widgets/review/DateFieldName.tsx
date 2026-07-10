import React from 'react';

import { useDataContext } from '@data/DataContext';
import { SourceLanguage } from '@data/DataTypes';
import { DateField } from '@data/DateField';

import { useURLParams } from '@settings/URLParams';

type Props = {
  field: DateField;
  language: 'source' | 'target';
};
const DateFieldName: React.FC<Props> = ({ field, language = 'target' }) => {
  const { getTranslation, findDataEntry } = useDataContext();
  const { sourceLanguage } = useURLParams();
  const data = findDataEntry({
    field,
    instance: '',
  });
  if (!data) return <span>{Object.entries(DateField).find((e) => e[1] === field)?.[0]}</span>;
  if (language === 'target') {
    const translation = getTranslation(data);
    if (translation) return <span>{translation}</span>;
  }
  return <span>{sourceLanguage === SourceLanguage.English ? data.english : data.french}</span>;
};

export default DateFieldName;
