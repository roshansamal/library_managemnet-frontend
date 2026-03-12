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
  Select as ChakraSelect,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';  // ✅ Added useCallback
import type { EmployeeType } from '../../types/EmployeeType';
import type { SelectOption } from '../../types/SelectOption';
import { PureSelect } from '../../components/utils/PureSelect'; // ✅ Add this import

type EmpEditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: EmployeeType | null;
  onUpdated?: () => void;
};

export default function EditEmailSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EmpEditSliderProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

type FormValues = {
  first_name:string;
  old_email: string;
  new_email: string;
};
const [form, setForm] = useState<FormValues>({
    first_name: '',
    old_email: '',
    new_email: '',
});
  // ✅ Safe handleChange (form always defined)
  const handleChange = (field: keyof FormValues, value: string) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  useEffect(() => {
    if (initialData) {
      setForm({ 
        first_name: initialData.first_name,
        old_email: initialData.userid,
        new_email: '',
      });
    } else {
      setForm({ 
        first_name: '',
        old_email: '',
        new_email: '',
      });
    }
  }, [initialData,]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log(JSON.stringify(form));
      const endpoint = '/api/tourbill/admin/emailupdate';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('Failed to save employee');
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
        <DrawerHeader color="black">Edit Email</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Full Name:</FormLabel>
                <Input
                  type="string"
                  value={form.first_name?.toString() || ''}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">User ID</FormLabel>
              <Input
                value={form.old_email}
                onChange={(e) => handleChange('old_email', e.target.value)}
                bg="blue.50"
                readOnly
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm" color={"red"}>New User ID</FormLabel>
              <Input
                value={form.new_email}
                onChange={(e) => handleChange('new_email', e.target.value)}
                bg="orange.50"
              />
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
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
