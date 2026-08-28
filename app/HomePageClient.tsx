'use client';

import { SessionProvider } from 'next-auth/react';

import { LinguisticsProvider } from '@data/LinguisticsContext';
import SourceDataProvider from '@data/source/SourceDataProvider';
import TargetDataProvider from '@data/target/TargetDataProvider';

import { URLParamsProvider } from '@settings/URLParams';

import PageBody from '../src/page_layout/PageBody';
import PageFooter from '../src/page_layout/PageFooter';
import PageTitle from '../src/page_layout/PageTitle';
import Sidebar from '../src/page_layout/Sidebar';

import UITextProvider from './UITextProvider';

export default function HomePageClient() {
  return (
    <SessionProvider>
      <URLParamsProvider>
        <UITextProvider>
          <LinguisticsProvider>
            <SourceDataProvider>
              <TargetDataProvider>
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
              </TargetDataProvider>
            </SourceDataProvider>
          </LinguisticsProvider>
        </UITextProvider>
      </URLParamsProvider>
    </SessionProvider>
  );
}
