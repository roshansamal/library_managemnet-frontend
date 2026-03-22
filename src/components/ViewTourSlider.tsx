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
  // useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// Import your shared RecordItem type
import type { RecordItem } from '../types/RecordItem';

type EditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: RecordItem | null;
  onUpdated?: () => void; // callback to refresh table after success
};

export default function ViewTourSlider({
  isOpen,
  onClose,
  initialData,
  // onUpdated,
}: EditSliderProps) {
  // const toast = useToast();

  // Local form state
  const [form, setForm] = useState<RecordItem | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // Whenever initialData changes (or slider opens), populate form
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(null);
    }
  }, [initialData]);

  const handleChange = (field: keyof RecordItem, value: string) => {
    if (!form) return;
    setForm({
      ...form,
      [field]: value,
    });
  };

  // const handleSubmit = async () => {
  //   if (!form) return;

  //   try {
  //     setIsSubmitting(true);

  //     // Example: call your API to update record
  //     // Replace URL and payload with your Laravel/Node endpoint
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
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"orange.400"}>View Tour</DrawerHeader>
        <DrawerBody>
          {!form ? null : (
            <Stack spacing={4}>
              {/* Example fields, adjust to your RecordItem shape */}
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>User ID:</FormLabel>
                <Input
                  value={form.userid || ''}
                  onChange={(e) => handleChange('userid', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>

             <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Customer:</FormLabel>
                <Input
                  value={form.customer_name || ''}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Purpose Of Visit:</FormLabel>
                <Input
                  type="number"
                  value={form.purpose_of_visit?.toString() || ''}
                  onChange={(e) => handleChange('purpose_of_visit', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Model Name:</FormLabel>
                <Input
                  value={form.machine_model || ''}
                  onChange={(e) => handleChange('machine_model', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Serial No:</FormLabel>
                <Input
                  value={form.machine_serial || ''}
                  onChange={(e) => handleChange('machine_serial', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Complaint Details:</FormLabel>
                <Input
                  value={form.machine_serial || ''}
                  onChange={(e) => handleChange('complaint_dtls', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Service Type:</FormLabel>
                <Input
                  value={form.service_type || ''}
                  onChange={(e) => handleChange('service_type', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Travel From:</FormLabel>
                <Input
                  
                  value={form.travel_from || ''}
                  onChange={(e) => handleChange('travel_from', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Travel To:</FormLabel>
                <Input
                  value={form.travel_to || ''}
                  onChange={(e) => handleChange('travel_to', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Model of Travel:</FormLabel>
                <Input
                  value={form.mode_of_travel || ''}
                  onChange={(e) => handleChange('mode_of_travel', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Ticket Status:</FormLabel>
                <Input
                  value={form.ticket_status || ''}
                  onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Cancel Reason:</FormLabel>
                <Input
                  value={form.cancel_reason || ''}
                  onChange={(e) => handleChange('cancel_reason', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Visiting Role:</FormLabel>
                <Input
                  value={form.visiting_role || ''}
                  onChange={(e) => handleChange('visiting_role', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Visiting Role:</FormLabel>
                <Input
                  value={form.visiting_role || ''}
                  onChange={(e) => handleChange('visiting_role', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Team Members:</FormLabel>
                <Input
                  value={form.team_members || ''}
                  onChange={(e) => handleChange('team_members', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour Start Date:</FormLabel>
                <Input
                  type="date"
                  value={form.tour_start_date || ''}
                  onChange={(e) => handleChange('tour_start_date', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour End Date:</FormLabel>
                <Input
                  type="date"
                  value={form.tour_end_date || ''}
                  onChange={(e) => handleChange('tour_end_date', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mgr Remarks:s</FormLabel>
                <Input
                  value={form.mgr_remarks || ''}
                  onChange={(e) => handleChange('mgr_remarks', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose} bg={"blue.400"} color={"white"} _hover={{bg:"blue.600"}}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
