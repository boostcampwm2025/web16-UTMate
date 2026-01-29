'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useDialogStore } from '@/shared/stores/useDialogStore';

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;

export const DialogProvider = () => {
  const {
    isOpen,
    isLoading,
    title,
    description,
    content,
    cancelText,
    confirmText,
    isAlert,
    hasCancel,
    onConfirm,
    onCancel,
  } = useDialogStore();

  function handleOnOpenChange(open: boolean) {
    if (!open && !isLoading) {
      onCancel();
    }
  }

  function handlePointerDownOutside(e: PointerDownOutsideEvent) {
    if (isLoading) {
      e.preventDefault();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent showCloseButton={false} onPointerDownOutside={handlePointerDownOutside}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {content}
        </DialogHeader>
        <DialogFooter>
          {hasCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelText}
            </Button>
          )}
          <Button
            variant={isAlert ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
