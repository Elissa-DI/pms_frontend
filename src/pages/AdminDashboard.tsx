import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/admin/StatCard";
import { StatsChart } from "@/components/admin/StatsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Car, CheckCircle, Clock, Users } from "lucide-react";

import { getAdminStats } from "@/lib/services";
import { AdminStats } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      const adminStats = await getAdminStats();
      if (adminStats) setStats(adminStats);
      setLoading(false);
    };

    getStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full" />
              ))}
          </div>
          <Skeleton className="h-[400px] w-full" />
        </main>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-600">
              Unable to load dashboard data.
            </h2>
            <p className="text-muted-foreground">
              Please try again later or contact support.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users className="h-5 w-5 text-white" />}
              description="Registered accounts"
              variant="primary"
            />
            <StatCard
              title="Verified Users"
              value={`${stats.verifiedUsers} (${Math.round(
                (stats.verifiedUsers / stats.totalUsers) * 100
              )}%)`}
              icon={<CheckCircle className="h-5 w-5 text-white" />}
              description="Email verified accounts"
              variant="success"
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<Calendar className="h-5 w-5 text-white" />}
              description="All time bookings"
              variant="info"
            />
            <StatCard
              title="Pending Bookings"
              value={stats.pendingBookings}
              icon={<Clock className="h-5 w-5 text-white" />}
              description="Awaiting confirmation"
              variant="warning"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Confirmed Bookings"
              value={stats.confirmedBookings}
              icon={<CheckCircle className="h-5 w-5 text-white" />}
              description="Approved reservations"
              variant="success"
            />
            <StatCard
              title="Available Slots"
              value={stats.availableSlots}
              icon={<Car className="h-5 w-5 text-white" />}
              description="Ready for booking"
              variant="info"
            />
            <StatCard
              title="Occupied Slots"
              value={stats.occupiedSlots}
              icon={<Car className="h-5 w-5 text-white" />}
              description="Currently in use"
              variant="warning"
            />
            <StatCard
              title="System Capacity"
              value={`${Math.round(
                (stats.occupiedSlots /
                  (stats.availableSlots + stats.occupiedSlots)) *
                  100
              )}%`}
              icon={<Car className="h-5 w-5 text-white" />}
              description={`${stats.occupiedSlots} of ${
                stats.availableSlots + stats.occupiedSlots
              } slots in use`}
              variant={
                stats.occupiedSlots /
                  (stats.availableSlots + stats.occupiedSlots) >
                0.8
                  ? "danger"
                  : "primary"
              }
            />
          </div>

          <div className="mb-6">
            <StatsChart stats={stats} />
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
