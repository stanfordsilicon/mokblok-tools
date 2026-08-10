import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const IntroCTAs: React.FC = () => {
  const { updateURLParams, admin } = useURLParams();
  const { uitext } = useInterfaceTranslation();
  return (
    <div className="flex flex-col items-start gap-4 p-2">
      {admin && (
        <button
          onClick={() => updateURLParams({ step: StepName.Input })}
          className="rounded-full border border-(--silicon-line-strong) bg-white px-5 py-3 text-sm font-semibold text-(--silicon-ink) shadow-sm transition hover:border-(--silicon-purple) hover:text-(--silicon-purple)"
        >
          {uitext('intro.ctaInputStart')}
        </button>
      )}
      <button
        onClick={() => updateURLParams({ step: StepName.Review })}
        className="rounded-full bg-(--silicon-brown) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--silicon-purple)"
      >
        {uitext('intro.ctaReviewStart')}
      </button>
    </div>
  );
};

export default IntroCTAs;
