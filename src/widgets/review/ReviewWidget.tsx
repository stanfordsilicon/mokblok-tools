import { useEffect } from 'react';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import { useURLParams } from '@settings/URLParams';

import DownloadAllDemos from './demo/DownloadAllDemos';
import { VoteDragProvider } from './input/VoteDragContext';
import ReviewSection from './ReviewSection';

const ReviewWidget: React.FC = () => {
  const { page, section, updateURLParams } = useURLParams();
  const sections = getSectionsForPage(page);

  // When the page changes, if the current section is not valid for that page, update the section to the first section for that page.
  useEffect(() => {
    const sectionsForPage = getSectionsForPage(page);
    if (section != DataSection.All && page != DataPage.All && !sectionsForPage.includes(section)) {
      updateURLParams({ section: sectionsForPage[0] });
    }
  }, [page, section, updateURLParams]);

  return (
    <VoteDragProvider>
      <div className="flex flex-col gap-2 relative flex-1">
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <DownloadAllDemos />
        </div>
        {section !== DataSection.All ? (
          <ReviewSection dataSection={section} />
        ) : (
          sections.map((section) => <ReviewSection dataSection={section} key={section} />)
        )}
      </div>
    </VoteDragProvider>
  );
};

export default ReviewWidget;
