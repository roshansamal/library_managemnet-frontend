// src/components/EditTourModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type RecordItem = {
  id: number;
  date: string;
  customer: string;
  amount: number;
  // add other fields as needed
};

interface EditTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: RecordItem | null;
  onUpdated?: () => void; // callback to refetch table
}

export default function EditTourModal({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EditTourModalProps) {
  const [form, setForm] = useState<RecordItem | null>(null);
  const toast = useToast();

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (field: keyof RecordItem, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: field === 'amount' ? Number(value) : value });
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      const res = await fetch(`/api/tours/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Update failed');

      toast({
        title: 'Updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      onUpdated?.(); // tell parent to refetch
    } catch (e) {
      toast({
        title: 'Update failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Tour</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {form && (
            <>
              <FormControl mb={3}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Customer</FormLabel>
                <Input
                  value={form.customer}
                  onChange={(e) => handleChange('customer', e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                />
              </FormControl>
              {/* add more fields as needed */}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
