import { create } from 'zustand';

interface UserBalanceState {
  balance: number | null;
  setBalance: (amount: number) => void;
}

const useUserBalanceStore = create<UserBalanceState>((set) => ({
  balance: null,
  setBalance: (amount) => set({ balance: amount }),
}));

export default useUserBalanceStore;
