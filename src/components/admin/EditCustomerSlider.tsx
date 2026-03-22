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
import { useEffect, useState } from 'react';  // ✅ Added useCallback
import type { CustomerType } from '../../types/CustomerType';

type EmpEditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: CustomerType | null;
  onUpdated?: () => void;
};

export default function EditCustomerSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EmpEditSliderProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic options states
  // const [dynamicDesignationOptions, setDynamicDesignationOptions] = useState<SelectOption[]>([]);
  // const [dynamicDepartmentOptions, setDynamicDepartmentOptions] = useState<SelectOption[]>([]);
  // const [dynamicManagerOptions, setDynamicManagerOptions] = useState<SelectOption[]>([]);
  // const [dynamicBranchOptions, setDynamicBranchOptions] = useState<SelectOption[]>([]);

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

  // ✅ Proper useCallback fetchers
  // const fetchDesignations = useCallback(async (): Promise<SelectOption[]> => {
  //   try {
  //     const res = await fetch("/api/tourbill/admin/desiglist");
  //     if (!res.ok) throw new Error('Failed to fetch');
  //     const json = await res.json();
  //     return json.map((c: any) => ({
  //       value: String(c.designation),
  //       label: c.designation,
  //     }));
  //   } catch (e) {
  //     console.error('Fetch designations failed:', e);
  //     return [];
  //   }
  // }, []);

  // const fetchDepartments = useCallback(async (): Promise<SelectOption[]> => {
  //   try {
  //     const res = await fetch("/api/tourbill/admin/deptlist");
  //     if (!res.ok) throw new Error('Failed to fetch');
  //     const json = await res.json();
  //     return json.map((c: any) => ({
  //       value: String(c.slug),
  //       label: c.department,
  //     }));
  //   } catch (e) {
  //     console.error('Fetch departments failed:', e);
  //     return [];
  //   }
  // }, []);

  // const fetchManagers = useCallback(async (): Promise<SelectOption[]> => {
  //   try {
  //     const res = await fetch("/api/tourbill/admin/mgrlist");
  //     if (!res.ok) throw new Error('Failed to fetch');
  //     const json = await res.json();
  //     return json.map((c: any) => ({
  //       value: String(c.userid),
  //       label: c.full_name,
  //     }));
  //   } catch (e) {
  //     console.error('Fetch managers failed:', e);
  //     return [];
  //   }
  // }, []);

  // const fetchBranches = useCallback(async (): Promise<SelectOption[]> => {
  //   try {
  //     const res = await fetch("/api/tourbill/admin/branchlist");
  //     if (!res.ok) throw new Error('Failed to fetch');
  //     const json = await res.json();
  //     return json.map((c: any) => ({
  //       // value: String(c.branch_name),
  //       value: String(c.branch_location),
  //       label: c.branch_location,
  //     }));
  //   } catch (e) {
  //     console.error('Fetch branches failed:', e);
  //     return [];
  //   }
  // }, []);

  // ✅ Safe handleChange (form always defined)
  const handleChange = (field: keyof CustomerType, value: string) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Load data + populate form
  useEffect(() => {
    // Fetch dropdown options
    // fetchDesignations().then(setDynamicDesignationOptions);
    // fetchDepartments().then(setDynamicDepartmentOptions);
    // fetchManagers().then(setDynamicManagerOptions);
    // fetchBranches().then(setDynamicBranchOptions);

    // Populate form from initialData
    if (initialData) {
      setForm(initialData);
    } else {
      // Reset to defaults
      // setForm({ 
      //   id: 0,name: '',customer_type: '',prim_location: '',contact_person: '',
      //   contact_person_no: '',prim_contact_no:'',alt_contact_no: '',whatsapp_mobileno: '',
      //   customer_status: '',principal_company: '',address1:'',address2:'',address3:'',
      //   email:'',
      // });
        setForm({
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
      }
    }, [initialData]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // console.log(JSON.stringify(form));
      // const endpoint = '/api/tourbill/admin/customer-update';
      // const res = await fetch(endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // });
      
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/customer-update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
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
        <DrawerHeader color="black">Edit Customer</DrawerHeader>
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
                onChange={(e) => handleChange('email', e.target.value)}
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
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Address:</FormLabel>
                <Input
                  value={form.address1 || ''}
                  onChange={(e) => handleChange('address1', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Address:</FormLabel>
                <Input
                  value={form.address1 || ''}
                  onChange={(e) => handleChange('address1', e.target.value)}
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
            isDisabled={false}  // form always defined
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
