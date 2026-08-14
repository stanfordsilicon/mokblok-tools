import React from 'react';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

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
  const { page: selectedPage, coverageLevel } = useURLParams();
  const isExpanded = selectedPage === page || selectedPage === DataPage.All;
  const sections = getSectionsForPage(page);

  // Confirm the sections that have data to be submitted at the current coverage level.
  const getDataEntriesForSection = useDataEntriesForSection();
  const pendingSections = sections.filter((section) => {
    const dataEntries = getDataEntriesForSection(page, section);
    const coveredDataEntries = dataEntries.filter(
      (entry) => entry.level && entry.level <= coverageLevel,
    );
    return coveredDataEntries.length > 0;
  });

  if (pendingSections.length === 0) return null;

  return (
    <>
      <SectionRow page={page} />
      {page !== DataPage.All &&
        page !== DataPage.FullTable &&
        isExpanded &&
        pendingSections.map((section) => (
          <SectionRow key={section} page={page} section={section} />
        ))}
    </>
  );
};

type SectionRowProps = { page: DataPage; section?: DataSection };

const SectionRow: React.FC<SectionRowProps> = ({ page, section }) => {
  const { section: selectedSection, page: selectedPage, updateURLParams, step } = useURLParams();
  const isSelected = section
    ? selectedSection === section || selectedSection === DataSection.All
    : selectedPage === page || (selectedPage === DataPage.All && page !== DataPage.FullTable);

  return (
    <tr key={section}>
      <td>
        <div
          className={
            'px-4 py-2 my-1 text-sm text-wrap border-none rounded-lg hover:bg-(--silicon-line) cursor-pointer' +
            (isSelected ? ' bg-(--silicon-white)' : '') +
            (section ? ' ml-12' : '')
          }
          onClick={() => updateURLParams({ page, section: section ?? DataSection.All })}
        >
          <PageSectionLabel page={page} section={section} isExpanded={isSelected} />
        </div>
      </td>
      <td>
        <ProgressCircle page={page} section={section} />
      </td>
      {step === StepName.Vote && (
        <td>
          <VotingCircle page={page} section={section} />
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
