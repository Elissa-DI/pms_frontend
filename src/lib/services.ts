import api from './api';
import { Slot, Booking, User, AdminStats, Ticket } from './types';

// Slot services
export const getAvailableSlots = async (filters?: {
  size?: string;
  vehicleType?: string;
}): Promise<Slot[]> => {
  try {
    let url = '/customer/slots';

    if (filters) {
      const params = new URLSearchParams();
      if (filters.size && filters.size !== 'ANY') params.append('size', filters.size);
      if (filters.vehicleType && filters.vehicleType !== 'ANY') params.append('vehicleType', filters.vehicleType);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await api.get(url);
    console.log('Available slots:', response.data);

    return response.data || [];
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

// Admin slot services
export const getAdminSlots = async (): Promise<Slot[]> => {
  try {
    const response = await api.get('/slots');
    return response.data.slots || [];
  } catch (error) {
    console.error('Error fetching admin slots:', error);
    throw error;
  }
};

export const createSlot = async (slotData: Omit<Slot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Slot> => {
  const response = await api.post('/slots', slotData);
  return response.data.slot;
};

export const updateSlot = async (id: string, slotData: Partial<Slot>): Promise<Slot> => {
  const response = await api.patch(`/slots/${id}`, slotData);
  return response.data.slot;
};

export const deleteSlot = async (id: string): Promise<void> => {
  await api.delete(`/slots/${id}`);
};

// Booking services
export const createBooking = async (
  slotId: string,
  startTime: string,
  endTime: string
): Promise<Booking> => {
  const response = await api.post('/customer/bookings', {
    slotId,
    startTime,
    endTime
  });
  return response.data.booking;
};

export const getUserBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/customer/bookings/me');
  return response.data || [];
};

export const getBookingDetails = async (id: string): Promise<Booking> => {
  const response = await api.get(`/customer/bookings/${id}`);
  // console.log('Booking details:', response.data);
  // console.log('Booking :', response);


  return response.data;
};

export const cancelBooking = async (id: string): Promise<Booking> => {
  const response = await api.patch(`/customer/bookings/${id}/cancel`);
  return response.data.booking;
};

// Admin user services
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data.users || [];
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data.user;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${id}`, userData);
  return response.data.user;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Admin booking services
export const getAdminBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings');
  return response.data.bookings || [];
};

export const getAdminBookingDetails = async (id: string): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data.booking;
};

export const updateBookingStatus = async (id: string, status: string): Promise<Booking> => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data.booking;
};

export const deleteBooking = async (id: string): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get("/stats");
  return response.data.data as AdminStats;
};

export const getBookingTicket = async (bookingId: string): Promise<Ticket> => {
  const response = await api.get(`/customer/bookings/${bookingId}/ticket`);
  return response.data;
};


