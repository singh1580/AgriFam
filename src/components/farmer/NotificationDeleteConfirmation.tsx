
import React from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface NotificationDeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const NotificationDeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false
}: NotificationDeleteConfirmationProps) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Notification"
      description="Are you sure you want to delete this notification? This action cannot be undone."
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      cancelText="Cancel"
      isDestructive={true}
    />
  );
};
