import { Spacer } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
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
  // type Row,
  type SortingState,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight, FiEdit,  } from 'react-icons/fi';
// import { FaCheck, FaLocationDot, FaRecycle } from 'react-icons/fa6';
// import { useToast } from '@chakra-ui/react';
import type { TourMasterType } from '../../types/TourMasterType';
import { FaSearch } from 'react-icons/fa';
import TourStatusSlider from '../../components/admin/TourStatusSlider';

type ApiResponse = {
  data: TourMasterType[];
  // current_page: number;
  // per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<TourMasterType>();

export default function ChangeTourStatus() {
  // const toast = useToast();
  // const [rows, setRows] = useState<TourMasterType[]>([]);
  // type UserOption = { userid: string };
  // const [users, setUsers] = useState<UserOption[]>([]);
  // const [username, setUsername] = useState('');
  const [tourId, setTourId] = useState('');
  // const [editingRow, setEditingRow] = useState<TourMasterType | null>(null);
  const [selectedRow, setSelectedRow] = useState<TourMasterType | null>(null);
  const token = localStorage.getItem('authToken');

  function fetchDataAgain(): void {
    handleFetch();
  }
  //---Tour View Slider Begin Here-----------------------------
  const [isTourStatusOpen, setIsTourStatusOpen] = useState(false);
  const openTourStatus = (row: TourMasterType) => {
    setSelectedRow(row);
    setIsTourStatusOpen(true);
  };
  const closeTourStatus = () => {
    setSelectedRow(null);
    setIsTourStatusOpen(false);
  };
  //---Tour View Slider Ends Here-----------------------------
  // //---Tour Gps Slider Begin Here-----------------------------
  // const [isTourGpsOpen, setIsTourGpsOpen] = useState(false);
  // const openTourGps = (row:TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsTourGpsOpen(true);
  // };
  // const closeTourGps = () => {
  //   setIsTourGpsOpen(false);
  //   setSelectedRow(null);
  // };
  

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TourMasterType[]>([]);
  const [pageIndex, setPageIndex] = useState(0); // zero-based
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ---- Row selector state ----
  // const [setSelectedIds] = useState<number[]>([]);
   const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'TourId',
        cell: (info) => JSON.stringify(info.getValue()),
      }),
      columnHelper.display({
        id: 'tour',
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
                openTourStatus(rowData)
              }}
            />
          );
        },
      }),
      // columnHelper.display({
      //   id: 'view',
      //   header: 'View',
      //   cell: (info) => {
      //     const rowData = info.row.original;
      //     return (
      //       <IconButton
      //         aria-label="View"
      //         icon={<FiEye />}
      //         size="sm"
      //         variant="ghost"
      //         _hover={{bg:"black",textColor:"white"}}
      //         onClick={() => {
      //           //openTourView(rowData)
      //         }}
      //       />
      //     );
      //   },
      // }),

      // columnHelper.display({
      //   id: 'gps',
      //   header: 'GPS',
      //   cell: (info) => {
      //     const rowData = info.row.original;
      //     return (
      //       <IconButton
      //         color="red"
      //         aria-label="GPS"
      //         icon={<FaLocationDot />}
      //         size="sm"
      //         variant="ghost"
      //         _hover={{bg:"black",textColor:"white"}}
      //         onClick={() => {
      //           //openTourGps(rowData)
      //         }}
      //       />
      //     );
      //   },
      // }),
      columnHelper.accessor('ticket_status', {
        header: 'Ticket Status',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('userid', {
        header: 'Engineer',
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
        header: 'Purpose Of Visit',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_model', {
        header: 'Machine Model',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('machine_serial', {
        header: 'Machine Serial',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('complaint_dtls', {
        header: 'Complaint Details',
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
      columnHelper.accessor('mode_of_travel', {
        header: 'Mode Of Travel',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('visiting_role', {
        header: 'Visiting Role',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('team_members', {
        header: 'Team Members',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tour_start_date', {
        header: 'Tour Start Date',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tour_end_date', {
        header: 'Tour End Date',
        cell: (info) => info.getValue(),
      }),
    ],
    [data]
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

  const handleFetch = async () => {
    try {
      //console.log(tourId);
      setIsLoading(true);

      // const res = await fetch(`/api/tourbill/admin/tourinfo/${tourId.toString()}`, {
      //     method: 'GET',
      //     credentials: 'include',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       //Authorization: `Bearer ${token}`,
      //     },
      //   });
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/touradmin/tourinfo/${tourId.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
      }
      const json: ApiResponse = await res.json(); // { data, total, ... }
      console.log(json);
      setData(json.data);
      //setData(json ? [json] : []);  // ✅ wrap in array for table
      // setTotal(json.total);
      setTotal(json ? 1 : 0);
      // setSelectedIds([]);          // optional reset
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" >
      <HStack spacing={1} as="nav" aria-label="Breadcrumb">
        <Text fontWeight="normal" fontSize={"sm"} color="black">Admin</Text>
        <Text color="gray.500">/</Text>
        <Text fontWeight="normal" fontSize={"sm"} color="black">Change Tour Status</Text>
      </HStack>
      <HStack spacing={1} as="nav" aria-label="Breadcrumb">
        <Input
          textAlign={'center'}
          type='number'
          p={1} h={8}
          width={"20"}
          value={tourId}
          onChange={(e) => setTourId(e.target.value)}
          bg={"orange.100"}
          //onKeyDown={handleFetch}
        />
      <Button colorScheme="blue" onClick={handleFetch} h={8} fontSize={"sm"} mx={"2"}>
        <FaSearch /><Spacer width={2}/>Search Tour
      </Button>
      </HStack>
    </Box>
    <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
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

    <TourStatusSlider
      isOpen={isTourStatusOpen}
      onClose={closeTourStatus}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />; 

    </Box>
    </>
  );
}
