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

export default function EmpEditSlider({
  isOpen,
  onClose,
  initialData,
  onUpdated,
}: EmpEditSliderProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic options states
  const [dynamicDesignationOptions, setDynamicDesignationOptions] = useState<SelectOption[]>([]);
  const [dynamicDepartmentOptions, setDynamicDepartmentOptions] = useState<SelectOption[]>([]);
  const [dynamicManagerOptions, setDynamicManagerOptions] = useState<SelectOption[]>([]);
  const [dynamicBranchOptions, setDynamicBranchOptions] = useState<SelectOption[]>([]);

  // ✅ Always defined form (no null)
  const [form, setForm] = useState<EmployeeType>({ 
    id: 0,
    designation: '',
    empid: '',
    userid: '',
    first_name: '',
    email: '',
    mobile_no: '',
    department: '',
    competency_level: '',
    manager: '',
    fixed_da: 0,
    password: '',
    base_location: ''
  });

  // ✅ Proper useCallback fetchers
  const fetchDesignations = useCallback(async (): Promise<SelectOption[]> => {
    try {
      const res = await fetch("/api/tourbill/admin/desiglist");
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
      const res = await fetch("/api/tourbill/admin/deptlist");
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
      const res = await fetch("/api/tourbill/admin/mgrlist");
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
      const res = await fetch("/api/tourbill/admin/branchlist");
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
  const handleChange = (field: keyof EmployeeType, value: string) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Load data + populate form
  useEffect(() => {
    // Fetch dropdown options
    fetchDesignations().then(setDynamicDesignationOptions);
    fetchDepartments().then(setDynamicDepartmentOptions);
    fetchManagers().then(setDynamicManagerOptions);
    fetchBranches().then(setDynamicBranchOptions);

    // Populate form from initialData
    if (initialData) {
      setForm(initialData);
    } else {
      // Reset to defaults
      setForm({ 
        id: 0, designation: '', empid: '', userid: '', first_name: '',
        email: '', mobile_no: '', department: '', competency_level: '',
        manager: '', fixed_da: 0, password: '', base_location: ''
      });
    }
  }, [initialData, fetchDesignations, fetchDepartments, fetchManagers, fetchBranches]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log(JSON.stringify(form));
      //const endpoint = form.id ? '/api/tourbill/admin/empupdate' : '/api/tourbill/admin/empadd';
      const endpoint = '/api/tourbill/admin/empupdate';
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
        <DrawerHeader color="black">Edit Employee</DrawerHeader>
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
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Full Name:</FormLabel>
                <Input
                  type="string"
                  value={form.first_name?.toString() || ''}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Employee ID</FormLabel>
              <Input
                value={form.empid}
                onChange={(e) => handleChange('empid', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            <PureSelect
              label="Designation"
              value={form.designation}
              options={dynamicDesignationOptions}
              // onChange={(value) => handleChange('designation', value)}
              placeholder="Select designation"
              //---------------------------
              //value={form.department}
              //options={dynamicDepartmentOptions}
              onChange={(value) => handleChange('designation', value)}
            />
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">User ID</FormLabel>
              <Input
                value={form.userid}
                onChange={(e) => handleChange('userid', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="sm">Email</FormLabel>
              <Input
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                bg="blue.50"
              />
            </FormControl>
            
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mobile No:</FormLabel>
                <Input
                  value={form.mobile_no || ''}
                  onChange={(e) => handleChange('mobile_no', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Competency Level:</FormLabel>
                <Input
                  value={form.competency_level || ''}
                  onChange={(e) => handleChange('competency_level', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
            <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Fixed DA:</FormLabel>
                <Input
                  value={form!.fixed_da || ''}
                  onChange={(e) => handleChange('fixed_da', e.target.value)}
                  bg={"blue.50"}
                />
            </FormControl>
            {/* <FormControl>
              <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Password:</FormLabel>
              <Input
                type='password'
                value={form!.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                bg={"blue.50"}
              />
            </FormControl> */}
            <PureSelect
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
            />
            
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


// import {
//   Button,
//   Drawer,
//   DrawerBody,
//   DrawerCloseButton,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerOverlay,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   useToast,
// } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
// import { Select } from '@chakra-ui/react';
// import type { EmployeeType } from '../../types/EmployeeType';
// export type Option = SelectOption;  // Alias
// import type { SelectOption } from '../../types/SelectOption';

// type EmpEditSliderProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   initialData: EmployeeType | null;
//   onUpdated?: () => void; // callback to refresh table after success
// };

// export default function EmpEditSlider({
//   isOpen,
//   onClose,
//   initialData,
//   onUpdated,
// }: EmpEditSliderProps) {
//   const toast = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   //Dynamic variables to be populated after API call
//   const [dynamicDesignationOptions, setDynamicDesignationOptions] = useState<SelectOption[]>([]);
//   const [dynamicDepartmentOptions, setDynamicDepartmentOptions] = useState<SelectOption[]>([]);
//   const [dynamicManagerOptions, setDynamicManagerOptions] = useState<SelectOption[]>([]);
//   const [dynamicBranchOptions, setDynamicBranchOptions] = useState<SelectOption[]>([]);
//   const fetchDesignations = useCallback(async (): Promise<Option[]> => {
//       try {
//         const res = await fetch("/api/tourbill/admin/desiglist");
//         if (!res.ok) throw new Error('Failed to fetch');
//         const json = await res.json();
//         return json.map((c: any) => ({
//           value: String(c.id),
//           label: c.name,
//         }));
//       } catch (e) {
//         console.error('Fetch designations failed:', e);
//         return [];
//       }
//     }, []);
  
//     const fetchDepartments = useCallback(async (): Promise<Option[]> => {
//       const res = await fetch("/api/tourbill/admin/deptlist");
//       const json = await res.json();
//       return json.map((c: any) => ({
//         value: String(c.slug),
//         label: c.department,
//       }));
//     }, []);
  
//     const fetchManagers = useCallback(async (): Promise<Option[]> => {
//       const res = await fetch("/api/tourbill/admin/mgrlist");
//       const json = await res.json();
//       return json.map((c: any) => ({
//         value: String(c.userid),
//         label: c.full_name,
//       }));
//     }, []);
  
//     const fetchBranches = useCallback(async (): Promise<Option[]> => {
//       const res = await fetch("/api/tourbill/admin/branchlist");
//       const json = await res.json();
//       return json.map((c: any) => ({
//         value: String(c.branch_name),
//         label: c.branch_location,
//       }));
//     }, []);

//     const [form, setForm] = useState<EmployeeType>({ 
//         id:0,
//         designation:'',
//         empid: '',
//         userid: '',
//         first_name: '',
//         email: '',
//         mobile_no: '',
//         department: '',
//         competency_level: '',
//         manager: '',
//         fixed_da: 0,
//         password:'',
//         branch:''
//     });

//       // Whenever initialData changes (or slider opens), populate form
//     useEffect(() => {
//         fetchDesignations().then(setDynamicDesignationOptions);
//         fetchDepartments().then(setDynamicDepartmentOptions);
//         fetchManagers().then(setDynamicManagerOptions);
//         fetchBranches().then(setDynamicBranchOptions);
//       if (initialData) {
//         setForm(initialData);
//       } else {
//         //setForm(null);
//       }
//     }, [initialData]);

  
// const handleChange = (field: keyof EmployeeType, value: string) => {
//     if (!form) return;
//     setForm({
//       ...form,
//       [field]: value,
//     });
//   };

// const handleSubmit = async () => {
//     if (!form) return;
//     try {
//       setIsSubmitting(true);
//       const res = await fetch(`/api/tourbill/admin/empadd`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) {
//         throw new Error('Failed to update record');
//       }
//       toast({
//         title: 'Updated successfully',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       // Inform parent to refresh table
//       onUpdated && onUpdated();
//       onClose();
//     } catch (err: any) {
//       toast({
//         title: 'Update failed',
//         description: err?.message || 'Something went wrong',
//         status: 'error',
//         duration: 4000,
//         isClosable: true,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
//       <DrawerOverlay />
//       <DrawerContent>
//         <DrawerCloseButton />
//         <DrawerHeader color={"black"}>Edit Employee</DrawerHeader>
//         <DrawerBody>
//             <Stack spacing={4}>
//                 <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Designation:</FormLabel>
//                 {/* <Select
//                     value={form!.designation ?? ''}
//                     onChange={(e) => handleChange('designation', e.target.value)}
//                     bg="blue.50"
//                     placeholder="Select Designation"
//                     >
//                     {designations.map(dep => (
//                         <option key={dep} value={dep}>{dep}</option>
//                     ))}
//                 </Select> */}
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>EmployeeID:</FormLabel>
//                 <Input
//                   value={form.empid || ''}
//                   onChange={(e) => handleChange('empid', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>User ID:</FormLabel>
//                 <Input
//                   value={form!.userid || ''}
//                   onChange={(e) => handleChange('userid', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Full Name:</FormLabel>
//                 <Input
//                   type="string"
//                   value={form!.first_name?.toString() || ''}
//                   onChange={(e) => handleChange('first_name', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>EMail:</FormLabel>
//                 <Input
//                   value={form!.email || ''}
//                   onChange={(e) => handleChange('email', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mobile No:</FormLabel>
//                 <Input
//                   value={form!.mobile_no || ''}
//                   onChange={(e) => handleChange('mobile_no', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Designation:</FormLabel>
//                 <Select
//                     value={form!.department ?? ''}
//                     onChange={(e) => handleChange('department', e.target.value)}
//                     bg="blue.50"
//                     placeholder="Select Department"
//                     >
//                     {departments.map(dep => (
//                         <option key={dep} value={dep}>{dep}</option>
//                     ))}
//                     </Select>
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Competency Level:</FormLabel>
//                 <Input
//                   value={form!.competency_level || ''}
//                   onChange={(e) => handleChange('competency_level', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Manager:</FormLabel>
//                 <Select
//                     value={form!.manager ?? ''}
//                     onChange={(e) => handleChange('manager', e.target.value)}
//                     bg="blue.50"
//                     placeholder="Select Manager"
//                     >
//                     {managers.map(dep => (
//                         <option key={dep} value={dep}>{dep}</option>
//                     ))}
//                     </Select>
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Fixed DA:</FormLabel>
//                 <Input
//                   value={form!.fixed_da || ''}
//                   onChange={(e) => handleChange('fixed_da', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Password:</FormLabel>
//                 <Input
//                   type='password'
//                   value={form!.password || ''}
//                   onChange={(e) => handleChange('password', e.target.value)}
//                   bg={"blue.50"}
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Base Location:</FormLabel>
//                 <Select
//                     value={form!.branch ?? ''}
//                     onChange={(e) => handleChange('branch', e.target.value)}
//                     bg="blue.50"
//                     placeholder="Select Branch"
//                     >
//                     {branches.map(dep => (
//                         <option key={dep} value={dep}>{dep}</option>
//                     ))}
//                     </Select>
//               </FormControl>
//             </Stack>
//         </DrawerBody>
//         <DrawerFooter borderTopWidth="1px">
//           <Button variant="outline" mr={3} onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             colorScheme="blue"
//             onClick={handleSubmit}
//             isLoading={isSubmitting}
//             isDisabled={!form}
//           >
//             Save
//           </Button>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }
// function useCallback(arg0: () => Promise<Option[]>, arg1: never[]) {
//   throw new Error('Function not implemented.');
// }

