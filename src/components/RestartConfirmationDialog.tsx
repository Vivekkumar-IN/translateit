
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RestartConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmRestart: () => void;
}

const RestartConfirmationDialog: React.FC<RestartConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirmRestart
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restart Translation?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restart the translation process? 
            <br /><br />
            <strong>All your current translations will be permanently removed</strong> and the process will start from the beginning. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmRestart} className="w-full rounded-md text-white transition-colors bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600">
            Yes, Restart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestartConfirmationDialog;
