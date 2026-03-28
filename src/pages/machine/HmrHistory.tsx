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
  Th,
  Tbody,
  Td,
  Toast,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";

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


export default function HmrHistory() {
  const brandNames = ["VOLVO", "SDLG"];
  const token = localStorage.getItem("authToken");

  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  // const [serialNo, setSerialNo] = useState("");

  const [models, setModels] = useState<string[]>([]);
  // const [serials, setSerials] = useState<string[]>([]);

  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingSerials, setIsLoadingSerials] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hmrData, setHmrData] = useState<any[]>([]);
  
  type HmrRow = {
  id: number;
  machine_brand?: string;
  machine_model?: string;
  machine_serial?: string;
  customer_name?: string;
  old_hmr?: string | number;
  hmr?: string | number;
  hmr_date?: string;
  hmr_updated_by?:string;
  remarks?:string;
};

  type SerialItem = {
    id: string | number;
    machine_serial: string;
  };
  const [serials, setSerials] = useState<SerialItem[]>([]);
  const [serialNo, setSerialNo] = useState("");
  const [machineId, setMachineId] = useState("");

  const direction = useBreakpointValue<"column" | "row">({
    base: "column",
    md: "row",
  });

  const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";

  // Brand -> load models
  const handleBrandChange = async (value: string) => {
    setBrandName(value);
    setModelName("");
    setSerialNo("");
    setMachineId("");
    setModels([]);
    setSerials([]);

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
    setMachineId("");
    setSerials([]);

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

  const fetchHmrHistory = async () => {
    try {
      console.log (`Value of Machine Master ID: ${serialNo}`);
      setIsSubmitting(true);
      //const selectedSerial = serials.find((item) => String(item.id) === serialNo);
      const res = await fetch(
        `${apiUrl}/api/touradmin/hmr-history/${encodeURIComponent(serialNo)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        console.error("Error:", res.status, await res.text());
        return;
      }

      const json = await res.json();
      //console.log("HMR details:", json);
      setHmrData(json.data || []);

      // const firstRow = json.data?.[0];
      // setHmrId(firstRow?.id ?? null);
      // console.log("HMRID:", firstRow?.id);

      //setHmrId(json.data?.id ?? null);
      //setHmrId(json.data.id);
      //console.log(`HMRID: ${json.data.id}`);

      // setHmrDetails(json.data ? [json.data] : []);
      // setHmrId(json.data?.id ?? null);
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

function MyTable({ data }: { data: HmrRow[] }) {
  return (
    <Box maxW="100%" overflowX="auto">
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Brand</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Model</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Serial</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Old HMR</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Current HMR</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>HMR date</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>HMR Updated By</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Remarks</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <Tr>
                <Td>{row.machine_brand ?? "-"}</Td>
                <Td>{row.machine_model ?? "-"}</Td>
                <Td>{row.machine_serial ?? "-"}</Td>
                <Td>{row.old_hmr ?? "-"}</Td>
                <Td>{row.hmr ?? "-"}</Td>
                <Td>{row.hmr_date ?? "-"}</Td>
                <Td>{row.hmr_updated_by ?? "-"}</Td>
                <Td>{row.remarks ?? "-"}</Td>
              </Tr>
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

const handleSerialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  setSerialNo(value);
  setMachineId(value);
  //console.log(`Value Selected: ${value}`);
};

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
            HMR History
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
              w={{ base: "100%", md: "25%" }}
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
              w={{ base: "100%", md: "25%" }}
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
              w={{ base: "100%", md: "25%" }}
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

            {/* Submit */}
            <Button
              colorScheme="blue"
              size="sm"
              onClick={fetchHmrHistory}
              isDisabled={!brandName || !modelName || !serialNo || isSubmitting}
              w={{ base: "100%", md: "auto" }}
            >
              HMR History
            </Button>
          </Stack>
        </Box>
      </Box>
      <MyTable data={hmrData} />
    </>
  );
}
