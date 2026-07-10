import { t } from 'i18next';
import { useEffect } from 'react';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useSettings } from '@settings/Settings';
import { useURLParams } from '@settings/URLParams';

import DataTypeSelector from './DataTypeSelector';
import DownloadAllDemos from './demo/DownloadAllDemos';
import ReviewSection from './ReviewSection';

const ReviewWidget: React.FC = () => {
  const { page, section, updateURLParams } = useURLParams();
  const sections = getSectionsForPage(page);
  useEffect(() => {
    const sectionsForPage = getSectionsForPage(page);
    if (section != DataSection.All && page != DataPage.All && !sectionsForPage.includes(section)) {
      updateURLParams({ section: sectionsForPage[0] });
    }
  }, [page, section, updateURLParams]);

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
          {t('review.setToday')}:{' '}
          <input
            type="date"
            value={today.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />{' '}
          <input type="time" value={today.toTimeString().slice(0, 5)} onChange={handleTimeChange} />
        </div>
        <DownloadAllDemos />
      </div>
      <DataTypeSelector />
      {section !== DataSection.All ? (
        <ReviewSection dataSection={section} />
      ) : (
        sections.map((section) => <ReviewSection dataSection={section} key={section} />)
      )}
    </div>
  );
};

export default ReviewWidget;
