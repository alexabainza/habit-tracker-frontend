import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmationDialogProps } from "@/utils/types";

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  isDestructive = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] py-12 bg-innermostCard">
        <DialogHeader>
          <DialogTitle className="text-3xl text-lightYellow">
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-white">
          {description}
        </DialogDescription>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full mr-2 border border-white text-white"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full ${
              isDestructive ? "bg-red-500 hover:bg-red-700 text-white" : ""
            }`}
          >
            {confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
