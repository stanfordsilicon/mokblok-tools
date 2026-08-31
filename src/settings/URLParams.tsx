import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import i18n from '@i18n';

import buildNextURLSearchParams from './urlparams/buildNextURLSearchParams';
import getInferredParams from './urlparams/getInferredParams';
import parseParamsFromURL from './urlparams/parseParamsFromURL';
import { URLParams, URLParamsContextState, URL_PARAMS_DEFAULTS } from './urlparams/urlParamsTypes';

const URLParamsContext = createContext<URLParamsContextState | undefined>(undefined);

/**
 * These parameters are saved in the URL
 */
export const URLParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userSettings = useSession().data?.user;

  const updateURLParams = useCallback(
    (newParams: Partial<URLParams>) => {
      const nextSearchParams = buildNextURLSearchParams(
        newParams,
        new URLSearchParams(searchParams.toString()),
      );
      const nextSearch = nextSearchParams.toString();
      router.push(`?${nextSearch}`, { scroll: false });
    },
    [router, searchParams],
  );

  const providerValue: URLParamsContextState = useMemo(() => {
    const instantiatedParams = parseParamsFromURL(new URLSearchParams(searchParams.toString()));

    Object.keys(instantiatedParams).forEach((key) => {
      const typedKey = key as keyof URLParams;
      if (instantiatedParams[typedKey] == null) delete instantiatedParams[typedKey];
    });
    const inferredParams = getInferredParams(instantiatedParams, userSettings);
    return {
      ...URL_PARAMS_DEFAULTS,
      ...instantiatedParams,
      ...inferredParams,
      updateURLParams,
    };
  }, [userSettings, searchParams, updateURLParams]);

  useEffect(() => {
    const changeLanguage = async () => {
      await i18n.changeLanguage(providerValue.interfaceLanguage);
    };
    void changeLanguage();
  }, [providerValue.interfaceLanguage]);

  return <URLParamsContext.Provider value={providerValue}>{children}</URLParamsContext.Provider>;
};

export const useURLParams = () => {
  const context = useContext(URLParamsContext);
  if (!context) {
    throw new Error('useURLParams must be used within a URLParamsProvider');
  }
  return context;
};
