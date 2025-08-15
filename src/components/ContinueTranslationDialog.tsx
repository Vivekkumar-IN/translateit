import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TranslationData } from "@/types";

interface ContinueTranslationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingLanguageCode: string;
  savedTranslationData: TranslationData | null;
  onContinue: () => void;
  onRestart: () => void;
  onCancel: () => void;
}

const ContinueTranslationDialog: React.FC<ContinueTranslationDialogProps> = ({
  open,
  onOpenChange,
  pendingLanguageCode,
  savedTranslationData,
  onContinue,
  onRestart,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Previous Translation Found</DialogTitle>
          <DialogDescription>
            Found previous translation progress for{" "}
            <strong>{pendingLanguageCode.toUpperCase()}</strong> with{" "}
            <strong>
              {savedTranslationData?.translations
                ? Object.keys(savedTranslationData.translations).length
                : 0}{" "}
              translations
            </strong>
            .
            <br />
            <br />
            Do you want to continue where you left off or start a fresh
            translation?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button variant="secondary" onClick={onRestart} className="w-full">
            Start Fresh
          </Button>
          <Button onClick={onContinue} className="w-full">
            Keep Previous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContinueTranslationDialog;
