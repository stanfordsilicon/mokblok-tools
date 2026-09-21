'use client';

import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { loadWorksheetLanguages } from './loadWorksheetBundle';

const WorksheetCatalogContext = createContext<{
  languages: string[];
  error: string | null;
  loading: boolean;
  refresh: () => void;
}>({
  languages: [],
  error: null,
  loading: true,
  refresh: () => {},
});

export function WorksheetCatalogProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const identity = session?.user?.id;
  const catalogIdentity = useRef<string | undefined>(undefined);
  const [refreshCount, setRefreshCount] = useState(0);
  const refresh = useCallback(() => setRefreshCount((count) => count + 1), []);
  const [state, setState] = useState({
    languages: [] as string[],
    error: null as string | null,
    loading: true,
  });
  useEffect(() => {
    if (status === 'loading') return;
    if (!identity) {
      setState({ languages: [], error: null, loading: false });
      return;
    }
    const controller = new AbortController();
    const changedUser = catalogIdentity.current !== identity;
    catalogIdentity.current = identity;
    setState((previous) => ({
      languages: changedUser ? [] : previous.languages,
      error: null,
      loading: true,
    }));
    loadWorksheetLanguages(controller.signal)
      .then((languages) => {
        if (!controller.signal.aborted) setState({ languages, error: null, loading: false });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ languages: [], error: error.message, loading: false });
      });
    return () => controller.abort();
  }, [identity, status, refreshCount]);

  return (
    <WorksheetCatalogContext.Provider value={{ ...state, refresh }}>
      {children}
    </WorksheetCatalogContext.Provider>
  );
}

export function useWorksheetCatalog() {
  return useContext(WorksheetCatalogContext);
}
