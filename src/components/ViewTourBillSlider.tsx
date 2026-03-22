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
  } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// Import your shared RecordItem type
import type { TourbillColumns } from '../interfaces/TourbillColumns';

type EditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: TourbillColumns | null;
  onUpdated?: () => void; // callback to refresh table after success
};

export default function ViewTourBillSlider({
  isOpen,
  onClose,
  initialData,
  // onUpdated,
}: EditSliderProps) {
  // const toast = useToast();

  // Local form state
  const [form, setForm] = useState<TourbillColumns | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // Whenever initialData changes (or slider opens), populate form
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(null);
    }
  }, [initialData]);

  const handleChange = (field: keyof TourbillColumns, value: string) => {
    if (!form) return;
    setForm({
      ...form,
      [field]: value,
    });
  };

  // const handleSubmit = async () => {
  //   if (!form) return;
  //   try {
  //     // setIsSubmitting(true);
  //     const res = await fetch(`/api/tours/${form.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(form),
  //     });
  //     if (!res.ok) {
  //       throw new Error('Failed to update record');
  //     }
  //     toast({
  //       title: 'Updated successfully',
  //       status: 'success',
  //       duration: 3000,
  //       isClosable: true,
  //     });

  //     // Inform parent to refresh table
  //     onUpdated && onUpdated();

  //     onClose();
  //   } catch (err: any) {
  //     toast({
  //       title: 'Update failed',
  //       description: err?.message || 'Something went wrong',
  //       status: 'error',
  //       duration: 4000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     //setIsSubmitting(false);
  //   }
  // };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"orange.400"}>View Bill</DrawerHeader>
        <DrawerBody>
          {!form ? null : (
            <Stack spacing={4}>
              {/* Example fields, adjust to your RecordItem shape */}
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour ID:</FormLabel>
                <Input
                  value={form.tourid || ''}
                  onChange={(e) => handleChange('tourid', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>User ID:</FormLabel>
                <Input
                  value={form.userid || ''}
                  onChange={(e) => handleChange('userid', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Created On:</FormLabel>
                <Input
                  type="number"
                  value={form.created_on?.toString() || ''}
                  onChange={(e) => handleChange('created_on', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>DA Calculated:</FormLabel>
                <Input
                  value={form.da_calculated || ''}
                  onChange={(e) => handleChange('da_calculated', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>TA Clamied:</FormLabel>
                <Input
                  value={form.ta_claimed || ''}
                  onChange={(e) => handleChange('ta_claimed', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Other Expenses:</FormLabel>
                <Input
                  value={form.other_expenses || ''}
                  onChange={(e) => handleChange('other_expenses', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Other Expenses Remarks:</FormLabel>
                <Input
                  value={form.other_expense_remarks || ''}
                  onChange={(e) => handleChange('other_expense_remarks', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>Total Claim:</FormLabel>
                <Input
                  value={form.total_claim || ''}
                  onChange={(e) => handleChange('total_claim', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Workorder:</FormLabel>
                <Input
                  value={form.workorder || ''}
                  onChange={(e) => handleChange('workorder', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Manager Action By:</FormLabel>
                <Input
                  value={form.mgr_action_by || ''}
                  onChange={(e) => handleChange('mgr_action_by', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Manager Action Date:</FormLabel>
                <Input
                  type="date"
                  value={form.mgr_action_date || ''}
                  onChange={(e) => handleChange('mgr_action_date', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mgr Remarks:</FormLabel>
                <Input
                  value={form.mgr_remarks || ''}
                  onChange={(e) => handleChange('mgr_remarks', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>Mgr Approved Amt:</FormLabel>
                <Input
                  value={form.mgr_approved_amt || ''}
                  onChange={(e) => handleChange('mgr_approved_amt', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Finance Action By:</FormLabel>
                <Input
                  value={form.finance_action_by || ''}
                  onChange={(e) => handleChange('finance_action_by', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Finance Action Date:</FormLabel>
                <Input
                  value={form.finance_action_date || ''}
                  onChange={(e) => handleChange('finance_action_date', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>Finance Approved Amt:</FormLabel>
                <Input
                  value={form.finance_approved_amount || ''}
                  onChange={(e) => handleChange('finance_approved_amount', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Finance Rejection Remarks:</FormLabel>
                <Input
                  value={form.fin_remarks || ''}
                  onChange={(e) => handleChange('finance_approved_amount', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Ticket Status:</FormLabel>
                <Input
                  value={form.ticket_status || ''}
                  onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose} bg={"blue.200"}>
            Close
          </Button>
          {/* <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!form}
          >
            Save
          </Button> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
