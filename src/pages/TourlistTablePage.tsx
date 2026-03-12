// src/pages/FilteredTablePage.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
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
  Select,
  Spinner,
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

type RecordItem = {
  id: number;
  date: string;
  customer: string;
  amount: number;
};

type ApiResponse = {
  data: RecordItem[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<RecordItem>();

const columnsDef = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('customer', {
    header: 'Customer',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => info.getValue().toFixed(2),
  }),
];

export default function TourlistTablePage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    from: '',
    to: '',
    search: '',
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<RecordItem[]>([]);
  const [pageIndex, setPageIndex] = useState(0); // zero-based
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Derive sort params for backend
  const sortParam = sorting[0]
    ? {
        sort_by: sorting[0].id,
        sort_dir: sorting[0].desc ? 'desc' : 'asc',
      }
    : { sort_by: '', sort_dir: '' };

  // Fetch data from Laravel API whenever filters/pagination/sort change
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (appliedFilters.from) params.append('from', appliedFilters.from);
        if (appliedFilters.to) params.append('to', appliedFilters.to);
        if (appliedFilters.search) params.append('search', appliedFilters.search);

        params.append('page', String(pageIndex + 1)); // Laravel 1-based
        params.append('per_page', String(pageSize));
        if (sortParam.sort_by) {
          params.append('sort_by', sortParam.sort_by);
          params.append('sort_dir', sortParam.sort_dir);
        }

        const res = await fetch(`/api/records?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to fetch data');

        const json: ApiResponse = await res.json();

        setData(json.data);
        setTotal(json.total);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [appliedFilters, pageIndex, pageSize, sortParam.sort_by, sortParam.sort_dir]);

  const table = useReactTable({
    data,
    columns: useMemo(() => columnsDef, []),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // client-side sort if needed
    manualSorting: true, // we send sort to backend
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize) || -1,
  });

  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  const handleApplyFilters = () => {
    setAppliedFilters({
      from: fromDate,
      to: toDate,
      search: search,
    });
    setPageIndex(0);
  };

  return (
    <Box>
      {/* Top filter row */}
      <HStack spacing={4} mb={4} align="flex-end">
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            From Date
          </Text>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || undefined}
          />
        </Box>
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            To Date
          </Text>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
          />
        </Box>
        <Box flex="1">
          <Text mb={1} fontSize="sm" fontWeight="medium">
            Search
          </Text>
          <Input
            placeholder="Search by customer, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Button colorScheme="blue" onClick={handleApplyFilters}>
          Apply Filter
        </Button>
      </HStack>

      {/* Table section */}
      <Box borderWidth="1px" borderRadius="md" overflow="hidden">
        {isLoading && (
          <HStack p={4}>
            <Spinner size="sm" />
            <Text>Loading...</Text>
          </HStack>
        )}

        <Table size="sm">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false
                  return (
                    <Th
                      key={header.id}
                      cursor={canSort ? 'pointer' : 'default'}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      whiteSpace="nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
                <Td colSpan={columnsDef.length}>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td colSpan={columnsDef.length}>
                <HStack justify="space-between" align="center">
                  <HStack>
                    <IconButton
                      aria-label="Previous page"
                      icon={<FiChevronLeft />}
                      size="sm"
                      onClick={() => canPrev && setPageIndex((p) => p - 1)}
                      isDisabled={!canPrev}
                    />
                    <IconButton
                      aria-label="Next page"
                      icon={<FiChevronRight />}
                      size="sm"
                      onClick={() => canNext && setPageIndex((p) => p + 1)}
                      isDisabled={!canNext}
                    />
                    <Text fontSize="sm">
                      Page {pageIndex + 1} of {pageCount}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm">Rows per page:</Text>
                    <Select
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
                    </Select>
                    <Text fontSize="sm">Total: {total}</Text>
                  </HStack>
                </HStack>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Box>
  );
}
