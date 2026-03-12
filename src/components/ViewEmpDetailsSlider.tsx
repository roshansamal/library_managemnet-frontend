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
import type { TourMasterType } from '../types/TourMasterType';
type EditSliderProps = {
  isOpen: boolean;
  onClose: () => void;
  tourId:number,  
  onUpdated?: () => void; // callback to refresh table after success
};

export default function ViewEmpDetailsSlider({
  isOpen,
  onClose,
  tourId,
}: EditSliderProps) {
  const toast = useToast();

  // Local form state
  const [form, setForm] = useState<TourMasterType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //------------------------------------------
  // fetch Tour Details when drawer opens and we have an id
  useEffect(() => {
    if (!isOpen || tourId == null) {
      setForm(null);          // clear when closed / no id
      return;
    }
    const controller = new AbortController();
    const fetchTour = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/tours/${tourId}/dtls`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to load tour: ${res.status}`);
        }
        //------------------------------
        const json: TourMasterType[] = await res.json();   // ⬅ array
        //console.log('Tour JSON:', json);
        setForm(json.length ? json[0] : null);             // ⬅ take first
        //------------------------------
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error(err);
        toast({
          title: 'Failed to load tour info',
          description: err.message || 'Please try again',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

  fetchTour();
  return () => controller.abort();
}, [isOpen, tourId, toast]);
  //------------------------------------------
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={"blue.500"}>View Tour</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4}>
            <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour ID:</FormLabel>
                <Input
                  value={form?.id || ''}
                  //onChange={(e) => handleChange('tourid', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>User ID:</FormLabel>
                <Input
                  value={form?.userid || ''}
                  //onChange={(e) => handleChange('userid', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Created On:</FormLabel>
                <Input
                  //type="number"
                  value={form?.created_on?.toString() || ''}
                  //onChange={(e) => handleChange('created_on', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Submitted On:</FormLabel>
                <Input
                  value={form?.submitted_on || ''}
                  //onChange={(e) => handleChange('da_calculated', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Updated On:</FormLabel>
                <Input
                  value={form?.updated_on || ''}
                  //onChange={(e) => handleChange('ta_claimed', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Customer Name:</FormLabel>
                <Input
                  value={form?.customer_name || ''}
                  //onChange={(e) => handleChange('other_expenses', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Purpose of Visit:</FormLabel>
                <Input
                  value={form?.purpose_of_visit || ''}
                  //onChange={(e) => handleChange('other_expense_remarks', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>Machine Model:</FormLabel>
                <Input
                  value={form?.machine_model || ''}
                  //onChange={(e) => handleChange('total_claim', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Machine Serial:</FormLabel>
                <Input
                  value={form?.machine_serial || ''}
                  //onChange={(e) => handleChange('workorder', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Complaint Details:</FormLabel>
                <Input
                  value={form?.complaint_dtls || ''}
                  //onChange={(e) => handleChange('mgr_action_by', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Service Type:</FormLabel>
                <Input
                  //type="date"
                  value={form?.service_type || ''}
                  //onChange={(e) => handleChange('mgr_action_date', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Travel From:</FormLabel>
                <Input
                  value={form?.travel_from || ''}
                  //onChange={(e) => handleChange('mgr_remarks', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>Travel To:</FormLabel>
                <Input
                  value={form?.travel_to || ''}
                  //onChange={(e) => handleChange('mgr_approved_amt', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mode of Travel:</FormLabel>
                <Input
                  value={form?.mode_of_travel || ''}
                  //onChange={(e) => handleChange('finance_action_by', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Ticket Status:</FormLabel>
                <Input
                  value={form?.ticket_status || ''}
                  //onChange={(e) => handleChange('finance_action_date', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"} color={"red"}>Visiting Role:</FormLabel>
                <Input
                  value={form?.visiting_role || ''}
                  //onChange={(e) => handleChange('finance_approved_amount', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour Start Date:</FormLabel>
                <Input
                  value={form?.tour_start_date || ''}
                  //onChange={(e) => handleChange('finance_approved_amount', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour End Date:</FormLabel>
                <Input
                  value={form?.tour_end_date || ''}
                  //onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Tour Continue:</FormLabel>
                <Input
                  value={form?.tour_continue || ''}
                  //onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Mgr Remarks:</FormLabel>
                <Input
                  value={form?.mgr_remarks || ''}
                  //onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Auto Close:</FormLabel>
                <Input
                  value={form?.auto_close || ''}
                  //onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Approved By:</FormLabel>
                <Input
                  value={form?.approved_by || ''}
                  //onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight={"semibold"} fontSize={"sm"}>Approved On:</FormLabel>
                <Input
                  value={form?.approved_at || ''}
                  //onChange={(e) => handleChange('ticket_status', e.target.value)}
                  bg={"blue.50"}
                  readOnly
                />
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
