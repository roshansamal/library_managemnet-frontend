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
// import type { EmployeeType } from '../../types/EmployeeType';
import type { SelectOption } from '../../types/SelectOption';
import { PureSelect } from '../../components/utils/PureSelect'; // ✅ Add this import
import type { MachineMasterType } from '../../types/MachineMasterType';

type EditMachineSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: MachineMasterType | null;
  onUpdated?: () => void;
};

export default function EditMachineSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EditMachineSliderProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic options states
  const [dynamicDesignationOptions, setDynamicDesignationOptions] = useState<SelectOption[]>([]);
  // const [dynamicDepartmentOptions, setDynamicDepartmentOptions] = useState<SelectOption[]>([]);
  // const [dynamicManagerOptions, setDynamicManagerOptions] = useState<SelectOption[]>([]);
  // const [dynamicBranchOptions, setDynamicBranchOptions] = useState<SelectOption[]>([]);

  // ✅ Always defined form (no null)
  const [form, setForm] = useState<MachineMasterType>({ 
    id:0,
    machine_brand:'',
    product_type:'',
    machine_model:'',
    machine_serial:'',
    machine_location:'',
    doc:'',
    engine_model:'',
    engine_serial:'',
    customer_name:'',
    principal_company:'',
    old_hmr:0,
    hmr:0,
    hmr_date:'',
    machine_status:'',
    machine_status_remarks:'',
    warranty_status:'',
    contact_person:'',
    contact_person_no:'',
    sales_dealer:'',
    service_dealer:'',
    warranty_type:'',
    warranty_type_code:'',
    rma_type:'',
    caretrack_activated:'',
    csa_type:'',
    contact_person_email:'',
  });

  // ✅ Proper useCallback fetchers
  const fetchDesignations = useCallback(async (): Promise<SelectOption[]> => {
    try {
      //-----------------------------------
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/desiglist`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
      });
      //------------------------------------
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.map((c: any) => ({
        value: String(c.designation),
        label: c.designation,
      }));
    } catch (e) {
      console.error('Fetch designations failed:', e);
      return [];
    }
  }, []);

  const fetchDepartments = useCallback(async (): Promise<SelectOption[]> => {
    try {
      //-----------------------------------
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/deptlist`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      //------------------------------------

      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.map((c: any) => ({
        value: String(c.slug),
        label: c.department,
      }));
    } catch (e) {
      console.error('Fetch departments failed:', e);
      return [];
    }
  }, []);

  const fetchManagers = useCallback(async (): Promise<SelectOption[]> => {
    try {
      //-----------------------------------
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/mgrlist`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
      });
      //------------------------------------
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.map((c: any) => ({
        value: String(c.userid),
        label: c.full_name,
      }));
    } catch (e) {
      console.error('Fetch managers failed:', e);
      return [];
    }
  }, []);

  const fetchBranches = useCallback(async (): Promise<SelectOption[]> => {
    try {
      //-----------------------------------
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/branchlist`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
      });
      //------------------------------------
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      return json.map((c: any) => ({
        // value: String(c.branch_name),
        value: String(c.branch_location),
        label: c.branch_location,
      }));
    } catch (e) {
      console.error('Fetch branches failed:', e);
      return [];
    }
  }, []);

  // ✅ Safe handleChange (form always defined)
  const handleChange = (field: keyof MachineMasterType, value: string) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Load data + populate form
  useEffect(() => {
    // Fetch dropdown options
    fetchDesignations().then(setDynamicDesignationOptions);
    // fetchDepartments().then(setDynamicDepartmentOptions);
    // fetchManagers().then(setDynamicManagerOptions);
    // fetchBranches().then(setDynamicBranchOptions);

    // Populate form from initialData
    if (initialData) {
      setForm(initialData);
    } else {
      // Reset to defaults
      setForm({ 
        id:0,
        machine_brand:'',
        product_type:'',
        machine_model:'',
        machine_serial:'',
        machine_location:'',
        doc:'',
        engine_model:'',
        engine_serial:'',
        customer_name:'',
        principal_company:'',
        old_hmr:0,
        hmr:0,
        hmr_date:'',
        machine_status:'',
        machine_status_remarks:'',
        warranty_status:'',
        contact_person:'',
        contact_person_no:'',
        sales_dealer:'',
        service_dealer:'',
        warranty_type:'',
        warranty_type_code:'',
        rma_type:'',
        caretrack_activated:'',
        csa_type:'',
        contact_person_email:'',  
      });
    }
  }, [initialData, fetchDesignations, fetchDepartments, fetchManagers, fetchBranches]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log(JSON.stringify(form));
      //-----------------------------------
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/empupdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
      });
      //-----------------------------------
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
        <DrawerHeader color="black">Edit Machine</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            {/* ✅ Use PureSelect for dynamic dropdowns */}
            {/* <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Id:</FormLabel>
                <Input
                  type="string"
                  value={form.id?.toString() || ''}
                  onChange={(e) => handleChange('id', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl> */}
            
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Machine ID:</FormLabel>
                <Input
                  type="string"
                  value={form.id?.toString() || ''}
                  onChange={(e) => handleChange('id', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Brand</FormLabel>
              <Input
                value={form.machine_brand}
                onChange={(e) => handleChange('machine_brand', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            <PureSelect
              label="Product Type"
              value={form.product_type}
              options={dynamicDesignationOptions}
              placeholder="Select Prdocut Type"
              onChange={(value) => handleChange('product_type', value)}
            />
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Machine Model</FormLabel>
              <Input
                value={form.machine_model}
                onChange={(e) => handleChange('machine_model', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Machine Serial</FormLabel>
              <Input
                value={form.machine_serial}
                onChange={(e) => handleChange('machine_serial', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
             <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Machine Location</FormLabel>
                <Input
                  value={form.machine_location || ''}
                  onChange={(e) => handleChange('machine_location', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>DOC:</FormLabel>
                <Input
                  value={form.doc || ''}
                  onChange={(e) => handleChange('doc', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Engine Model:</FormLabel>
                <Input
                  value={form!.engine_model || ''}
                  onChange={(e) => handleChange('engine_model', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Engine Serial:</FormLabel>
                <Input
                  value={form!.engine_serial || ''}
                  onChange={(e) => handleChange('engine_serial', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Customer:</FormLabel>
                <Input
                  value={form!.customer_name || ''}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Principal Company:</FormLabel>
                <Input
                  value={form!.principal_company || ''}
                  onChange={(e) => handleChange('principal_company', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>OLD HMR:</FormLabel>
                <Input
                  value={form!.old_hmr || ''}
                  onChange={(e) => handleChange('old_hmr', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>HMR:</FormLabel>
                <Input
                  value={form!.hmr || ''}
                  onChange={(e) => handleChange('hmr', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>HMR Date:</FormLabel>
                <Input
                  value={form!.hmr_date || ''}
                  onChange={(e) => handleChange('hmr_date', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Sales Dealer:</FormLabel>
                <Input
                  value={form!.sales_dealer || ''}
                  onChange={(e) => handleChange('sales_dealer', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Service Dealer:</FormLabel>
                <Input
                  value={form!.service_dealer || ''}
                  onChange={(e) => handleChange('service_dealer', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Machine Status:</FormLabel>
                <Input
                  value={form!.machine_status || ''}
                  onChange={(e) => handleChange('machine_status', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Warranty Status:</FormLabel>
                <Input
                  value={form!.warranty_status || ''}
                  onChange={(e) => handleChange('warranty_status', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Warranty Type:</FormLabel>
                <Input
                  value={form!.warranty_type || ''}
                  onChange={(e) => handleChange('warranty_type', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Warranty Code:</FormLabel>
                <Input
                  value={form!.warranty_type_code || ''}
                  onChange={(e) => handleChange('warranty_type_code', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>RMA:</FormLabel>
                <Input
                  value={form!.rma_type || ''}
                  onChange={(e) => handleChange('rma_type', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Contact Person:</FormLabel>
                <Input
                  value={form!.contact_person || ''}
                  onChange={(e) => handleChange('contact_person', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Contact Person:</FormLabel>
                <Input
                  value={form!.contact_person_no || ''}
                  onChange={(e) => handleChange('contact_person_no', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Contact eMail:</FormLabel>
                <Input
                  value={form!.contact_person_email || ''}
                  onChange={(e) => handleChange('contact_person_email', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Care Track:</FormLabel>
                <Input
                  value={form!.caretrack_activated || ''}
                  onChange={(e) => handleChange('caretrack_activated', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
             <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>CSA:</FormLabel>
                <Input
                  value={form!.csa_type || ''}
                  onChange={(e) => handleChange('csa_type', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            {/* <PureSelect
              label="Branch"
              value={form.base_location}
              options={dynamicBranchOptions}
              onChange={(value) => handleChange('base_location', value)}
              placeholder="Select branch"
            />
            <PureSelect
              label="Manager"
              value={form.manager}
              options={dynamicManagerOptions}
              onChange={(value) => handleChange('manager', value)}
              placeholder="Select manager"
            />
            <PureSelect
              label="Department"
              value={form.department}
              options={dynamicDepartmentOptions}
              onChange={(value) => handleChange('department', value)}
              placeholder="Select department"
            /> */}
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
