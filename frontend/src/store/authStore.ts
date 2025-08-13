import { create } from 'zustand';

type AuthState = {
  access?: string | null;
  refresh?: string | null;
  user?: any | null;
  setTokens: (a: string, r: string) => void;
  setUser: (u: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  user: null,
  setTokens: (access, refresh) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    set({ access, refresh });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    set({ access: null, refresh: null, user: null });
  }
}));
