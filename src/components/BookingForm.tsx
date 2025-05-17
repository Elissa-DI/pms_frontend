
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAvailableSlots, createBooking } from '@/lib/services';
import { Slot } from '@/lib/types';

// Generate times from 6am to 10pm
const generateTimeOptions = () => {
  const times = [];
  for (let i = 6; i <= 22; i++) {
    // Format as 06:00, 07:00, etc.
    times.push(`${i.toString().padStart(2, '0')}:00`);
    // Add 30-minute increments
    if (i < 22) {
      times.push(`${i.toString().padStart(2, '0')}:30`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const formSchema = z.object({
  slotId: z.string({ required_error: "Please select a parking slot" }),
  date: z.date({ required_error: "Please select a date" }),
  startTime: z.string({ required_error: "Please select a start time" }),
  endTime: z.string({ required_error: "Please select an end time" }),
}).refine(data => {
  // Convert to comparable values
  const start = parseInt(data.startTime.replace(':', ''));
  const end = parseInt(data.endTime.replace(':', ''));
  return start < end;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

type FormValues = z.infer<typeof formSchema>;

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const preselectedSlotId = searchParams.get('slotId');
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotId: preselectedSlotId || '',
      date: new Date(),
      startTime: '',
      endTime: '',
    },
  });

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const availableSlots = await getAvailableSlots();
        setSlots(availableSlots);
        
        if (preselectedSlotId) {
          form.setValue('slotId', preselectedSlotId);
        }
      } catch (error) {
        console.error('Failed to load slots:', error);
        toast.error('Failed to load available parking slots');
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    loadSlots();
  }, [preselectedSlotId, form]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Combine date and time into ISO string
      const dateStr = format(data.date, 'yyyy-MM-dd');
      const startDateTime = new Date(`${dateStr}T${data.startTime}:00`);
      const endDateTime = new Date(`${dateStr}T${data.endTime}:00`);
      
      // Format to ISO
      const startTimeISO = startDateTime.toISOString();
      const endTimeISO = endDateTime.toISOString();
      
      await createBooking(data.slotId, startTimeISO, endTimeISO);
      toast.success('Booking created successfully');
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Book a Parking Slot</CardTitle>
        <CardDescription>
          Select a slot, date and time for your booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSlots ? (
          <div className="flex justify-center py-6">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-52"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-40"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-36"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded mt-6"></div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="slotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parking Slot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parking slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {slots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.number} - {slot.location} ({slot.size} / {slot.vehicleType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating booking...' : 'Book Now'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingForm;
