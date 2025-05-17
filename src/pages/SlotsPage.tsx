
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import SlotCard from '@/components/SlotCard';
import SlotFilters from '@/components/SlotFilters';
import { getAvailableSlots } from '@/lib/services';
import { Slot } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CarFront } from 'lucide-react';

const SlotsPage = () => {
  const [filters, setFilters] = useState<{
    size?: string;
    vehicleType?: string;
  }>({});

  const { data: slots, isLoading, error } = useQuery({
    queryKey: ['slots', filters],
    queryFn: () => getAvailableSlots(filters),
    staleTime: 60000, // 1 minute
    meta: {
      onError: () => {
        toast.error('Failed to load available parking slots');
      }
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch slots:', error);
    }
  }, [error]);

  const handleFilterChange = (newFilters: { size?: string; vehicleType?: string }) => {
    setFilters(newFilters);
  };

  const SkeletonSlot = () => (
    <div className="border rounded-lg p-4 h-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-32 mt-1" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 mt-4">
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-10 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );

  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Available Parking Slots</h1>
          <p className="text-muted-foreground mt-2">
            Browse and book available parking slots
          </p>
        </div>

        <SlotFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonSlot key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <CarFront className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Error loading slots</h2>
            <p className="text-muted-foreground text-center max-w-md">
              There was a problem loading the available parking slots. Please try again later.
            </p>
          </div>
        ) : slots && slots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <CarFront className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No parking slots available</h2>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no parking slots that match your criteria. Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SlotsPage;
