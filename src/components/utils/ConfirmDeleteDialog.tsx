import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React from 'react';

type ConfirmDeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;   // delete handler
  title?: string;
  message?: string;
};

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete record',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
}) => {
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                onConfirm(); // call delete
                onClose();   // close dialog
              }}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
