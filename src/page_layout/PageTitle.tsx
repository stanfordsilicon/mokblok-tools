import { useTranslation } from 'react-i18next';

import SettingsButton from '@settings/SettingsButton';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

const PageTitle: React.FC = () => {
  const { t } = useTranslation();
  const { page, step } = useURLParams();

  return (
    <div style={{ position: 'relative' }}>
      <SettingsButton />
      <div style={{ fontSize: '3em', fontWeight: 'bold', marginBottom: '0.5em', lineHeight: '1' }}>
        {t(`${step.toLowerCase()}.title`)}{' '}
        {step === StepName.Review && (
          <span style={{ fontSize: '0.5em' }}>/ {t(`dataPage.${page}`)}</span>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
