// src/pages/FilteredTablePage.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Spinner, TableContainer } from '@chakra-ui/react';
// import {
//   Select,
//   useDisclosure,
// } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
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
import { FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { FaLocationDot } from 'react-icons/fa6';
// import { useToast } from '@chakra-ui/react';
import ViewTourDetailsSlider from '../../components/ViewTourDetailsSlider';
import type { TourMasterType } from '../../types/TourMasterType';
import { ChevronRightIcon } from '@chakra-ui/icons/ChevronRight';
// import { MdOutlineApproval } from 'react-icons/md';
// import { FcApproval } from 'react-icons/fc';
// import { RiEjectFill } from 'react-icons/ri';
// import { GiCancel, GiReturnArrow } from 'react-icons/gi';

type ApiResponse = {
  data: TourMasterType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<TourMasterType>();

export default function EngineersAvailable() {
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  //const [selectedUser, setSelectedUser] = useState('');



  // const toast = useToast();
  // const [rows, setRows] = useState<TourMasterType[]>([]);
  // type UserOption = { userid: string };
  // const [users, setUsers] = useState<UserOption[]>([]);
  // const [username, setUsername] = useState('');
  // Used for Side Drawer Start
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [editingRow, setEditingRow] = useState<TourMasterType | null>(null);
  // const [reloadKey, setReloadKey] = useState(0); //For Forcing Screen Update
  //--------------------------------
  //Used for Edit Slide Drawer
  const [selectedRow, setSelectedRow] = useState<TourMasterType | null>(null);
  // const [isTourEditOpen, setIsTourEditOpen] = useState(false);
  // const openTourEdit = (row: TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsTourEditOpen(true);
  // };
  // const closeTourEdit = () => {
  //   setIsTourEditOpen(false);
  //   setSelectedRow(null);
  // };
  function fetchDataAgain(): void {
    handleFetch();
  }
  //---Tour View Slider Begin Here-----------------------------
  const [isTourViewOpen, setIsTourViewOpen] = useState(false);
  const openTourView = (row: TourMasterType) => {
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
  const openTourGps = (row:TourMasterType) => {
    setSelectedRow(row);
    // setIsTourGpsOpen(true);
  };
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isSelected = (tourid: number) => selectedIds.includes(tourid);
  const toggleAll = () => {
    //setSelectedIds(allSelected ? [] : data.map((r) => r.id));
    setSelectedIds(allSelected ? [] : data.map((r) => r.id));
  };
  const toggleOne = (tourid: number) => {
    setSelectedIds((prev) =>
      prev.includes(tourid) ? prev.filter((x) => x !== tourid) : [...prev, tourid],
    );
  };
  
  useEffect(() => {
    handleFetch();
  }, []);
  
  // Columns, including selection column
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'TourId',
        cell: (info) => JSON.stringify(info.getValue()),
      }),
      // columnHelper.display({
      //   id: 'tour',
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
      columnHelper.accessor('ticket_status', {
        header: 'Ticket Status',
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

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tourbill/engineers-available', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            //Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({
          //   "ticket_status":"Mgr Rejected"
          // }),
        });
      if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
      }
      const json: ApiResponse = await res.json(); // { data, total, ... }
      console.log(json);
      setData(json.data);
      setTotal(json.total);
      setSelectedIds([]);          // optional reset
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Breadcrumb spacing="1" separator={<ChevronRightIcon />} fontWeight="normal" fontSize={"sm"} mb={1} color={"blue.700"}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/report">Report</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>Engineers Available</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>

    <TableContainer
      maxH="80vh"
      overflowX={{ base: "auto", md: "auto" }}  // Always scroll on mobile
      overflowY="auto"
      w="full"
      whiteSpace="nowrap"  // Prevent text wrap
    >
      {isLoading && (
          <HStack p={4}>
            <Spinner size="sm" />
            <Text>Loading...</Text>
          </HStack>
        )}
        <Table
          size="sm"
          variant="striped"
          colorScheme="gray"
          maxH="75vh"
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
                  <HStack ml={"20"}>
                    <Text fontSize="sm">Rows per page:</Text>
                    <ChakraSelect
                      bg={"cyan.100"}
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

    </TableContainer>
    {/* <Box borderWidth="1px" borderRadius="md" maxH="600px" overflow="auto" p={1}>
      <Box h="100vh" w="100vw"
        maxH="75vh" 
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',  // Keep horizontal thin
          },
          '&::-webkit-scrollbar:vertical': {
            width: '0px',  // Hide vertical completely
          },
          '&::-webkit-scrollbar:horizontal': {
            height: '8px', // Keep horizontal visible
          },
          scrollbarWidth: 'none',  // Firefox vertical hide
          msOverflowStyle: 'none', // Edge vertical hide
        }}
      >
        {isLoading && (
          <HStack p={4}>
            <Spinner size="sm" />
            <Text>Loading...</Text>
          </HStack>
        )}
        <Table
          size="sm"
          variant="striped"
          colorScheme="gray"
          maxH="50vh"
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
      </Box> */}
    <ViewTourDetailsSlider
      isOpen={isTourViewOpen}
      onClose={closeTourView}
      tourId={selectedRow?.id ?? 0}
      onUpdated={fetchDataAgain}
    />
    {/* <ViewTourBillSlider
      isOpen={isTourViewOpen}
      onClose={closeTourView}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />; */}
    {/* <ViewGpsSlider
      isOpen={isTourGpsOpen}
      onClose={closeTourGps}
      tourId={selectedRow?.id ?? 0}
      onUpdated={fetchDataAgain}
    />; */}
    {/* <MgrTourBillApprovalSlider
      isOpen={isBillApprovalOpen}
      onClose={closeBillApproval}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />;
    <MgrTourBillReturnSlider
      isOpen={isBillReturnOpen}
      onClose={closeBillReturn}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />; */}
    {/* </Box> */}
    </>
  );
}
