// src/pages/FilteredTablePage.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Link, Spacer, Table } from '@chakra-ui/react';
import { Select, useDisclosure,} from '@chakra-ui/react';
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
import { FaRecycle, FaTrash } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';
import type { CustomerType } from '../../types/CustomerType';
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
import AddCustomerSlider from '../../components/admin/AddCustomerSlider';
import EditCustomerSlider from '../../components/admin/EditCustomerSlider';

type ApiResponse = {
  data: CustomerType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<CustomerType>();

export default function Customers() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<CustomerType | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isSelected = (tourid: number) => selectedIds.includes(tourid);
  const [isViewEmpOpen, setIsViewEmpOpen] = useState(false);
  const [isEmpAddOpen, setIsEmpAddOpen] = useState(false);
  const [isEmpEditOpen, setIsEmpEditOpen] = useState(false);
  const [isEmpAddClose, setIsEmpAddClose] = useState(false);
  const [isEmpEditClose, setIsEmpEditClose] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<CustomerType | null>(null);
  const toast = useToast();

  
  // ✅ Single pagination state (remove old pageIndex/pageSize)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [data, setData] = useState<CustomerType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const closeEditEmpSlider = () => {
    setIsEmpEditClose(true);
    setIsEmpEditOpen(false);
    setSelectedRow(null);
  };
  function fetchDataAgain(): void {
    handleFetch();
  }
  // Emp Add
  const openEmpAdd = (row: CustomerType) => {
    setSelectedRow(row);
    setIsEmpAddOpen(true);
  };
  const closeEmpAdd = () => {
    setSelectedRow(null);
    setIsEmpAddOpen(false);
  };
  //Emp Edit
  const OpenEmpEditSlider = (row: CustomerType) => {
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
      // columnHelper.accessor('name', {
      //   header: 'name',
      //   cell: (info) => info.getValue(),
      // }),
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Customer Name',
        cell: info => info.getValue(),
        size: 500,       // ✅ desired width in px
        minSize: 200,
        maxSize: 500,
      }),
      columnHelper.accessor('customer_type', {
        header: 'Customer Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('prim_location', {
        header: 'Primary Location',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person', {
        header: 'Contact Person',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person_no', {
        header: 'Contact No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('prim_contact_no', {
        header: 'Primary No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('alt_contact_no', {
        header: 'Alternate No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('whatsapp_mobileno', {
        header: 'WhatsApp',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('customer_status', {
        header: 'Customer Status',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('principal_company', {
        header: 'Principal Company',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('address1', {
        header: 'Address',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
    ],
    [isSelected],
  );

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
  // const { pageIndex, pageSize } = table.getState().pagination;
  // const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  // ✅ Table-controlled buttons (REPLACE your manual ones)
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const showAddCustomerSlider= async () => {
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
  const res = await fetch(`/api/tourbill/admin/customerlist?${params}`);
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  setData(json.data);
  setTotal(json.total);
  setIsLoading(false);
}, [pagination.pageIndex, pagination.pageSize]);


  // useEffect(() => {
  //   // handleFetch(pageIndex, pageSize);
  //   handleFetch();
  // },[pageIndex, pageSize, startDate, endDate]);

  // useEffect(() => {
  //     handleFetch();  // Refetches with new pagination.pageIndex
  //   }, [pagination.pageIndex, pagination.pageSize]);  //

  // ✅ Auto-fetch on page change + initial load
useEffect(() => {
  handleFetch();
}, [handleFetch]);

// ✅ Table-controlled buttons (REPLACE your manual ones)
// const canPrev = table.getCanPreviousPage();
// const canNext = table.getCanNextPage();


  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    try {
      const res = await fetch(`/api/tourbill/admin/customer-delete/${rowToDelete.id}`, {
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
        description: `Employee ${rowToDelete.name} deleted successfully.`,
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
      {/* <Link href="/dashboard" color="blue.500">Admin</Link> */}
      <Text fontWeight="thin" size={"sm"}>Admin</Text>
      <Text color="gray.500">/</Text>
      <Text fontWeight="thin" size={"sm"}>Customers</Text>
      <Button colorScheme="blue" onClick={handleFetch} h={8} fontSize={"sm"} mx={"2"}>
        <FaRecycle /><Spacer width={"2"}/>Refresh
      </Button>
      <Button colorScheme="blue" onClick={showAddCustomerSlider} h={8} fontSize={"sm"}>
        <FaPlusCircle /><Spacer width={"2"}/>Add Customer
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
          maxH="45vh"
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
                    <ChakraSelect
                      size="sm"
                      width="80px"
                     // value={pageSize}
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
    <AddCustomerSlider
      isOpen={isEmpAddOpen}
      onClose={closeEmpAdd}
      initialData={selectedRow}
      onUpdated={fetchDataAgain} 
      />
    <EditCustomerSlider
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



