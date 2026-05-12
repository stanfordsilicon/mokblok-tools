import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import PluralAmount from '@data/PluralAmount';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const pluralInstances = ['book', 'song'] as const;
const pluralVariantOrder = ['base', ...Object.values(PluralAmount)];

type PluralInstance = (typeof pluralInstances)[number];

type VariantKey = (typeof pluralVariantOrder)[number];

const PluralsReviewTable: React.FC = () => {
  const { t } = useTranslation();
  const { findDataFields } = useDataContext();

  const pluralFields = findDataFields({ field: 'plurals' }).filter((field) =>
    pluralInstances.includes(field.instance as PluralInstance),
  );
  const pluralMatrix = matrixBy(
    pluralFields,
    (field) => field.instance,
    (field) => field.variant || 'base',
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      {pluralInstances.map((instance) => {
        const rowsForInstance = pluralMatrix[instance];
        if (!rowsForInstance) return null;
        return (
          <div key={instance}>
            <h3>{t(`review.plurals.instances.${instance}`)}</h3>
            <table>
              <thead>
                <tr>
                  <th>{t('review.plurals.category')}</th>
                  <th>
                    <SourceLanguageLabel />
                  </th>
                  <th>{t('review.translated')}</th>
                </tr>
              </thead>
              <tbody>
                {pluralVariantOrder.map((variantKey) => {
                  const row = rowsForInstance[variantKey as VariantKey];
                  if (!row) return null;
                  return (
                    <tr key={variantKey}>
                      <td>{t(`review.plurals.categories.${variantKey}`, variantKey)}</td>
                      <SourceDataCell data={row} />
                      <InputDataCell data={row} inputWidth="15em" />
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
