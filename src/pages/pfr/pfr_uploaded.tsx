// src/pages/FilteredTablePage.tsx
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
// import {
//   Select,
//   useDisclosure,
// } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  // createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  // type Row,
  type SortingState,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight,  } from 'react-icons/fi';
import { FaDownload, FaTrash, } from 'react-icons/fa6';
import type { PfrUploadsType } from '../../types/PfrUploadsType';
import { ConfirmDeleteDialog } from '../../components/utils/ConfirmDeleteDialog';
// import { useToast } from '@chakra-ui/react';
// import { MdOutlineApproval } from 'react-icons/md';
// import { FcApproval } from 'react-icons/fc';
// import { RiEjectFill } from 'react-icons/ri';
// import { GiCancel, GiReturnArrow } from 'react-icons/gi';

type ApiResponse = {
  data: PfrUploadsType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<PfrUploadsType>();
// import ViewGpsSlider from '../components/ViewGpsSlider';
// import ViewTourDetailsSlider from '../components/ViewTourDetailsSlider';
// import type { TourMasterType } from '../types/TourMasterType';

export default function PfrUploaded() {
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  //const [selectedUser, setSelectedUser] = useState('');



  // const toast = useToast();
  // const [rows, setRows] = useState<PfrUploadsType[]>([]);
  // type UserOption = { userid: string };
  //const [users, setUsers] = useState<UserOption[]>([]);
  // const [username, setUsername] = useState('');
  // Used for Side Drawer Start
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [editingRow, setEditingRow] = useState<TourMasterType | null>(null);
  // const [reloadKey, setReloadKey] = useState(0); //For Forcing Screen Update
  //--------------------------------
  //Used for Edit Slide Drawer
  // const [selectedRow, setSelectedRow] = useState<PfrUploadsType | null>(null);
  // const [isTourEditOpen, setIsTourEditOpen] = useState(false);
  // const openTourEdit = (row: TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsTourEditOpen(true);
  // };
  // const closeTourEdit = () => {
  //   setIsTourEditOpen(false);
  //   setSelectedRow(null);
  // };
  // function fetchDataAgain(): void {
  //   handleFetch();
  // }
  // //---Tour View Slider Begin Here-----------------------------
  // const [isTourViewOpen, setIsTourViewOpen] = useState(false);
  // const openTourView = (row: TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsTourViewOpen(true);
  // };
  // const closeTourView = () => {
  //   setIsTourViewOpen(false);
  //   setSelectedRow(null);
  // };
  //---Tour View Slider Ends Here-----------------------------
  //---Tour Gps Slider Begin Here-----------------------------
  // const [isTourGpsOpen, setIsTourGpsOpen] = useState(false);
  // const openTourGps = (row:TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsTourGpsOpen(true);
  // };
  // const closeTourGps = () => {
  //   setIsTourGpsOpen(false);
  //   setSelectedRow(null);
  // };
  //---Tour Gps Slider Ends Here-----------------------------
  //---Tour Approval Slider Begin Here-----------------------------
  // const [isTourApprovalOpen, setIsTourApprovalOpen] = useState(false);
  // const [isBillApprovalOpen, setIsBillApprovalOpen] = useState(false);
  // const [isBillReturnOpen, setIsBillReturnOpen] = useState(false);
  // const openTourApproval = (row: TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsTourApprovalOpen(true);
  // };
  // const closeBillApproval = () => {
  //   setIsBillApprovalOpen(false);
  //   setSelectedRow(null);
  // };
  // const openBillReturn = (row: TourMasterType) => {
  //   setSelectedRow(row);
  //   setIsBillReturnOpen(true);
  // };
  //  const closeBillReturn = () => {
  //   setIsBillReturnOpen(false);
  //   setSelectedRow(null);
  // };
  //---Tour Approval Slider Ends Here-----------------------------

  // const handleApproveSelected = async () => {
  //   if (selectedIds.length === 0) return;
  //   try {
  //     // Optional: confirm
  //     const ok = window.confirm(
  //       `Approve ${selectedIds.length} selected tours?`,
  //     );
  //     if (!ok) return;
  //     //console.log(selectedIds);
  //     const res = await fetch('/api/tourbill/mgr-bulk-bill-approval', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ids: selectedIds,
  //       }),
  //     });

  //     if (!res.ok) {
  //       throw new Error('Failed to approve selected tours');
  //     }
  //     toast({
  //       title: 'Updated successfully',
  //       status: 'success',
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     // After success: refetch table and clear selection
  //     // simplest: just reset pageIndex or bump a reload counter
  //     setPageIndex(0); // triggers useEffect fetch because dependency
  //     setSelectedIds([]);
  //     setReloadKey((k) => k + 1); // forces useEffect to run
  //     fetchDataAgain();
  //   } catch (err) {
  //     //console.error(err);
  //     alert('Approve failed. Please try again.'+err);
  //   }
  // };
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
  // const handleReturnClick = (row: TourMasterType) => {
  //   setEditingRow(row);
  //   onOpen();
  // };

  // Used for Side Drawer End
  // const [appliedFilters, setAppliedFilters] = useState({
  //   submittedby:''
  // });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<PfrUploadsType[]>([]);
  // const [pageIndex, setPageIndex] = useState(0); // zero-based
  // const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ---- Row selector state ----
  const [rowToDelete, setRowToDelete] = useState<PfrUploadsType | null>(null);
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

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
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

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const res = await fetch('/api/pfr/pfrlist');
  //     const json: PfrUploadsType[] = await res.json();
  //     setRows(json);
  //   };
  //   fetchUsers();
  // }, []);


  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(
        `${apiUrl}/touradmin/delete-pfr`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'pfr_id':rowToDelete.id}),
        },
      );

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      await handleFetch();
      toast({
        title: 'Deleted',
        description: `PFR ${rowToDelete.id} marked as deleted`,
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


  useEffect(() => {
    handleFetch();
  }, [pagination.pageIndex, pagination.pageSize, sorting]);
  
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
      // columnHelper.display({
      //   id: 'select',
      //   header: () => (
      //     <input
      //       type="checkbox"
      //       checked={allSelected}
      //       onChange={toggleAll}
      //     />
      //   ),
      //   cell: ({ row }) => {
      //     const rowId = row.original.id;
      //     return (
      //       <input
      //         type="checkbox"
      //         checked={isSelected(rowId)}
      //         onChange={() => toggleOne(rowId)}
      //       />
      //     );
      //   },
      // }),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => JSON.stringify(info.getValue()),
      }),
      columnHelper.display({
              id: 'delete',
              header: 'Delete',
              cell: (info) => {
                const rowData = info.row.original as PfrUploadsType;
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
       columnHelper.accessor('upload_date', {
        header: 'Upload Date',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('filename', {
        header: 'Filename',
        cell: (info) => info.getValue(),
      }),

      columnHelper.display({
        id: 'download_url',
        header: 'Download',
        cell: (info) => {
          const rowData = info.row.original;
          const url = rowData.download_url; // string URL
          return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download          // hint browser to download
          >
            <IconButton
              color="black"
              aria-label="download"
              icon={<FaDownload />}
              size="sm"
              variant="ghost"
              _hover={{ bg: 'black', textColor: 'white' }}
            />
          </a>
        );
        },
      }),
      columnHelper.accessor('uploaded_by', {
        header: 'Uploaded By',
        cell: (info) => info.getValue(),
      }),
     
    ],
    [allSelected, isSelected, toggleAll, toggleOne],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    // pageCount: Math.ceil(total / pageSize) || -1,
    pageCount: total ? Math.ceil(total / pagination.pageSize) : -1,
  });

  // const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  // const canPrev = pageIndex > 0;
  // const canNext = pageIndex < pageCount - 1;

  const { pageIndex, pageSize } = table.getState().pagination;
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        per_page: pagination.pageSize.toString(),
      });
      //console.log('Info:',selectedUser);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/pfr/pfrlist?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({
          //   "start_date":startDate,
          //   "end_date":endDate,
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
    <Breadcrumb fontWeight="semibold" fontSize={"sm"} ml={1} mb={1} color={'blue.500'}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">PFR</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>PFR Uploads</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
      {/* Filters */}
      {/* <HStack spacing={1} mb={4} align="flex-end" justifyContent={"left"}>
         <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            From Date
          </Text>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            //min={startDate || undefined}
            bg="cyan.50"
            h={8}
          />
        </Box>
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            To Date
          </Text>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            bg="cyan.50"
            h={8}
          />
        </Box>
        <Button colorScheme="blue" onClick={handleFetch} h={8} fontSize={"sm"}>
          <FaFilter/>Apply
        </Button>
      </HStack> */}

      {/* Table */}
      <Box overflow="auto">
        <Table
          size="sm"
          minW="1200px"
          variant="striped"
          //colorScheme="gray"
          colorScheme="green"
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
                      py="1"
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
                  <Text textAlign="center" py={1}>
                    No records found.
                  </Text>
                </Td>
              </Tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id} h="10">
                {row.getVisibleCells().map((cell) => (
                  // <Td key={cell.id}>
                    <Td key={cell.id} lineHeight="1" py="0.5">  {/* Add lineHeight here */}
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
                      //onClick={() => canPrev && setPageIndex((p) => p - 1)}
                      onClick={() => table.previousPage()}
                      isDisabled={!canPrev}
                      bg={"black"}
                      color={"white"}

                    />
                    <IconButton
                      aria-label="Next page"
                      icon={<FiChevronRight />}
                      size="sm"
                      //onClick={() => canNext && setPageIndex((p) => p + 1)}
                      onClick={() => table.nextPage()}
                      isDisabled={!canNext}
                      bg={"black"}
                      color={"white"}
                    />
                    <Text fontSize="sm">
                      {/* Page {pageIndex + 1} of {pageCount} */}
                      Page {pageIndex + 1} of {table.getPageCount() || 1}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm">Rows per page:</Text>
                    <ChakraSelect
                      size="sm"
                      width="80px"
                      value={pageSize}
                      onChange={(e) => {
                        // setPageSize(Number(e.target.value));
                        // setPageIndex(0);

                        const newSize = Number(e.target.value);
                        table.setPageSize(newSize);
                        table.setPageIndex(0);
                      }}
                    >
                      {/* {[10, 20, 50].map((size) => ( */}
                       {[10,50,100].map((size) => (
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
    {/* <ViewTourDetailsSlider
      isOpen={isTourViewOpen}
      onClose={closeTourView}
      tourId={selectedRow?.id ?? 0}
      onUpdated={fetchDataAgain}
    />; */}
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
    <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
    </>
  );
}
function toast(_arg0: { title: string; description: any; status: string; duration: number; isClosable: boolean; }) {
  throw new Error('Function not implemented.');
}

