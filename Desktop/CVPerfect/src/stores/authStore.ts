import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  isProUser: boolean;
  stripeCustomerId?: string;
  remainingCredits: number;
  subscriptionId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  decrementCredits: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) =>
        set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      decrementCredits: () =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                remainingCredits: Math.max(0, state.user.remainingCredits - 1),
              }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
); 