'use client';

import { create } from 'zustand';

import { type DemoDataContextType } from './types';

// TODO save to MongoDB
export const useDemoDataContext = create<DemoDataContextType>((set) => ({
  demoVotes: {},
  setDemoVote: (demo, vote) =>
    set((state) => ({
      demoVotes: {
        ...state.demoVotes,
        [demo]: typeof vote === 'function' ? vote(state.demoVotes[demo]) : vote,
      },
    })),
}));
