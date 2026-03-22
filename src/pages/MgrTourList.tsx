// src/pages/FilteredTablePage.tsx
// import {
//   Drawer,
//   DrawerBody,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   useDisclosure,
// } from '@chakra-ui/react';
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
import { FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import {  FaCheck, FaCheckDouble, FaFilter, FaLocationDot,  } from 'react-icons/fa6';
// import { MdOutlineApproval } from 'react-icons/md';
// import { FcApproval } from 'react-icons/fc';
// import { RiEjectFill } from 'react-icons/ri';
// import { GiCancel, GiReturnArrow } from 'react-icons/gi';

type ApiResponse = {
  data: RecordItem[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<RecordItem>();
// import EditSlider from '../components/EditSlider';
import type { RecordItem } from '../types/RecordItem';
// import EditSlider from '../components/EditTourSlider';
// import { FaUndo } from 'react-icons/fa';
import ViewTourSlider from '../components/ViewTourSlider';
// import EditTourSlider from '../components/EditTourSlider';
// import ViewGpsSlider from '../components/ViewGpsSlider';
//import ApproveTourSlider from '../components/ApproveTourSlider';
// import { GrReturn } from 'react-icons/gr';

export default function MgrTourList() {
  // Used for Side Drawer Start
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [setEditingRow] = useState<RecordItem | null>(null);
  const [reloadKey, setReloadKey] = useState(0); //For Forcing Screen Update
  //--------------------------------
  //Used for Edit Slide Drawer
  const [selectedRow, setSelectedRow] = useState<RecordItem | null>(null);
  // const [ setIsTourEditOpen] = useState(false);
  // const openTourEdit = (row: RecordItem) => {
  //   setSelectedRow(row);
  //   setIsTourEditOpen(true);
  // };
  // const closeTourEdit = () => {
  //   setIsTourEditOpen(false);
  //   setSelectedRow(null);
  // };
  function fetchDataAgain(): void {
    throw new Error('Function not implemented.');
  }
  //---Tour View Slider Begin Here-----------------------------
  const [isTourViewOpen, setIsTourViewOpen] = useState(false);
  const openTourView = (row: RecordItem) => {
    setSelectedRow(row);
    setIsTourViewOpen(true);
  };
  const closeTourView = () => {
    setIsTourViewOpen(false);
    setSelectedRow(null);
  };
  //---Tour View Slider Ends Here-----------------------------
  //---Tour Gps Slider Begin Here-----------------------------
  // const [isTourGpsOpen, setIsTourGpsOpen] = useState(false);
  const openTourGps = (row: RecordItem) => {
    setSelectedRow(row);
    // setIsTourGpsOpen(true);
  };
  // const closeTourGps = () => {
  //   setIsTourGpsOpen(false);
  //   setSelectedRow(null);
  // };
  //---Tour Gps Slider Ends Here-----------------------------
  //---Tour Approval Slider Begin Here-----------------------------
  // const [isTourApprovalOpen, setIsTourApprovalOpen] = useState(false);
  const openTourApproval = (row: RecordItem) => {
    setSelectedRow(row);
    // setIsTourApprovalOpen(true);
  };
  // const closeTourApproval = () => {
  //   setIsTourApprovalOpen(false);
  //   setSelectedRow(null);
  // };
  //---Tour Approval Slider Ends Here-----------------------------

  const handleApproveSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      // Optional: confirm
      const ok = window.confirm(
        `Approve ${selectedIds.length} selected tours?`,
      );
      if (!ok) return;
      const res = await fetch('/api/tours/mgr-bulk-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedIds,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to approve selected tours');
      }
      // After success: refetch table and clear selection
      // simplest: just reset pageIndex or bump a reload counter
      setPageIndex(0); // triggers useEffect fetch because dependency
      setSelectedIds([]);
      setReloadKey((k) => k + 1); // forces useEffect to run
    } catch (err) {
      console.error(err);
      alert('Approve failed. Please try again.'+err);
    }
  };
  //--------------------------------------------------
  // const handleTourEditClick = (row: RecordItem) => {
  //   setEditingRow(row);
  //   onOpen();
  // };
  //   const handleTourViewClick = (row: RecordItem) => {
  //   setEditingRow(row);
  //   setIsTourViewOpen(true);
  //   onOpen();
  // };
  // const handleReturnClick = (row: RecordItem) => {
  //   setEditingRow(row);
  //   onOpen();
  // };

  
  // Used for Side Drawer End
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

  // ---- Row selector state ----
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isSelected = (id: number) => selectedIds.includes(id);
  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : data.map((r) => r.id));
  };
  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  // ----------------------------

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
        const res = await fetch(`/api/tours/mgr_pending_tour_approval?${params.toString()}`, {
          method: 'GET',              // make sure this matches Postman
          headers: { 'Accept': 'application/json' },
        });
        //------------------------------
        if (!res.ok) throw new Error('Failed to fetch data');
        const json: ApiResponse = await res.json();
        setData(json.data);
        setTotal(json.total);
        // reset selection when page/data changes (optional but safer)
        setSelectedIds([]);
        //console.log(json.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [
    appliedFilters,
    pageIndex,
    pageSize,
    sortParam.sort_by,
    sortParam.sort_dir,
    reloadKey, //This reloadKey is important to refresh the table rows
  ]);

  // Columns, including selection column
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />
        ),
        cell: ({ row }) => {
          const rowId = row.original.id;
          return (
            <input
              type="checkbox"
              checked={isSelected(rowId)}
              onChange={() => toggleOne(rowId)}
            />
          );
        },
      }),
      columnHelper.accessor('id', {
        header: 'TourId',
        cell: (info) => JSON.stringify(info.getValue()),
      }),
      // columnHelper.display({
      //   id: 'edit',
      //   header: 'Edit',
      //   cell: (info) => {
      //     // const rowData = info.row.original;
      //     return (
      //       <IconButton
      //         aria-label="Edit"
      //         icon={<FiEdit />}
      //         size="sm"
      //         variant="ghost"
      //         _hover={{bg:"black",textColor:"white"}}
      //         onClick={() => {
      //           //openTourEdit(rowData)
      //         }}
      //       />
      //     );
      //   },
      // }),

      columnHelper.display({
        id: 'view',
        header: 'View',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              aria-label="View"
              icon={<FiEye />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                openTourView(rowData)
              }}
            />
          );
        },
      }),

      columnHelper.display({
        id: 'gps',
        header: 'GPS',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              color="red"
              aria-label="GPS"
              icon={<FaLocationDot />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                openTourGps(rowData)
              }}
            />
          );
        },
      }),
      columnHelper.display({
        id: 'approve',
        header: 'Approve',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              color="blue"
              aria-label="APPROVE"
              icon={<FaCheck />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                openTourApproval(rowData)
              }}
            />
          );
        },
      }),
      // columnHelper.display({
      //   id: 'return',
      //   header: 'Return',
      //   cell: (info) => {
      //     // const rowData = info.row.original;
      //     return (
      //       <IconButton
      //         color="black"
      //         aria-label="RETURN"
      //         icon={<FaUndo />}
      //         size="sm"
      //         variant="ghost"
      //         _hover={{bg:"black",textColor:"white"}}
      //         onClick={() => {
      //           //handleReturnClick(rowData)
      //         }}
      //       />
      //     );
      //   },
      // }),

      columnHelper.accessor('userid', {
        header: 'UserId',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('submitted_on', {
        header: 'Submitted On',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('customer_name', {
        header: 'Customer Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('purpose_of_visit', {
        header: 'Purpose of Visit',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_model', {
        header: 'Model No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_serial', {
        header: 'Serial No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('complaint_dtls', {
        header: 'Complaint',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('service_type', {
        header: 'Service Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('travel_from', {
        header: 'Travel From',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('travel_to', {
        header: 'Travel To',
        cell: (info) => info.getValue(),
      }),
    ],
    [allSelected, isSelected, toggleAll, toggleOne],
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

  const handleApplyFilters = () => {
    setAppliedFilters({
      from: fromDate,
      to: toDate,
      search: search,
    });
    setPageIndex(0);
  };

  return (
    <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
      {/* Filters */}
      <HStack spacing={1} mb={4} align="flex-end">
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            From Date
          </Text>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate || undefined}
            bg="orange.100"
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
            bg="orange.100"
          />
        </Box>
        <Box flex="1">
          <Text mb={1} fontSize="sm" fontWeight="medium">
            Search
          </Text>
          <Input
            bg="cyan.100"
            placeholder="Search by customer, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Button colorScheme="gray" onClick={handleApplyFilters} >
          <FaFilter/>
        </Button>
        <Button
          colorScheme="green"
          isDisabled={selectedIds.length === 0}
          onClick={handleApproveSelected}
        >
          <FaCheckDouble/> ({selectedIds.length})
        </Button>
      </HStack>

      {/* Table */}
      <Box overflow="auto">
        <Table
          size="sm"
          minW="1200px"
          variant="striped"
          colorScheme="gray"
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
                    <IconButton
                      aria-label="Previous page"
                      icon={<FiChevronLeft />}
                      size="sm"
                      onClick={() => canPrev && setPageIndex((p) => p - 1)}
                      isDisabled={!canPrev}
                      bg={"black"}
                      color={"white"}
                    />
                    <IconButton
                      aria-label="Next page"
                      icon={<FiChevronRight />}
                      size="sm"
                      onClick={() => canNext && setPageIndex((p) => p + 1)}
                      isDisabled={!canNext}
                      bg={"black"}
                      color={"white"}
                    />
                    <Text fontSize="sm">
                      Page {pageIndex + 1} of {pageCount}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm">Rows per page:</Text>
                    <ChakraSelect
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
                    </ChakraSelect>
                    <Text fontSize="sm">Total: {total}</Text>
                  </HStack>
                </HStack>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    {/* All Individual Sliers Are Specified Here */}
    {/* <EditTourSlider
      isOpen={isTourEditOpen}
      onClose={closeTourEdit}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    /> */}
    <ViewTourSlider
      isOpen={isTourViewOpen}
      onClose={closeTourView}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />
    {/* <ViewGpsSlider
      isOpen={isTourGpsOpen}
      onClose={closeTourGps}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    /> */}
    {/* <ApproveTourSlider
      isOpen={isTourApprovalOpen}
      onClose={closeTourApproval}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />; */}
    </Box>
    
  );
}



