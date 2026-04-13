import { useDataContext } from '@data/DataContext';

const DemoDateIntervalCreateEvent = () => {
  const { findDataField, getTranslation } = useDataContext();
  const date = findDataField({ field: 'availableFormats', instance: 'yMMMEd' });

  return (
    <>
      {/* all in SVG format like the other Demos */}
      {/* box at top saying "creating an event for Tuesday, April 23" */}
      <text x={10} y={20} fontSize="1.2em">
        Creating an event for
      </text>
      <text x={10} y={40} fontSize="1.2em">
        {getTranslation(date)}
      </text>
      <rect x="10" y="60" width="80" height="20" fill="white" stroke="#ccc" rx="10" ry="10" />
      horizontal lines to break the above box into multiple hours
      <path d="M10 80 L90 80" stroke="#ccc" />
      <path d="M10 100 L90 100" stroke="#ccc" />
      <path d="M10 120 L90 120" stroke="#ccc" />
      <path d="M10 140 L90 140" stroke="#ccc" />
      <path d="M10 160 L90 160" stroke="#ccc" />
      <path d="M10 180 L90 180" stroke="#ccc" />
      <path d="M10 200 L90 200" stroke="#ccc" />
      {/* below that, a calendar view of the month of April with the 23rd highlighted */}
      {/* <rect x="10" y="60" width="220" height="100" fill="white" stroke="#ccc" rx="10" ry="10" /> */}
      {/* (can reuse calendar code from DemoMonthsGrid) */}
      {/* How long should the event last? */}
      {/* dropdown with options like "1 day", "2 days", "1 week", "2 weeks", "1 month" */}
    </>
  );
};

export default DemoDateIntervalCreateEvent;
