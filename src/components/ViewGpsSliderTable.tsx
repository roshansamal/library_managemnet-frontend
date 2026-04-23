import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
// import { createColumnHelper } from '@tanstack/react-table';
import type { GpsType } from '../types/GpsType';
type EditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  tourId:number,  
  onUpdated?: () => void; // callback to refresh table after success
};
import { Text } from "@chakra-ui/react";
// const columnHelper = createColumnHelper<GpsType>();
export default function ViewGpsSliderTable({
  isOpen,
  onClose,
  tourId,
}: EditSliderProps) {
  const toast = useToast();
  const token = localStorage.getItem('authToken');
  const [gps, setGps] = useState<GpsType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //------------------------------------------
  // fetch GPS when drawer opens and we have an id
  useEffect(() => {
    if (!isOpen || tourId==null) {
      //console.log('Early return from effect');
      setGps([]);
      return;
    }
    const controller = new AbortController();
    const fetchGps = async () => {
      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL ?? "https://localhost:8000";
        const res = await fetch(`${apiUrl}/api/touradmin/tours/${tourId}/gps`,
          {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
          // { signal: controller.signal },
        );
        if (!res.ok) {
          throw new Error(`Failed to load GPS: ${res.status}`);
        }
        //const json: GpsItem = await res.json(); //Use for Single Row
        const json: GpsType[] = await res.json(); //Use for Multiple Row
        //console.log('GPS JSON:', json); // <--- add this
        setGps(json);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error(err);
        toast({
          title: 'Failed to load GPS info',
          description: err.message || 'Please try again',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchGps();
    return () => controller.abort();
  }, [isOpen, tourId, toast]);
  //------------------------------------------
  // const columns = useMemo(
  //     () => [
  //       columnHelper.display({
  //         id: 'serial_no',
  //         header: 'SL',
  //         cell: ({ row, table }) => {
  //           const { pageIndex, pageSize } = table.getState().pagination;
  //           return pageIndex * pageSize + row.index + 1;
  //         },
  //       }),
       
  //       columnHelper.accessor('tourid', {
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
  
  //       columnHelper.display({
  //         id: 'view',
  //         header: 'Bill',
  //         cell: (info) => {
  //           const rowData = info.row.original;
  //           return (
  //             <IconButton
  //               aria-label="View"
  //               icon={<FiEye />}
  //               size="sm"
  //               variant="ghost"
  //               _hover={{bg:"black",textColor:"white"}}
  //               onClick={() => {
  //                 openTourView(rowData)
  //               }}
  //             />
  //           );
  //         },
  //       }),
  
  //       columnHelper.display({
  //         id: 'gps',
  //         header: 'GPS',
  //         cell: (info) => {
  //           const rowData = info.row.original;
  //           return (
  //           Number(rowData?.gps_count || 0) > 0 ? (
  //             <IconButton
  //               color="orange.500"
  //               aria-label="GPS"
  //               icon={<FaLocationDot />}
  //               size="sm"
  //               variant="ghost"
  //               _hover={{ bg: "black", color: "white" }}
  //               onClick={() => openTourGps(rowData)}
  //             />
  //           ) : null
  //           );
  //         },
  //       }),
        
  //       columnHelper.display({
  //         id: 'approve',
  //         header: 'Approve',
  //         cell: (info) => {
  //           const rowData = info.row.original;
  //           // console.log("gps_count", rowData?.gps_count, typeof rowData?.gps_count);
  //           return (
  //             <IconButton
  //               color="blue.600"
  //               aria-label="APPROVE"
  //               icon={<FaCheckCircle />}
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
  //       columnHelper.accessor('da_calculated', {
  //         header: 'DA Calculated',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('ta_claimed', {
  //         header: 'TA Claimed',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('other_expenses', {
  //         header: 'Other Expenses',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('other_expense_remarks', {
  //         header: 'Other Expenses Remarks',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('total_claim', {
  //         header: 'Total User Claim',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('mgr_approved_amt', {
  //         header: 'Mgr Approved Amt',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('mgr_remarks', {
  //         header: 'Mgr Remarks',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('tour_start_date', {
  //         header: 'Tour Start Date',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('tour_end_date', {
  //         header: 'Tour End Date',
  //         cell: (info) => info.getValue(),
  //       }),
  //       columnHelper.accessor('created_at', {
  //         header: 'Submitted On',
  //         cell: (info) => info.getValue(),
  //       }),
  //     ],
  //     [allSelected, isSelected, toggleAll, toggleOne],
  //   );

  //------------------------------------------
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"blue.500"}>View GPS Information</DrawerHeader>
        <DrawerBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Tour ID:
                </FormLabel>
                <Input
                  value={tourId ?? ''}
                  readOnly
                  bg="gray"
                  color="white"
                />
              </FormControl>

              {/* GPS info */}
              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  GPS Status
                </FormLabel>
                {isLoading ? (
                  <Input value="Loading..." readOnly bg="white" color="black" />
                ) : gps.length === 0 ? (
                  <Input value="No GPS data" readOnly bg="white" color="black" />
                ) : (
                  <Stack spacing={2}  overflowY="auto">
                    {gps.map((row) => (
                      <>
                      {/* <Input
                        key={row.id}
                        value={`${row.created_on}+'\n'+${row.address}`}
                        readOnly
                        bg="white"
                        color="black"
                      />
                      <Input
                        key={row.address}
                        value={`${row.address}`}
                        readOnly
                      /> */}
                      <Box borderWidth="1px" borderRadius="md" p={1} fontSize="sm">
                        <Text><Text as="span" fontWeight="bold">Dated: </Text>{new Date(row.created_on).toLocaleString("en-IN")}</Text>
                        <Text><Text as="span" fontWeight="bold">Address: </Text>{row.address}</Text>
                        <Text><Text as="span" fontWeight="bold">Latitude: </Text>{row.latitude}</Text>
                        <Text><Text as="span" fontWeight="bold">Longitude: </Text>{row.longitude}</Text>
                        <Text><Text as="span" fontWeight="bold">Device ID: </Text>{row.deviceid}</Text>
                      </Box>
                      </>
                    ))}
                  </Stack>
                )}
              </FormControl>
            </Stack>
          
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose} bg={"blue.200"}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
