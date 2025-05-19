import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Booking, Ticket as TicketType } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Download, FileText, Ticket, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getBookingTicket } from "@/lib/services";
import { generatePDF } from "@/lib/pdfUtils";

interface BookingItemProps {
  booking: Booking;
  onCancel: (id: string) => Promise<void>;
}

const BookingItem = ({ booking, onCancel }: BookingItemProps) => {
  const startTime = parseISO(booking.startTime);
  const endTime = parseISO(booking.endTime);

  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const getStatusClass = () => {
    switch (booking.status) {
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

  const handleGenerateTicket = async () => {
    try {
      const ticketData = await getBookingTicket(booking.id);
      setTicket(ticketData);
      setShowDialog(true);
      toast.success("Ticket generated");
    } catch (error) {
      toast.error("Could not generate ticket");
    }
  };

  const handleDownload = () => {
    if (!ticket) return;
    generatePDF(ticket);
    toast.success("Ticket downloaded");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Slot {booking.slot.number}</h3>
            <p className="text-sm text-muted-foreground">
              {booking.slot.location}
            </p>
          </div>
          <div className={getStatusClass()}>{booking.status}</div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div>
                <span className="font-medium">Date: </span>
                {format(startTime, "PPP")}
              </div>
              <div className="flex gap-3">
                <span>
                  <span className="font-medium">From: </span>
                  {format(startTime, "p")}
                </span>
                <span>
                  <span className="font-medium">To: </span>
                  {format(endTime, "p")}
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

        {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
          ticket ? (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Ticket className="mr-2 h-4 w-4" />
                  View Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Parking Ticket</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Booking ID</p>
                    <p className="font-medium">{ticket.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parking Slot</p>
                    <p className="font-medium">{ticket.slotNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vehicle Type</p>
                    <p className="font-medium">{ticket.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{ticket.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Time</p>
                    <p className="font-medium">{format(parseISO(ticket.startTime), "PPP 'at' p")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Time</p>
                    <p className="font-medium">{format(parseISO(ticket.endTime), "PPP 'at' p")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{ticket.durationHours} hours</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate</p>
                    <p className="font-medium">RWF {ticket.ratePerHour}/hour</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-md flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      RWF {ticket.total}
                    </p>
                  </div>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" onClick={handleGenerateTicket}>
              <Ticket className="mr-2 h-4 w-4" />
              Get Ticket
            </Button>
          )
        )}

        {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
          <Button variant="destructive" onClick={() => onCancel(booking.id)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingItem;
