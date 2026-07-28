import { useState } from 'react';

export type UseTSVState = {
  value: string;
  set: (value: string) => void;
  clear: () => void;
};

function useTSVState(initialValue: string = ''): UseTSVState {
  const [value, setValue] = useState(initialValue);
  const clear = () => setValue('');
  return { value, set: setValue, clear };
}

export default useTSVState;
