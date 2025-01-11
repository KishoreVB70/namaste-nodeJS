import { create } from 'zustand'

type StoreType = {
    hasCookie: boolean,
    setHasCookie: (val: boolean) => void;
}
const useStore = create<StoreType>((set) => ({
  hasCookie: false,
  setHasCookie: (val) => set({hasCookie: val})
}))

export default useStore;
