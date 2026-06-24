import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useCallback } from "react";
import { useEffect, useState } from 'react';
// import type { EmployeeType } from '../../types/EmployeeType';
import type { StudentMasterType } from '../../types/StudentMasterType';
// import { PureSelect } from '../utils/PureSelect';

export type Option = SelectOption;  // Alias
import type { SelectOption } from '../../types/SelectOption';
import { PureSelect } from '../../components/utils/PureSelect';
// import type { MachineMasterType } from '../../types/MachineMasterType';

type AddStudentSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: StudentMasterType | null;
  onUpdated?: () => void; // callback to refresh table after success
};

// Main Function Start Here
export default function NewStudentPage({
  isOpen,
  onClose,
  // initialData,
  onUpdated,
}: AddStudentSliderProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const fetchDesignations = useCallback(async (): Promise<Option[]> => {
  //   const token = localStorage.getItem('authToken');
  //   const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
  //   const res = await fetch(`${apiUrl}/touradmin/desiglist`, {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,   // 👈 Bearer token
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //   });
   
  //   const json = await res.json();
  //   // assume json = [{ id: 1, name: "India" }, ...]
  //   return json.map((c: any) => ({
  //     value: String(c.slug),
  //     label: c.designation,
  //   }));
  // }, []);

  // const fetchDepartments = useCallback(async (): Promise<Option[]> => {
  //   const token = localStorage.getItem('authToken');
  //   const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
  //   const res = await fetch(`${apiUrl}/touradmin/deptlist`, {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,   // 👈 Bearer token
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //   });
    
  //   const json = await res.json();
  //   return json.map((c: any) => ({
  //     value: String(c.slug),
  //     label: c.department,
  //   }));
  // }, []);

  // const fetchManagers = useCallback(async (): Promise<Option[]> => {
  //   const token = localStorage.getItem('authToken');
  //   const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
  //   const res = await fetch(`${apiUrl}/touradmin/mgrlist`, {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,   // 👈 Bearer token
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //   });
  //   const json = await res.json();
  //   return json.map((c: any) => ({
  //     value: String(c.userid),
  //     label: c.full_name,
  //   }));
  // }, []);

  // const fetchBranches = useCallback(async (): Promise<Option[]> => {
  //   const token = localStorage.getItem('authToken');
  //   const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
  //   const res = await fetch(`${apiUrl}/touradmin/branchlist`, {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,   // 👈 Bearer token
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //   });
    
  //   const json = await res.json();
  //   return json.map((c: any) => ({
  //     value: String(c.branch_name),
  //     label: c.branch_location,
  //   }));
  // }, []);
 
const [form, setForm] = useState<StudentMasterType>({
    id:1,
    name: '',
    rollno: 0,
    gender: '',
    dept_id: 1,
    blood_group: 1,
    mobile: '',
    email: '',
    image_url: '',
});

const handleChange = (key: keyof StudentMasterType, value: string) => {
  setForm(prev => ({ ...prev, [key]: value }));
};

// Fetch and Set Dynamic Data From API
// const [dynamicDesignationOptions, setDynamicDesignationOptions] = useState<SelectOption[]>([]);
// const [dynamicDepartmentOptions, setDynamicDepartmentOptions] = useState<SelectOption[]>([]);
// const [dynamicManagerOptions, setDynamicManagerOptions] = useState<SelectOption[]>([]);
// const [dynamicBranchOptions, setDynamicBranchOptions] = useState<SelectOption[]>([]);

useEffect(() => {
  // fetchDesignations().then(setDynamicDesignationOptions);
  // fetchDepartments().then(setDynamicDepartmentOptions);
  // fetchManagers().then(setDynamicManagerOptions);
  // fetchBranches().then(setDynamicBranchOptions);
}, []);

const handleSubmit = async () => {
    if (!form) return;
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:5000';
      const res = await fetch(`${apiUrl}/api/students/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
    <>
    <Flex
      direction="column"
      h="calc(100vh - 80px)" // or "100vh" if this is the whole page
    >
      <Stack spacing={4}>
           <FormControl>
          <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Name:</FormLabel>
                      <Input
                        value={form.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                        bg={"blue.50"}
                      />
                    </FormControl>
      </Stack>
    </Flex>
    </>
    );

    // <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
    //   <DrawerOverlay />
    //   <DrawerContent>
    //     <DrawerCloseButton />
    //     <DrawerHeader color={"black"}>Add Student</DrawerHeader>
    //     <DrawerBody>
    //       <Stack spacing={4}>
    //         {/* <FormControl>
    //           <PureSelect
    //             label="Branch"
    //             value={form.base_location ?? ''}
    //             options={dynamicBranchOptions}  // ✅ Dynamic from API
    //             onChange={(value) => handleChange('base_location', value)}
    //             placeholder="Select Branch"
    //           />
    //         </FormControl>
    //         <FormControl>
    //           <PureSelect
    //             label="Manager"
    //             value={form.manager ?? ''}
    //             options={dynamicManagerOptions}  // ✅ Dynamic from API
    //             onChange={(value) => handleChange('manager', value)}
    //             placeholder="Select Manager"
    //           />
    //           </FormControl>
    //         <FormControl>
    //         <FormControl>
    //           <PureSelect
    //             label="Department"
    //             value={form.department ?? ''}
    //             options={dynamicDepartmentOptions}  // ✅ Dynamic from API
    //             onChange={(value) => handleChange('department', value)}
    //             placeholder="Select Department"
    //           />
    //         </FormControl>
    //         <PureSelect
    //           label="Designation"
    //           value={form.designation ?? ''}
    //           options={dynamicDesignationOptions}  // ✅ Dynamic from API
    //           onChange={(value) => handleChange('designation', value)}
    //           placeholder="Select Designation"
    //         />
    //         </FormControl> */}
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Name:</FormLabel>
    //             <Input
    //               value={form.name || ''}
    //               onChange={(e) => handleChange('name', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Roll No:</FormLabel>
    //             <Input
    //               value={form.rollno || ''}
    //               onChange={(e) => handleChange('rollno', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Gender:</FormLabel>
    //             <Input
    //               type="string"
    //               value={form.gender?.toString() || ''}
    //               onChange={(e) => handleChange('gender', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Dept ID:</FormLabel>
    //             <Input
    //               value={form.dept_id || ''}
    //               onChange={(e) => handleChange('dept_id', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Blood Group:</FormLabel>
    //             <Input
    //               value={form.blood_group || ''}
    //               onChange={(e) => handleChange('blood_group', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mobile No:</FormLabel>
    //             <Input
    //               value={form.mobile || ''}
    //               onChange={(e) => handleChange('mobile', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Email:</FormLabel>
    //             <Input
    //               value={form.email || ''}
    //               onChange={(e) => handleChange('email', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //           <FormControl>
    //             <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Image URL:</FormLabel>
    //             <Input
    //               type='text'
    //               value={form.image_url || ''}
    //               onChange={(e) => handleChange('image_url', e.target.value)}
    //               bg={"blue.50"}
    //             />
    //           </FormControl>
    //         </Stack>
    //     </DrawerBody>
    //     <DrawerFooter borderTopWidth="1px">
    //       <Button variant="outline" mr={3} onClick={onClose} colorScheme="yellow">
    //         Cancel
    //       </Button>
    //       <Button
    //         colorScheme="blue"
    //         onClick={handleSubmit}
    //         isLoading={isSubmitting}
    //         isDisabled={!form}
    //       >
    //         Save
    //       </Button>
    //     </DrawerFooter>
    //   </DrawerContent>
    // </Drawer>
  // );
}
