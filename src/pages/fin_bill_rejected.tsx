import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Flex, Link, Spacer, useDisclosure } from '@chakra-ui/react';
import {  Select} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Box, Button, HStack,Table,Thead,Tbody,Tr,Th,Td,IconButton,Text,Select as ChakraSelect} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight, FiEye, } from 'react-icons/fi';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaHtml5, FaLocationDot, FaRecycle } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';

type ApiResponse = {
  data: TourBillType[];
  current_page: number;
  per_page: number;
  total: number;
};

const columnHelper = createColumnHelper<TourBillType>();
import { FaCheckCircle, FaSearch, FaUndo } from 'react-icons/fa';
import type { TourBillType } from '../types/TourBillType';
import TableLoader from '../components/TableLoader';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import ViewGpsSliderTable from '../components/ViewGpsSliderTable';
import BillApprovalSlider from '../components/BillApprovalSlider';

export default function FinBillRejected() {
  const token = localStorage.getItem('authToken');
  const toast = useToast();
  type UserOption = { userid: string };
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [selectedRow, setSelectedRow] = useState<TourBillType | null>(null);
  const openTourEdit = (row: TourBillType) => {
    setSelectedRow(row);
  };
  const [isExporting, setIsExporting] = useState(false);

  function fetchDataAgain(): void {
    void handleFetch();
  }
  //---Tour View Slider Begin Here-----------------------------
  const openTourView = (row: TourBillType) => {
    setSelectedRow(row);
  };
  const [isTourGpsOpen, setIsTourGpsOpen] = useState(false);
  const openTourGps = (row:TourBillType) => {
    setSelectedRow(row);
    setIsTourGpsOpen(true);
  };
  const closeTourGps = () => {
    setIsTourGpsOpen(false);
    setSelectedRow(null);
  };
  const closeBillApproval = () => {
    setIsBillApprovalOpen(false);
    setSelectedRow(null);
  };
  //---Tour Gps Slider Ends Here-----------------------------
  //---Tour Approval Slider Begin Here-----------------------------
  const [isBillApprovalOpen, setIsBillApprovalOpen] = useState(false);
  const openBillApproval = (row: TourBillType) => {
    setSelectedRow(row);
    setIsBillApprovalOpen(true);
  };
  const openBillReturn = (row: TourBillType) => {
    setSelectedRow(row);
    // setIsBillReturnOpen(true);
  };
  //---Tour Approval Slider Ends Here-----------------------------
  const handleBulkApproval = async () => {
    if (selectedIds.length === 0) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(`${apiUrl}/api/touradmin/fin-bulk-bill-approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ids: selectedIds,
        }),
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
      setSelectedIds([]);
      fetchDataAgain();
    } catch (err) {
      //console.error(err);
      alert('Approve failed. Please try again.'+err);
    }
  };

  const [data, setData] = useState<TourBillType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ---- Row selector state ----
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isSelected = (tourid: number) => selectedIds.includes(tourid);
  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : data.map((r) => r.tourid));
  };
  const toggleOne = (tourid: number) => {
    setSelectedIds((prev) =>
      prev.includes(tourid) ? prev.filter((x) => x !== tourid) : [...prev, tourid],
    );
  };

  const exportToExcel = async (data: any[], fileName: string) => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Main Sheet');
  
      // 1. Define Columns (This replaces SheetJS auto-headers)
      worksheet.columns = [
        { header: 'TourID', key: 'tourid', width: 15 },
        { header: 'Engineer', key: 'userid', width: 15 },
        { header: 'Fixed Da', key: 'fixed_da', width: 20 },
        { header: 'DA Calculated', key: 'da_calculated', width: 20 },
        { header: 'TA Claimed', key: 'ta_claimed', width: 20 },
        { header: 'Other Expeness', key: 'other_expenses', width: 12 },
        { header: 'Other Expense Remarks', key: 'other_expense_remarks', width: 15 },
        { header: 'Total Claim', key: 'total_claim', width: 20 },
        { header: 'Mgr Approved Amt', key: 'mgr_approved_amt', width: 12 },
        { header: 'Mgr Remarks', key: 'mgr_remarks', width: 15 },
        { header: 'Tour Start Date', key: 'tour_start_date', width: 12 },
        { header: 'Tour End Date', key: 'tour_end_date', width: 15 },
        { header: 'Submitted On', key: 'created_on', width: 20 },
      ];
  
      // 2. Add Rows
      worksheet.addRows(data);
  
      // 3. (Bonus) Styling - Something SheetJS (free) can't do
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
  
      // 4. Generate & Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    };

  const exportToPDF = async (rows: any[], fileName: string) => {
    const doc = new jsPDF('l', 'pt', 'a4'); // or 'p', 'mm', 'a4'
    const headers = [
      'TourID',
      'Engineer',
      'Fixed DA',
      'DA Calculated',
      'TA Claimed',
      'Other Expenses',
      //'Other Expense Remarks',
      'Total Claim',
      'Mgr Approved Amt',
      'Mgr Remarks',
      'Tour Start Date',
      'Tour End Date',
      'Submitted On'
    ];
  
    const body = rows.map((r) => [
      r.tourid,
      r.userid,
      r.fixed_da,
      r.da_calculated,
      r.ta_claimed,
      r.other_expenses,
      //r.other_expense_remarks,
      r.total_claim,
      r.mgr_approved_amt,
      r.mgr_remarks,
      r.tour_start_date,
      r.tour_end_date,
      r.created_on,
    ]);
  
    autoTable(doc, {
      head: [headers],
      body,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [55, 65, 81] },
    });
  
    doc.save(fileName);
  };

  const exportToCsv = async (rows: any[], fileName: string) => {
      // 1. Create Workbook & Worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Export');
  
      // 2. Define Columns
      worksheet.columns = [
        { header: 'TourID', key: 'tourid', width: 15 },
        { header: 'Engineer', key: 'userid', width: 15 },
        { header: 'Fixed Da', key: 'fixed_da', width: 20 },
        { header: 'DA Calculated', key: 'da_calculated', width: 20 },
        { header: 'TA Claimed', key: 'ta_claimed', width: 20 },
        { header: 'Other Expeness', key: 'other_expenses', width: 12 },
        { header: 'Other Expense Remarks', key: 'other_expense_remarks', width: 15 },
        { header: 'Total Claim', key: 'total_claim', width: 20 },
        { header: 'Mgr Approved Amt', key: 'mgr_approved_amt', width: 12 },
        { header: 'Mgr Remarks', key: 'mgr_remarks', width: 15 },
        { header: 'Tour Start Date', key: 'tour_start_date', width: 12 },
        { header: 'Tour End Date', key: 'tour_end_date', width: 15 },
        { header: 'Submitted On', key: 'created_on', width: 20 },
      ];
  
      worksheet.addRows(rows);
      // 4. Generate CSV Buffer
      // ExcelJS handles all the comma escaping and newline logic here
      const buffer = await workbook.csv.writeBuffer();
  
      // 5. Trigger Download
      const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${fileName}.csv`);
    };
  
    const exportHTML = async (rows: any[], fileName: string) => {
      const headers = [
        'TourID',
        'Engineer',
        'Fixed DA',
        'DA Calculated',
        'TA Claimed',
        'Other Expenses',
        'Other Expense Remarks',
        'Total Claim',
        'Mgr Approved Amt',
        'Mgr Remarks',
        'Tour Start Date',
        'Tour End Date',
        'Submitted On'
      ];
  
      const headerRow = `<tr>${headers
        .map((h) => `<th>${h}</th>`)
        .join('')}</tr>`;
  
      const bodyRows = rows
        .map(
          (r) =>
            `<tr>${[
              r.tourid,
              r.userid,
              r.fixed_da,
              r.da_calculated,
              r.ta_claimed,
              r.other_expenses,
              r.other_expense_remarks,
              r.total_claim,
              r.mgr_approved_amt,
              r.mgr_remarks,
              r.tour_start_date,
              r.tour_end_date,
              r.created_on,
            ]
              .map((value) => `<td>${value ?? ''}</td>`)
              .join('')}</tr>`,
        )
        .join('');
  
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Employees</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 4px 8px; font-size: 12px; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <table>
          <thead>${headerRow}</thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </body>
      </html>
    `.trim();
  
      const blob = new Blob([html], {
        type: 'text/html;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    };

  const handleExport = async (exportType: string) => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all",
        "ticket_status":"Fin Rejected"
      });
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/fin/tourbill-export?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const json = await res.json();
      setIsLoading(false);

      // 2. Pass the fresh data to your ExcelJS function
      // Ensure 'response.data' is the array of employees
      if(exportType === 'EXCEL'){
        await exportToExcel(json.data, "finance_pending");
      }else if (exportType === 'CSV'){
        await exportToCsv(json.data, "finance_pending");
      }else if (exportType === 'PDF'){
        await exportToPDF(json.data, "finance_pending.pdf");
      }else if (exportType === 'HTML'){
        await exportHTML(json.data, "finance_pending.html");
      }
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchUsers = useCallback(async () => {
      const params = new URLSearchParams({ ticket_status: "Fin Rejected" });
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/touradmin/fin/users-by-bill-status?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      const json: UserOption[] = await res.json();
      setUsers(json);
    }, []);

    const handleFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/api/touradmin/fin/bills-by-status`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: selectedUser,
          ticket_status: 'Fin Rejected',
          page: (pagination.pageIndex + 1).toString(),
          per_page: pagination.pageSize.toString(),
        }),
      });

      if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
      }

      const json: ApiResponse = await res.json();
      setData(json.data);
      setTotal(json.total);
      setSelectedIds([]);
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedUser, pagination.pageIndex, pagination.pageSize]);
  
  useEffect(() => {
    void fetchUsers();
    void handleFetch();
  }, [fetchUsers, handleFetch]);

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
        header: 'Bill',
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
          Number(rowData?.gps_count || 0) > 0 ? (
            <IconButton
              color="orange.500"
              aria-label="GPS"
              icon={<FaLocationDot />}
              size="sm"
              variant="ghost"
              _hover={{ bg: "black", color: "white" }}
              onClick={() => openTourGps(rowData)}
            />
          ) : null
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
              color="blue.600"
              aria-label="APPROVE"
              icon={<FaCheckCircle />}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                openBillApproval(rowData)
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
      columnHelper.accessor('da_calculated', {
        header: 'DA Calculated',
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
        header: 'Other Expenses Remarks',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('total_claim', {
        header: 'Total User Claim',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('mgr_approved_amt', {
        header: 'Mgr Approved Amt',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('mgr_remarks', {
        header: 'Mgr Remarks',
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
      columnHelper.accessor('created_at', {
        header: 'Submitted On',
        cell: (info) => info.getValue(),
      }),
    ],
    [allSelected, isSelected, toggleAll, toggleOne],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,  // ✅ Table controls it
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    // pageCount: Math.ceil(total / pageSize) || -1,
    pageCount: total ? Math.ceil(total / pagination.pageSize) : 0,
  });

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const {
    isOpen: isBulkDialogOpen,
    onOpen: openBulkDialog,
    onClose: closeBulkDialog,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
    <AlertDialog
      isOpen={isBulkDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeBulkDialog}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Approve Selected Tours
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to approve {selectedIds.length} selected tour
            {selectedIds.length > 1 ? 's' : ''}?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeBulkDialog}>
              No
            </Button>
            <Button
              colorScheme="green"
              ml={3}
              onClick={async () => {
                await handleBulkApproval(); // call your logic
                closeBulkDialog();
              }}
              //isLoading={isSubmitting}
            >
              Yes, Approve
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
    <Flex
        direction="column"
        h="calc(100vh - 80px)" // or "100vh" if this is the whole page
      >
      <Flex align="center" as="nav" aria-label="Breadcrumb" w="100%" py={1}>
        {/* Left Side: Breadcrumbs */}
        <HStack spacing={1} display={{ base: "none", md: "flex" }}>
          <Link href="/finance" color="blue.500" fontWeight="normal" fontSize={"sm"}>Finance</Link>
          <Text color="gray.500">/</Text>
          <Link color="red.500" fontWeight="normal" fontSize={"sm"}>Bills Rejected</Link>
        </HStack>
        {/* The Magic: This fills all available space between the two groups */}
        <Spacer />
        {/* Right Side: Action Buttons */}
        <HStack
          direction={['column', 'row']} // column on mobile, row on md+
          spacing={1}
          flexWrap="wrap"              // allow wrapping when needed
          align="stretch">
          <Box  display={"flex"}>
            <Select
              placeholder="ALL"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              size="sm"
              bg="yellow.50"
              fontWeight={"semibold"}
            >
              {users.map((u) => (
                <option key={u.userid} value={u.userid} >
                  {u.userid}
                </option>
              ))}
            </Select>
          </Box>
          <Button colorScheme="orange" h={8} fontWeight={"thin"} variant="solid">
            <FaSearch/>
          </Button>
          <Button
            colorScheme="green"
            isDisabled={selectedIds.length === 0}
            onClick={openBulkDialog}
            h={8} variant="solid" fontWeight={"thin"}
            >
            {/* {selectedIds.length}<FaCheckCircle/> */}
            <FaCheckCircle/>
          </Button>
          <Button 
            leftIcon={<FaRecycle />} 
            colorScheme="green" 
            onClick={() => handleFetch()}  // ✅ no args, ignore event
            h={8} 
            fontSize="sm"
          >
          </Button>
           <IconButton 
                colorScheme="blue" 
                variant="outline" 
                aria-label="Export Excel"
                icon={<FaFileExcel/>}
                size="sm" // or xs for smaller
                isLoading={isExporting} 
                onClick={() => handleExport("EXCEL")}  // <-- wrap in arrow
            />
            <IconButton 
              colorScheme="green" 
              variant="outline" 
              aria-label="Export CSV"
              icon={<FaFileCsv />}
              size="sm" // or xs for smaller
              isLoading={isExporting} 
              onClick={() => handleExport("CSV")}  // <-- wrap in arrow
            />
            <IconButton 
                colorScheme="red" 
                variant="outline" 
                aria-label="Export PDF"
                icon={<FaFilePdf/>}
                size="sm" // or xs for smaller
                onClick={() => handleExport("PDF")}  // <-- wrap in arrow
              />
            <IconButton 
              colorScheme="blue" 
              variant="outline" 
              aria-label="Export HTML"
              icon={<FaHtml5/>}
              size="sm" // or xs for smaller
              onClick={() => handleExport("HTML")}  // <-- wrap in arrow
            />
        </HStack>
      </Flex>
      <Box borderWidth="1px" borderRadius="md" maxH="90vh" overflow="auto" p={0} position="relative">

      {/* Table */}
      <Box
        flex="1"
        position="relative"
      >
        <Table
          size="sm"
          minW="1200px"
          variant="striped"
          colorScheme="gray"
          position="relative"
          maxH="100vh"
        >
          <Thead bg="gray.700" top={0} zIndex={1} position="sticky">
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
          </Table>
         {/* Bottom Area Start */}
          {/* ✅ Sticky pagination/footer bar */}
          <HStack
            justify="space-between"
            align="center"
            position="sticky"
            bottom={0}          // stick to bottom of scroll container
            bg="white"          // background so rows don't bleed through
            py={2}
            mt={2}
            pl={1}
            pr={1}
            zIndex={2}
          >
            <HStack>
              <IconButton
                aria-label="Previous"
                icon={<FiChevronLeft />}
                onClick={() => table.previousPage()}
                isDisabled={!canPrev}
                bg="blue.700"
                color="white"
                _hover={{ bg: "orange", color: "black" }}
                size="sm"
              />
              <IconButton
                aria-label="Next"
                icon={<FiChevronRight />}
                onClick={() => table.nextPage()}
                isDisabled={!canNext}
                bg="blue.700"
                color="white"
                _hover={{ bg: "orange", color: "black" }}
                size="sm"
                //isLoading={isLoading}         // ✅ Chakra will show spinner in the button itself
                //loadingText="Loading..."
              />
              <Text fontSize="sm">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </Text>
            </HStack>

            <HStack>
              <Text fontSize="sm">Rows per page:</Text>
              <ChakraSelect
                bg={"yellow.100"}
                size="sm"
                width="80px"
                value={pagination.pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  table.setPageSize(newSize);
                  table.setPageIndex(0);
                }}
              >
                {[50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </ChakraSelect>
              <Text fontSize="sm">Total: {total}</Text>
            </HStack>
          </HStack>
        {/* Bottom Area End */}
        {/* <TableLoader 
            isLoading={isLoading}
            message="Loading..."
            size="lg"
          /> */}
      </Box>
    <ViewGpsSliderTable
      isOpen={isTourGpsOpen}
      onClose={closeTourGps}
      tourId={selectedRow?.tourid ?? 0}
      onUpdated={fetchDataAgain}
    />
    <BillApprovalSlider
      isOpen={isBillApprovalOpen}
      onClose={closeBillApproval}
      billRecord={selectedRow}
      onUpdated={fetchDataAgain}
    />
    </Box>
   </Flex>
      {isLoading && (
      <Box
        position="fixed"
        inset={0}            // top:0, right:0, bottom:0, left:0
        bg="blackAlpha.400"  // semi‑transparent backdrop
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <TableLoader 
          isLoading={true}
          message="Loading..."
          size="lg"
        />
      </Box>
    )}
    </>
    
  );
}
//---------------------------------------------------------------
// // src/pages/FilteredTablePage.tsx
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
// import {
//   Select,
//   // useDisclosure,
// } from '@chakra-ui/react';
// import { useEffect, useMemo, useState } from 'react';
// import {
//   Box,
//   Button,
//   HStack,
//   // Input,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Tfoot,
//   IconButton,
//   Text,
//   Select as ChakraSelect,
// } from '@chakra-ui/react';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
//   // type Row,
//   type SortingState,
// } from '@tanstack/react-table';
// import { FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
// import { FaCheck, FaFileCsv, FaFileExcel, FaFilePdf, FaFilter, FaLocationDot } from 'react-icons/fa6';
// import { useToast } from '@chakra-ui/react';
// // import { MdOutlineApproval } from 'react-icons/md';
// // import { FcApproval } from 'react-icons/fc';
// // import { RiEjectFill } from 'react-icons/ri';
// // import { GiCancel, GiReturnArrow } from 'react-icons/gi';

// type ApiResponse = {
//   data: TourMasterType[];
//   current_page: number;
//   per_page: number;
//   total: number;
// };

// const columnHelper = createColumnHelper<TourMasterType>();
// // import { FaDownload, FaUndo } from 'react-icons/fa';
// import ViewGpsSlider from '../components/ViewGpsSlider';
// // import ViewTourBillSlider from '../components/ViewTourBillSlider';
// // import ViewTourDetailsSlider from '../components/ViewTourDetailsSlider';
// // import MgrTourBillApprovalSlider from '../components/MgrTourBillApprovalSlider';
// // import MgrTourBillReturnSlider from '../components/MgrTourBillReturnSlider';
// import type { TourMasterType } from '../types/TourMasterType';
// import { FaUndo } from 'react-icons/fa';

// export default function FinBillRejected() {
//   const toast = useToast();
//   // const [rows, setRows] = useState<TourMasterType[]>([]);
//   type UserOption = { userid: string };
//   const [users, setUsers] = useState<UserOption[]>([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   // const [username, setUsername] = useState('');
//   // Used for Side Drawer Start
//   // const { isOpen, onOpen, onClose } = useDisclosure();
//   // const [editingRow, setEditingRow] = useState<TourMasterType | null>(null);
//   // const [reloadKey, setReloadKey] = useState(0); //For Forcing Screen Update
//   //--------------------------------
//   //Used for Edit Slide Drawer
//   const [selectedRow, setSelectedRow] = useState<TourMasterType | null>(null);
//   // const [isTourEditOpen, setIsTourEditOpen] = useState(false);
//   const openTourEdit = (row: TourMasterType) => {
//     setSelectedRow(row);
//     // setIsTourEditOpen(true);
//   };
//   // const closeTourEdit = () => {
//   //   setIsTourEditOpen(false);
//   //   setSelectedRow(null);
//   // };
//   function fetchDataAgain(): void {
//     handleFetch();
//   }
//   //---Tour View Slider Begin Here-----------------------------
//   // const [isTourViewOpen, setIsTourViewOpen] = useState(false);
//   // const openTourView = (row: TourMasterType) => {
//   //   setSelectedRow(row);
//   //   setIsTourViewOpen(true);
//   // };
//   // const closeTourView = () => {
//   //   setIsTourViewOpen(false);
//   //   setSelectedRow(null);
//   // };
//   //---Tour View Slider Ends Here-----------------------------
//   //---Tour Gps Slider Begin Here-----------------------------
//   const [isTourGpsOpen, setIsTourGpsOpen] = useState(false);
//   const openTourGps = (row:TourMasterType) => {
//     setSelectedRow(row);
//     setIsTourGpsOpen(true);
//   };
//   const closeTourGps = () => {
//     setIsTourGpsOpen(false);
//     setSelectedRow(null);
//   };
//   //---Tour Gps Slider Ends Here-----------------------------
//   //---Tour Approval Slider Begin Here-----------------------------
//   // const [isTourApprovalOpen, setIsTourApprovalOpen] = useState(false);
//   // const [isBillApprovalOpen, setIsBillApprovalOpen] = useState(false);
//   // const [isBillReturnOpen, setIsBillReturnOpen] = useState(false);
//   const openTourApproval = (row: TourMasterType) => {
//     setSelectedRow(row);
//     // setIsTourApprovalOpen(true);
//   };
//   // const closeBillApproval = () => {
//   //   setIsBillApprovalOpen(false);
//   //   setSelectedRow(null);
//   // };
//   const openBillReturn = (row: TourMasterType) => {
//     setSelectedRow(row);
//     // setIsBillReturnOpen(true);
//   };
//   //  const closeBillReturn = () => {
//   //   setIsBillReturnOpen(false);
//   //   setSelectedRow(null);
//   // };
//   //---Tour Approval Slider Ends Here-----------------------------

//   const handleApproveSelected = async () => {
//     if (selectedIds.length === 0) return;
//     try {
//       // Optional: confirm
//       const ok = window.confirm(
//         `Approve ${selectedIds.length} selected tours?`,
//       );
//       if (!ok) return;
//       //console.log(selectedIds);
//       const res = await fetch('/api/tourbill/mgr-bulk-tour-approval', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ids: selectedIds,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error('Failed to approve selected tours');
//       }
//       toast({
//         title: 'Updated successfully',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//       // After success: refetch table and clear selection
//       // simplest: just reset pageIndex or bump a reload counter
//       setPageIndex(0); // triggers useEffect fetch because dependency
//       setSelectedIds([]);
//       // setReloadKey((k) => k + 1); // forces useEffect to run
//       fetchDataAgain();
//     } catch (err) {
//       //console.error(err);
//       alert('Approve failed. Please try again.'+err);
//     }
//   };
//   //--------------------------------------------------
//   // const handleTourEditClick = (row: TourbillColumns) => {
//   //   setEditingRow(row);
//   //   onOpen();
//   // };
//   //   const handleTourViewClick = (row: TourbillColumns) => {
//   //   setEditingRow(row);
//   //   setIsTourViewOpen(true);
//   //   onOpen();
//   // };
//   // const handleReturnClick = (row: TourMasterType) => {
//   //   setEditingRow(row);
//   //   onOpen();
//   // };

//   // Used for Side Drawer End
//   // const [appliedFilters, setAppliedFilters] = useState({
//   //   submittedby:''
//   // });

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [data, setData] = useState<TourMasterType[]>([]);
//   const [pageIndex, setPageIndex] = useState(0); // zero-based
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   // ---- Row selector state ----
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const allSelected = data.length > 0 && selectedIds.length === data.length;
//   const isSelected = (tourid: number) => selectedIds.includes(tourid);
//   const toggleAll = () => {
//     //setSelectedIds(allSelected ? [] : data.map((r) => r.id));
//     setSelectedIds(allSelected ? [] : data.map((r) => r.id));
//   };
//   const toggleOne = (tourid: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(tourid) ? prev.filter((x) => x !== tourid) : [...prev, tourid],
//     );
//   };

  
//   useEffect(() => {
//     const params = new URLSearchParams({ ticket_status: "Finance Rejected" });
//     const fetchUsers = async () => {
//       const res = await fetch(`/api/tourbill/users-by-bill-status?${params}`);
//       const json: UserOption[] = await res.json();
//       setUsers(json);
//     };
//     fetchUsers();
//     handleFetch();
//   }, []);
  
//   // Columns, including selection column
//   const columns = useMemo(
//     () => [
//       columnHelper.display({
//         id: 'select',
//         header: () => (
//           <input
//             type="checkbox"
//             checked={allSelected}
//             onChange={toggleAll}
//           />
//         ),
//         cell: ({ row }) => {
//           const rowId = row.original.id;
//           return (
//             <input
//               type="checkbox"
//               checked={isSelected(rowId)}
//               onChange={() => toggleOne(rowId)}
//             />
//           );
//         },
//       }),
//       columnHelper.accessor('id', {
//         header: 'TourId',
//         cell: (info) => JSON.stringify(info.getValue()),
//       }),
//       columnHelper.display({
//         id: 'tour',
//         header: 'tour',
//         cell: (info) => {
//           const rowData = info.row.original;
//           return (
//             <IconButton
//               aria-label="Tour"
//               icon={<FiEye />}
//               size="sm"
//               variant="ghost"
//               _hover={{bg:"black",textColor:"white"}}
//               onClick={() => {
//                 openTourEdit(rowData)
//               }}
//             />
//           );
//         },
//       }),

//       // columnHelper.display({
//       //   id: 'view',
//       //   header: 'View',
//       //   cell: (info) => {
//       //     // const rowData = info.row.original;
//       //     return (
//       //       <IconButton
//       //         aria-label="View"
//       //         icon={<FiEye />}
//       //         size="sm"
//       //         variant="ghost"
//       //         _hover={{bg:"black",textColor:"white"}}
//       //         onClick={() => {
//       //           // openTourView(rowData)
//       //         }}
//       //       />
//       //     );
//       //   },
//       // }),

//       columnHelper.display({
//         id: 'gps',
//         header: 'GPS',
//         cell: (info) => {
//           const rowData = info.row.original;
//           return (
//             <IconButton
//               color="red"
//               aria-label="GPS"
//               icon={<FaLocationDot />}
//               size="sm"
//               variant="ghost"
//               _hover={{bg:"black",textColor:"white"}}
//               onClick={() => {
//                 openTourGps(rowData)
//               }}
//             />
//           );
//         },
//       }),
//       columnHelper.display({
//         id: 'approve',
//         header: 'Approve',
//         cell: (info) => {
//           const rowData = info.row.original;
//           return (
//             <IconButton
//               color="blue"
//               aria-label="APPROVE"
//               icon={<FaCheck />}
//               size="sm"
//               variant="ghost"
//               _hover={{bg:"black",textColor:"white"}}
//               onClick={() => {
//                 openTourApproval(rowData)
//               }}
//             />
//           );
//         },
//       }),
//       columnHelper.display({
//         id: 'return',
//         header: 'Return',
//         cell: (info) => {
//           const rowData = info.row.original;
//           return (
//             <IconButton
//               color="black"
//               aria-label="RETURN"
//               icon={<FaUndo />}
//               size="sm"
//               variant="ghost"
//               _hover={{bg:"black",textColor:"white"}}
//               onClick={() => {
//                 openBillReturn(rowData)
//               }}
//             />
//           );
//         },
//       }),

//       columnHelper.accessor('userid', {
//         header: 'Engineer',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('customer_name', {
//         header: 'Customer Name',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('machine_model', {
//         header: 'Machine Model',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('machine_serial', {
//         header: 'Machine Serial',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('complaint_dtls', {
//         header: 'Complaint Details',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('travel_from', {
//         header: 'Travel From',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('travel_to', {
//         header: 'Travel To',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('mode_of_travel', {
//         header: 'Mode of Travel',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('visiting_role', {
//         header: 'Visiting Role',
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor('team_members', {
//         header: 'Team Members',
//         cell: (info) => info.getValue(),
//       }),
//     ],
//     [allSelected, isSelected, toggleAll, toggleOne],
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//     },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     manualSorting: true,
//     manualPagination: true,
//     pageCount: Math.ceil(total / pageSize) || -1,
//   });

//   const pageCount = Math.max(Math.ceil(total / pageSize), 1);
//   const canPrev = pageIndex > 0;
//   const canNext = pageIndex < pageCount - 1;

//   const handleFetch = async () => {
//   try {
//     setIsLoading(true);
//     //console.log('Info:',selectedUser);
//     const res = await fetch('/api/tourbill/bills-by-status', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           search: selectedUser,
//           ticket_status:'Finance Rejected'
//         }),
//       });
//     if (!res.ok) {
//       console.error('Error:', res.status, await res.text());
//       return;
//     }

//     const json: ApiResponse = await res.json(); // { data, total, ... }
//     setData(json.data);
//     setTotal(json.total);
//     setSelectedIds([]);          // optional reset
//   } catch (e) {
//     console.error('Fetch failed:', e);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <>
//     <Breadcrumb fontWeight="semibold" fontSize={"sm"} mb={1} color={"blue.700"}>
//       <BreadcrumbItem>
//         <BreadcrumbLink href="/">Home</BreadcrumbLink>
//       </BreadcrumbItem>
//       <BreadcrumbItem>
//         <BreadcrumbLink href="/tours">Finance</BreadcrumbLink>
//       </BreadcrumbItem>
//       <BreadcrumbItem isCurrentPage>
//         <BreadcrumbLink>Bills Rejected</BreadcrumbLink>
//       </BreadcrumbItem>
//     </Breadcrumb>
//     <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={1}>
//       {/* Filters */}
//       <HStack spacing={1} mb={2} align="flex-start" justifyContent={"left"}>
//         <Box  display={"flex"}>
//           {/* <Text mb={0} fontSize="sm" fontWeight="medium" mr={"5"}>
//             Engineer:
//           </Text> */}
//           <Select
//             placeholder="ALL"
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//             size="sm"
//             bg="cyan.100"
//             fontWeight={"semibold"}
//           >
//             {users.map((u) => (
//               <option key={u.userid} value={u.userid} >
//                 {u.userid}
//               </option>
//             ))}
//           </Select>
//         </Box>
//         <Button colorScheme="blue" onClick={handleFetch} h={8} fontWeight={"thin"} variant="solid">
//           <FaFilter/>Apply
//         </Button>
//         <Button
//           colorScheme="green"
//           isDisabled={selectedIds.length === 0}
//           onClick={handleApproveSelected}
//           h={8} variant="solid" fontWeight={"thin"}
//         >
//           Approve Selected ({selectedIds.length})
//         </Button>
//         <HStack mb={0} h={8} p={0}>
//           <IconButton 
//             colorScheme="blue" 
//             variant="outline" 
//             aria-label="Export CSV"
//             icon={<FaFileExcel/>}
//             size="sm" // or xs for smaller
//           />
//           <IconButton 
//             colorScheme="green" 
//             variant="outline" 
//             aria-label="Export CSV"
//             icon={<FaFileCsv />}
//             size="sm" // or xs for smaller
//           />
//           <IconButton 
//             colorScheme="red" 
//             variant="outline" 
//             aria-label="Export CSV"
//             icon={<FaFilePdf/>}
//             size="sm" // or xs for smaller
//           />
//         </HStack>
//       </HStack>

//       {/* Table */}
//       <Box overflow="auto">
//         <Table
//           size="sm"
//           minW="1200px"
//           variant="striped"
//           colorScheme="gray"
//           maxH="50vh"
//         >
//           <Thead bg="gray.700" top={0} zIndex={1}>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   const canSort = header.column.getCanSort();
//                   const sortDir = header.column.getIsSorted(); // 'asc' | 'desc' | false
//                   return (
//                     <Th
//                       key={header.id}
//                       cursor={canSort ? 'pointer' : 'default'}
//                       onClick={
//                         canSort
//                           ? header.column.getToggleSortingHandler()
//                           : undefined
//                       }
//                       whiteSpace="nowrap"
//                       color="white"
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                       {sortDir === 'asc' && ' ▲'}
//                       {sortDir === 'desc' && ' ▼'}
//                     </Th>
//                   );
//                 })}
//               </Tr>
//             ))}
//           </Thead>

//           <Tbody>
//             {table.getRowModel().rows.length === 0 && !isLoading && (
//               <Tr>
//                 <Td colSpan={columns.length}>
//                   <Text textAlign="center" py={4}>
//                     No records found.
//                   </Text>
//                 </Td>
//               </Tr>
//             )}
//             {table.getRowModel().rows.map((row) => (
//               <Tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <Td key={cell.id}>
//                     {flexRender(
//                       cell.column.columnDef.cell,
//                       cell.getContext(),
//                     )}
//                   </Td>
//                 ))}
//               </Tr>
//             ))}
//           </Tbody>
//           <Tfoot>
//             <Tr>
//               <Td colSpan={columns.length}>
//                 <HStack justify="space-between" align="center">
//                   <HStack>
//                     <IconButton
//                       aria-label="Previous page"
//                       icon={<FiChevronLeft />}
//                       size="sm"
//                       onClick={() => canPrev && setPageIndex((p) => p - 1)}
//                       isDisabled={!canPrev}
//                       bg={"black"}
//                       color={"white"}

//                     />
//                     <IconButton
//                       aria-label="Next page"
//                       icon={<FiChevronRight />}
//                       size="sm"
//                       onClick={() => canNext && setPageIndex((p) => p + 1)}
//                       isDisabled={!canNext}
//                       bg={"black"}
//                       color={"white"}
//                     />
//                     <Text fontSize="sm">
//                       Page {pageIndex + 1} of {pageCount}
//                     </Text>
//                   </HStack>
//                   <HStack>
//                     <Text fontSize="sm">Rows per page:</Text>
//                     <ChakraSelect
//                       size="sm"
//                       width="80px"
//                       value={pageSize}
//                       onChange={(e) => {
//                         setPageSize(Number(e.target.value));
//                         setPageIndex(0);
//                       }}
//                     >
//                       {[10, 20, 50].map((size) => (
//                         <option key={size} value={size}>
//                           {size}
//                         </option>
//                       ))}
//                     </ChakraSelect>
//                     <Text fontSize="sm">Total: {total}</Text>
//                   </HStack>
//                 </HStack>
//               </Td>
//             </Tr>
//           </Tfoot>
//         </Table>
//       </Box>
//     {/* <TourEditSlider
//       isOpen={isTourEditOpen}
//       onClose={closeTourEdit}
//       tourId={selectedRow?.id ?? 0}
//       onUpdated={fetchDataAgain}
//     />; */}
//     {/* <TourViewSlider
//       isOpen={isTourViewOpen}
//       onClose={closeTourView}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain}
//     />; */}
//     <ViewGpsSlider
//       isOpen={isTourGpsOpen}
//       onClose={closeTourGps}
//       tourId={selectedRow?.id ?? 0}
//       onUpdated={fetchDataAgain}
//     />;
//     {/* <MgrTourApprovalSlider
//       isOpen={isTourApprovalOpen}
//       onClose={closeTourApproval}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain}
//     />;
//     <MgrTourReturnSlider
//       isOpen={isTourReturnOpen}
//       onClose={closeTourReturn}
//       initialData={selectedRow}
//       onUpdated={fetchDataAgain}
//     />; */}
//     </Box>
//     </>
//   )
// }
//--------------------------------------------------------------------------




