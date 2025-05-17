
import { format, parseISO } from 'date-fns';
import { Booking } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BookingItemProps {
  booking: Booking;
  onCancel: (id: string) => Promise<void>;
}

const BookingItem = ({ booking, onCancel }: BookingItemProps) => {
  const startTime = parseISO(booking.startTime);
  const endTime = parseISO(booking.endTime);
  
  const getStatusClass = () => {
    switch (booking.status) {
      case 'PENDING': return 'status-badge pending';
      case 'CONFIRMED': return 'status-badge confirmed';
      case 'CANCELLED': return 'status-badge cancelled';
      case 'COMPLETED': return 'status-badge completed';
      default: return 'status-badge';
    }
  };
  
  const handleCancel = async () => {
    await onCancel(booking.id);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">
              Slot {booking.slot.number}
            </h3>
            <p className="text-sm text-muted-foreground">
              {booking.slot.location}
            </p>
          </div>
          <div className={getStatusClass()}>
            {booking.status}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div>
                <span className="font-medium">Date: </span>
                {format(startTime, 'PPP')}
              </div>
              <div className="flex gap-3">
                <span>
                  <span className="font-medium">From: </span>
                  {format(startTime, 'p')}
                </span>
                <span>
                  <span className="font-medium">To: </span>
                  {format(endTime, 'p')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t bg-muted/30 flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/bookings/${booking.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            Details
          </Link>
        </Button>
        
        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel booking</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>
                  Yes, cancel booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingItem;
