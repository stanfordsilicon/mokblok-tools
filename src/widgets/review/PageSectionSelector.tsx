import React, { useCallback, useEffect, useState } from 'react';

import { isEntryInCoverageLevel } from '@data/CoverageLevel';
import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';
import { isEntryInWorksheetScope } from '@data/worksheets/Worksheets';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useDataEntriesForSection } from './getDataEntriesForSection';
import ProgressCircle from './progress/ProgressCircle';
import VotingCircle from './progress/VotingCircle';

const PageSectionSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { step } = useURLParams();
  // Return a 3 column grid of buttons for each DataPage
  return (
    <table className="w-full h-fit table-auto text-xs">
      <colgroup>
        <col />
        <col className="truncate w-10" />
        {step === StepName.Vote && <col className="w-10" />}
      </colgroup>
      <thead>
        <tr>
          <th className="">{uitext('nav.page/section')}</th>
          <th className="truncate">{uitext('nav.translations')}</th>
          {step === StepName.Vote && (
            <th className="truncate" title={uitext('nav.votes')}>
              {uitext('nav.votes')}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {Object.values(DataPage).map((page) => (
          <PageButtons key={page} page={page} />
        ))}
      </tbody>
    </table>
  );
};

const PageButtons: React.FC<{
  page: DataPage;
}> = ({ page }) => {
  const { page: selectedPage, coverageLevel, worksheets, admin } = useURLParams();
  const [isExpanded, setIsExpanded] = useState(
    selectedPage === page || selectedPage === DataPage.All,
  );

  useEffect(() => {
    // When the page changes, redo the isExpanded
    setIsExpanded(selectedPage === page || selectedPage === DataPage.All);
  }, [selectedPage, page]);

  const sections =
    page !== DataPage.All && page !== DataPage.FullTable ? getSectionsForPage(page) : [];

  // Confirm the sections that have data to be submitted at the current coverage level.
  const getDataEntriesForSection = useDataEntriesForSection();
  const pendingSections = sections.filter((section) => {
    const dataEntries = getDataEntriesForSection(page, section);
    const coveredDataEntries = dataEntries.filter(
      (entry) =>
        isEntryInCoverageLevel(entry, coverageLevel) && isEntryInWorksheetScope(entry, worksheets),
    );
    return coveredDataEntries.length > 0;
  });

  // Don't show buttons in a few cases
  if (page === DataPage.FullTable) {
    if (!admin) return null;
  } else if (page !== DataPage.All && pendingSections.length === 0) {
    return null;
  }

  return (
    <>
      <SectionRow page={page} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      {page !== DataPage.All &&
        page !== DataPage.FullTable &&
        sections.map((section) => (
          <SectionRow
            key={section}
            page={page}
            section={section}
            isVisible={isExpanded && pendingSections.includes(section)}
          />
        ))}
    </>
  );
};

type SectionRowProps = {
  page: DataPage;
  section?: DataSection;
  isVisible?: boolean; // Only for Sections
  isExpanded?: boolean; // Only for Pages
  setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>; // Only for Pages
};

const SectionRow: React.FC<SectionRowProps> = ({
  page,
  section,
  isVisible = true,
  isExpanded = true,
  setIsExpanded,
}) => {
  const { section: selectedSection, page: selectedPage, updateURLParams, step } = useURLParams();
  const [isRendered, setIsRendered] = useState(isVisible);

  useEffect(() => {
    if (isVisible) setIsRendered(true);
  }, [isVisible]);

  const isSelected = section
    ? selectedSection === section || selectedSection === DataSection.All
    : (selectedPage === page || (selectedPage === DataPage.All && page !== DataPage.FullTable)) &&
      isExpanded;
  const contentClassName =
    (section ? 'overflow-hidden transition-all duration-300 ease-in-out' : '') +
    (section ? (isVisible ? ' max-h-20 opacity-100' : ' max-h-0 opacity-0') : '');

  const onClick = useCallback(() => {
    updateURLParams({ page, section: section ?? DataSection.All });
    if (setIsExpanded) setIsExpanded(!isSelected);
  }, [updateURLParams, page, section, setIsExpanded, isSelected]);

  return (
    <tr key={section}>
      <td>
        <div
          className={contentClassName}
          hidden={section ? !isRendered : undefined}
          aria-hidden={section ? !isRendered : undefined}
          onTransitionEnd={() => {
            if (section && !isVisible) setIsRendered(false);
          }}
        >
          <div
            className={
              'px-4 py-2 my-1 text-sm h-min text-wrap rounded-lg hover:bg-(--silicon-line) border border-(--silicon-line) cursor-pointer' +
              (isSelected ? ' bg-(--silicon-white)' : ' bg-(--silicon-white)/50') +
              (section ? ' ml-12' : '')
            }
            role="button"
            tabIndex={0}
            onClick={onClick}
          >
            <PageSectionLabel page={page} section={section} isExpanded={isSelected} />
          </div>
        </div>
      </td>
      <td>
        <div
          className={contentClassName}
          hidden={section ? !isRendered : undefined}
          aria-hidden={section ? !isRendered : undefined}
        >
          <ProgressCircle page={page} section={section} />
        </div>
      </td>
      {step === StepName.Vote && (
        <td>
          <div
            className={contentClassName}
            hidden={section ? !isRendered : undefined}
            aria-hidden={section ? !isRendered : undefined}
          >
            <VotingCircle page={page} section={section} />
          </div>
        </td>
      )}
    </tr>
  );
};

const PageSectionLabel: React.FC<{
  page: DataPage;
  section?: DataSection;
  isExpanded: boolean;
}> = ({ page, section, isExpanded }) => {
  const { uitext } = useInterfaceTranslation();
  if (section) return uitext(`dataSection.${section}`);
  return (
    <div className="flex items-center justify-between">
      {uitext(`dataPage.${page}`)}{' '}
      {page !== DataPage.All && page !== DataPage.FullTable && (
        <div
          style={{
            transition: 'transform 0.5s',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
        >
          ▼
        </div>
      )}
    </div>
  );
};

export default PageSectionSelector;
