import { useEffect } from 'react';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

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

  return (
    <div
      style={{
        display: 'flex',
        gap: '1em',
        flexDirection: 'column',
        position: 'relative',
        flex: 1,
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <DownloadAllDemos />
      </div>
      {section !== DataSection.All ? (
        <ReviewSection dataSection={section} />
      ) : (
        sections.map((section) => <ReviewSection dataSection={section} key={section} />)
      )}
    </div>
  );
};

export default ReviewWidget;
