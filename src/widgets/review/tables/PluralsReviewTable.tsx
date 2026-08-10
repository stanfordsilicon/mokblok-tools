import { useDataContext } from '@data/DataContext';
import PluralAmount from '@data/PluralAmount';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

const pluralInstances = ['book', 'song'] as const;
const pluralVariantOrder = ['base', ...Object.values(PluralAmount)];

type PluralInstance = (typeof pluralInstances)[number];

type VariantKey = (typeof pluralVariantOrder)[number];

const PluralsReviewTable: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntries } = useDataContext();

  const pluralFields = findDataEntries({ field: 'plurals' }).filter((entry) =>
    pluralInstances.includes(entry.instance as PluralInstance),
  );
  const pluralMatrix = matrixBy(
    pluralFields,
    (entry) => entry.instance,
    (entry) => entry.variant || 'base',
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      {pluralInstances.map((instance) => {
        const entriesForInstance = pluralMatrix[instance];
        if (!entriesForInstance) return null;
        return (
          <div key={instance}>
            <h3>{uitext(`review.plurals.instances.${instance}`)}</h3>
            <table>
              <thead>
                <tr>
                  <th>{uitext('review.plurals.category')}</th>
                  <th>
                    <SourceLanguageLabel />
                  </th>
                  <th>{uitext('review.translated')}</th>
                </tr>
              </thead>
              <tbody>
                {pluralVariantOrder.map((variantKey) => {
                  const entry = entriesForInstance[variantKey as VariantKey];
                  if (!entry) return null;
                  return (
                    <tr key={variantKey}>
                      <td>{uitext(`review.plurals.categories.${variantKey}`, variantKey)}</td>
                      <SourceDataCell entry={entry} />
                      <InputDataCell entry={entry} inputWidth="15em" />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default PluralsReviewTable;
