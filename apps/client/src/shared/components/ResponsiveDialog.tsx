import type { ReactNode, Dispatch, SetStateAction } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';
import { useIsMobile } from '@/shared/hooks/use-mobile';

export function ResponsiveDialog({
  children,
  isOpen,
  setIsOpen,
  title,
  description,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="items-start">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2>{title}</h2>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
