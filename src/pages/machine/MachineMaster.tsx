// src/pages/FilteredTablePage.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Select as ChakraSelect,
  useToast,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight, FiEdit } from 'react-icons/fi';
import { FaCircle, FaRecycle, FaTrash } from 'react-icons/fa6';
//import { FaRecycle, FaTrash } from 'react-icons/fa6';

// import type { EmployeeType } from '../../types/EmployeeType';
import type { MachineMasterType } from '../../types/MachineMasterType';
// import AddEmpSlider from '../../components/admin/AddEmpSlider';
// import EmpEditSlider from '../../components/admin/EmpEditSlider';
import { ConfirmDeleteDialog } from '../../components/utils/ConfirmDeleteDialog';
import TableLoader from '../../components/TableLoader';
import AddMachineSlider from './AddMachineSlider';
import EditMachineSlider from './EditMachineSlider';

const columnHelper = createColumnHelper<MachineMasterType>();

export default function MachineMaster() {
  const [selectedRow, setSelectedRow] = useState<MachineMasterType | null>(null);
  const [selectedIds] = useState<number[]>([]);
  const [isEmpAddOpen, setIsEmpAddOpen] = useState(false);
  const [isEditSlierOpen, setIsEditSlierOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<MachineMasterType | null>(null);
  const [data, setData] = useState<MachineMasterType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const token = localStorage.getItem('authToken');

  // Single pagination state controlled by TanStack Table
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isSelected = (tourid: number) => selectedIds.includes(tourid);

  const closeEmpAdd = () => {
    setSelectedRow(null);
    setIsEmpAddOpen(false);
  };

  const closeEmpEditSlider = () => {
    setSelectedRow(null);
    setIsEditSlierOpen(false);
  };

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
      columnHelper.display({
        id: 'edit',
        header: 'Edit',
        cell: (info) => (
          <IconButton
            aria-label="Edit"
            icon={<FiEdit />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'black', textColor: 'white' }}
            onClick={() => {
              const rowData = info.row.original as MachineMasterType;
                setSelectedRow(rowData);
                setIsEditSlierOpen(true);
            }}
          />
        ),
      }),
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: (info) => {
          const rowData = info.row.original as MachineMasterType;
          return (
            <IconButton
              aria-label="Delete"
              icon={<FaTrash />}
              color="red"
              size="sm"
              variant="ghost"
              _hover={{ bg: 'black', textColor: 'white' }}
              onClick={() => {
                setRowToDelete(rowData);
                setIsDeleteOpen(true);
              }}
            />
          );
        },
      }),
      columnHelper.accessor('machine_brand', {
        header: 'Brand',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('product_type', {
        header: 'Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_model', {
        header: 'Model',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_serial', {
        header: 'Serial',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_location', {
        header: 'Location',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('doc', {
        header: 'Comm Date',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('engine_model', {
        header: 'Engine Model',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('engine_serial', {
        header: 'Engine Serial',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('customer_name', {
        header: 'Customer Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('principal_company', {
        header: 'Principal Company',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('old_hmr', {
        header: 'Old HMR',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('hmr', {
        header: 'Last HMR',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('hmr_date', {
        header: 'Last HMR Date',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('sales_dealer', {
        header: 'Sales Dealer',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('service_dealer', {
        header: 'Service Dealer',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_status', {
        header: 'Status',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('warranty_status', {
        header: 'Warranty?',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('warranty_type', {
        header: 'Warranty Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('warranty_type_code', {
        header: 'Warranty Code',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('rma_type', {
        header: 'RMA Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person', {
        header: 'Contact Person',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person_no', {
        header: 'Contact Phone',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person_email', {
        header: 'Contact Email',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('caretrack_activated', {
        header: 'Caretrack?',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('csa_type', {
        header: 'CSA Type',
        cell: (info) => info.getValue(),
      }),
    ],
    [isSelected],
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: total ? Math.ceil(total / pagination.pageSize) : -1,
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const showAddEmpSlider = async () => {
    setIsLoading(true);
    try {
      setIsEmpAddOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetch = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        per_page: pagination.pageSize.toString(),
      });

      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(
        `${apiUrl}/api/touradmin/machine-master?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, token]);

  function fetchDataAgain(): void {
    void handleFetch();
  }

  useEffect(() => {
    void handleFetch();
  }, [handleFetch]);

  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(
        `${apiUrl}/touradmin/delete-machine`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'machine_id':rowToDelete.id}),
        },
      );

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      await handleFetch();

      toast({
        title: 'Deleted',
        description: `Machine ${rowToDelete.id} marked as deleted`,
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
      <Flex
        justify="space-between"
        align="center"
        w="full"
        as="nav"
        aria-label="Breadcrumb"
        mb={2}
      >
        <HStack spacing={2} alignItems="center">
          <Link
            href="/dashboard"
            fontSize="sm"
            fontWeight="bold"
            color="blue.500"
          >
            Home
          </Link>
          <Text color="gray.500" m={0}>
            /
          </Text>
          <Text fontWeight="bold" fontSize="sm">
            Machines
          </Text>
          <Text color="gray.500">/</Text>
          <Text fontWeight="bold" fontSize="sm">
            List
          </Text>
        </HStack>

        <HStack spacing={2}>
          <Button colorScheme="pink" onClick={handleFetch} h={8} fontSize="sm">
            <FaRecycle />
            <Spacer w={2} />
            Refresh
          </Button>
          <Button
            colorScheme="blue"
            onClick={showAddEmpSlider}
            h={8}
            fontSize="sm"
          >
            <FaCircle />
            <Spacer w={2} />
            Add Machine
          </Button>
        </HStack>
      </Flex>

      <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
        {/* Table */}
        <Box overflow="auto">
          <Table
            size="sm"
            minW="1200px"
            variant="striped"
            colorScheme="blue"
            maxH="50vh"
          >
            <Thead bg="gray.700" top={0} zIndex={1}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
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
          </Table>

          <TableLoader
            isLoading={isLoading}
            message="Loading..."
            size="lg"
          />
        </Box>

        {/* Pagination controls */}
        <Flex
          justify="space-between"
          align="center"
          w="full"
          mt={2}
        >
          <HStack spacing={2} alignItems="center">
            <IconButton
              bgColor="black"
              color="white"
              borderColor="gray"
              aria-label="Previous"
              icon={<FiChevronLeft />}
              onClick={() => table.previousPage()}
              isDisabled={!canPrev}
              size="sm"
            />
            <IconButton
              bgColor="black"
              color="white"
              borderColor="gray"
              aria-label="Next"
              icon={<FiChevronRight />}
              onClick={() => table.nextPage()}
              isDisabled={!canNext}
              size="sm"
            />
            <Text fontSize="sm">
              Page {pageIndex + 1} of {table.getPageCount() || 1}
            </Text>
          </HStack>

          <HStack spacing={2} alignItems="center">
            <Text fontSize="sm">Rows per page:</Text>
            <ChakraSelect
              bgColor="yellow.100"
              size="sm"
              width="80px"
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                table.setPageSize(newSize);
                table.setPageIndex(0);
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
        </Flex>

        <AddMachineSlider
          isOpen={isEmpAddOpen}
          onClose={closeEmpAdd}
          initialData={selectedRow}
          onUpdated={fetchDataAgain}
        />
        <EditMachineSlider
          isOpen={isEditSlierOpen}
          onClose={closeEmpEditSlider}
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

