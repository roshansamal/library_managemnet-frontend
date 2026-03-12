// src/pages/FilteredTablePage.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Link, Table } from '@chakra-ui/react';
import {
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Input,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  IconButton,
  Text,
  Select as ChakraSelect,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  type PaginationState,
  type Row,
  type RowModel,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight, FiDelete, FiEdit, FiEye } from 'react-icons/fi';
import { FaCheck, FaCheckDouble, FaCross, FaFilter, FaLocationDot, FaRecycle, FaTrash } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';
import type { EmployeeType } from '../../types/EmployeeType';
import { FaPlusCircle } from 'react-icons/fa';
import AddEmpSlider from '../../components/admin/AddEmpSlider';
import EmpEditSlider from '../../components/admin/EmpEditSlider';
import { ConfirmDeleteDialog } from '../../components/utils/ConfirmDeleteDialog';
import TableLoader from '../../components/TableLoader';
import {
  useReactTable,
  getCoreRowModel,     // ✅ Always required
  getPaginationRowModel,
} from '@tanstack/react-table';
import axios from 'axios';

type ApiResponse = {
  data: EmployeeType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<EmployeeType>();

export default function Employees() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<EmployeeType | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [username, setUsername] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isSelected = (tourid: number) => selectedIds.includes(tourid);
  const [isViewEmpOpen, setIsViewEmpOpen] = useState(false);
  const [isEmpAddOpen, setIsEmpAddOpen] = useState(false);
  const [isEmpEditOpen, setIsEmpEditOpen] = useState(false);
  const [isEmpAddClose, setIsEmpAddClose] = useState(false);
  const [isEmpEditClose, setIsEmpEditClose] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<EmployeeType | null>(null);
  const toast = useToast();

  
  // ✅ Single pagination state (remove old pageIndex/pageSize)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [data, setData] = useState<EmployeeType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Type Declaration
  type UserOption = { userid: string };

  const closeEditEmpSlider = () => {
    setIsEmpEditClose(true);
    setIsEmpEditOpen(false);
    setSelectedRow(null);
  };
  function fetchDataAgain(): void {
    handleFetch();
  }
  // Emp Add
  const openEmpAdd = (row: EmployeeType) => {
    setSelectedRow(row);
    setIsEmpAddOpen(true);
  };
  const closeEmpAdd = () => {
    setSelectedRow(null);
    setIsEmpAddOpen(false);
  };
  //Emp Edit
  const OpenEmpEditSlider = (row: EmployeeType) => {
    setSelectedRow(row);
    setIsEmpEditOpen(true);
  };
  const CloseEmpEditSlider = () => {
    setSelectedRow(null);
    setIsEmpEditOpen(false);
  };
  
  // Columns, including selection column
  const columns = useMemo(
    () => [
        columnHelper.display({
        id: 'serial_no',
        header: 'SL',
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        },
      }),
      // columnHelper.accessor('id', {
      //   header: 'ID',
      //   cell: ({ row }) => <span>{row.index + 1}</span>,
      // }),
      columnHelper.display({
        id: 'edit',
        header: 'Edit',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              aria-label="Edit"
              icon={<FiEdit />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                OpenEmpEditSlider(rowData);
              }}
            />
          );
        },
      }),
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              aria-label="Delete"
              icon={<FaTrash />}
              color={"red"}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                setRowToDelete(rowData);     // store row
                setIsDeleteOpen(true);       // open dialog
              }}
            />
          );
        },
      }),
      columnHelper.accessor('empid', {
        header: 'EmployeeID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('userid', {
        header: 'User ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('first_name', {
        header: 'Full Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('mobile_no', {
        header: 'Mobile No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('competency_level', {
        header: 'Competency Level',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('manager', {
        header: 'Manager',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('fixed_da', {
        header: 'Fixed DA',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('base_location', {
        header: 'Branch',
        cell: (info) => info.getValue(),
      }),
    ],
    [isSelected],
  );

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: {
  //     sorting,
  //   },
  //   onSortingChange: setSorting,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   manualSorting: true,
  //   manualPagination: true,
  //   pageCount: Math.ceil(total / pageSize) || -1,
  // });

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: { pagination: { pageIndex, pageSize } },
  //   onPaginationChange: setPagination,
  //   getPaginationRowModel: getPaginationRowModel(),
  //   manualPagination: true,
  //   pageCount: total ? Math.ceil(total / pageSize) : 0,
  //   getCoreRowModel: function (table: Table<any>): () => RowModel<any> {
  //     throw new Error('Function not implemented.');
  //   }
  // });


//   const table = useReactTable({
//   data,
//   columns,
//   state: { pagination: { pageIndex, pageSize } },
//   onPaginationChange: setPagination,
//   getCoreRowModel: getCoreRowModel(),        // ✅ Fixes the error
//   getPaginationRowModel: getPaginationRowModel(),
//   manualPagination: true,
//   // pageCount: total ? Math.ceil(total / pagination.pageSize) : 0,
//   // pageCount: total ? Math.ceil(total / pageSize) : 0,
//   pageCount: total ? Math.ceil(total / pagination.pageSize) : 0,
// });

  // ✅ Table uses pagination state
const table = useReactTable({
  data,
  columns,
  state: { pagination },  // ✅ Single source
  onPaginationChange: setPagination,  // ✅ Table controls it
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  manualPagination: true,
  pageCount: total ? Math.ceil(total / pagination.pageSize) : -1,
});
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  // const canPrev = pageIndex > 0;
  // const canNext = pageIndex < pageCount - 1;
  // ✅ Table-controlled buttons (REPLACE your manual ones)
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const showAddEmpSlider= async () => {
    setIsLoading(true);
    try {
      setIsEmpAddOpen(true);
    }
    catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Fetch current page
const handleFetch = useCallback(async () => {
  console.log('Fetching page:', pagination.pageIndex + 1);
  setIsLoading(true);
  const params = new URLSearchParams({
    page: (pagination.pageIndex + 1).toString(),
    per_page: pagination.pageSize.toString(),
  });
  const res = await fetch(`/api/touradmin/emp/emplist?${params}`);
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  setData(json.data);
  setTotal(json.total);
  setIsLoading(false);
}, [pagination.pageIndex, pagination.pageSize]);


useEffect(() => {
  handleFetch();
}, [handleFetch]);

// ✅ Table-controlled buttons (REPLACE your manual ones)
// const canPrev = table.getCanPreviousPage();
// const canNext = table.getCanNextPage();

  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    try {
      const res = await fetch(`/api/tourbill/admin/empdelete/${rowToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      // Option 1: refetch
      await handleFetch();

      // Option 2: local remove (if you prefer):
      // setData(prev => prev.filter(emp => emp.id !== rowToDelete.id));

      toast({
        title: 'Deleted',
        description: `Employee ${rowToDelete.empid} deleted successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: 'Delete failed',
        description: e?.message ?? 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setRowToDelete(null);
    }
  };

 
  return (
    <>
    <HStack spacing={2} as="nav" aria-label="Breadcrumb">
      <Link href="/dashboard" color="blue.500">Admin</Link>
      <Text color="gray.500">/</Text>
      <Text fontWeight="medium">Employees</Text>
      <Button colorScheme="blue" onClick={handleFetch} h={8} fontSize={"sm"} mx={"2"}>
        <FaRecycle />Refresh
      </Button>
      <Button colorScheme="blue" onClick={showAddEmpSlider} h={8} fontSize={"sm"}>
        <FaPlusCircle />Add Employee
      </Button>
    </HStack>
    <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
      {/* Filters */}
      <HStack spacing={1} mb={1} align="flex-end" justifyContent={"left"}>
         
      </HStack>

      {/* Table */}
      <Box overflow="auto">
        <Table
          size="sm"
          minW="1200px"
          variant="striped"
          colorScheme="gray"
          maxH="50vh"
        >
          <Thead bg="gray.700" top={0} zIndex={1}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false
                  return (
                    <Th
                      key={header.id}
                      cursor={canSort ? 'pointer' : 'default'}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      whiteSpace="nowrap"
                      color="white"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sortDir === 'asc' && ' ▲'}
                      {sortDir === 'desc' && ' ▼'}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {table.getRowModel().rows.length === 0 && !isLoading && (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign="center" py={4}>
                    No records found.
                  </Text>
                </Td>
              </Tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td colSpan={columns.length}>
                <HStack justify="space-between" align="center">
                  <HStack>
                    {/* <IconButton
                      aria-label="Previous page"
                      icon={<FiChevronLeft />}
                      size="sm"
                      // onClick={() => canPrev && setPageIndex((p) => p - 1)}
                      onClick={() => table.previousPage()}  // ✅ Table method
                      isDisabled={!canPrev}
                      bg={"blue"}
                      color={"white"}
                      _hover={{bg:"orange",color:"black"}}

                    />
                    <IconButton
                      aria-label="Next page"
                      icon={<FiChevronRight />}
                      size="sm"
                      // onClick={() => canNext && setPageIndex((p) => p + 1)}
                      onClick={() => table.nextPage()}      // ✅ Table method  
                      isDisabled={!canNext}
                      bg={"blue"}
                      color={"white"}
                      _hover={{bg:"orange",color:"black"}}
                    /> */}
                    <IconButton
                      aria-label="Previous"
                      icon={<FiChevronLeft />}
                      onClick={() => table.previousPage()}  // ✅ Table method
                      isDisabled={!canPrev}
                    />
                    <IconButton
                      aria-label="Next"
                      icon={<FiChevronRight />}
                      onClick={() => table.nextPage()}      // ✅ Table method  
                      isDisabled={!canNext}
                    />
                    <Text fontSize="sm">
                      {/* Page {pageIndex + 1} of {pageCount} */}
                      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm">Rows per page:</Text>
                    {/* <ChakraSelect
                      size="sm"
                      width="80px"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageIndex(0);
                      }}
                    >
                      {[10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </ChakraSelect> */}
                    
                    <ChakraSelect
                      size="sm"
                      width="80px"
                      value={pageSize}
                      onChange={(e) => {
                        const newSize = Number(e.target.value);
                        table.setPageSize(newSize);         // ✅ updates pagination.pageSize
                        table.setPageIndex(0);              // ✅ go back to first page
                      }}
                    >
                      {[10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </ChakraSelect>
                    <Text fontSize="sm">Total: {total}</Text>
                  </HStack>
                </HStack>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
        <TableLoader 
            isLoading={isLoading}
            message="Loading..."
            size="lg"
          />
      </Box>
    <AddEmpSlider
      isOpen={isEmpAddOpen}
      onClose={closeEmpAdd}
      initialData={selectedRow}
      onUpdated={fetchDataAgain} 
      />
    <EmpEditSlider
      isOpen={isEmpEditOpen}
      onClose={CloseEmpEditSlider}
      initialData={selectedRow}
      onUpdated={fetchDataAgain} 
      />
    <ConfirmDeleteDialog
      isOpen={isDeleteOpen}
      onClose={() => setIsDeleteOpen(false)}
      onConfirm={handleDeleteConfirm}
    />
    </Box>
    </>
  );
}

// function setPagination(_updaterOrValue: Updater<PaginationState>): void {
//   throw new Error('Function not implemented.');
// }

