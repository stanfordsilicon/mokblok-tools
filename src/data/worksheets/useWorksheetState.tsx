import { useCallback, useMemo, useState } from 'react';

export type UseWorksheetState = {
  value: string;
  set: (value: string) => void;
  clear: () => void;
};

function useWorksheetState(initialValue: string = ''): UseWorksheetState {
  const [value, setValue] = useState(initialValue);
  const clear = useCallback(() => setValue(''), []);
  return useMemo(() => ({ value, set: setValue, clear }), [clear, value]);
}

export default useWorksheetState;
