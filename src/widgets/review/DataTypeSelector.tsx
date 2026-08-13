import React from 'react';

import { DataPage, DataSection, getSectionsForPage } from '@data/DataSection';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import ProgressCircle from './progress/ProgressCircle';
import VotingCircle from './progress/VotingCircle';

const DataTypeSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { step } = useURLParams();
  // Return a 3 column grid of buttons for each DataPage
  return (
    <table className="w-full h-fit table-auto text-xs">
      <thead>
        <tr>
          <th>{uitext('nav.page/section')}</th>
          <th className="truncate">{uitext('nav.translations')}</th>
          {step === StepName.Vote && <th className="truncate">{uitext('nav.votes')}</th>}
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
  const { uitext } = useInterfaceTranslation();
  const { page: selectedPage, updateURLParams, step } = useURLParams();
  const isExpanded = selectedPage === page || selectedPage === DataPage.All;
  const highlightBackground =
    selectedPage === page || (selectedPage === DataPage.All && page !== DataPage.FullTable);

  return (
    <>
      <tr>
        <td>
          <button
            className={'p-1 text-xs' + (highlightBackground ? ' selected' : '')}
            onClick={() => updateURLParams({ page, section: DataSection.All })}
            style={{ width: '12em' }}
          >
            {uitext(`dataPage.${page}`)}{' '}
            {page !== DataPage.All && page !== DataPage.FullTable && (
              <div
                style={{
                  display: 'inline-block',
                  transition: 'transform 0.5s',
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                }}
              >
                ▼
              </div>
            )}
          </button>
        </td>
        <td>
          <ProgressCircle page={page} />
        </td>
        {step === StepName.Vote && (
          <td>
            <VotingCircle page={page} />
          </td>
        )}
      </tr>
      {page !== DataPage.All && page !== DataPage.FullTable && isExpanded && (
        <PageSections page={page} />
      )}
    </>
  );
};

type PageSectionsProps = { page: DataPage };

const PageSections: React.FC<PageSectionsProps> = ({ page }) => {
  const { uitext } = useInterfaceTranslation();
  const { section: selectedSection, updateURLParams, step } = useURLParams();
  const sections = getSectionsForPage(page);

  return sections.map((section) => (
    <tr key={section}>
      <td className="text-right">
        <button
          className={
            'px-0.5 py-0.5 text-xs text-wrap' +
            (selectedSection === section || selectedSection === DataSection.All ? ' selected' : '')
          }
          onClick={() => updateURLParams({ section, page })}
          style={{ width: '10.5em' }}
        >
          {uitext(`dataSection.${section}`)}
        </button>
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
  ));
};

export default DataTypeSelector;
