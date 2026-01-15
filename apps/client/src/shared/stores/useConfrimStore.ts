import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  isAlert: boolean;
  confirm: (
    title: string,
    description: string,
    options?: { cancelText?: string; confirmText?: string; isAlert?: boolean },
  ) => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
  close: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  isLoading: false,
  title: '',
  description: '',
  cancelText: '취소',
  confirmText: '확인',
  isAlert: false,
  onConfirm: () => {},
  onCancel: () => {},

  setLoading: (isLoading) => set({ isLoading }),
  close: () => set({ isOpen: false, isLoading: false }),

  confirm: (title, description, options) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        isLoading: false,
        title,
        description,
        cancelText: options?.cancelText ?? '취소',
        confirmText: options?.confirmText ?? '확인',
        isAlert: options?.isAlert ?? false,
        onConfirm: () => {
          set({ isOpen: false });
          resolve(true);
        },
        onCancel: () => {
          set({ isOpen: false });
          resolve(false);
        },
      });
    });
  },
}));
