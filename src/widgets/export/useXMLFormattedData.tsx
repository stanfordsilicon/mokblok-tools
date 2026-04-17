import {
  type DateFieldData,
  type DayOfWeekData,
  type MonthData,
  type RowData,
} from '@data/DataTypes';
import { DateField } from '@data/DateField';

type XMLFormattedData = {
  monthsXML?: string;
  daysOfWeekXML?: string;
  dateFieldsXML?: string;
};

const useXMLFormattedData = (): XMLFormattedData => {
  const months: MonthData[] = [];
  const daysOfWeek: DayOfWeekData[] = [];
  const dateFields: Partial<Record<DateField, DateFieldData>> = {};

  const monthsXML = months ? getMonthsXML(months).replaceAll('\n', '\n      ') : undefined;
  const daysOfWeekXML = daysOfWeek
    ? getDaysOfWeekXML(daysOfWeek).replaceAll('\n', '\n      ')
    : undefined;
  const dateFieldsXML = dateFields
    ? getDateFieldsXML(dateFields).replaceAll('\n', '\n      ')
    : undefined;

  // Apply indentation

  return { monthsXML, daysOfWeekXML, dateFieldsXML };
};

function getMonthsXML(monthsData: MonthData[]): string {
  return `
<months>
  <monthContext type="format">
    <monthWidth type="wide">
${getIndexedXMLTag(DateField.Month, monthsData, (m) => m.wide)}
    </monthWidth>
    <monthWidth type="abbreviated"> 
${getIndexedXMLTag(DateField.Month, monthsData, (m) => m.abbreviated)} 
    </monthWidth>
    <monthWidth type="narrow">
${getIndexedXMLTag(DateField.Month, monthsData, (m) => m.narrow)} 
    </monthWidth>
  </monthContext>
</months>`;
}

function getDaysOfWeekXML(daysOfWeekData: DayOfWeekData[]): string {
  return `
<days>
  <dayContext type="format">
    <dayWidth type="wide">
${getIndexedXMLTag(DateField.Day, daysOfWeekData, (d) => d.wide)}
    </dayWidth>
    <dayWidth type="abbreviated"> 
${getIndexedXMLTag(DateField.Day, daysOfWeekData, (d) => d.abbreviated)} 
    </dayWidth>
    <dayWidth type="short"> 
${getIndexedXMLTag(DateField.Day, daysOfWeekData, (d) => d.abbreviated)} 
    </dayWidth>
    <dayWidth type="narrow">
${getIndexedXMLTag(DateField.Day, daysOfWeekData, (d) => d.narrow)} 
    </dayWidth>
  </dayContext>
</days>`;
}

const dayOfWeekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// Returns values like <month type="1">January</month>
function getIndexedXMLTag<T>(
  dateField: DateField,
  items: T[],
  getRow: (item: T) => RowData | undefined,
): string {
  return items
    .map((item, index) => {
      const row = getRow(item);
      const value = row?.translated?.trim();
      if (!row || !value) return null; // Skip missing or whitespace-only values
      const type = dateField == DateField.Day ? dayOfWeekKeys[index] : index + 1;
      return `<${dateField} type="${type}">${value}</${dateField}>`;
    })
    .filter(Boolean)
    .map((line) => ' '.repeat(6) + line)
    .join('\n');
}

function getDateFieldsXML(dateFieldsData: Partial<Record<DateField, DateFieldData>>): string {
  const fields = [
    ...getDateFieldVersions('era', dateFieldsData[DateField.Era]),
    ...getDateFieldVersions('year', dateFieldsData[DateField.Year]),
    ...getDateFieldVersions('month', dateFieldsData[DateField.Month]),
    ...getDateFieldVersions('day', dateFieldsData[DateField.Day]),
    ...getDateFieldVersions('hour', dateFieldsData[DateField.Hour]),
    ...getDateFieldVersions('minute', dateFieldsData[DateField.Minute]),
    ...getDateFieldVersions('second', dateFieldsData[DateField.Second]),
  ].filter(Boolean);
  return `
<fields>
${fields.map((line) => '  ' + line).join('\n')}
</fields>`;
}

function getDateFieldVersions(type: string, fieldData: DateFieldData | undefined): string[] {
  if (!fieldData) return [];
  return [
    getFieldMaybe(`${type}`, fieldData?.wide?.translated),
    getFieldMaybe(`${type}-short`, fieldData?.short?.translated),
    getFieldMaybe(`${type}-narrow`, fieldData?.narrow?.translated),
  ].filter(Boolean) as string[];
}

function getFieldMaybe(type: string, displayName: string | undefined): string {
  if (!displayName) return '';
  return `<field type="${type}">
    <displayName>${displayName}</displayName>
  </field>`;
}

export default useXMLFormattedData;
