import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'free' | 'pro' | 'one-time';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired';

interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  subscriptionStatus: SubscriptionStatus;
  remainingCredits: number;
  stripeCustomerId?: string;
  subscriptionId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  decrementCredits: () => void;
  addCredits: (amount: number) => void;
  applyPromoCode: (code: string) => Promise<boolean>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      signIn: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      signOut: () => {
        // Clear user data and redirect to landing page
        set({ user: null, isAuthenticated: false });
        window.location.href = '/';
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      decrementCredits: () => {
        const currentUser = get().user;
        if (currentUser && currentUser.type === 'one-time' && currentUser.remainingCredits > 0) {
          set({
            user: {
              ...currentUser,
              remainingCredits: currentUser.remainingCredits - 1
            }
          });
        }
      },

      addCredits: (amount: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              remainingCredits: currentUser.remainingCredits + amount
            }
          });
        }
      },

      applyPromoCode: async (code: string) => {
        // TODO: Implement actual promo code validation with backend
        // For now, we'll simulate a successful promo code
        if (code === 'ADMIN2024') {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                remainingCredits: currentUser.remainingCredits + 1
              }
            });
            return true;
          }
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export { useAuthStore }; 