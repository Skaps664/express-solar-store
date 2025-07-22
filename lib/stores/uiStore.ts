import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    { name: 'ui-store' }
  )
);
