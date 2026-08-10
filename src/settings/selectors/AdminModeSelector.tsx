import React, { useCallback } from 'react';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

/**
 * Toggles admin mode on and off. When admin mode is off, the user can only access the intro
 * or review steps. When admin mode is on, the user can access all steps. This is useful for
 * testing and debugging.
 */
const AdminModeSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { updateURLParams, admin, step } = useURLParams();
  const updateAdminMode = useCallback(() => {
    updateURLParams({
      admin: !admin,
      step: step === StepName.Review ? step : StepName.Intro,
    });
  }, [updateURLParams, admin, step]);

  if (!admin) return null;

  return (
    <button onClick={updateAdminMode} className={admin ? 'selected' : ''}>
      {admin ? uitext('settings.inAdminCTATurnOff') : uitext('settings.notAdminCTATurnOn')}
    </button>
  );
};

export default AdminModeSelector;
