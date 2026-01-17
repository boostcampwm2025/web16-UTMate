import { create } from 'zustand';
import { ReactNode } from 'react';

interface DialogOptions {
  cancelText?: string;
  confirmText?: string;
  isAlert?: boolean;
  hasCancel?: boolean;
}

interface DialogState {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  description: string;
  content: ReactNode | null;
  cancelText: string;
  confirmText: string;
  isAlert: boolean;
  hasCancel: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface DialogActions {
  confirm: (
    title: string,
    descriptionOrContent: string | ReactNode,
    options?: DialogOptions,
  ) => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
  close: () => void;
}

type DialogStore = DialogState & DialogActions;

const INITIAL_STATE: DialogState = {
  isOpen: false,
  isLoading: false,
  title: '',
  description: '',
  content: null,
  cancelText: '취소',
  confirmText: '확인',
  isAlert: false,
  hasCancel: true,
  onConfirm: () => {},
  onCancel: () => {},
};

const isReactNode = (value: string | ReactNode): value is ReactNode => {
  return typeof value !== 'string';
};

export const useDialogStore = create<DialogStore>((set) => ({
  ...INITIAL_STATE,

  setLoading: (isLoading) => set({ isLoading }),
  close: () => set({ isOpen: false, isLoading: false }),

  confirm: (title, descriptionOrContent, options) => {
    return new Promise((resolve) => {
      const isContent = isReactNode(descriptionOrContent);

      set({
        isOpen: true,
        isLoading: false,
        title,
        description: isContent ? '' : descriptionOrContent,
        content: isContent ? descriptionOrContent : null,
        cancelText: options?.cancelText ?? INITIAL_STATE.cancelText,
        confirmText: options?.confirmText ?? INITIAL_STATE.confirmText,
        isAlert: options?.isAlert ?? INITIAL_STATE.isAlert,
        hasCancel: options?.hasCancel ?? INITIAL_STATE.hasCancel,
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

export { INITIAL_STATE as DIALOG_INITIAL_STATE };
