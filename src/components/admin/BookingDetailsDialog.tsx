
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Booking } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Calendar, CarFront, MapPin, Clock, User } from 'lucide-react';

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
}

const BookingDetailsDialog = ({ open, onOpenChange, booking }: BookingDetailsDialogProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h2>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{booking.user.name}</p>
                <p className="text-sm">{booking.user.email}</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <CarFront className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parking Slot</p>
                <p className="font-medium">
                  {booking.slot.number} ({booking.slot.size} - {booking.slot.vehicleType})
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{booking.slot.location}</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(parseISO(booking.startTime), 'PPP')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">
                  {format(parseISO(booking.startTime), 'p')} - {format(parseISO(booking.endTime), 'p')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
