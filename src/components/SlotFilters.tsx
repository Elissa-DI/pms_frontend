
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  size: z.string().optional(),
  vehicleType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SlotFiltersProps {
  onFilterChange: (filters: { size?: string; vehicleType?: string }) => void;
}

const SlotFilters = ({ onFilterChange }: SlotFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: undefined,
      vehicleType: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    onFilterChange({
      size: data.size || undefined,
      vehicleType: data.vehicleType || undefined,
    });
    setIsOpen(false);
  };

  const resetFilters = () => {
    form.reset();
    onFilterChange({});
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg p-4 border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ANY">Any size</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ANY">Any type</SelectItem>
                      <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="TRUCK">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full">Apply Filters</Button>
        </form>
      </Form>
    </div>
  );
};

export default SlotFilters;
