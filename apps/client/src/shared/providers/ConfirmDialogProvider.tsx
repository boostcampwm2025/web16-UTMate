'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useConfirmStore } from '@/shared/stores/useConfrimStore';
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';

export const ConfirmDialogProvider = () => {
  const {
    isOpen,
    isLoading,
    title,
    description,
    cancelText,
    confirmText,
    isAlert,
    onConfirm,
    onCancel,
  } = useConfirmStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
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
