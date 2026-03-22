// src/pages/FilteredTablePage.tsx
import {  Breadcrumb, BreadcrumbItem, BreadcrumbLink, TableContainer,  } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  HStack,
  Input,
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
  type Row,
  type SortingState,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight,} from 'react-icons/fi';
import { FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa6';
import { ChevronRightIcon } from '@chakra-ui/icons/ChevronRight';
import type { UtilizationType } from '../../types/UtilizationType';
import TableLoader from '../../components/TableLoader';

type ApiResponse = {
  data: UtilizationType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<UtilizationType>();
export default function EngineersUtilization() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<UtilizationType[]>([]);
  const [pageIndex, setPageIndex] = useState(0); // zero-based
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const useSerialNumber = (pageIndex: number, pageSize: number) => {
    return useCallback(
      ({ row }: { row: Row<UtilizationType> }) => {
        return (pageIndex * pageSize) + row.index + 1;
      },
      [pageIndex, pageSize]
    );
  };

// In your component:
const getSerialNo = useSerialNumber(pageIndex, pageSize);

  // useEffect(() => {
  //   handleFetch(pageIndex, pageSize);  // Include pagination params
  // }, [pageIndex, pageSize, fromDate, toDate]);  // Add dependencies

  useEffect(() => {
    //handleFetch(pageIndex, pageSize);  // Single call handles all state
  }, [pageIndex, pageSize]);  // Stable callback dependency


  const columns = useMemo(
    () => [
      // columnHelper.display({
      //   id: 'serial',
      //   header: 'SL',
      //   cell: ({ row }) => (
      //     <Text fontWeight="medium">{getSerialNo({ row })}</Text>
      //   ),
      // }),
      columnHelper.display({
        id: 'serial',
        header: 'SL',
        cell: ({ row }) => {
          if (data.length === 0) return null;  // Hide during loading
          const serial = (pageIndex * pageSize) + row.index + 1;
          return serial;
        },
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('userid', {
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('Warranty', {
        header: 'Warranty Tours',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('Revenue', {
        header: 'Revenue Tours',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('Goodwill', {
        header: 'Goodwill Tours',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('CSA', {
        header: 'CSA Tours',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('total_tours', {
        header: 'Total Tours',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('from_date', {
        header: 'From Date',
        //cell: fromDate
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('to_date', {
        header: 'To Date',
        //cell: (info) => info.getValue(),
        cell: toDate
        // cell: toDate(info) => {
        //   const status = info.getValue();  // Direct string/number
        //   return ({toDate});
        //   // return <Badge colorScheme={status === 'active' ? 'green' : 'red'}>
        //   //   {toDate}
        //   // </Badge>;
        // },
      }),
    ],
    [getSerialNo]
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

  const handleFetch = async (pageIndex: number, pageSize: number) => {
    setIsLoading(true);  // Show spinner FIRST
    //setData([]);  
    try {
      //setIsLoading(true);
      const res = await fetch('/api/tourbill/engineers-utilization', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            //Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            "date_from":fromDate,
            "date_to":toDate,
            "page": pageIndex + 1,     // Laravel uses 1-based pages
            "per_page": pageSize 
          }),
        });
      if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
      }
      const json: ApiResponse = await res.json(); // { data, total, ... }
      //console.log(json);
      setData(json.data);
      setTotal(json.total);
      // setSelectedIds([]);          // optional reset
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Breadcrumb spacing="1" separator={<ChevronRightIcon />} fontWeight="semibold" fontSize={"sm"} 
      mb={1} color={"blue.700"}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/report">Report</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>Engineers Utilization</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <HStack spacing={1} mb={1} align="flex-start" justifyContent={"center"}>
      <Box>
          {/* <Text mb={1} fontSize="sm" fontWeight="medium">
            From Date
          </Text> */}
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || undefined}
            bg="cyan.100"
            h={"8"}
          />
        </Box>
        <Box>
          {/* <Text mb={1} fontSize="sm" fontWeight="medium">
            To Date
          </Text> */}
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
            bg="cyan.100"
            h={"8"}
          />
        </Box>
      {/* <Button colorScheme="blue" onClick={handleFetch(0,10)} h={8} fontWeight={"normal"} variant="solid">
        Apply
      </Button> */}
      <HStack mb={0} h={8} p={0}>
        <IconButton 
          colorScheme="blue" 
          variant="outline" 
          aria-label="Export CSV"
          icon={<FaFileExcel/>}
          size="sm" // or xs for smaller
        />
        <IconButton 
          colorScheme="green" 
          variant="outline" 
          aria-label="Export CSV"
          icon={<FaFileCsv />}
          size="sm" // or xs for smaller
        />
        <IconButton 
          colorScheme="red" 
          variant="outline" 
          aria-label="Export CSV"
          icon={<FaFilePdf/>}
          size="sm" // or xs for smaller
        />
      </HStack>
    </HStack>

    <TableContainer
      maxH="80vh"
      overflowX={{ base: "auto", md: "auto" }}  // Always scroll on mobile
      overflowY="auto"
      w="full"
      whiteSpace="nowrap"  // Prevent text wrap
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
                      // onClick={() => canPrev && setPageIndex((p) => p - 1)}
                      onClick={() => {
                        if (canPrev) {
                          setPageIndex((p) => p - 1);
                          handleFetch(pageIndex - 1, pageSize);  // Fetch previous page
                        }
                      }}
                      isDisabled={!canPrev}
                      bg={"black"}
                      color={"white"}
                    />
                    <IconButton
                      aria-label="Next page"
                      icon={<FiChevronRight />}
                      size="sm"
                      // onClick={() => canNext && setPageIndex((p) => p + 1)}
                      onClick={() => {
                        if (canNext) {
                          setPageIndex((p) => p + 1);
                          handleFetch(pageIndex + 1, pageSize);  // Fetch next page
                        }
                      }}
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
                      // onChange={(e) => {
                      //   setPageSize(Number(e.target.value));
                      //   setPageIndex(0);
                      // }}
                      onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setPageSize(newSize);
                        setPageIndex(0);  // Reset to first page
                        handleFetch(0, newSize);  // Fetch with new page size
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
        {/* Small overlay box - centered in table */}
        {/* {isLoading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="2xl"
            border="2px solid"
            borderColor="gray.200"
            zIndex="docked"  // Above table but below modals
            minW="200px"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Spinner size="lg" color="blue.500" thickness="3px" />
              <Text fontSize="md" fontWeight="medium" color="gray.700">
                Loading data...
              </Text>
            </VStack>
          </Box>
        )} */}

        {/* {isLoading && (
        <Center
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="lg"
          zIndex={10}
          minW="120px"
        >
          <VStack spacing={2}>
            <Spinner size="md" />
            <Text fontSize="sm">Loading...</Text>
          </VStack>
        </Center>
      )} */}

      {/* Reusable loader - 1 line! */}
      <TableLoader 
        isLoading={isLoading}
        message="Loading..."
        size="lg"
      />
    </TableContainer>
    </>
  );
}
