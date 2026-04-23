// src/pages/FilteredTablePage.tsx
import { Flex, Input, Link, Spacer, Table } from '@chakra-ui/react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import {
//   Select,
//   useDisclosure,
// } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  // Input,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import {
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FiDownload, FiSearch } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight, FiEdit,  } from 'react-icons/fi';
import { FaRecycle, FaTrash } from 'react-icons/fa6';
import { useToast } from '@chakra-ui/react';
import type { EmployeeType } from '../../types/EmployeeType';
import { FaPlusCircle } from 'react-icons/fa';
import AddEmpSlider from '../../components/admin/AddEmpSlider';
import EmpEditSlider from '../../components/admin/EmpEditSlider';
import { ConfirmDeleteDialog } from '../../components/utils/ConfirmDeleteDialog';
import TableLoader from '../../components/TableLoader';
import {
  useReactTable,
  getCoreRowModel,     // ✅ Always required
  getPaginationRowModel,
} from '@tanstack/react-table';
const columnHelper = createColumnHelper<EmployeeType>();

export default function Employees() {
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState<EmployeeType | null>(null);
  const [selectedIds] = useState<number[]>([]);
  const isSelected = (tourid: number) => selectedIds.includes(tourid);
  const [isEmpAddOpen, setIsEmpAddOpen] = useState(false);
  const [isEmpEditOpen, setIsEmpEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<EmployeeType | null>(null);
  const toast = useToast();
  const token = localStorage.getItem('authToken');
  const [isExporting, setIsExporting] = useState(false);
  // const [employees, setEmployees] = useState<any[]>([]);
  
  // ✅ Single pagination state (remove old pageIndex/pageSize)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [data, setData] = useState<EmployeeType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/emp/emplist?${params.toString()}`,
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
      await exportToExcel(json.data, "Full_Employee_Report");
      
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCSV = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/emp/emplist?${params.toString()}`,
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
      await exportToCsv(json.data, "Full_Employee_Report");
      
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDF = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/emp/emplist?${params.toString()}`,
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
      await exportToPDF(json.data, "employees.pdf");
      
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleHtml = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        "per_page": "all"
      });
      // 1. Fetch ALL data from Laravel specifically for the report
      const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
      const res = await fetch(
        `${apiUrl}/api/touradmin/emp/emplist?${params.toString()}`,
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
      await exportHTML(json.data, "employees.html");
      
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };


  const exportToExcel = async (data: any[], fileName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Main Sheet');

    // 1. Define Columns (This replaces SheetJS auto-headers)
    worksheet.columns = [
      { header: 'UserID', key: 'userid', width: 15 },
      { header: 'Employee Id', key: 'empid', width: 15 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'First Name', key: 'first_name', width: 20 },
      { header: 'Middle Name', key: 'middle_name', width: 12 },
      { header: 'Last Name', key: 'last_name', width: 15 },
      { header: 'Mobile No', key: 'mobile_no', width: 20 },
      { header: 'Department', key: 'department', width: 12 },
      { header: 'Base Location', key: 'base_location', width: 15 },
      { header: 'DOB', key: 'dob', width: 20 },
      { header: 'Marital Status', key: 'marital_status', width: 12 },
      { header: 'Joining Date', key: 'doj', width: 15 },
      { header: 'Competency Level', key: 'competency_level', width: 20 },
      { header: 'Manager', key: 'manager', width: 12 },
      { header: 'Fixed DA', key: 'fixed_da', width: 15 },
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


//   const exportCSV = async (rows: any[], fileName: string) => {
//   const headers = [
//     'Designation','Empid','Userid','First Name',//'Middle Name','Last Name',
//                 'Mobile No','Department','Base Location','DOB','Marital Status','DOJ','Level',
//                 'Manager','Fixed DA'
//   ];

//   const lines = [
//     headers.join(','), // header row
//     ...rows.map((r) =>
//       [
//         r.empid,
//         r.userid,
//         r.first_name,
//         r.designation,
//         r.mobile_no,
//         r.department,
//         r.competency_level,
//         r.manager,
//         r.fixed_da,
//         r.base_location,
//       ]
//         .map((value) => {
//           const v = value ?? '';
//           // Escape " and , for CSV
//           const s = String(v).replace(/"/g, '""');
//           return `"${s}"`;
//         })
//         .join(','),
//     ),
//   ];

//   const csv = lines.join('\r\n');
//   const blob = new Blob([csv], {
//     type: 'text/csv;charset=utf-8;',
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = 'employees.csv';
//   a.click();
// };


  const exportToPDF = async (rows: any[], fileName: string) => {
    const doc = new jsPDF('l', 'pt', 'a4'); // or 'p', 'mm', 'a4'
  const headers = [
    'Designation','Empid','Userid','First Name',//'Middle Name','Last Name',
                'Mobile No','Department','Base Location','DOB','Marital Status','DOJ','Level',
                'Manager','Fixed DA'
  ];

  const body = rows.map((r) => [
    r.designation,
    r.empid,
    r.userid,
    r.first_name,
    r.mobile_no,
    r.department,
    r.base_location,
    r.dob,
    r.marital_status,
    r.doj,
    r.competency_level,
    r.manager,
    r.fixed_da,
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

  // const formatDateForCsv = (date: Date | string) => {
  //   const d = new Date(date);
  //   // Returns YYYY-MM-DD which Excel recognizes globally
  //   return d.toISOString().split('T')[0]; 
  // };

  const exportToCsv = async (rows: any[], fileName: string) => {
    // 1. Create Workbook & Worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Export');

    // 2. Define Columns
    worksheet.columns = [
      { header: 'UserID', key: 'userid', width: 15 },
      { header: 'Employee Id', key: 'empid', width: 15 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'First Name', key: 'first_name', width: 20 },
      { header: 'Mobile No', key: 'mobile_no', width: 20 },
      { header: 'Department', key: 'department', width: 12 },
      { header: 'Base Location', key: 'base_location', width: 15 },
      { header: 'DOB', key: 'dob', width: 20 },
      { header: 'Marital Status', key: 'marital_status', width: 12 },
      { header: 'Joining Date', key: 'doj', width: 15 },
      { header: 'Competency Level', key: 'competency_level', width: 20 },
      { header: 'Manager', key: 'manager', width: 12 },
      { header: 'Fixed DA', key: 'fixed_da', width: 15 },
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
      'Designation',
      'Empid',
      'Userid',
      'First Name',
      'Mobile No',
      'Department',
      'Base Location',
      'DOB',
      'Marital Status',
      'DOJ',
      'Level',
      'Manager',
      'Fixed DA'
    ];

    const headerRow = `<tr>${headers
      .map((h) => `<th>${h}</th>`)
      .join('')}</tr>`;

    const bodyRows = rows
      .map(
        (r) =>
          `<tr>${[
            r.designation,
            r.empid,
            r.userid,
            r.first_name,
            r.mobile_no,
            r.department,
            r.base_location,
            r.dob,
            r.marital_status,
            r.doj,
            r.competency_level,
            r.manager,
            r.fixed_da,
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

  function fetchDataAgain(): void {
    handleFetch();
  }

  const handleSearch = (searchText: string) => {
      handleFetch({ search: searchText });
  };

  const closeEmpAdd = () => {
    setSelectedRow(null);
    setIsEmpAddOpen(false);
  };
  //Emp Edit
  const OpenEmpEditSlider = (row: EmployeeType) => {
    setSelectedRow(row);
    setIsEmpEditOpen(true);
  };
  const CloseEmpEditSlider = () => {
    setSelectedRow(null);
    setIsEmpEditOpen(false);
  };
  
  // Columns, including selection column
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
              _hover={{bg:"black",textColor:"white"}}
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
              color={"red.500"}
              size="sm"
              variant="ghost"
              _hover={{bg:"black",textColor:"white"}}
              onClick={() => {
                setRowToDelete(rowData);     // store row
                setIsDeleteOpen(true);       // open dialog
              }}
            />
          );
        },
      }),
      columnHelper.accessor('empid', {
        header: 'EmployeeID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('userid', {
        header: 'User ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('first_name', {
        header: 'Full Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('mobile_no', {
        header: 'Mobile No',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('competency_level', {
        header: 'Competency Level',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('manager', {
        header: 'Manager',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('fixed_da', {
        header: 'Fixed DA',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('base_location', {
        header: 'Branch',
        cell: (info) => info.getValue(),
      }),
    ],
    [isSelected],
  );

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: {
  //     sorting,
  //   },
  //   onSortingChange: setSorting,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   manualSorting: true,
  //   manualPagination: true,
  //   pageCount: Math.ceil(total / pageSize) || -1,
  // });

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: { pagination: { pageIndex, pageSize } },
  //   onPaginationChange: setPagination,
  //   getPaginationRowModel: getPaginationRowModel(),
  //   manualPagination: true,
  //   pageCount: total ? Math.ceil(total / pageSize) : 0,
  //   getCoreRowModel: function (table: Table<any>): () => RowModel<any> {
  //     throw new Error('Function not implemented.');
  //   }
  // });


//   const table = useReactTable({
//   data,
//   columns,
//   state: { pagination: { pageIndex, pageSize } },
//   onPaginationChange: setPagination,
//   getCoreRowModel: getCoreRowModel(),        // ✅ Fixes the error
//   getPaginationRowModel: getPaginationRowModel(),
//   manualPagination: true,
//   // pageCount: total ? Math.ceil(total / pagination.pageSize) : 0,
//   // pageCount: total ? Math.ceil(total / pageSize) : 0,
//   pageCount: total ? Math.ceil(total / pagination.pageSize) : 0,
// });

  // ✅ Table uses pagination state
const table = useReactTable({
  columnResizeMode: 'onChange', // or 'onEnd'
  data,
  columns,
  state: { pagination },  // ✅ Single source
  onPaginationChange: setPagination,  // ✅ Table controls it
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  manualPagination: true,
  // pageCount: total ? Math.ceil(total / pagination.pageSize) : -1,
  pageCount: total ? Math.ceil(total / pagination.pageSize) : 0, // ✅
});
  // const { pageIndex, pageSize } = table.getState().pagination;
  // const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  // const canPrev = pageIndex > 0;
  // const canNext = pageIndex < pageCount - 1;
  // ✅ Table-controlled buttons (REPLACE your manual ones)
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const showAddEmpSlider= async () => {
    setIsLoading(true);
    try {
      setIsEmpAddOpen(true);
    }
    catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  }

const handleFetch = useCallback(
  async (opts?: { search?: string }) => {
    setIsLoading(true);

    const params = new URLSearchParams({
      page: (pagination.pageIndex + 1).toString(),
      per_page: pagination.pageSize.toString(),
    });

    if (opts?.search) {
      params.set("search", opts.search); // or whatever param your API expects
    }

    const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
    const res = await fetch(
      `${apiUrl}/api/touradmin/emp/emplist?${params.toString()}`,
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
  },
  [pagination.pageIndex, pagination.pageSize, token],
);

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
      const res = await fetch(`${apiUrl}/touradmin/empdelete/${rowToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,   // 👈 Bearer token
          'Accept': 'application/json',
        },
        credentials: 'include',
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
        description: `Employee ${rowToDelete.empid} deleted successfully.`,
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
        <Text color="gray.500">/</Text>
        <Text fontWeight="normal">Employees</Text>
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
            placeholder="Search employees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            bg="yellow.100"
          />
          <InputRightElement width="2.5rem">
            <IconButton
              aria-label="Search"
              size="sm"
              icon={<FiSearch />}
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
          onClick={showAddEmpSlider} 
          h={8} 
          fontSize="sm"
          mr={0}
        >
        </Button>
        {/* <Button size="sm" colorScheme="green" onClick={() => exportToExcel(employees, "Employee_Report")}> */}
        <Button
          size="sm" colorScheme="green"
          isLoading={isExporting} 
          onClick={handleExport}
          leftIcon={<FiDownload />}
        >
          EXCEL
        </Button>
        <Button size="sm" colorScheme="green"
            isLoading={isExporting} 
            onClick={handleCSV}
            leftIcon={<FiDownload />}>
          CSV
        </Button>
        <Button size="sm" colorScheme="green"
          isLoading={isExporting} 
          onClick={handleHtml}
          leftIcon={<FiDownload />}>
          HTML
        </Button>
        <Button
          size="sm" colorScheme="green"
          isLoading={isExporting} 
          onClick={handlePDF}
          leftIcon={<FiDownload />}
          >
            PDF
        </Button>
      </HStack>
    </Flex>
    <Box borderWidth="1px" borderRadius="md" maxH="500px" overflow="auto" p={0} position="relative">
      {/* Filters */}
      {/* <HStack spacing={1} mb={1} align="flex-end" justifyContent={"left"}>
      </HStack> */}

      {/* Table */}
      <Box
        flex="1"             // ✅ fills remaining vertical space
        
        // overflowY="auto"
        // overflowX="auto"
        // borderWidth="1px"
        // borderRadius="md"
        // p={1}
        position="relative"
      >
        <Table
          size="sm"
          minW="1200px"
          variant="striped"
          colorScheme="gray"
          //maxH="50vh"
          //h="100vh"
          position="relative"
          maxH="100vh"
          
        >
          <Thead bg="gray.700" 
            top={0} 
            zIndex={1} 
            position="sticky"  // ✅ make header sticky
          >
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
                      style={{
                        width: header.getSize(),
                      }}
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
    <AddEmpSlider
      isOpen={isEmpAddOpen}
      onClose={closeEmpAdd}
      initialData={selectedRow}
      onUpdated={fetchDataAgain} 
      />
    <EmpEditSlider
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

// function setPagination(_updaterOrValue: Updater<PaginationState>): void {
//   throw new Error('Function not implemented.');
// }

