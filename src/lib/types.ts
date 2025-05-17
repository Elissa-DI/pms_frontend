
export type UserRole = 'CUSTOMER' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: UserRole;
};

export type SlotSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type VehicleType = 'MOTORCYCLE' | 'CAR' | 'TRUCK' | 'ANY';
export type SlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export type Slot = {
  id: string;
  number: string;
  size: SlotSize;
  vehicleType: VehicleType;
  location: string;
  status: SlotStatus;
};

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type Booking = {
  id: string;
  slotId: string;
  userId: string;
  slot: Slot;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};
