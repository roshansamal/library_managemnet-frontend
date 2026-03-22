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
import { useCallback, useEffect, useState } from 'react';  // ✅ Added useCallback
import type { TourMasterType } from '../../types/TourMasterType';
import { PureSelect } from '../utils/PureSelect';
export type Option = SelectOption;  // Alias
import type { SelectOption } from '../../types/SelectOption';

type EmpEditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: TourMasterType | null;
  onUpdated?: () => void;
};

export default function TourStatusSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EmpEditSliderProps) {
 const toast = useToast();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [dynamicStatusOptions, setDynamicStatusOptions] = useState<SelectOption[]>([]);

  // ✅ Always defined form (no null)
    const [form, setForm] = useState<TourMasterType>({ 
      id: 0,
      userid: '',
      created_on: '',
      submitted_on: '',
      updated_on: '',
      customer_name: '',
      purpose_of_visit: '',
      machine_model: '',
      machine_serial: '',
      complaint_dtls: '',
      service_type: '',
      travel_from: '',
      travel_to: '',
      mode_of_travel:'',
      ticket_status:'',
      cancel_reason:'',
      visiting_role:'',
      team_members:'',
      prim_tourid:'',
      tour_start_date:'',
      tour_end_date:'',
      tour_continue:'',
      tour_continue_date:'',
      mgr_remarks:'',
      auto_close:'',
      approved_by:'',
      approved_at:'',
    });

  const fetchStatus = useCallback(async (): Promise<SelectOption[]> => {
    try {
      const token = localStorage.getItem('authToken');
      // const res = await fetch("/api/touradmin/tourstatus");
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/tourstatus`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
      });
      //-----------------------------------
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.map((c: any) => ({
        value: String(c.status_name),
        label: c.status_name,
      }));
    } catch (e) {
      console.error('Fetch Tour Status failed:', e);
      return [];
    }
  }, []);

  // ✅ Safe handleChange (form always defined)
  const handleChange = (field: keyof TourMasterType, value: string) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Load data + populate form
  useEffect(() => {
    fetchStatus().then(setDynamicStatusOptions);
    // Populate form from initialData
    if (initialData) {
      setForm(initialData);
    } else {
        setForm({
          id: 0,
          userid: '',
          created_on: '',
          submitted_on: '',
          updated_on: '',
          customer_name: '',
          purpose_of_visit: '',
          machine_model: '',
          machine_serial: '',
          complaint_dtls: '',
          service_type: '',
          travel_from: '',
          travel_to: '',
          mode_of_travel:'',
          ticket_status:'',
          cancel_reason:'',
          visiting_role:'',
          team_members:'',
          prim_tourid:'',
          tour_start_date:'',
          tour_end_date:'',
          tour_continue:'',
          tour_continue_date:'',
          mgr_remarks:'',
          auto_close:'',
          approved_by:'',
          approved_at:'',
        });
      }
    }, [initialData]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log(JSON.stringify(form));
      
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/tour-status-update`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Failed to update tour status');
      }
      toast({
        title: 'Saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUpdated?.(); // Refresh parent table
      onClose();
    } catch (err: any) {
      toast({
        title: 'Save failed',
        description: err?.message || 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color="brown" fontSize={"md"}>Tour Status Update</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour ID:</FormLabel>
                <Input
                  value={form.id || ''}
                  onChange={(e) => handleChange('id', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
             <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Current Tour Status:</FormLabel>
                <Input
                  value={form.ticket_status || ''}
                  onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"grey"} color={"white"}
                  readOnly
                />
              </FormControl>
              <PureSelect
                label="New Tour Status"
                value={form.ticket_status}
                options={dynamicStatusOptions}
                onChange={(value) => handleChange('ticket_status', value)}
                placeholder="Select Tour Status"
              />
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose} colorScheme="orange">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={false}  // form always defined
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
