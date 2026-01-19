'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useDialogStore } from '@/shared/stores/useDialogStore';
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';

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

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {content}
        </AlertDialogHeader>
        <AlertDialogFooter>
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
