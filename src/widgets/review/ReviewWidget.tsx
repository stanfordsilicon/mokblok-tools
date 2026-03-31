import { useState } from 'react';

import { DataType } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import DataTypeSelector from './DataTypeSelector';
import DownloadAllDemos from './demo/DownloadAllDemos';
import ReviewSection from './ReviewSection';

const ReviewWidget: React.FC = () => {
  const { today, setToday } = useSettings();
  const [dataType, setDataType] = useState<DataType | undefined>(DataType.Alphabet);
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
    <div style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
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
      <DataTypeSelector curDataType={dataType} setDataType={setDataType} />
      {dataType ? (
        <ReviewSection dataType={dataType} />
      ) : (
        Object.values(DataType).map((dataType) => (
          <ReviewSection dataType={dataType} key={dataType} />
        ))
      )}
    </div>
  );
};

export default ReviewWidget;
