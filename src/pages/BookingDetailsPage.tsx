import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Layout from "@/components/Layout";
import { getBookingDetails, cancelBooking } from "@/lib/services";
import { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CarFront, Calendar, MapPin, Clock, X } from "lucide-react";
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
} from "@/components/ui/alert-dialog";

const BookingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!id) return;

        setIsLoading(true);
        const data = await getBookingDetails(id);
        setBooking(data);
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        toast.error("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = async () => {
    try {
      if (!id) return;

      await cancelBooking(id);
      const updatedBooking = await getBookingDetails(id);
      setBooking(updatedBooking);

      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "status-badge pending";
      case "CONFIRMED":
        return "status-badge confirmed";
      case "CANCELLED":
        return "status-badge cancelled";
      case "COMPLETED":
        return "status-badge completed";
      default:
        return "status-badge";
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/bookings")}
        >
          ← Back to bookings
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground mt-2">
            View your parking booking information
          </p>
        </div>

        {isLoading ? (
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="border-t border-b py-6 space-y-4">
              <div className="flex gap-4 items-start">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-60" />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : booking ? (
          <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    Slot {booking.slot.number}
                  </h2>
                  <p className="text-muted-foreground">
                    {booking.slot.location}
                  </p>
                </div>
                <div className={getStatusClass(booking.status)}>
                  {booking.status}
                </div>
              </div>

              <div className="border-t border-b py-6 space-y-6 mb-6">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <CarFront className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Parking Slot Details
                    </p>
                    <p className="font-medium">
                      Size: {booking.slot.size}, Type:{" "}
                      {booking.slot.vehicleType}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{booking.slot.location}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(parseISO(booking.startTime), "PPP")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {format(parseISO(booking.startTime), "p")} -{" "}
                      {format(parseISO(booking.endTime), "p")}
                    </p>
                  </div>
                </div>
              </div>

              {booking.status !== "CANCELLED" &&
                booking.status !== "COMPLETED" && (
                  <div className="flex justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <X className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            No, keep booking
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleCancelBooking}>
                            Yes, cancel booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
            <h2 className="text-xl font-medium mb-2">Booking not found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              The booking you're looking for doesn't exist or you don't have
              access to it.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingDetailsPage;
