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
import type { TourbillColumns } from '../interfaces/TourbillColumns';
type MgrTourBillApprovalSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: TourbillColumns | null; 
  onUpdated?: () => void; // callback to refresh table after success
};

export default function MgrTourBillReturnSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: MgrTourBillApprovalSliderProps) {
  const toast = useToast();

  // Local form state
  const [form, setForm] = useState<TourbillColumns | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //------------------------------------------
  // fetch Tour Details when drawer opens and we have an id
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

  const handleSubmit = async () => {
    if (!form) return;
    try {
      setIsSubmitting(true);
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/tourbill/mgr-bill-return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      // onUpdated && onUpdated();
      if (typeof onUpdated === 'function') {
        onUpdated();
      }

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
      setIsSubmitting(false);
    }
  };
  //   const controller = new AbortController();
  //   const fetchTour = async () => {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch(`/api/tours/${tourId}/dtls`, { signal: controller.signal });
  //       if (!res.ok) {
  //         throw new Error(`Failed to load tour: ${res.status}`);
  //       }
  //       //------------------------------
  //       const json: TourMasterType[] = await res.json();   // ⬅ array
  //       //console.log('Tour JSON:', json);
  //       setForm(json.length ? json[0] : null);             // ⬅ take first
  //       //------------------------------
  //     } catch (err: any) {
  //       if (err.name === 'AbortError') return;
  //       console.error(err);
  //       toast({
  //         title: 'Failed to load tour info',
  //         description: err.message || 'Please try again',
  //         status: 'error',
  //         duration: 4000,
  //         isClosable: true,
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  // fetchTour();
  // return () => controller.abort();
// }, [isOpen, initialData, toast]);
  //------------------------------------------
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"blue.500"}>Bill Return By Manager</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour ID:</FormLabel>
                <Input
                  value={form?.tourid || ''}
                  onChange={(e) => handleChange('tourid', e.target.value)}
                  bg={"gray.400"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>User ID:</FormLabel>
                <Input
                  value={form?.userid || ''}
                  onChange={(e) => handleChange('userid', e.target.value)}
                  bg={"gray.400"} color={"white"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>
                  Approved Amount (Total Claim):</FormLabel>
                <Input
                  //type="number"
                  value={form?.total_claim?.toString() || ''}
                  onChange={(e) => handleChange('mgr_approved_amt', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Remarks:</FormLabel>
                <Input
                  value={form?.mgr_remarks || ''}
                  onChange={(e) => handleChange('mgr_remarks', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose} bg={"blue.200"}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!form}
          >
            Return
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
