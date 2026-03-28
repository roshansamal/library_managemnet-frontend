// import {
//   Box,
//   SimpleGrid,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
// } from "@chakra-ui/react";
// import { useState } from "react";

// function HmrForm() {
//   const [oldHmr, setOldHmr] = useState("");
//   const [hmr, setHmr] = useState("");
//   const [hmrDate, setHmrDate] = useState("");

//   const handleSubmit = async () => {
//     console.log({ oldHmr, hmr, hmrDate });
//   };

//   return (
//     <Box p={4} borderWidth="1px" borderRadius="md" bg="white" w="full">
//       <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} alignItems="end">
//         <FormControl>
//           <FormLabel>Old HMR</FormLabel>
//           <Input
//             value={oldHmr}
//             onChange={(e) => setOldHmr(e.target.value)}
//             placeholder="Enter old HMR"
//           />
//         </FormControl>

//         <FormControl>
//           <FormLabel>HMR</FormLabel>
//           <Input
//             value={hmr}
//             onChange={(e) => setHmr(e.target.value)}
//             placeholder="Enter HMR"
//           />
//         </FormControl>

//         <FormControl>
//           <FormLabel>HMR Date</FormLabel>
//           <Input
//             type="date"
//             value={hmrDate}
//             onChange={(e) => setHmrDate(e.target.value)}
//           />
//         </FormControl>

//         <Button colorScheme="blue" onClick={handleSubmit} w="full">
//           Submit
//         </Button>
//       </SimpleGrid>
//     </Box>
//   );
// }