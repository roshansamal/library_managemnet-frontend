// src/pages/FilteredTablePage.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, TableContainer } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Table,
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
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa6';
import { ChevronRightIcon } from '@chakra-ui/icons/ChevronRight';
import TableLoader from '../../components/TableLoader';
import type { MachineMasterType } from '../../types/MachineMasterType';

type ApiResponse = {
  data: MachineMasterType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<MachineMasterType>();

export default function RevenueAddBill() {
  // const [fromDate, setFromDate] = useState('');
  // const [toDate, setToDate] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<MachineMasterType[]>([]);
  const [pageIndex, setPageIndex] = useState(0); // zero-based
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [agingHours, setAgingHours] = useState<'0-5000'|'5001-10000'|'10001-15000'|'15001-20000'|'20000'>('0-5000');
  //const [agingHours, setAgingHours] = useState<5000|10000|15000|20000>(5000);

  // ✅ FIXED: Stable fetch function with useCallback
  const handleFetch = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    try {
      console.log("Aging Hours",agingHours);
      const res = await fetch('/api/tourbill/machine-aging-report', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'aging_hours':agingHours,
          'page': page + 1, // Laravel uses 1-based pages
          'per_page': size 
        }),
      });
      
      if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
      }
      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotal(json.total);
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, [agingHours]); // ✅ Dependencies included

  // ✅ FIXED: Stable event handlers - NO inline calls!
  const handleApplyFilters = useCallback(() => {
    handleFetch(0, pageSize);
  }, [handleFetch, pageSize,agingHours]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      const newPage = pageIndex - 1;
      setPageIndex(newPage);
      handleFetch(newPage, pageSize);
    }
  }, [pageIndex, pageSize, handleFetch]);

  const handleNextPage = useCallback(() => {
    const pageCount = Math.ceil(total / pageSize);
    if (pageIndex < pageCount - 1) {
      const newPage = pageIndex + 1;
      setPageIndex(newPage);
      handleFetch(newPage, pageSize);
    }
  }, [pageIndex, pageSize, total, handleFetch]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPageIndex(0); // Reset to first page
    handleFetch(0, newSize);
  }, [handleFetch]);

  // ✅ Load initial data on mount
  useEffect(() => {
    handleFetch(0, pageSize);
  }, []); // Empty deps = only on mount

  // ✅ FIXED: Serial number calculation - stable
  const getSerialNo = useCallback((rowIndex: number) => {
    return (pageIndex * pageSize) + rowIndex + 1;
  }, [pageIndex, pageSize]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'serial',
        header: 'SL',
        cell: ({ row }) => {
          if (data.length === 0) return null;
          return getSerialNo(row.index);
        },
      }),
      columnHelper.accessor('machine_brand', {
        header: 'Machine Brand',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('product_type', {
        header: 'Machine Type',
        cell: (info) => `${info.getValue()}`,
      }),
      columnHelper.accessor('machine_model', {
        header: 'Machine Model',
        cell: (info) => `${info.getValue()}`,
      }),
      columnHelper.accessor('machine_serial', {
        header: 'Machine Serial',
        cell: (info) => `${info.getValue()}`,
      }),
      columnHelper.accessor('hmr', {
        header: 'HMR',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('hmr_date', {
        header: 'HMR Date',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('machine_location', {
        header: 'Machine Location',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('doc', {
        header: 'DOC',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('engine_model', {
        header: 'Engine Model',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('engine_serial', {
        header: 'Engine Serial',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('customer_name', {
        header: 'Customer',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('sales_dealer', {
        header: 'Sales Dealer',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('service_dealer', {
        header: 'Service Dealer',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('warranty_status', {
        header: 'Warranty Status',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('warranty_type_code', {
        header: 'Warranty Code',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('rma_type', {
        header: 'RMA Type',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('contact_person', {
        header: 'Contact Person',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('contact_person_no', {
        header: 'Contact Phone',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('contact_person_email', {
        header: 'Contact Mail',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('caretrack_activated', {
        header: 'Care Track',
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor('csa_type', {
        header: 'CSA',
        cell: (info) => info.getValue() as string,
      }),
    ],
    [getSerialNo] // ✅ Stable dependency
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize) || -1,
  });

  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <>
      <Breadcrumb spacing="1" separator={<ChevronRightIcon />} fontWeight="semibold" fontSize={"sm"} mb={1} color={"blue.700"}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/revenue">Revenue</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Add Bill</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {/* <HStack spacing={1} mb={1} align="flex-start" justifyContent={"center"}>
        <Box>
          <HStack ml={"1"}>
            <Text fontSize="sm">Age(Hours):</Text>
            <ChakraSelect
              bg="orange.100"
              size="sm"
              value={agingHours}
              onChange={(e) => {
                setAgingHours(e.target.value as '0-5000'|'5001-10000'|'10001-15000'|'15001-20000'|'20000');
                }
              } 
            >
              <option value="0-5000">Less Than 5000</option>
              <option value="5001-10000">Between 5001 Than 10,000</option>
              <option value="10001-15000">Between 10,001 Than 15,000</option>
              <option value="15001-20000">Between 15,001 Than 20,000</option>
              <option value="20000">More Than 20,000</option>
            </ChakraSelect>
          </HStack>
        </Box> */}
        {/* ✅ FIXED: Stable handler reference */}
        {/* <Button 
          colorScheme="blue" 
          onClick={handleApplyFilters} 
          h={8} 
          fontWeight={"normal"} 
          variant="solid"
          isLoading={isLoading}
        >
          Apply
        </Button>
        <HStack mb={0} h={8} p={0}>
          <IconButton 
            colorScheme="blue" 
            variant="outline" 
            aria-label="Export Excel"
            icon={<FaFileExcel/>}
            size="sm"
          />
          <IconButton 
            colorScheme="green" 
            variant="outline" 
            aria-label="Export CSV"
            icon={<FaFileCsv />}
            size="sm"
          />
          <IconButton 
            colorScheme="red" 
            variant="outline" 
            aria-label="Export PDF"
            icon={<FaFilePdf/>}
            size="sm"
          />
        </HStack>
      </HStack> */}

      {/* <TableContainer
        maxH="80vh"
        overflowX={{ base: "auto", md: "auto" }}
        overflowY="auto"
        w="full"
        whiteSpace="nowrap"
        minH="80vh"
      >
        <Table
          size="sm"
          variant="striped"
          colorScheme="blackAlpha"
          maxH="60vh"
          w="100vw"
          minW={{ base: "800px", md: "max-content" }}
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
                  <Text textAlign="left" py={4} color={"gray"}>
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
                <HStack justify="flex-start" align="start">
                  <HStack>
                    <IconButton
                      aria-label="Previous page"
                      icon={<FiChevronLeft />}
                      size="sm"
                      onClick={handlePrevPage}
                      isDisabled={!canPrev}
                      bg={"black"}
                      color={"white"}
                    />
                    <IconButton
                      aria-label="Next page"
                      icon={<FiChevronRight />}
                      size="sm"
                      onClick={handleNextPage}
                      isDisabled={!canNext}
                      bg={"black"}
                      color={"white"}
                    />
                    <Text fontSize="sm">
                      Page {pageIndex + 1} of {pageCount}
                    </Text>
                  </HStack>
                  <HStack ml={"20"}>
                    <Text fontSize="sm">Rows per page:</Text>
                    <ChakraSelect
                      bg={"cyan.100"}
                      size="sm"
                      width="80px"
                      value={pageSize}
                      onChange={handlePageSizeChange} // ✅ FIXED: Stable handler
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
      </TableContainer> */}
    </>
  );
}
