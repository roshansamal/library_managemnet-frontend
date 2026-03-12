// // components/EditSlider.tsx
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

// // Import your shared RecordItem type
// import type { RecordItem } from '../types/RecordItem';

// type EditSliderProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   initialData: RecordItem | null;
//   onUpdated?: () => void; // callback to refresh table after success
// };

// export default function MgrBillApprovalSlider({
//   isOpen,
//   onClose,
//   initialData,
//   onUpdated,
// }: EditSliderProps) {
//   const toast = useToast();

//   // Local form state
//   const [form, setForm] = useState<RecordItem | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Whenever initialData changes (or slider opens), populate form
//   useEffect(() => {
//     if (initialData) {
//       setForm(initialData);
//     } else {
//       setForm(null);
//     }
//   }, [initialData]);

//   const handleChange = (field: keyof RecordItem, value: string) => {
//     if (!form) return;
//     setForm({
//       ...form,
//       [field]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     if (!form) return;

//     try {
//       setIsSubmitting(true);

//       // Example: call your API to update record
//       // Replace URL and payload with your Laravel/Node endpoint
//       const res = await fetch(`/api/tours/${form.id}`, {
//         method: 'PUT',
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
//         <DrawerHeader color={"orange.400"}>Tour Approval</DrawerHeader>
//         <DrawerBody>
//           {!form ? null : (
//             <Stack spacing={4}>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour ID:</FormLabel>
//                 <Input
//                   value={form.tourid || ''}
//                   onChange={(e) => handleChange('id', e.target.value)}
//                   bg={"blue.50"} color={"black"}
//                   readOnly
//                 />
//               </FormControl>
//              <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Approve Amount:</FormLabel>
//                 <Input
//                   value={form.customer_name || ''}
//                   onChange={(e) => handleChange('customer_name', e.target.value)}
//                   bg={"grey"} color={"white"}
//                   readOnly
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mgr Remarks:</FormLabel>
//                 <Input
//                   value={form.mgr_remarks || ''}
//                   onChange={(e) => handleChange('mgr_remarks', e.target.value)}
//                   bg={"grey"} color={"white"}
//                   readOnly
//                 />
//               </FormControl>
//             </Stack>
//           )}
//         </DrawerBody>

//         <DrawerFooter borderTopWidth="1px">
//           <Button variant="outline" mr={3} onClick={onClose} bg={"blue.400"} color={"white"} _hover={{bg:"blue.600"}}>
//             Close
//           </Button>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }
