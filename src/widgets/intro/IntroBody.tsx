import { useTranslation } from 'react-i18next';

import SourceLanguageSelector from '@settings/selectors/SourceLanguageSelector';
import TargetLanguageSelector from '@settings/selectors/TargetLanguageSelector';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

/**
 * A page that immediately asks the user to select the source language and target language.
 */
const IntroBody: React.FC = () => {
  const { updateURLParams } = useURLParams();
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1rem' }}>
      <h2 style={{ margin: '0' }}>{t('intro.welcomeHeader')}</h2>
      <div>{t('intro.description')}</div>
      <SourceLanguageSelector />
      <TargetLanguageSelector />
      <button onClick={() => updateURLParams({ step: StepName.Input })}>
        {t('intro.ctaInputStart')}
      </button>
      <button onClick={() => updateURLParams({ step: StepName.Review })}>
        {t('intro.ctaReviewStart')}
      </button>
    </div>
  );
};

export default IntroBody;
