import { jsPDF } from "jspdf";
import { Ticket } from "@/lib/types";
import { format, parseISO } from "date-fns";

export const generatePDF = (ticket: Ticket) => {
  const doc = new jsPDF();

  // Formatting time
  const startTime = format(parseISO(ticket.startTime), "PPP 'at' p");
  const endTime = format(parseISO(ticket.endTime), "PPP 'at' p");

  // Title/Header
  doc.setFillColor("#1f2937"); // Dark header
  doc.rect(0, 0, 210, 20, "F");
  doc.setTextColor("#ffffff");
  doc.setFontSize(16);
  doc.text("PMS - PARKING TICKET", 10, 13);

  // Reset text color and spacing
  doc.setTextColor("#000000");
  doc.setFontSize(14);
  doc.text("Ticket Summary", 10, 30);

  // Horizontal line
  doc.setDrawColor(200);
  doc.line(10, 32, 200, 32);

  // Ticket details
  const details = [
    { label: "Booking ID", value: ticket.bookingId },
    { label: "Slot Number", value: ticket.slotNumber },
    { label: "Vehicle Type", value: ticket.vehicleType },
    { label: "Location", value: ticket.location },
    { label: "Start Time", value: startTime },
    { label: "End Time", value: endTime },
    { label: "Duration", value: `${ticket.durationHours} hour(s)` },
    { label: "Rate (per hour)", value: `RWF ${ticket.ratePerHour}` },
  ];

  let y = 42;
  details.forEach(({ label, value }) => {
    doc.setFont("Helvetica", "bold");
    doc.text(`${label}:`, 10, y);

    doc.setFont("Helvetica", "normal");
    doc.text(value, 70, y);
    y += 10;
  });

  // Total Section
  doc.setFillColor("#f3f4f6");
  doc.rect(10, y + 5, 190, 15, "F");

  doc.setFont("Helvetica", "bold");
  doc.setTextColor("#000000");
  doc.text("Total Amount:", 15, y + 15);

  doc.setTextColor("#2563eb");
  doc.text(`RWF ${ticket.total}`, 70, y + 15);

  // Footer
  doc.setTextColor("#6b7280");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Please keep this ticket safe and present it when needed.", 10, y + 35);
  doc.text("Thank you for using PMS!", 10, y + 43);

  // Save the PDF
  doc.save(`pms-ticket-${ticket.bookingId.substring(0, 8)}.pdf`);
};
