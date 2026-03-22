import {
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
import type { GpsItem } from '../types/GpsItem';
type EditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  tourId:number,  
  onUpdated?: () => void; // callback to refresh table after success
};

export default function ViewGpsSlider({
  isOpen,
  onClose,
  tourId,
}: EditSliderProps) {
  const toast = useToast();

  // Local form state
  // const [form, setForm] = useState<number | null>(null);
  // const [gps, setGps] = useState<GpsItem | null>(null);
  const [gps, setGps] = useState<GpsItem[]>([]);
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
    //console.log('Effect run, isOpen=', isOpen, 'tourId=', tourId);
    const fetchGps = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/tours/${tourId}/gps`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          throw new Error(`Failed to load GPS: ${res.status}`);
        }
        //const json: GpsItem = await res.json(); //Use for Single Row
        const json: GpsItem[] = await res.json(); //Use for Multiple Row
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
                      <Input
                        key={row.id}
                        value={`${row.created_on}`}
                        readOnly
                        bg="gray.700"
                        color="white"
                      />
                      <Input
                        key={row.address}
                        value={`${row.address}`}
                        readOnly
                      />
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
