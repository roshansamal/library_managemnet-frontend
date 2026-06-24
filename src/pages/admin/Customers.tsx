// src/pages/FilteredTablePage.tsx
import { Flex, Input, InputGroup, InputRightElement, Link, Spacer, Table } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Box,
  Button,
  HStack,
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
  // type PaginationState,
  // type Row,
  // type RowModel,
  // type SortingState,
  // type Updater,
} from '@tanstack/react-table';
import { FiChevronLeft, FiChevronRight, FiDownload, FiEdit, FiSearch, } from 'react-icons/fi';
import { FaRecycle, FaTrash } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';
import type { CustomerType } from '../../types/CustomerType';
import { FaChevronRight, FaPlusCircle } from 'react-icons/fa';
import { ConfirmDeleteDialog } from '../../components/utils/ConfirmDeleteDialog';
import TableLoader from '../../components/TableLoader';
import {
  useReactTable,
  getCoreRowModel,     // ✅ Always required
  getPaginationRowModel,
} from '@tanstack/react-table';
import AddCustomerSlider from '../../components/admin/AddCustomerSlider';
import EditCustomerSlider from '../../components/admin/EditCustomerSlider';
const columnHelper = createColumnHelper<CustomerType>();

export default function Customers() {
  const [searchText, setSearchText] = useState("");
  // const [isExporting, setIsExporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  //---------------------------
  const [selectedRow, setSelectedRow] = useState<CustomerType | null>(null);
  const [selectedIds,] = useState<number[]>([]);
  const isSelected = (tourid: number) => selectedIds.includes(tourid);
  const [isCustAddOpen, setIsCustAddOpen] = useState(false);
  const [isEmpEditOpen, setIsEmpEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<CustomerType | null>(null);
  const toast = useToast();
  const token = localStorage.getItem('authToken');

  // ✅ Single pagination state (remove old pageIndex/pageSize)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [data, setData] = useState<CustomerType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function fetchDataAgain(): void {
    handleFetch();
  }
  const handleSearch = (searchText: string) => {
    handleFetch({ search: searchText });
  };

  const handleExcel = async () => {
    setIsExportingExcel(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/customer-export?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
      setIsLoading(false);

      // 2. Pass the fresh data to your ExcelJS function
      // Ensure 'response.data' is the array of employees
      await exportToExcel(json.data, "Customers");

    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleCSV = async () => {
    setIsExportingCsv(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/customer-export?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
      setIsLoading(false);

      // 2. Pass the fresh data to your ExcelJS function
      // Ensure 'response.data' is the array of employees
      await exportToCsv(json.data, "Customers");

    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handlePDF = async () => {
    setIsExportingPdf(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/customer-export?${params.toString()}`,
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
      await exportToPDF(json.data, "Customers.pdf");

    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleHtml = async () => {
    setIsExportingHtml(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/customer-export?${params.toString()}`,
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
      await exportHTML(json.data, "Customers.html");

    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExportingHtml(false);
    }
  };


  const exportToExcel = async (data: any[], fileName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Main Sheet');

    // 1. Define Columns (This replaces SheetJS auto-headers)
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 15 },
      { header: 'Customer Type', key: 'customer_type', width: 15 },
      { header: 'Primary Location', key: 'primary_location', width: 20 },
      { header: 'Contact Person', key: 'contact_person', width: 20 },
      { header: 'Contact Person No', key: 'contact_person_no', width: 20 },
      { header: 'Primary Contact No', key: 'primay_contact_no', width: 12 },
      { header: 'Alt Contact No', key: 'alt_contact_no', width: 15 },
      { header: 'WhatsApp No', key: 'whatsapp_mobileno', width: 20 },
      { header: 'Customer Status', key: 'customer_status', width: 12 },
      { header: 'Principal Company', key: 'principal_company', width: 15 },
      { header: 'Address1', key: 'address1', width: 20 },
      { header: 'Address2', key: 'address2', width: 12 },
      { header: 'Address3', key: 'address3', width: 15 },
      { header: 'EMail', key: 'email', width: 15 },
      { header: 'Is Active', key: 'is_active', width: 15 },
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
      'Name',
      'Customer Type',
      'Primary Location',
      'Contact Person',
      'Contact Person No',
      'Primary Contact No',
      'Alt Contact No',
      'WhatsApp No',
      'Customer Status',
      'Principal Company',
      'Address1',
      'Address2',
      'Address3',
      'EMail',
      'Is Active',
    ];

    const body = rows.map((r) => [
      r.name,
      r.customer_type,
      r.primary_location,
      r.contact_person,
      r.contact_person_no,
      r.primary_contact_no,
      r.alternate_contact_no,
      r.whatsapp_mobileno,
      r.customer_status,
      r.principal_company,
      r.address1,
      r.address2,
      r.address3,
      r.email,
      r.is_active
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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Export');

    // 2. Define Columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 15 },
      { header: 'Customer Type', key: 'customer_type', width: 15 },
      { header: 'Primary Location', key: 'primary_location', width: 20 },
      { header: 'Contact Person', key: 'contact_person', width: 20 },
      { header: 'Contact Person No', key: 'contact_person_no', width: 20 },
      { header: 'Primary Contact No', key: 'primay_contact_no', width: 12 },
      { header: 'Alt Contact No', key: 'alt_contact_no', width: 15 },
      { header: 'WhatsApp No', key: 'whatsapp_mobileno', width: 20 },
      { header: 'Customer Status', key: 'customer_status', width: 12 },
      { header: 'Principal Company', key: 'principal_company', width: 15 },
      { header: 'Address1', key: 'address1', width: 20 },
      { header: 'Address2', key: 'address2', width: 12 },
      { header: 'Address3', key: 'address3', width: 15 },
      { header: 'EMail', key: 'email', width: 15 },
      { header: 'Is Active', key: 'is_active', width: 15 },
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
      'Name',
      'Customer Type',
      'Primary Location',
      'Contact Person',
      'Contact Person No',
      'Primary Contact No',
      'Alt Contact No',
      'WhatsApp No',
      'Customer Status',
      'Principal Company',
      'Address1',
      'Address2',
      'Address3',
      'EMail',
      'Is Active',
    ];

    const headerRow = `<tr>${headers
      .map((h) => `<th>${h}</th>`)
      .join('')}</tr>`;

    const bodyRows = rows
      .map(
        (r) =>
          `<tr>${[
            r.name,
            r.customer_type,
            r.primary_location,
            r.contact_person,
            r.contact_person_no,
            r.primary_contact_no,
            r.alternate_contact_no,
            r.whatsapp_mobileno,
            r.customer_status,
            r.principal_company,
            r.address1,
            r.address2,
            r.address3,
            r.email,
            r.is_active
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

  const handleFetch = useCallback(async (_opts?: { search?: string }) => {
    console.log('Fetching page:', pagination.pageIndex + 1);
    setIsLoading(true);
    const params = new URLSearchParams({
      page: (pagination.pageIndex + 1).toString(),
      per_page: pagination.pageSize.toString(),
    });

    if (_opts?.search) {
      params.set("search", _opts.search); // or whatever param your API expects
    }

    const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
    const res = await fetch(`${apiUrl}/api/touradmin/customerlist?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,   // 👈 Bearer token
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    console.log(json);
    setData(json.data);
    setTotal(json.total);
    setIsLoading(false);
  }, [pagination.pageIndex, pagination.pageSize, token]);

  const closeCustAdd = () => {
    setSelectedRow(null);
    setIsCustAddOpen(false);
  };

  const OpenEmpEditSlider = (row: CustomerType) => {
    setSelectedRow(row);
    setIsEmpEditOpen(true);
  };
  const CloseEmpEditSlider = () => {
    setSelectedRow(null);
    setIsEmpEditOpen(false);
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
      // columnHelper.accessor('id', {
      //   header: 'ID',
      //   cell: ({ row }) => <span>{row.index + 1}</span>,
      // }),
      columnHelper.display({
        id: 'edit',
        header: 'Edit',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              aria-label="Edit"
              icon={<FiEdit />}
              size="sm"
              variant="ghost"
              _hover={{ bg: "black", textColor: "white" }}
              onClick={() => {
                OpenEmpEditSlider(rowData);
              }}
            />
          );
        },
      }),
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <IconButton
              aria-label="Delete"
              icon={<FaTrash />}
              color={"red"}
              size="sm"
              variant="ghost"
              _hover={{ bg: "black", textColor: "white" }}
              onClick={() => {
                setRowToDelete(rowData);     // store row
                setIsDeleteOpen(true);       // open dialog
              }}
            />
          );
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Customer Name',
        cell: info => info.getValue(),
        size: 500,       // ✅ desired width in px
        minSize: 200,
        maxSize: 500,
      }),
      columnHelper.accessor('customer_type', {
        header: 'Customer Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('primary_location', {
        header: 'Primary Location',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person', {
        header: 'Contact Person',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contact_person_no', {
        header: 'Contact No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('prim_contact_no', {
        header: 'Primary No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('alt_contact_no', {
        header: 'Alternate No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('whatsapp_mobileno', {
        header: 'WhatsApp',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('customer_status', {
        header: 'Customer Status',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('principal_company', {
        header: 'Principal Company',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('address1', {
        header: 'Address',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
    ],
    [isSelected],
  );

  // ✅ Table uses pagination state
  const table = useReactTable({
    data,
    columns,
    state: { pagination },  // ✅ Single source
    onPaginationChange: setPagination,  // ✅ Table controls it
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: total ? Math.ceil(total / pagination.pageSize) : -1,
  });
  // const { pageIndex, pageSize } = table.getState().pagination;
  // const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  // ✅ Table-controlled buttons (REPLACE your manual ones)
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const showAddCustomerSlider = async () => {
    setIsLoading(true);
    try {
      setIsCustAddOpen(true);
    }
    catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Auto-fetch on page change + initial load
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // ✅ Table-controlled buttons (REPLACE your manual ones)
  // const canPrev = table.getCanPreviousPage();
  // const canNext = table.getCanNextPage();


  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(`${apiUrl}/touradmin/customer-delete/${rowToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      // Option 1: refetch
      await handleFetch();

      // Option 2: local remove (if you prefer):
      // setData(prev => prev.filter(emp => emp.id !== rowToDelete.id));

      toast({
        title: 'Deleted',
        description: `Employee ${rowToDelete.name} deleted successfully.`,
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
        direction="column"
        h="calc(100vh - 80px)" // or "100vh" if this is the whole page
      >
        <Flex align="center" as="nav" aria-label="Breadcrumb" w="100%" py={1}>
          {/* Left Side: Breadcrumbs */}
          <HStack spacing={1} display={{ base: "none", md: "flex" }}>
            <Link href="/dashboard" color="blue.500" fontWeight="normal">Admin</Link>
            <FaChevronRight />
            <Text fontWeight="normal">Customers</Text>
          </HStack>
          {/* The Magic: This fills all available space between the two groups */}
          <Spacer />
          {/* Right Side: Action Buttons */}
          <HStack
            direction={['column', 'row']} // column on mobile, row on md+
            spacing={1}
            flexWrap="wrap"              // allow wrapping when needed
            align="stretch">
            <InputGroup maxW="200px" size="sm">
              <Input
                placeholder="Search ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                bg="white"
              />
              <InputRightElement width="2.5rem">
                <IconButton
                  aria-label="Search"
                  size="sm"
                  icon={<FiSearch />}
                  color={"black"}
                  onClick={() => handleSearch(searchText)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <Button
              leftIcon={<FaRecycle />}
              colorScheme="green"
              onClick={() => handleFetch()}  // ✅ no args, ignore event
              h={8}
              fontSize="sm"
            >
            </Button>
            <Button
              leftIcon={<FaPlusCircle />}
              colorScheme="blue"
              onClick={showAddCustomerSlider}
              h={8}
              fontSize="sm"
              mr={0}
            >
            </Button>
            {/* <Button size="sm" colorScheme="green" onClick={() => exportToExcel(employees, "Employee_Report")}> */}
            <Button
              size="sm" colorScheme="green"
              isLoading={isExportingExcel}
              onClick={handleExcel}
              leftIcon={<FiDownload />}
            >
              EXCEL
            </Button>
            <Button size="sm" colorScheme="green"
              isLoading={isExportingCsv}
              onClick={handleCSV}
              leftIcon={<FiDownload />}>
              CSV
            </Button>
            <Button size="sm" colorScheme="green"
              isLoading={isExportingHtml}
              onClick={handleHtml}
              leftIcon={<FiDownload />}>
              HTML
            </Button>
            <Button
              size="sm" colorScheme="green"
              isLoading={isExportingPdf}
              onClick={handlePDF}
              leftIcon={<FiDownload />}>
              PDF
            </Button>
          </HStack>
        </Flex>

       <Box borderWidth="1px" borderRadius="md" overflow="auto" p={0} position="relative" h="100%" flex={1}>
          {/* <Box maxH="500px" overflowY="auto"> */}
          <Box position="relative" flex="1">
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sortDir = header.column.getIsSorted();

                      return (
                        <Th
                          key={header.id}
                          position="sticky"
                          top={0}
                          zIndex={2}
                          bg="gray.700"
                          color="white"
                          cursor={canSort ? 'pointer' : 'default'}
                          whiteSpace="nowrap"
                          onClick={
                            canSort ? header.column.getToggleSortingHandler() : undefined
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
              bg="gray.200"          // background so rows don't bleed through
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
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </ChakraSelect>
                <Text fontSize="sm">Total: {total}</Text>
              </HStack>
            </HStack>
          {/* Bottom Area End */}
            <TableLoader
              isLoading={isLoading}
              message="Loading..."
              size="lg"
            />
          </Box>
          <AddCustomerSlider
            isOpen={isCustAddOpen}
            onClose={closeCustAdd}
            initialData={selectedRow}
            onUpdated={fetchDataAgain}
          />
          <EditCustomerSlider
            isOpen={isEmpEditOpen}
            onClose={CloseEmpEditSlider}
            initialData={selectedRow}
            onUpdated={fetchDataAgain}
          />
          <ConfirmDeleteDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        </Box>
      </Flex>
    </>
  );
}



