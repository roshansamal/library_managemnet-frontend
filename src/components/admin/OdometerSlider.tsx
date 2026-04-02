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
    HStack,
} from '@chakra-ui/react';
import {  useEffect, useState } from 'react';  // ✅ Added useCallback
// import { PureSelect } from '../utils/PureSelect';
export type Option = SelectOption;  // Alias
import type { OdometerType } from '../../types/OdometerType';
import type { SelectOption } from '../../types/SelectOption';

type EmpEditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: OdometerType | null;
  onUpdated?: () => void;
};

export default function OdometerSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EmpEditSliderProps) {
 const toast = useToast();
 const [isSubmitting, setIsSubmitting] = useState(false);
 
  // ✅ Always defined form (no null)
    const [form, setForm] = useState<OdometerType>({ 
      id: 0,
      tourid:0,
      userid: '',
      start_reading:0,
      stop_reading:0,
      start_url:'',
      stop_url:'',
      new_start_reading:0,
      new_stop_reading:0,
    });

  // const fetchStatus = useCallback(async (): Promise<SelectOption[]> => {
  //   try {
  //     const res = await fetch("/api/tourbill/admin/tourstatus");
  //     if (!res.ok) throw new Error('Failed to fetch');
  //     const json = await res.json();
  //     return json.map((c: any) => ({
  //       value: String(c.status_name),
  //       label: c.status_name,
  //     }));
  //   } catch (e) {
  //     console.error('Fetch Tour Status failed:', e);
  //     return [];
  //   }
  // }, []);

  // ✅ Safe handleChange (form always defined)
  const handleChange = (field: keyof OdometerType, value: string) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Load data + populate form
  useEffect(() => {
    // fetchStatus().then(setDynamicStatusOptions);
    // Populate form from initialData
    if (initialData) {
      initialData.new_start_reading=initialData.start_reading;
      initialData.new_stop_reading=initialData.stop_reading;
      setForm(initialData);
    } else {
        setForm({
          id: 0,
          tourid:0,
          userid: '',
          start_reading:0,
          stop_reading:0,
          start_url:'',
          stop_url:'',
          new_start_reading:0,
          new_stop_reading:0,
        });
      }
    }, [initialData]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/odometer-update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
      });
      //----------------------------------
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
        <DrawerHeader color="blue" fontSize={"md"}>Odometer  Update</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>TourID:</FormLabel>
                <Input
                  value={form.tourid || ''}
                  onChange={(e) => handleChange('id', e.target.value)}
                  bg={"lightgray"} color={"black"}
                  readOnly
                />
              </FormControl>
              <HStack justify="space-between" align="center">
                <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Start Reading:</FormLabel>
                  <Input
                    value={form.start_reading || ''}
                    onChange={(e) => handleChange('start_reading', e.target.value)}
                    bg={"lightgray"} color={"black"}
                    readOnly
                  />
                </FormControl>
                <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Stop Reading:</FormLabel>
                  <Input
                    value={form.stop_reading || ''}
                    onChange={(e) => handleChange('stop_reading', e.target.value)}
                    bg={"lightgray"} color={"black"}
                    readOnly
                  />
                </FormControl>
              </HStack>
              <HStack justify="space-between" align="center">
                <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>New Start Reading:</FormLabel>
                  <Input
                    value={form.new_start_reading || ''}
                    onChange={(e) => handleChange('new_start_reading', e.target.value)}
                    bg={"cyan.50"} color={"black"}
                  />
                </FormControl>
                <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>New Stop Reading:</FormLabel>
                  <Input
                    value={form.new_stop_reading || ''}
                    onChange={(e) => handleChange('new_stop_reading', e.target.value)}
                    bg={"cyan.50"} color={"black"}
                  />
                </FormControl>
              </HStack>
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
