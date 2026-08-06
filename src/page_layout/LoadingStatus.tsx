import { useSourceDataContext } from '@data/SourceDataProvider';
import { useTargetDataContext } from '@data/TargetDataProvider';

const LoadingStatus = () => {
  const { sourceDataStatus } = useSourceDataContext();
  const { targetDataStatus } = useTargetDataContext();

  const overallStep = sourceDataStatus < 4 ? sourceDataStatus : 4 + targetDataStatus;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-(--silicon-ink-soft)">
        <span>Loading</span>
        <span>{overallStep} / 6</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-(--silicon-line)">
        <div
          className="h-full rounded-full bg-(--silicon-brown) transition-[width] duration-300"
          style={{ width: `${(overallStep * 100) / 6}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingStatus;
