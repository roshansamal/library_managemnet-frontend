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
import type { EmployeeType } from '../../types/EmployeeType';
import { PureSelect } from '../utils/PureSelect';

export type Option = SelectOption;  // Alias
import type { SelectOption } from '../../types/SelectOption';

type AddEmpSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: EmployeeType | null;
  onUpdated?: () => void; // callback to refresh table after success
};

// Main Function Start Here
export default function AddEmpSlider({
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
 
const [form, setForm] = useState<EmployeeType>({ 
    id:0,
    designation:'',
    empid: '',
    userid: '',
    first_name: '',
    email: '',
    mobile_no: '',
    department: '',
    competency_level: '',
    manager: '',
    fixed_da: 0,
    password:'',
    base_location:''
});

const handleChange = (key: keyof EmployeeType, value: string) => {
  setForm(prev => ({ ...prev, [key]: value }));
};

// Fetch and Set Dynamic Data From API
const [dynamicDesignationOptions, setDynamicDesignationOptions] = useState<SelectOption[]>([]);
const [dynamicDepartmentOptions, setDynamicDepartmentOptions] = useState<SelectOption[]>([]);
const [dynamicManagerOptions, setDynamicManagerOptions] = useState<SelectOption[]>([]);
const [dynamicBranchOptions, setDynamicBranchOptions] = useState<SelectOption[]>([]);

useEffect(() => {
  //Fetch All Select Data through API Call During Component Load
  fetchDesignations().then(setDynamicDesignationOptions);
  fetchDepartments().then(setDynamicDepartmentOptions);
  fetchManagers().then(setDynamicManagerOptions);
  fetchBranches().then(setDynamicBranchOptions);
}, []);

const handleSubmit = async () => {
    if (!form) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/tourbill/admin/empadd`, {
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
        <DrawerHeader color={"black"}>Add Employee</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
              <PureSelect
                label="Branch"
                value={form.base_location ?? ''}
                options={dynamicBranchOptions}  // ✅ Dynamic from API
                onChange={(value) => handleChange('base_location', value)}
                placeholder="Select Branch"
              />
            </FormControl>
            <FormControl>
              <PureSelect
                label="Manager"
                value={form.manager ?? ''}
                options={dynamicManagerOptions}  // ✅ Dynamic from API
                onChange={(value) => handleChange('manager', value)}
                placeholder="Select Manager"
              />
              </FormControl>
            <FormControl>
            <FormControl>
              <PureSelect
                label="Department"
                value={form.department ?? ''}
                options={dynamicDepartmentOptions}  // ✅ Dynamic from API
                onChange={(value) => handleChange('department', value)}
                placeholder="Select Department"
              />
            </FormControl>
            <PureSelect
              label="Designation"
              value={form.designation ?? ''}
              options={dynamicDesignationOptions}  // ✅ Dynamic from API
              onChange={(value) => handleChange('designation', value)}
              placeholder="Select Designation"
            />
            </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>EmployeeID:</FormLabel>
                <Input
                  value={form.empid || ''}
                  onChange={(e) => handleChange('empid', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>User ID:</FormLabel>
                <Input
                  value={form.userid || ''}
                  onChange={(e) => handleChange('userid', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
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
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>EMail:</FormLabel>
                <Input
                  value={form.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  bg={"blue.50"}
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
                  value={form.fixed_da || ''}
                  onChange={(e) => handleChange('fixed_da', e.target.value)}
                  bg={"blue.50"}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Password:</FormLabel>
                <Input
                  type='password'
                  value={form.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
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
