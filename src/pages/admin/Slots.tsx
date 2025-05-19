
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Slot, SlotStatus } from '@/lib/types';
import { getAdminSlots } from '@/lib/services';
import { toast } from 'sonner';
import SlotDialog from '@/components/admin/SlotDialog';

const getStatusBadgeClass = (status: SlotStatus) => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'OCCUPIED':
      return 'bg-blue-100 text-blue-800';
    case 'UNAVAILABLE':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminSlots = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { data: slots, isLoading, error, refetch } = useQuery({
    queryKey: ['adminSlots'],
    queryFn: getAdminSlots,
    staleTime: 60000, // 1 minute
    meta: {
      onError: () => {
        toast.error('Failed to load slots data');
      }
    }
  });

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  const handleAddNewSlot = () => {
    setSelectedSlot(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  // Fallback to empty array if API fails
  const displaySlots = slots || [];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Parking Slots</h2>
        <Button onClick={handleAddNewSlot}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Slot
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                  <Skeleton className="h-10 w-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load slots. Please try again later.</p>
            </div>
          ) : displaySlots.length > 0 ? (
            <div className="space-y-4">
              {displaySlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center font-semibold">
                      {slot.number.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-medium">Slot {slot.number}</p>
                      <p className="text-sm text-muted-foreground">
                        {slot.size} • {slot.vehicleType} • {slot.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(slot.status)}`}>
                      {slot.status}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleEditSlot(slot)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No slots found. Add a new slot to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <SlotDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        slot={selectedSlot}
        onClose={handleDialogClose}
      />
    </AdminLayout>
  );
};

export default AdminSlots;
