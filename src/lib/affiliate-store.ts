import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AffiliateSettings {
  affiliateId: string;
  subIds: string[];
  articleLink: string;
  pageLink: string;
}

interface AffiliateStore {
  settings: AffiliateSettings;
  _hasHydrated: boolean;
  setSettings: (settings: AffiliateSettings) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAffiliateStore = create<AffiliateStore>()(
  persist(
    (set) => ({
      settings: {
        affiliateId: '',
        subIds: [''],
        articleLink: '',
        pageLink: '',
      },
      _hasHydrated: false,
      setSettings: (settings) => set({ settings }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'affiliate-config',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
