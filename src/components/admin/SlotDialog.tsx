import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slot, SlotStatus } from "@/lib/types";
import { createSlot, updateSlot, deleteSlot } from "@/lib/services";
import { toast } from "sonner";
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

const slotFormSchema = z.object({
  number: z.string().min(1, { message: "Slot number is required" }),
  size: z.string().min(1, { message: "Size is required" }),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

interface SlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot?: Slot | null;
  onClose: () => void;
}

const SlotDialog = ({ open, onOpenChange, slot, onClose }: SlotDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const isEditing = !!slot;

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      number: "",
      size: "",
      vehicleType: "",
      location: "",
      status: "AVAILABLE",
    },
  });

  useEffect(() => {
    if (slot) {
      form.reset({
        number: slot.number,
        size: slot.size,
        vehicleType: slot.vehicleType,
        location: slot.location,
        status: slot.status,
      });
    } else {
      form.reset({
        number: "",
        size: "",
        vehicleType: "",
        location: "",
        status: "AVAILABLE",
      });
    }
  }, [slot, form]);

  const handleSubmit = async (data: SlotFormValues) => {
    try {
      setIsSubmitting(true);

      if (isEditing && slot) {
        await updateSlot(slot.id, data);
        toast.success("Slot updated successfully");
      } else {
        await createSlot(data);
        toast.success("New slot created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Error submitting slot:", error);
      toast.error(
        isEditing ? "Failed to update slot" : "Failed to create slot"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!slot) return;

    try {
      setIsSubmitting(true);
      await deleteSlot(slot.id);
      toast.success("Slot deleted successfully");
      setIsDeleteAlertOpen(false);
      onClose();
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("Failed to delete slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Slot" : "Add New Slot"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slot Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SMALL">Small</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LARGE">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                        <SelectItem value="CAR">Car</SelectItem>
                        <SelectItem value="TRUCK">Truck</SelectItem>
                        <SelectItem value="ANY">Any</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Floor 1, Section B"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OCCUPIED">Occupied</SelectItem>
                        <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-between sm:justify-between gap-2">
                <div className="flex gap-2">
                  {isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsDeleteAlertOpen(true)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this slot. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SlotDialog;
