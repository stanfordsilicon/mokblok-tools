'use client';

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
    <URLParamsProvider>
      <I18nextProvider i18n={i18n}>
        <LinguisticsProvider>
          <SourceDataProvider>
            <TargetDataProvider>
              <DataProvider>
                <div
                  data-testid="FullPage"
                  style={{ display: 'flex', width: '100vw', overflow: 'auto', height: '100vh' }}
                >
                  <Sidebar />
                  <div
                    style={{ flex: 1, padding: '1em', display: 'flex', flexDirection: 'column' }}
                  >
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
  );
}

export default App;
