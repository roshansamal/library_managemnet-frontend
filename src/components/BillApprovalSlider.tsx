// components/EditSlider.tsx
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// Import your shared RecordItem type
import type { TourBillType } from '../types/TourBillType';

type MySliderProps = {
  isOpen: boolean;
  onClose: () => void;
  billRecord: TourBillType | null;
  onUpdated?: () => void; // callback to refresh table after success
};

export default function BillApprovalSlider({
  isOpen,
  onClose,
  billRecord,
  onUpdated,
}: MySliderProps) {
  const toast = useToast();
  const token = localStorage.getItem('authToken');

  // Local form state
  const [form, setForm] = useState<TourBillType | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // Whenever initialData changes (or slider opens), populate form
  useEffect(() => {
    if (billRecord) {
      setForm(billRecord);
    } else {
      setForm(null);
    }
  }, [billRecord]);

  const handleChange = (field: keyof TourBillType, value: string) => {
    if (!form) return;
    setForm({
      ...form,
      [field]: value,
    });
  };

  const approveSingle = async () => {
    if (!form) return;
    try {
      // setIsSubmitting(true);
      // Example: call your API to update record
      // Replace URL and payload with your Laravel/Node endpoint
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/touradmin/fin-approve-bill`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Failed to update record');
      }

      toast({
        title: 'Updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Inform parent to refresh table
      onUpdated && onUpdated();

      onClose();
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err?.message || 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"black"}>Bill Approval</DrawerHeader>
        <DrawerBody>
          {!form ? null : (
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour ID:</FormLabel>
                <Input
                  value={form.tourid || ''}
                  onChange={(e) => handleChange('id', e.target.value)}
                  bg={"blue.50"} color={"black"}
                  readOnly
                />
              </FormControl>
             <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mgr Approved Amount:</FormLabel>
                <Input
                  value={form.mgr_approved_amt || ''}
                  onChange={(e) => handleChange('mgr_approved_amt', e.target.value)}
                  bg={"blue.50"} color={"black"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Finance Approved Amount:</FormLabel>
                <Input
                  value={form.finance_approved_amount || ''}
                  onChange={(e) => handleChange('finance_approved_amount', e.target.value)}
                  bg={"gray.50"} color={"black"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Finance Remarks:</FormLabel>
                <Input
                  value={form.fin_remarks || ''}
                  onChange={(e) => handleChange('fin_remarks', e.target.value)}
                  bg={"grey.50"} color={"black"}
                />
              </FormControl>
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose} bg={"blue.400"} color={"white"} _hover={{bg:"blue.600"}}>
            Close
          </Button>
          <Button variant="outline" mr={3} onClick={approveSingle} bg={"green.400"} color={"white"} _hover={{bg:"green.600"}}>
            Approve
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
