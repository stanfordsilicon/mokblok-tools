import { useCallback, useMemo, useState } from 'react';

export type UseTSVState = {
  value: string;
  set: (value: string) => void;
  clear: () => void;
};

function useTSVState(initialValue: string = ''): UseTSVState {
  const [value, setValue] = useState(initialValue);
  const clear = useCallback(() => setValue(''), []);
  return useMemo(() => ({ value, set: setValue, clear }), [clear, value]);
}

export default useTSVState;
