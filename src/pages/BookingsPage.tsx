
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import BookingItem from '@/components/BookingItem';
import { getUserBookings, cancelBooking } from '@/lib/services';
import { Booking } from '@/lib/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarX } from 'lucide-react';

const BookingsPage = () => {
  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['userBookings'],
    queryFn: getUserBookings,
    staleTime: 60000, // 1 minute
    meta: {
      onError: () => {
        toast.error('Failed to load your bookings');
      }
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch bookings:', error);
    }
  }, [error]);

  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      refetch();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const SkeletonBooking = () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-40 mt-1" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-4 w-4" />
          <div className="w-full">
            <Skeleton className="h-4 w-full max-w-[200px] mb-1" />
            <Skeleton className="h-4 w-full max-w-[150px]" />
          </div>
        </div>
      </div>
      <div className="p-4 border-t bg-muted/30 flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your parking bookings
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBooking key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <CalendarX className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Error loading bookings</h2>
            <p className="text-muted-foreground text-center max-w-md">
              There was a problem loading your bookings. Please try again later.
            </p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <CalendarX className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No bookings found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have any parking bookings yet. Start by browsing available slots and making a reservation.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingsPage;
