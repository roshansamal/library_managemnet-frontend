import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  HStack,
  Text,
  useBreakpointValue,
  Table,
  Thead,
  Tr,
  Select as ChakraSelect,
  Th,
  Tbody,
  Td,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import type { ServicingMasterType } from "../../types/ServicingMasterType";
import TableLoader from "../../components/TableLoader";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type ApiItem = {
  machine_model: string; // used for both models and serials (per your API)
};
type ApiSerial = {
  id: number;
  machine_serial: string; // used for both models and serials (per your API)
};
type ApiSerialResponse = {
  //success: boolean;
  //count: number;
  data: ApiSerial[];
};
// type SerialItem = {
//   id: number;
//   machine_serial: string;
// };

type ApiListResponse = {
  success: boolean;
  count: number;
  data: ApiItem[];
};


export default function ServicingList() {
  const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
  const brandNames = ["VOLVO", "SDLG"];
  const token = localStorage.getItem("authToken");
  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingSerials, setIsLoadingSerials] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [hmrData, setHmrData] = useState<any[]>([]);
  const columnHelper = createColumnHelper<ServicingMasterType>();
  const [data, setData] = useState<ServicingMasterType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const [serialNo, setSerialNo] = useState("");
  // const [serials, setSerials] = useState<string[]>([]);
  // Single pagination state controlled by TanStack Table
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  type MyRow = {
    id:number;
    machine_brand:string;
    product_type:string;
    machine_model:string;
    machine_serial:string;
    service_date:string;
    service_by:string;
    service_at_hmr:string;
    service_type:number; //` mediumint(9) DEFAULT NULL,
    record_writer:string;
    record_date:string;
    remarks:string;
    status:string;
    machine_id:number;
};

  type SerialItem = {
    id: string | number;
    machine_serial: string;
  };
  const [serials, setSerials] = useState<SerialItem[]>([]);
  const [serialNo, setSerialNo] = useState("");
  // const [machineId, setMachineId] = useState("");

  const direction = useBreakpointValue<"column" | "row">({
    base: "column",
    md: "row",
  });

  

  // Brand -> load models
  const handleBrandChange = async (value: string) => {
    setBrandName(value);
    setModelName("");
    setSerialNo("");
    setModels([]);
    setSerials([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (!value) return;
    try {
      setIsLoadingModels(true);
      const res = await fetch(
        `${apiUrl}/api/tourbill/ddmodels?brand=${encodeURIComponent(value)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to load models: ${res.status}`);
      }
      const json: ApiListResponse = await res.json();
      const modelNames = json.data.map((item) => item.machine_model);
      setModels(modelNames);
    } catch (err) {
      console.error("load models failed", err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Model -> load serials
  const handleModelChange = async (value: string) => {
    setModelName(value);
    setSerialNo("");
    setSerials([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (!brandName || !value) return;
    try {
      setIsLoadingSerials(true);
      const res = await fetch(
        `${apiUrl}/api/touradmin/dd-serialno?brand_filter=${encodeURIComponent(
          brandName,
        )}&model_filter=${encodeURIComponent(value)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to load serials: ${res.status}`);
      }

      // const json: ApiSerialResponse = await res.json();
      // const serialList = json.data.map((item) => item.machine_serial);
      // console.log(serialList);
      // setSerials(serialList);
      const json: ApiSerialResponse = await res.json();
      //setSerials(json.data);
      setSerials(
        json.data.map((item) => ({
          id: item.id,
          machine_serial: item.machine_serial,
        })),
      );
    } catch (err) {
      console.error("load serials failed", err);
    } finally {
      setIsLoadingSerials(false);
    }
  };

  const handleSerialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSerialNo(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    console.log(`Value Selected: ${value}`);
  }

  // const fetchServicingList = async () => {
  //   try {
  //     console.log (`Value of Machine Master ID: ${serialNo}`);
  //     setIsSubmitting(true);
  //     //const selectedSerial = serials.find((item) => String(item.id) === serialNo);
  //     const res = await fetch(
  //       `${apiUrl}/api/touradmin/hmr-history/${encodeURIComponent(serialNo)}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //         },
  //       },
  //     );

  //     if (!res.ok) {
  //       console.error("Error:", res.status, await res.text());
  //       return;
  //     }

  //     const json = await res.json();
  //     //console.log("HMR details:", json);
  //     setHmrData(json.data || []);

  //     // const firstRow = json.data?.[0];
  //     // setHmrId(firstRow?.id ?? null);
  //     // console.log("HMRID:", firstRow?.id);

  //     //setHmrId(json.data?.id ?? null);
  //     //setHmrId(json.data.id);
  //     //console.log(`HMRID: ${json.data.id}`);

  //     // setHmrDetails(json.data ? [json.data] : []);
  //     // setHmrId(json.data?.id ?? null);
  //   } catch (e) {
  //     console.error("Fetch failed:", e);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


const handleFetch = useCallback(async () => {
    try {
      console.log(`Model Name: ${modelName}`);
      setIsLoading(true);
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        per_page: pagination.pageSize.toString(),
        brand:brandName,
        model:modelName,
        serial:serialNo,
        hours:'',
      });

      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
      const res = await fetch(
        `${apiUrl}/api/touradmin/servicing-list?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      setData(json.data);
      console.log(json.data);
      setTotal(json.total);
    } catch (err) {
        console.error('Fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, token, brandName, modelName, serialNo]);

  // function fetchDataAgain(): void {
  //   void handleFetch();
  // }

  // useEffect(() => {
  //   void handleFetch();
  // }, [handleFetch]);

function MyTable({ data }: { data: MyRow[] }) {
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
        columnHelper.accessor('machine_brand', {
          header: 'Brand',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('product_type', {
          header: 'Type',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('machine_model', {
          header: 'Model',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('machine_serial', {
          header: 'Serial',
          cell: (info) => info.getValue(),
        }),
         columnHelper.accessor('service_type', {
          header: 'Service Type',
          cell: (info) => info.getValue()+' Hrs',
        }),
         columnHelper.accessor('service_at_hmr', {
          header: 'Service HMR',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('service_date', {
          header: 'Service Date',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('service_by', {
          header: 'Service By',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('record_writer', {
          header: 'Record Writer',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('record_date', {
          header: 'Record Date',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('remarks', {
          header: 'Remarks',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('machine_id', {
          header: 'Machine ID',
          cell: (info) => info.getValue(),
        }),
      ],
      [],
    );
   const table = useReactTable({
      data,
      columns,
      state: { pagination },
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      manualPagination: true,
      pageCount: total ? Math.ceil(total / pagination.pageSize) : -1,
    });

  const { pageIndex, pageSize } = table.getState().pagination;
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();
  return (
    <>
    <Box borderWidth="1px" borderRadius="md" maxH="350px" overflow="auto" p={1}>
      <Box maxW="100%" overflow="auto">
      <Table variant="striped" size="sm" borderX="1px" >
        <Thead bg="gray.700" top={0} zIndex={1}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
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

                    borderX="1px" borderColor="gray.200"
                    borderRight="1px" 
                    // p={3} 
                    // fontSize="sm" 
                    // fontWeight="bold"
                    //color="gray.700"
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
              <Td colSpan={columns.length}
                borderRight="1px" 
                borderColor="gray.100" 
                p={3}
              >
                <Text textAlign="center" py={4}>
                  No records found.
                </Text>
              </Td>
            </Tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}
                // borderRight="1px" 
                // borderTop="1px" 
                // borderBottom="1px"
                // borderLeft={"1px"}
                // borderColor="gray.500" 
                //p={1}
                >
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
      <TableLoader
        isLoading={isLoading}
        message="Loading..."
        size="lg"
      />
    </Box>
    <Flex
        justify="space-between"
        align="center"
        w="full"
        mt={2}
      >
        <HStack spacing={2} alignItems="center">
          <IconButton
            bgColor="black"
            color="white"
            borderColor="gray"
            aria-label="Previous"
            icon={<FiChevronLeft />}
            onClick={() => table.previousPage()}
            isDisabled={!canPrev}
            size="sm"
          />
          <IconButton
            bgColor="black"
            color="white"
            borderColor="gray"
            aria-label="Next"
            icon={<FiChevronRight />}
            onClick={() => table.nextPage()}
            isDisabled={!canNext}
            size="sm"
          />
          <Text fontSize="sm">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </Text>
        </HStack>

        <HStack spacing={2} alignItems="center">
          <Text fontSize="sm">Rows per page:</Text>
          <ChakraSelect
            bgColor="yellow.100"
            size="sm"
            width="80px"
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              table.setPageSize(newSize);
              table.setPageIndex(0);
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
      </Flex>
    </Box>
    </>
  );
}


return (
  <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      fontWeight="medium"
      mb={2}
    >
      <HStack spacing={1} as="nav" aria-label="Breadcrumb">
        <Text fontWeight="normal" fontSize="sm" color="black">
          Machine
        </Text>
        <Text color="gray.500">/</Text>
        <Text fontWeight="normal" fontSize="sm" color="black">
          ServicingList
        </Text>
      </HStack>
    </Box>

    <Box borderWidth="1px" borderRadius="md" p={2} bgColor={"gray.300"}>
      <Box overflow="auto" >
        <Stack
          direction={direction}
          spacing={2}
          align="flex-end"
          justify="space-between"
          flexWrap="wrap"
        >
          {/* Brand */}
          <FormControl
            minW={{ base: "100%", md: "200px" }}
            w={{ base: "100%", md: "20%" }}
          >
            <FormLabel fontSize="sm">Brand</FormLabel>
            <Select
              placeholder="Select Brand"
              value={brandName}
              onChange={(e) => handleBrandChange(e.target.value)}
              size="sm"
              bgColor={"white"}
            >
              {brandNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Model */}
          <FormControl
            minW={{ base: "100%", md: "200px" }}
            w={{ base: "100%", md: "20%" }}
            isDisabled={!brandName || isLoadingModels}
          >
            <FormLabel fontSize="sm">Model</FormLabel>
            <Select
              placeholder={
                isLoadingModels
                  ? "Loading models..."
                  : brandName
                  ? "Select model"
                  : "Select brand first"
              }
              value={modelName}
              onChange={(e) => handleModelChange(e.target.value)}
              size="sm"
              bgColor={"white"}
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Serial */}
          <FormControl
            minW={{ base: "100%", md: "200px" }}
            w={{ base: "100%", md: "20%" }}
            isDisabled={!modelName || isLoadingSerials}
          >
            <FormLabel fontSize="sm">Serial</FormLabel>
            <Select
              placeholder={
                isLoadingSerials
                  ? "Loading serials..."
                  : modelName
                  ? "Select serial"
                  : "Select model first"
              }
              value={serialNo}
              onChange={handleSerialChange}
              size="sm"
              bgColor={"white"}
            >
              {serials.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.machine_serial}
                </option>
              ))}

            </Select>
          </FormControl>

          <FormControl
            minW={{ base: "100%", md: "200px" }}
            w={{ base: "100%", md: "20%" }}
            isDisabled={!modelName || isLoadingSerials}
          >
            <FormLabel fontSize="sm">Service Type</FormLabel>
            <Select
              placeholder={
                isLoadingSerials
                  ? "Loading serials..."
                  : modelName
                  ? "Select serial"
                  : "Select model first"
              }
              value={serialNo}
              onChange={handleSerialChange}
              size="sm"
              bgColor={"white"}
            >
              {serials.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.machine_serial}
                </option>
              ))}

            </Select>
          </FormControl>

          {/* Submit */}
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleFetch}
            //isDisabled={!brandName || !modelName || !serialNo || isSubmitting}
            w={{ base: "100%", md: "auto" }}
          >
            Apply Filter
          </Button>
        </Stack>
      </Box>
    </Box>
    <MyTable data={data} />
  </>
);
}

// function setIsLoading(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }

