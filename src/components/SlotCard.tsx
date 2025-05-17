
import { Slot } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SlotCardProps {
  slot: Slot;
}

const SlotCard = ({ slot }: SlotCardProps) => {
  return (
    <div className="slot-card flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{slot.number}</h3>
          <p className="text-muted-foreground text-sm">{slot.location}</p>
        </div>
        <Badge variant={slot.status === 'AVAILABLE' ? 'secondary' : 'outline'}>
          {slot.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4 mt-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Size</span>
          <span className="font-medium">{slot.size}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Type</span>
          <span className="font-medium">{slot.vehicleType}</span>
        </div>
      </div>
      
      <div className="mt-auto">
        <Button asChild className="w-full">
          <Link to={`/book?slotId=${slot.id}`}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book Slot
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SlotCard;
