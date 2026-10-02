import { DataSection } from '@data/DataSection';
import { useSourceDataContext } from '@data/source/SourceDataProvider';
import { useTargetDataStore } from '@data/target/TargetDataProvider';

type Props = {
  instance: string;
};

/** A date-picker style preview for one available date format. */
const DemoDateCombination: React.FC<Props> = ({ instance }) => {
  const { findDataEntry } = useSourceDataContext();
  const getTranslation = useTargetDataStore((state) => state.getTranslation);
  const entry = findDataEntry({
    section: DataSection.Dates,
    field: 'availableFormats',
    instance,
  });

  const formattedDate = getTranslation(entry);
  const date = entry?.var1 ? new Date(entry.var1) : new Date(0);
  const monthName = getTranslation(
    findDataEntry({
      section: DataSection.Months,
      field: 'M',
      instance: String(date.getUTCMonth() + 1),
      length: 'w',
    }),
  );
  const dayFields = Array.from(new Set(Array.from(instance))).map((field) =>
    findDataEntry({
      section: DataSection.DateFields,
      field,
      length: 'w',
    }),
  );
  const dayFieldString = dayFields.map((entry) => getTranslation(entry)).join(', ');

  return (
    <>
      <rect x="20" y="25" width="200" height="190" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
      <rect x="20" y="25" width="200" height="42" rx="10" fill="#2563eb" />
      <rect x="20" y="55" width="200" height="12" fill="#2563eb" />
      <text x="35" y="51" fill="white" fontSize="12" fontWeight="bold">
        {monthName}
      </text>
      <text x="205" y="51" fill="white" fontSize="18" textAnchor="end">
        ▾
      </text>
      <text x="120" y="105" textAnchor="middle" fill="#64748b" fontSize="11">
        {dayFieldString}
      </text>
      <text x="120" y="138" textAnchor="middle" fill="#0f172a" fontSize="20" fontWeight="bold">
        {formattedDate || '—'}
      </text>
      <line x1="45" y1="160" x2="195" y2="160" stroke="#cbd5e1" />
      <circle cx="120" cy="185" r="12" fill="#dbeafe" />
      <path d="M120 178v14M113 185h14" stroke="#2563eb" strokeWidth="2" />
    </>
  );
};

export default DemoDateCombination;
