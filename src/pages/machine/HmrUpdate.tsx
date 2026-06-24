// import { FormControl, FormLabel, Select, Stack, useBreakpointValue } from '@chakra-ui/react';
// import { useState } from 'react';
// import {
//   Box,
//   Button,
//   HStack,
//   Text,
//   Select as ChakraSelect,
// } from '@chakra-ui/react';

// const modelsByBrand: Record<string, string[]> = {
//   India: ["Odisha", "Karnataka", "Maharashtra"],
//   USA: ["California", "New York", "Texas"],
// };

// const serialByModel: Record<string, string[]> = {
//   Odisha: ["Bhubaneswar", "Cuttack"],
//   Karnataka: ["Bengaluru", "Mysuru"],
//   Maharashtra: ["Mumbai", "Pune"],
//   California: ["San Francisco", "Los Angeles"],
//   "New York": ["New York City", "Buffalo"],
//   Texas: ["Austin", "Dallas"],
// };

// type ModelOption = {
//   id: number;
//   name: string;
// };

// type ModelApiItem = {
//   machine_model: string;
// };

// type ModelApiResponse = {
//   success: boolean;
//   count: number;
//   data: ModelApiItem[];
// };


// export default function HmrUpdate() {
//   const brandNames = ["VOLVO", "SDLG"];
//   const token = localStorage.getItem('authToken');
//   const [brandName, setBrandName] = useState("");
//   const [modelName, setModelName] = useState("");
//   const [serialNo, setSerialNo] = useState("");
//   const [models, setModels] = useState<string[]>([]);  // just strings
//   const [serials, setSerials] = useState<string[]>([]);  // just strings
  
//   const [isLoadingModels, setIsLoadingModels] = useState(false);
  
//   const direction = useBreakpointValue<"column" | "row">({
//     base: "column",
//     md: "row",
//   });

//   const modelOptions = modelName ? modelsByBrand[brandName] ?? [] : [];
//   const serialnoOptions = serialNo ? serialByModel[modelName] ?? [] : [];
//   const [isLoading, setIsLoading] = useState(false);

//   type ApiResponse = {
//     //data: HmrUpdateType[];
//     total: number;
//   };

//   const handleBrandChange = async (value: string) => {
//     console.log("handleBrandChange Called");
//     setBrandName(value);
//     setModelName("");
//     setModels([]);

//     if (!value) return;

//     try {
//       setIsLoadingModels(true);
//       const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
//       const res = await fetch(`${apiUrl}/api/tourbill/ddmodels?brand=${encodeURIComponent(value)}`,{
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,   // 👈 Bearer token
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//       });
      
//       if (!res.ok) {
//         throw new Error(`Failed to load models: ${res.status}`);
//       }
//       // const json: ModelOption[] = await res.json();
//       const json: ModelApiResponse = await res.json()
//       const modelNames = json.data.map((item) => item.machine_model);
//       setModels(modelNames);
//       //console.log(`${modelNames}`);
//     } catch (err) {
//       console.error(err);
//       // TODO: optional toast
//     } finally {
//       setIsLoadingModels(false);
//     }
//   };

//   const handleModelChange = async (pBrand: string,pModel:string) => {
//     console.log("handleModelChange Called");
//     setBrandName(pBrand);
//     setModelName(pModel);
//     setSerials([]);

//     if (!pBrand) return;

//     try {
//       //setIsLoadingSerials(true);
//       const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
//       const res = await fetch(`${apiUrl}/api/tourbill/ddmodels?brand=${encodeURIComponent(pBrand)}&model=${encodeURIComponent(pModel)}`,{
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,   // 👈 Bearer token
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//       });
      
//       if (!res.ok) {
//         throw new Error(`Failed to load serials: ${res.status}`);
//       }
//       const json: ModelApiResponse = await res.json()
//       const modelNames = json.data.map((item) => item.machine_model);
//       setModels(modelNames);
//       //console.log(`${modelNames}`);
//     } catch (err) {
//       console.error(err);
//       // TODO: optional toast
//     } finally {
//       setIsLoadingModels(false);
//     }
//   };

//   // const handleFetch = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
//   //     const res = await fetch(`${apiUrl}/api/touradmin/tourinfo/${brandName.toString()}`, {
//   //       method: 'GET',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,   // 👈 Bearer token
//   //         'Accept': 'application/json',
//   //       },
//   //     });
      
//   //     if (!res.ok) {
//   //       console.error('Error:', res.status, await res.text());
//   //       return;
//   //     }
//   //     const json: ApiResponse = await res.json(); // { data, total, ... }
//   //     console.log(json);
//   //     //setData(json.data);
//   //     //setData(json ? [json] : []);  // ✅ wrap in array for table
//   //     // setTotal(json.total);
//   //     //setTotal(json ? 1 : 0);
//   //     // setSelectedIds([]);          // optional reset
//   //   } catch (e) {
//   //     console.error('Fetch failed:', e);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true);
//       const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:8000';
//       const res = await fetch(`${apiUrl}/api/touradmin/tourinfo/${brandName.toString()}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,   // 👈 Bearer token
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!res.ok) {
//         console.error('Error:', res.status, await res.text());
//         return;
//       }
//       const json: ApiResponse = await res.json(); // { data, total, ... }
//       console.log(json);
//       //setData(json.data);
//       //setData(json ? [json] : []);  // ✅ wrap in array for table
//       // setTotal(json.total);
//       //setTotal(json ? 1 : 0);
//       // setSelectedIds([]);          // optional reset
//     } catch (e) {
//       console.error('Fetch failed:', e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//     <Box display="flex" justifyContent="space-between" alignItems="center" fontWeight={"medium"}>
//       <HStack spacing={1} as="nav" aria-label="Breadcrumb">
//         <Text fontWeight="normal" fontSize={"sm"} color="black">Machine</Text>
//         <Text color="gray.500">/</Text>
//         <Text fontWeight="normal" fontSize={"sm"} color="black">HMR Update</Text>
//       </HStack>
//     </Box>
//     <Box borderWidth="1px" borderRadius="md" maxH="auto" overflow="auto" p={1}>
//       <Box overflow="auto">
//         <Stack
//           direction={{ base: "column", md: "row" }} // column on mobile, row on md+
//           spacing={2}
//           align="flex-end"
//           justify="space-between"
//           justifyContent={"space-between"}
//           flexWrap="wrap"
//         >
//         <FormControl
//           minW={{ base: "100%", md: "200px" }}
//           w={{ base: "100%", md: "25%" }}
//         >
//           <FormLabel fontSize="sm">Brand</FormLabel>
//           <Select
//             placeholder="Select Brand"
//             value={brandName}
//             onChange={(e) => {
//               const value = e.target.value;
//               //  setBrandName(value);
//               //  setModelName("");
//               //  setSerialNo("");
//               handleBrandChange(value)
//             }}
//             size="sm"
//           >
//             {brandNames.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl
//           minW={{ base: "100%", md: "200px" }}
//           w={{ base: "100%", md: "25%" }}
//           isDisabled={!brandName || isLoadingModels}
//         >
//           <FormLabel fontSize="sm">Model</FormLabel>
//           <Select
//             placeholder={brandName ? "Select model" : "Select brand first"}
//             value={modelName}
//             onChange={(e) => {
//               const value = e.target.value;
//               // setModelName(value);
//               // setSerialNo("");
//               handleModelChange('VOLVO',value);
//             }}
//             size="sm"
//           >
//             {models.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </Select>
//         </FormControl>
//         {/* <FormControl
//           minW={{ base: "100%", md: "200px" }}
//           w={{ base: "100%", md: "25%" }}
//           isDisabled={!modelName}
//         >
//           <FormLabel fontSize="sm">Serial</FormLabel>
//           <Select
//             placeholder={modelName ? "Select model" : "Select model first"}
//             value={modelName}
//             onChange={(e) => setSerialNo(e.target.value)}
//             size="sm"
//           >
//             {serialnoOptions.map((ct) => (
//               <option key={ct} value={ct}>
//                 {ct}
//               </option>
//             ))}
//           </Select>
//         </FormControl> */}
//         <FormControl
//           minW={{ base: "100%", md: "200px" }}
//           w={{ base: "100%", md: "25%" }}
//           isDisabled={!modelName}
//         >
//           <FormLabel fontSize="sm">Serial</FormLabel>
//           <Select
//             placeholder={modelName ? "Select serial" : "Select model first"}
//             value={serialNo}                           // 👈 use serialNo here
//             onChange={(e) => setSerialNo(e.target.value)}
//             size="sm"
//           >
//             {serialnoOptions.map((ct) => (
//               <option key={ct} value={ct}>
//                 {ct}
//               </option>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           colorScheme="blue"
//           size="sm"
//           onClick={handleSubmit}
//           isDisabled={!brandName || !modelName || !serialNo}
//         >
//           Get HMR Details
//         </Button>
//       </Stack>
//       </Box>
//     </Box>
//     </>
//   );
// }
//------------------------------------------------
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
  // VStack,
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
type HmrFormProps = {
  selectedId: string | null;
};

export default function HmrUpdate() {
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
  // const [hmrId, setHmrId] = useState<number | null>(null);
  

  type HmrRow = {
  id: number;
  machine_brand?: string;
  machine_model?: string;
  machine_serial?: string;
  customer_name?: string;
  old_hmr?: string | number;
  hmr?: string | number;
  hmr_date?: string;
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

  const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";

  // Brand -> load models
  const handleBrandChange = async (value: string) => {
    setBrandName(value);
    setModelName("");
    setSerialNo("");
    // setMachineId("");
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
    // setMachineId("");
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

  const fetchHmrDetails = async () => {
    try {
      console.log (`Value of Machine Master ID: ${serialNo}`);
      setIsSubmitting(true);
      //const selectedSerial = serials.find((item) => String(item.id) === serialNo);
      const res = await fetch(
        `${apiUrl}/api/touradmin/hmrinfo/${encodeURIComponent(serialNo)}`,
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
      console.log("HMR details:", json);
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

//   function MyTable() {
//   return (
//     <Box maxW="100%" overflowX="auto">
//       <Table variant="striped" size="sm">
//         <Thead>
//           <Tr>
//             <Th position="sticky" top={0} bg="white" zIndex={1}>
//               Name
//             </Th>
//             <Th position="sticky" top={0} bg="white" zIndex={1}>
//               Value
//             </Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>Machine Brand</Td>
//             <Td>serialNo</Td>
//           </Tr>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>Machine Model</Td>
//             <Td>Machine Brand</Td>
//           </Tr>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>Machine Serial</Td>
//             <Td>Machine Brand</Td>
//           </Tr>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>Customer Name</Td>
//             <Td>Machine Brand</Td>
//           </Tr>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>OLD HMR</Td>
//             <Td>Machine Brand</Td>
//           </Tr>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>HMR</Td>
//             <Td>Machine Brand</Td>
//           </Tr>
//           <Tr>
//             <Td color={"blue"} fontWeight={"normal"}>HMR Date</Td>
//             <Td>Machine Brand</Td>
//           </Tr>
//         </Tbody>
//       </Table>
//     </Box>
//   );
// }

function MyTable({ data }: { data: HmrRow[] }) {
  return (
    <Box maxW="100%" overflowX="auto">
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Name</Th>
            <Th position="sticky" top={0} bg="white" zIndex={1}>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <Tr>
                <Td color="blue">Machine Brand</Td>
                <Td>{row.machine_brand ?? "-"}</Td>
              </Tr>
              <Tr>
                <Td color="blue">Machine Model</Td>
                <Td>{row.machine_model ?? "-"}</Td>
              </Tr>
              <Tr>
                <Td color="blue">Machine Serial</Td>
                <Td>{row.machine_serial ?? "-"}</Td>
              </Tr>
              <Tr>
                <Td color="blue">Customer Name</Td>
                <Td>{row.customer_name ?? "-"}</Td>
              </Tr>
              <Tr>
                <Td color="blue">OLD HMR</Td>
                <Td>{row.old_hmr ?? "-"}</Td>
              </Tr>
              <Tr>
                <Td color="blue">HMR</Td>
                <Td>{row.hmr ?? "-"}</Td>
              </Tr>
              <Tr>
                <Td color="blue">HMR Date</Td>
                <Td>{row.hmr_date ?? "-"}</Td>
              </Tr>
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}


function HmrForm({ selectedId }: HmrFormProps) {  
  const [oldHmr, setOldHmr] = useState("");
  const [hmr, setHmr] = useState("");
  const [hmrDate, setHmrDate] = useState("");

  const handleSubmit = async () => {
    console.log({ oldHmr, hmr, hmrDate, selectedId });
    if (!brandName || !selectedId) return;
      try {
        setIsLoadingSerials(true);
        const res = await fetch(
          `${apiUrl}/api/touradmin/hmr-update`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              machine_id: selectedId,
              old_hmr:oldHmr,
              hmr:hmr,
              hmr_date:hmrDate
            }),
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to load serials: ${res.status}`);
        }
        Toast({
          title: 'Hmr update successful',
          description: 'Hmr update successful',
          status:"success",
          duration: 4000,
          isClosable: true,
        });
        
      } catch (err) {
        console.error("load serials failed", err);
      } finally {
        setIsLoadingSerials(false);
      }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="cyan.100" w="full">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} alignItems="end">
        <FormControl>
          <FormLabel>Old HMR</FormLabel>
          <Input
            value={oldHmr}
            onChange={(e) => setOldHmr(e.target.value)}
            placeholder="Enter old HMR"
            bg={"white"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>HMR</FormLabel>
          <Input
            value={hmr}
            onChange={(e) => setHmr(e.target.value)}
            placeholder="Enter HMR"
            bg={"white"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>HMR Date</FormLabel>
          <Input
            type="date"
            value={hmrDate}
            onChange={(e) => setHmrDate(e.target.value)}
            bg={"white"}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit} w="full">
          Submit
        </Button>
      </SimpleGrid>
    </Box>
  );
}

const handleSerialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  setSerialNo(value);
  // setMachineId(value);
  console.log(`Value Selected: ${value}`);
  //setHmrId(null);
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
            HMR Update
          </Text>
        </HStack>
      </Box>

      <Box borderWidth="1px" borderRadius="md" p={2} bgColor={"cyan.100"}>
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
                // onChange={(e) => 
                //   setSerialNo(e.target.value)

                // }
                
                //onChange={(e) => setMachineId(e.target.value)}
                
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
              onClick={fetchHmrDetails}
              isDisabled={!brandName || !modelName || !serialNo || isSubmitting}
              w={{ base: "100%", md: "auto" }}
            >
              Get HMR Details
            </Button>
          </Stack>
        </Box>
      </Box>
      <MyTable data={hmrData} />
      <HmrForm selectedId={serialNo}/>
    </>
  );
}
