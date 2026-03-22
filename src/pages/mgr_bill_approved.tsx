// src/pages/FilteredTablePage.tsx
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  // useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  // Input,
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
import { FiChevronLeft, FiChevronRight,  FiEye } from 'react-icons/fi';
import { FaCheck,  FaFileCsv, FaFileExcel, FaFilePdf, FaFilter, FaLocationDot } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';
// import { MdOutlineApproval } from 'react-icons/md';
// import { FcApproval } from 'react-icons/fc';
// import { RiEjectFill } from 'react-icons/ri';
// import { GiCancel, GiReturnArrow } from 'react-icons/gi';

type ApiResponse = {
  data: TourbillColumns[],
  current_page: number,
  per_page: number,
  total: number
};

const columnHelper = createColumnHelper<TourbillColumns>();
// import { FaDownload, FaUndo } from 'react-icons/fa';
import ViewGpsSlider from '../components/ViewGpsSlider';
import type { TourbillColumns } from '../interfaces/TourbillColumns';
import ViewTourBillSlider from '../components/ViewTourBillSlider';
import ViewTourDetailsSlider from '../components/ViewTourDetailsSlider';
import MgrTourBillApprovalSlider from '../components/MgrTourBillApprovalSlider';
import MgrTourBillReturnSlider from '../components/MgrTourBillReturnSlider';
import { FaUndo } from 'react-icons/fa';

export default function MgrBillApproved() {
  const toast = useToast();
  // const [rows, setRows] = useState<TourbillColumns[]>([]);
  type UserOption = { userid: string };
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  // const [username, setUsername] = useState('');
  // Used for Side Drawer Start
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [editingRow, setEditingRow] = useState<TourbillColumns | null>(null);
  // const [reloadKey, setReloadKey] = useState(0); //For Forcing Screen Update
  //--------------------------------
  //Used for Edit Slide Drawer
  const [selectedRow, setSelectedRow] = useState<TourbillColumns | null>(null);
  const [isTourEditOpen, setIsTourEditOpen] = useState(false);
  const openTourEdit = (row: TourbillColumns) => {
    setSelectedRow(row);
    setIsTourEditOpen(true);
  };
  const closeTourEdit = () => {
    setIsTourEditOpen(false);
    setSelectedRow(null);
  };
  function fetchDataAgain(): void {
    handleFetch();
  }
  //---Tour View Slider Begin Here-----------------------------
  const [isTourViewOpen, setIsTourViewOpen] = useState(false);
  const openTourView = (row: TourbillColumns) => {
    setSelectedRow(row);
    setIsTourViewOpen(true);
  };
  const closeTourView = () => {
    setIsTourViewOpen(false);
    setSelectedRow(null);
  };
  //---Tour View Slider Ends Here-----------------------------
  //---Tour Gps Slider Begin Here-----------------------------
  const [isTourGpsOpen, setIsTourGpsOpen] = useState(false);
  const openTourGps = (row:TourbillColumns) => {
    setSelectedRow(row);
    setIsTourGpsOpen(true);
  };
  const closeTourGps = () => {
    setIsTourGpsOpen(false);
    setSelectedRow(null);
  };
  //---Tour Gps Slider Ends Here-----------------------------
  //---Tour Approval Slider Begin Here-----------------------------
  // const [isTourApprovalOpen, setIsTourApprovalOpen] = useState(false);
  const [isBillApprovalOpen, setIsBillApprovalOpen] = useState(false);
  const [isBillReturnOpen, setIsBillReturnOpen] = useState(false);
  const openTourApproval = (row: TourbillColumns) => {
    setSelectedRow(row);
    // setIsTourApprovalOpen(true);
  };
  const closeBillApproval = () => {
    setIsBillApprovalOpen(false);
    setSelectedRow(null);
  };
  const openBillReturn = (row: TourbillColumns) => {
    setSelectedRow(row);
    setIsBillReturnOpen(true);
  };
   const closeBillReturn = () => {
    setIsBillReturnOpen(false);
    setSelectedRow(null);
  };
  //---Tour Approval Slider Ends Here-----------------------------

  const handleApproveSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      // Optional: confirm
      const ok = window.confirm(
        `Approve ${selectedIds.length} selected tours?`,
      );
      if (!ok) return;
      //console.log(selectedIds);
      const params = new URLSearchParams({ ticket_status: "Mgr Approved" });
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/touradmin/mgr-bill-approved?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${token}`,   // 👈 Bearer token
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //   ids: selectedIds,
        // }),
      });

      if (!res.ok) {
        throw new Error('Failed to approve selected tours');
      }
      toast({
        title: 'Updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // After success: refetch table and clear selection
      // simplest: just reset pageIndex or bump a reload counter
      setPageIndex(0); // triggers useEffect fetch because dependency
      setSelectedIds([]);
      //setReloadKey((k) => k + 1); // forces useEffect to run
      fetchDataAgain();
    } catch (err) {
      //console.error(err);
      alert('Approve failed. Please try again.'+err);
    }
  };
  //--------------------------------------------------
  // const handleTourEditClick = (row: TourbillColumns) => {
  //   setEditingRow(row);
  //   onOpen();
  // };
  //   const handleTourViewClick = (row: TourbillColumns) => {
  //   setEditingRow(row);
  //   setIsTourViewOpen(true);
  //   onOpen();
  // };
  // const handleReturnClick = (row: TourbillColumns) => {
  //   setEditingRow(row);
  //   onOpen();
  // };

  // Used for Side Drawer End
  // const [appliedFilters, setAppliedFilters] = useState({
  //   submittedby:''
  // });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TourbillColumns[]>([]);
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
    setSelectedIds(allSelected ? [] : data.map((r) => r.tourid));
  };
  const toggleOne = (tourid: number) => {
    setSelectedIds((prev) =>
      prev.includes(tourid) ? prev.filter((x) => x !== tourid) : [...prev, tourid],
    );
  };

  const handleExportCSV = () => {
      // Get visible headers
      const headers = table
        .getHeaderGroups()
        .map((x) => x.headers)
        .flat();

      // Get visible rows
      const rows = table.getCoreRowModel().rows;

      // Build CSV content
      const headerRow = headers
        .map((h) => {
          const headerContent = h.column.columnDef.header;
          if (typeof headerContent === 'string') return headerContent;
          return h.id;
        })
        .join(',');

      const dataRows = rows
        .map((row) =>
          headers
            .map((h) => {
              const value = row.getValue(h.id);
              // escape quotes in values
              const escaped = String(value ?? '').replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(','),
        )
        .join('\n');

      const csv = `${headerRow}\n${dataRows}`;

      // Trigger download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'table-export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };
  // ----------------------------
  // const reloadTours = async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch('/api/tours');   // your listing endpoint
  //     if (!res.ok) {
  //       throw new Error(`Failed to load tours: ${res.status}`);
  //     }
  //     const data: TourMasterType[] = await res.json();
  //     setRows(data);                           // update table data
  //   } catch (err) {
  //     console.error('Reload tours failed', err);
  //     // optionally show toast here
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  /////////////////////////////////
  // Derive sort params for backend
  // const sortParam = sorting[0]
  //   ? {
  //       sort_by: sorting[0].id,
  //       sort_dir: sorting[0].desc ? 'desc' : 'asc',
  //     }
  //   : { sort_by: '', sort_dir: '' };


  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/touradmin/billsubmittedby`, {
        method: 'GET',
          credentials: 'include',
          headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
      }
      const json: UserOption[] = await res.json();
        setUsers(json);       // optional reset
      } catch (e) {
        console.error('Fetch failed:', e);
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    // const fetchUsers = async () => {
    //   const token = localStorage.getItem('authToken');
    //   const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
    //   const res = await fetch(`${apiUrl}/api/touradmin/billsubmittedby`, {
    //     method: 'GET',
    //       credentials: 'include',
    //       headers: {
    //       'Authorization': `Bearer ${token}`,   // 👈 Bearer token
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    // });
    // const json: UserOption[] = await res.json();
    // setUsers(json);
    fetchUsers();
    handleFetch();
  }, []);
  
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
          const rowId = row.original.tourid;
          return (
            <input
              type="checkbox"
              checked={isSelected(rowId)}
              onChange={() => toggleOne(rowId)}
            />
          );
        },
      }),
      columnHelper.accessor('tourid', {
        header: 'TourId',
        cell: (info) => JSON.stringify(info.getValue()),
      }),
      columnHelper.display({
        id: 'tour',
        header: 'tour',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              aria-label="Tour"
              icon={<FiEye />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                openTourEdit(rowData)
              }}
            />
          );
        },
      }),

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
      columnHelper.display({
        id: 'return',
        header: 'Return',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              color="black"
              aria-label="RETURN"
              icon={<FaUndo />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                openBillReturn(rowData)
              }}
            />
          );
        },
      }),

      columnHelper.accessor('userid', {
        header: 'Engineer',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('fixed_da', {
        header: 'Eligible DA',
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
      columnHelper.accessor('created_on', {
        header: 'Submitted On',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('da_calculated', {
        header: 'Calculated DA',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('ta_claimed', {
        header: 'TA Claimed',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('other_expenses', {
        header: 'Other Expenses',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('other_expense_remarks', {
        header: 'Expense Remarks',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('total_claim', {
        header: 'Total Claim',
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
    const params = new URLSearchParams({ ticket_status: "Mgr_Bill_Approved",search: selectedUser, });
    const token = localStorage.getItem('authToken');
    const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
    const res = await fetch(`${apiUrl}/api/touradmin/mgr-bill-approved?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
    if (!res.ok) {
      console.error('Error:', res.status, await res.text());
      return;
    }

    const json: ApiResponse = await res.json(); // { data, total, ... }
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
    <Breadcrumb fontWeight="normal" fontSize={"sm"} mb={1} ml={1} color={"red"}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/tours">Manager</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>Bills Approved</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
      {/* Filters */}
      <HStack spacing={1} mb={5} align="flex-start" justifyContent={"left"}>
        <Box minW="20%">
          {/* <Text mb={0} fontSize="sm" fontWeight="medium">
            Submitted By:
          </Text> */}
          <Select
            placeholder="ALL"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            size="sm"
            bg="cyan.100"
            fontWeight={"semibold"}
          >
            {users.map((u) => (
              <option key={u.userid} value={u.userid} >
                {u.userid}
              </option>
            ))}
          </Select>
        </Box>
        <Button colorScheme="blue" onClick={handleFetch} h={8}>
          <FaFilter/>Apply
        </Button>
        <Button
          colorScheme="green"
          isDisabled={selectedIds.length === 0}
          onClick={handleApproveSelected}
          h={8}
        >
          Approve Selected ({selectedIds.length})
        </Button>
        <HStack mb={0} h={8}>
          <Button colorScheme="blue" onClick={handleExportCSV} p={0}>
            <FaFileExcel/>
          </Button>
          <Button colorScheme="green" p={0}>
            <FaFileCsv/>
          </Button>
          <Button colorScheme="purple" p={0}>
            <FaFilePdf/>
          </Button>
        </HStack>
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
                  )
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
    <ViewTourDetailsSlider
      isOpen={isTourEditOpen}
      onClose={closeTourEdit}
      tourId={selectedRow?.tourid ?? 0}
      onUpdated={fetchDataAgain}
    />
    <ViewTourBillSlider
      isOpen={isTourViewOpen}
      onClose={closeTourView}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />
    <ViewGpsSlider
      isOpen={isTourGpsOpen}
      onClose={closeTourGps}
      tourId={selectedRow?.tourid ?? 0}
      onUpdated={fetchDataAgain}
    />
    <MgrTourBillApprovalSlider
      isOpen={isBillApprovalOpen}
      onClose={closeBillApproval}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />
    <MgrTourBillReturnSlider
      isOpen={isBillReturnOpen}
      onClose={closeBillReturn}
      initialData={selectedRow}
      onUpdated={fetchDataAgain}
    />
    </Box>
    </>
  )
}





