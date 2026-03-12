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
import { useCallback } from "react";
import { useEffect, useState } from 'react';
import type { CustomerType } from '../../types/CustomerType';
import { PureSelect } from '../utils/PureSelect';

export type Option = SelectOption;  // Alias
import type { SelectOption } from '../../types/SelectOption';

type AddEmpSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: CustomerType | null;
  onUpdated?: () => void; // callback to refresh table after success
};

// Main Function Start Here
export default function AddCustomerSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: AddEmpSliderProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDesignations = useCallback(async (): Promise<Option[]> => {
    const res = await fetch("/api/tourbill/admin/desiglist");
    const json = await res.json();
    // assume json = [{ id: 1, name: "India" }, ...]
    return json.map((c: any) => ({
      value: String(c.slug),
      label: c.designation,
    }));
  }, []);

  const fetchDepartments = useCallback(async (): Promise<Option[]> => {
    const res = await fetch("/api/tourbill/admin/deptlist");
    const json = await res.json();
    return json.map((c: any) => ({
      value: String(c.slug),
      label: c.department,
    }));
  }, []);

  const fetchManagers = useCallback(async (): Promise<Option[]> => {
    const res = await fetch("/api/tourbill/admin/mgrlist");
    const json = await res.json();
    return json.map((c: any) => ({
      value: String(c.userid),
      label: c.full_name,
    }));
  }, []);

  const fetchBranches = useCallback(async (): Promise<Option[]> => {
    const res = await fetch("/api/tourbill/admin/branchlist");
    const json = await res.json();
    return json.map((c: any) => ({
      value: String(c.branch_name),
      label: c.branch_location,
    }));
  }, []);
 
// ✅ Always defined form (no null)
    const [form, setForm] = useState<CustomerType>({ 
      id: 0,
      name: '',
      customer_type: '',
      prim_location: '',
      contact_person: '',
      contact_person_no: '',
      prim_contact_no:'',
      alt_contact_no: '',
      whatsapp_mobileno: '',
      customer_status: '',
      principal_company: '',
      address1:'',
      address2:'',
      address3:'',
      email:'',
    });

const handleChange = (key: keyof CustomerType, value: string) => {
  setForm(prev => ({ ...prev, [key]: value }));
};

// Fetch and Set Dynamic Data From API

useEffect(() => {
}, []);

const handleSubmit = async () => {
    if (!form) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/tourbill/admin/customer-add`, {
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
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"black"}>Add Customer</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Name:</FormLabel>
                <Input
                  type="string"
                  value={form.name?.toString() || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Customer Type</FormLabel>
              <Input
                value={form.customer_type}
                onChange={(e) => handleChange('customer_type', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Primary Location</FormLabel>
              <Input
                value={form.prim_location}
                onChange={(e) => handleChange('prim_location', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Contact Person</FormLabel>
              <Input
                value={form.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Contact Person No:</FormLabel>
                <Input
                  value={form.contact_person_no || ''}
                  onChange={(e) => handleChange('contact_person_no', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Primary Contact No:</FormLabel>
                <Input
                  value={form.prim_contact_no || ''}
                  onChange={(e) => handleChange('prim_contact_no', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Alternate Contact No:</FormLabel>
                <Input
                  value={form.alt_contact_no || ''}
                  onChange={(e) => handleChange('alt_contact_no', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>WhatsApp No:</FormLabel>
                <Input
                  value={form.whatsapp_mobileno || ''}
                  onChange={(e) => handleChange('whatsapp_mobileno', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Customer Status:</FormLabel>
                <Input
                  value={form.customer_status || ''}
                  onChange={(e) => handleChange('customer_status', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Principal Company:</FormLabel>
                <Input
                  value={form.principal_company || ''}
                  onChange={(e) => handleChange('principal_company', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Address Line 1:</FormLabel>
                <Input
                  value={form.address1 || ''}
                  onChange={(e) => handleChange('address1', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Address Line2:</FormLabel>
                <Input
                  value={form.address2 || ''}
                  onChange={(e) => handleChange('address2', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Email:</FormLabel>
                <Input
                  value={form.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  bg={"blue.50"}
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
            isDisabled={!form}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
