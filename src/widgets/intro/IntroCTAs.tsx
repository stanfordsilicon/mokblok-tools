import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import { Button } from '@shared/shadcn/ui/button';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const IntroCTAs: React.FC = () => {
  const { updateURLParams, admin } = useURLParams();
  const { uitext } = useInterfaceTranslation();
  return (
    <div className="flex flex-col items-start gap-4">
      {admin && (
        <Button onClick={() => updateURLParams({ step: StepName.Import })}>
          {uitext('intro.ctaImportStart')}
        </Button>
      )}
      <Button onClick={() => updateURLParams({ step: StepName.Edit })}>
        {uitext('intro.ctaReviewStart')}
      </Button>
    </div>
  );
};

export default IntroCTAs;
