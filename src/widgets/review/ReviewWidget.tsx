import { useEffect, useState } from 'react';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useSettings } from '@settings/Settings';

import DataTypeSelector from './DataTypeSelector';
import DownloadAllDemos from './demo/DownloadAllDemos';
import ReviewSection from './ReviewSection';

const ReviewWidget: React.FC = () => {
  const [page, setPage] = useState<DataPage | undefined>(DataPage.Core);
  const [section, setSection] = useState<DataSection | undefined>(DataSection.Alphabet);
  const sections = page ? getSectionsForPage(page) : Object.values(DataSection);
  useEffect(() => {
    const sectionsForPage = page ? getSectionsForPage(page) : [];
    if (section && page && !sectionsForPage.includes(section)) {
      setSection(sectionsForPage[0]);
    }
  }, [page, section]);

  const { today, setToday } = useSettings();
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const date = new Date(e.target.value);
    setToday(date);
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return;
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const updatedDate = new Date(today);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    setToday(updatedDate);
  };

  return (
    <div style={{ display: 'flex', gap: '1em', flexDirection: 'column', width: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          Set today (using browser date picker):{' '}
          <input
            type="date"
            value={today.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />{' '}
          <input type="time" value={today.toTimeString().slice(0, 5)} onChange={handleTimeChange} />
        </div>
        <DownloadAllDemos />
      </div>
      <DataTypeSelector
        selectedPage={page}
        setPage={setPage}
        selectedSection={section}
        setSection={setSection}
      />
      {section ? (
        <ReviewSection dataSection={section} />
      ) : (
        sections.map((section) => <ReviewSection dataSection={section} key={section} />)
      )}
    </div>
  );
};

export default ReviewWidget;
