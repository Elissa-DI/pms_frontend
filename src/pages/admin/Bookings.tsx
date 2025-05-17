
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Booking } from '@/lib/types';
import { getAdminBookings, deleteBooking, updateBookingStatus } from '@/lib/services';
import { toast } from 'sonner';
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
import { format, parseISO } from 'date-fns';
import { CalendarX, Calendar, FileText, Trash2, Check, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BookingDetailsDialog from '@/components/admin/BookingDetailsDialog';

const AdminBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: getAdminBookings,
    staleTime: 60000, // 1 minute
    meta: {
      onError: () => {
        toast.error('Failed to load bookings data');
      }
    }
  });

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteBooking(bookingToDelete);
      toast.success('Booking deleted successfully');
      setIsDeleteAlertOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    } finally {
      setIsDeleting(false);
      setBookingToDelete(null);
    }
  };

  const confirmDelete = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setIsDeleteAlertOpen(true);
  };

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      setIsUpdatingStatus(true);
      await updateBookingStatus(bookingId, status);
      toast.success('Booking status updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fallback to empty array if API fails
  const displayBookings = bookings || [];

  const SkeletonBooking = () => (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32 mt-1" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Booking Management</h2>
        <p className="text-muted-foreground mt-1">View and manage all parking bookings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBooking key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <CalendarX className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-lg font-medium">Error loading bookings</p>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          ) : displayBookings.length > 0 ? (
            <div className="space-y-6">
              {displayBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {booking.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium">Booking Time</span>
                      </div>
                      <p className="text-sm">
                        {format(parseISO(booking.startTime), 'PPP')}
                        <br />
                        {format(parseISO(booking.startTime), 'p')} - {format(parseISO(booking.endTime), 'p')}
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-xs font-medium">Slot Information</span>
                      <p className="text-sm">
                        {booking.slot.number} ({booking.slot.size})
                        <br />
                        {booking.slot.location}
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <span className="text-xs font-medium">Status Management</span>
                      <Select 
                        defaultValue={booking.status} 
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                        disabled={isUpdatingStatus || booking.status === 'CANCELLED'}
                      >
                        <SelectTrigger className="mt-1 h-8 text-xs">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(booking.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-muted-foreground">There are no bookings in the system yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBooking && (
        <BookingDetailsDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          booking={selectedBooking}
        />
      )}

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this booking. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} disabled={isDeleting} className='bg-red-500'>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBookings;
