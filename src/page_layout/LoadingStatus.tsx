import { SourceDataStatus, useSourceDataContext } from '@data/SourceDataProvider';
import { TargetDataStatus, useTargetDataContext } from '@data/TargetDataProvider';

const LoadingStatus = () => {
  const { sourceDataStatus } = useSourceDataContext();
  const { targetDataStatus } = useTargetDataContext();

  const overallStep =
    sourceDataStatus < SourceDataStatus.Ready
      ? sourceDataStatus
      : SourceDataStatus.Ready + targetDataStatus;
  const maxRegularStatus = SourceDataStatus.Ready + TargetDataStatus.Ready;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-(--silicon-ink-soft)">
        <span>Loading</span>
        <span>
          {sourceDataStatus + targetDataStatus} / {maxRegularStatus}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-(--silicon-line)">
        <div
          className="h-full rounded-full bg-(--silicon-brown) transition-[width] duration-300"
          style={{
            width: `${(overallStep * 100) / maxRegularStatus}%`,
            backgroundColor:
              sourceDataStatus === SourceDataStatus.Error ? 'var(--silicon-orange)' : undefined,
          }}
        />
      </div>
      {sourceDataStatus === SourceDataStatus.Error && (
        <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-(--silicon-orange)">
          Error loading source data
        </div>
      )}
    </div>
  );
};

export default LoadingStatus;
