import { create } from 'zustand';
export const useUI = create(set => ({
  search: '', setSearch: search => set({ search }),
  notice: '', setNotice: notice => set({ notice }),
}));
