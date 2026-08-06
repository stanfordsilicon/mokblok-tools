'use client';

import { SessionProvider } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';

import { DataProvider } from '@data/DataContext';
import { LinguisticsProvider } from '@data/LinguisticsContext';
import SourceDataProvider from '@data/SourceDataProvider';
import TargetDataProvider from '@data/TargetDataProvider';

import { URLParamsProvider } from '@settings/URLParams';

import i18n from '../i18n';

import PageBody from './PageBody';
import PageFooter from './PageFooter';
import PageTitle from './PageTitle';
import Sidebar from './Sidebar';

function App() {
  return (
    <SessionProvider>
      <URLParamsProvider>
        <I18nextProvider i18n={i18n}>
          <LinguisticsProvider>
            <SourceDataProvider>
              <TargetDataProvider>
                <DataProvider>
                  <div
                    data-testid="FullPage"
                    className="min-h-screen bg-(--silicon-beige) text-(--silicon-ink) lg:flex"
                  >
                    <Sidebar />
                    <div className="flex min-h-screen flex-1 flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                      <PageTitle />
                      <PageBody />
                      <PageFooter />
                    </div>
                  </div>
                </DataProvider>
              </TargetDataProvider>
            </SourceDataProvider>
          </LinguisticsProvider>
        </I18nextProvider>
      </URLParamsProvider>
    </SessionProvider>
  );
}

export default App;
