// // src/pages/FilteredTablePage.tsx
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
// import {
//   Select,
//   useDisclosure,
// } from '@chakra-ui/react';
// import { useEffect, useMemo, useState } from 'react';
// import {
//   Box,
//   Button,
//   HStack,
//   Input,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Tfoot,
//   IconButton,
//   Text,
//   Select as ChakraSelect,
// } from '@chakra-ui/react';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type Row,
//   type SortingState,
// } from '@tanstack/react-table';
// import { FiChevronLeft, FiChevronRight, FiDelete, FiEdit, FiEye } from 'react-icons/fi';
// import { FaCheck, FaCheckDouble, FaCross, FaFilter, FaLocationDot, FaRecycle, FaTrash } from 'react-icons/fa6';
// import { useToast } from '@chakra-ui/react';
// import type { EmployeeType } from '../../types/EmployeeType';
// import { FaPlusCircle } from 'react-icons/fa';
// import AddEmpSlider from '../../components/admin/AddEmpSlider';
// import EmpEditSlider from '../../components/admin/EmpEditSlider';
// import { ConfirmDeleteDialog } from '../../components/utils/ConfirmDeleteDialog';

// type ApiResponse = {
//   data: EmployeeType[];
//   current_page: number;
//   per_page: number;
//   total: number;
// };

// const columnHelper = createColumnHelper<EmployeeType>();

// export default function Employees() {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [data, setData] = useState<EmployeeType[]>([]);
//   const [pageIndex, setPageIndex] = useState(0); // zero-based
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<EmployeeType | null>(null);
//   const [users, setUsers] = useState<UserOption[]>([]);
//   const [username, setUsername] = useState('');
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const allSelected = data.length > 0 && selectedIds.length === data.length;
//   const isSelected = (tourid: number) => selectedIds.includes(tourid);
//   const [isViewEmpOpen, setIsViewEmpOpen] = useState(false);
//   const [isEmpAddOpen, setIsEmpAddOpen] = useState(false);
//   const [isEmpEditOpen, setIsEmpEditOpen] = useState(false);
//   const [isEmpAddClose, setIsEmpAddClose] = useState(false);
//   const [isEmpEditClose, setIsEmpEditClose] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [rowToDelete, setRowToDelete] = useState<EmployeeType | null>(null);
//   const toast = useToast();

//   // Type Declaration
//   type UserOption = { userid: string };

//   const closeEditEmpSlider = () => {
//     setIsEmpEditClose(true);
//     setIsEmpEditOpen(false);
//     setSelectedRow(null);
//   };
//   function fetchDataAgain(): void {
//     handleFetch();
//   }
//   // Emp Add
//   const openEmpAdd = (row: EmployeeType) => {
//     setSelectedRow(row);
//     setIsEmpAddOpen(true);
//   };
//   const closeEmpAdd = () => {
//     setSelectedRow(null);
//     setIsEmpAddOpen(false);
//   };
//   //Emp Edit
//   const OpenEmpEditSlider = (row: EmployeeType) => {
//     setSelectedRow(row);
//     setIsEmpEditOpen(true);
//   };
//   const CloseEmpEditSlider = () => {
//     setSelectedRow(null);
//     setIsEmpEditOpen(false);
//   };

//   const toggleAll = () => {
//     //setSelectedIds(allSelected ? [] : data.map((r) => r.id));
//     setSelectedIds(allSelected ? [] : data.map((r) => r.id));
//   };
//   const toggleOne = (tourid: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(tourid) ? prev.filter((x) => x !== tourid) : [...prev, tourid],
//     );
//   };


//   // useEffect(() => {
//   //   const fetchUsers = async () => {
//   //     const res = await fetch('/api/tourbill/admin/emplist');
//   //     const json: UserOption[] = await res.json();
//   //     setUsers(json);
//   //   };
//   //   fetchUsers();
//   // }, []);
  
//   // Columns, including selection column
//   const columns = useMemo(
//     () => [
//       columnHelper.accessor('id', {
//         header: 'ID',
//         // cell: (info) => JSON.stringify(info.getValue()),
//         cell: ({ row }) => <span>{row.index + 1}</span>,
//       }),
//       columnHelper.display({
//         id: 'edit',
//         header: 'Edit',
//         cell: (info) => {
//           const rowData = info.row.original;
//           return (
//             <IconButton
//               aria-label="Edit"
//               icon={<FiEdit />}
//               size="sm"
//               variant="ghost"
//               _hover={{bg:"black",textColor:"white"}}
//               onClick={() => {
//                 OpenEmpEditSlider(rowData);
//               }}
//             />
//           );
//         },
//       }),
//       columnHelper.display({
//         id: 'delete',
//         header: 'Delete',
//         cell: (info) => {
//           const rowData = info.row.original;
//           return (
//             <IconButton
//               aria-label="Delete"
//               icon={<FaTrash />}
//               color={"red"}
//               size="sm"
//               variant="ghost"
//               _hover={{bg:"black",textColor:"white"}}
//               onClick={() => {
//                 setRowToDelete(rowData);     // store row
//                 setIsDeleteOpen(true);       // open dialog
//               }}
//             />
//           );
//         },
//       }),
//       columnHelper.accessor('empid', {
//         header: 'EmployeeID',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('userid', {
//         header: 'User ID',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('first_name', {
//         header: 'Full Name',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('designation', {
//         header: 'Designation',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('mobile_no', {
//         header: 'Mobile No',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('department', {
//         header: 'Department',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('competency_level', {
//         header: 'Competency Level',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('manager', {
//         header: 'Manager',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('fixed_da', {
//         header: 'Fixed DA',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('base_location', {
//         header: 'Branch',
//         cell: (info) => info.getValue(),
//       }),
//     ],
//     [allSelected, isSelected, toggleAll, toggleOne],
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//     },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     manualSorting: true,
//     manualPagination: true,
//     pageCount: Math.ceil(total / pageSize) || -1,
//   });

//   const pageCount = Math.max(Math.ceil(total / pageSize), 1);
//   const canPrev = pageIndex > 0;
//   const canNext = pageIndex < pageCount - 1;

//   const showAddEmpSlider= async () => {
//     setIsLoading(true);
//     try {
//       setIsEmpAddOpen(true);
//     }
//     catch (e) {
//       console.error('Fetch failed:', e);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // const handleFetch = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     const res = await fetch('/api/tourbill/admin/emplist', {
//   //         method: 'POST',
//   //         credentials: 'include',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //           //Authorization: `Bearer ${token}`,
//   //         },
//   //         body: JSON.stringify({
//   //           "start_date":startDate,
//   //           "end_date":endDate,
//   //         }),
//   //       });
//   //     if (!res.ok) {
//   //       console.error('Error:', res.status, await res.text());
//   //       return;
//   //     }
//   //     const json: ApiResponse = await res.json(); // { data, total, ... }
//   //     //console.log(json);
//   //     setData(json.data);
//   //     setTotal(json.total);
//   //     setSelectedIds([]);          // optional reset
//   //   } catch (e) {
//   //     console.error('Fetch failed:', e);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleFetch = async (pageIdx = pageIndex, pageSz = pageSize) => {
//   try {
//     setIsLoading(true);
//     const res = await fetch('/api/tourbill/admin/emplist', {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         start_date: startDate,
//         end_date: endDate,
//         page: pageIdx + 1,      // Laravel expects 1-based
//         per_page: pageSz,       // e.g., 10
//       }),
//     });
//     if (!res.ok) {
//       console.error('Error:', res.status, await res.text());
//       return;
//     }
//     const json: ApiResponse = await res.json();
//     setData(json.data);
//     setTotal(json.total);     // For pageCount: Math.ceil(total / pageSize)
//     setSelectedIds([]);
//   } catch (e) {
//     console.error('Fetch failed:', e);
//   } finally {
//     setIsLoading(false);
//   }
// };


//   // useEffect(() => {
//   //   void handleFetch();
//   // }, [handleFetch]);
//   const handleDeleteConfirm = async () => {
//     if (!rowToDelete) return;
//     try {
//       const res = await fetch(`/api/tourbill/admin/empdelete/${rowToDelete.id}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });
//       if (!res.ok) {
//         throw new Error(`Delete failed: ${res.status}`);
//       }

//       // Option 1: refetch
//       await handleFetch();

//       // Option 2: local remove (if you prefer):
//       // setData(prev => prev.filter(emp => emp.id !== rowToDelete.id));

//       toast({
//         title: 'Deleted',
//         description: `Employee ${rowToDelete.empid} deleted successfully.`,
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (e: any) {
//       toast({
//         title: 'Delete failed',
//         description: e?.message ?? 'Something went wrong',
//         status: 'error',
//         duration: 4000,
//         isClosable: true,
//       });
//     } finally {
//       setRowToDelete(null);
//     }
//   };


//   return (
//     <>
//     <Breadcrumb fontWeight="thin" fontSize={"sm"} mb={1}>
//       {/* <BreadcrumbItem>
//         <BreadcrumbLink href="/">Home</BreadcrumbLink>
//       </BreadcrumbItem> */}
//       <BreadcrumbItem>
//         <BreadcrumbLink>Admin</BreadcrumbLink>
//       </BreadcrumbItem>
//       <BreadcrumbItem isCurrentPage>
//         <BreadcrumbLink>Employees</BreadcrumbLink>
//       </BreadcrumbItem>
//       <Button colorScheme="blue" onClick={handleFetch} h={8} fontSize={"sm"} mx={"2"}>
//         <FaRecycle />Refresh
//       </Button>
//       <Button colorScheme="blue" onClick={showAddEmpSlider} h={8} fontSize={"sm"}>
//         <FaPlusCircle />Add Employee
//       </Button>
//     </Breadcrumb>
//     <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
//       {/* Filters */}
//       <HStack spacing={1} mb={4} align="flex-end" justifyContent={"left"}>
//          {/* <Box>
//           <Text mb={1} fontSize="sm" fontWeight="medium">
//             From Date
//           </Text>
//           <Input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             bg="cyan.50"
//             h={8}
//           />
//         </Box> */}
//         {/* <Box>
//           <Text mb={1} fontSize="sm" fontWeight="medium">
//             To Date
//           </Text>
//           <Input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             min={startDate || undefined}
//             bg="cyan.50"
//             h={8}
//           />
//         </Box> */}
//         {/* <Button colorScheme="blue" onClick={handleFetch} h={8} fontSize={"sm"}>
//           <FaRecycle />Refresh
//         </Button>
//         <Button colorScheme="blue" onClick={showAddEmpSlider} h={8} fontSize={"sm"}>
//           <FaPlusCircle />Add Employee
//         </Button> */}
//       </HStack>

//       {/* Table */}
//       <Box overflow="auto">
//         <Table
//           size="sm"
//           minW="1200px"
//           variant="striped"
//           colorScheme="gray"
//           maxH="50vh"
//         >
//           <Thead bg="gray.700" top={0} zIndex={1}>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   const canSort = header.column.getCanSort();
//                   const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false
//                   return (
//                     <Th
//                       key={header.id}
//                       cursor={canSort ? 'pointer' : 'default'}
//                       onClick={
//                         canSort
//                           ? header.column.getToggleSortingHandler()
//                           : undefined
//                       }
//                       whiteSpace="nowrap"
//                       color="white"
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                       {sortDir === 'asc' && ' ▲'}
//                       {sortDir === 'desc' && ' ▼'}
//                     </Th>
//                   );
//                 })}
//               </Tr>
//             ))}
//           </Thead>

//           <Tbody>
//             {table.getRowModel().rows.length === 0 && !isLoading && (
//               <Tr>
//                 <Td colSpan={columns.length}>
//                   <Text textAlign="center" py={4}>
//                     No records found.
//                   </Text>
//                 </Td>
//               </Tr>
//             )}
//             {table.getRowModel().rows.map((row) => (
//               <Tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <Td key={cell.id}>
//                     {flexRender(
//                       cell.column.columnDef.cell,
//                       cell.getContext(),
//                     )}
//                   </Td>
//                 ))}
//               </Tr>
//             ))}
//           </Tbody>
//           <Tfoot>
//             <Tr>
//               <Td colSpan={columns.length}>
//                 <HStack justify="space-between" align="center">
//                   <HStack>
//                     <IconButton
//                       aria-label="Previous page"
//                       icon={<FiChevronLeft />}
//                       size="sm"
//                       onClick={() => canPrev && setPageIndex((p) => p - 1)}
//                       isDisabled={!canPrev}
//                       bg={"blue"}
//                       color={"white"}
//                       _hover={{bg:"orange",color:"black"}}

//                     />
//                     <IconButton
//                       aria-label="Next page"
//                       icon={<FiChevronRight />}
//                       size="sm"
//                       onClick={() => canNext && setPageIndex((p) => p + 1)}
//                       isDisabled={!canNext}
//                       bg={"blue"}
//                       color={"white"}
//                       _hover={{bg:"orange",color:"black"}}
//                     />
//                     <Text fontSize="sm">
//                       Page {pageIndex + 1} of {pageCount}
//                     </Text>
//                   </HStack>
//                   <HStack>
//                     <Text fontSize="sm">Rows per page:</Text>
//                     <ChakraSelect
//                       size="sm"
//                       width="80px"
//                       value={pageSize}
//                       onChange={(e) => {
//                         setPageSize(Number(e.target.value));
//                         setPageIndex(0);
//                       }}
//                     >
//                       {[10, 20, 50].map((size) => (
//                         <option key={size} value={size}>
//                           {size}
//                         </option>
//                       ))}
//                     </ChakraSelect>
//                     <Text fontSize="sm">Total: {total}</Text>
//                   </HStack>
//                 </HStack>
//               </Td>
//             </Tr>
//           </Tfoot>
//         </Table>
//       </Box>
//     {/* <ViewTourDetailsSlider
//       isOpen={isTourViewOpen}
//       onClose={closeTourView}
//       tourId={selectedRow?.id ?? 0}
//       onUpdated={fetchDataAgain}
//     />; */}
//     {/* <ViewTourBillSlider
//       isOpen={isTourViewOpen}
//       onClose={closeTourView}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain}
//     />; */}
//     {/* <ViewGpsSlider
//       isOpen={isTourGpsOpen}
//       onClose={closeTourGps}
//       tourId={selectedRow?.id ?? 0}
//       onUpdated={fetchDataAgain}
//     />; */}
//     {/* <MgrTourBillApprovalSlider
//       isOpen={isBillApprovalOpen}
//       onClose={closeBillApproval}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain}
//     />;
//     <MgrTourBillReturnSlider
//       isOpen={isBillReturnOpen}
//       onClose={closeBillReturn}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain}
//     />; */}

//     <AddEmpSlider
//       isOpen={isEmpAddOpen}
//       onClose={closeEmpAdd}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain} 
//       />;
//     <EmpEditSlider
//       isOpen={isEmpEditOpen}
//       onClose={CloseEmpEditSlider}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain} 
//       />;

//     <ConfirmDeleteDialog
//       isOpen={isDeleteOpen}
//       onClose={() => setIsDeleteOpen(false)}
//       onConfirm={handleDeleteConfirm}
//     />
//     </Box>
//     </>
//   );
// }
