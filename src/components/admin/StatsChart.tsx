/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { AdminStats } from "@/lib/types";
import { ChevronDown, ChartPie, BarChart as BarChartIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface StatsChartProps {
  stats: AdminStats;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#14B8A6', '#6366F1', '#EC4899', '#8B5CF6'];


export function StatsChart({ stats }: StatsChartProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [dataType, setDataType] = useState<"users" | "bookings" | "slots">("users");

  const dataConfig = {
    users: {
      title: "User Statistics",
      description: "Breakdown of user accounts",
      data: [
        { name: "Verified Users", value: stats.verifiedUsers },
        { name: "Unverified Users", value: stats.totalUsers - stats.verifiedUsers }
      ]
    },
    bookings: {
      title: "Booking Statistics",
      description: "Breakdown of booking status",
      data: [
        { name: "Pending", value: stats.pendingBookings },
        { name: "Confirmed", value: stats.confirmedBookings },
        { name: "Other", value: stats.totalBookings - stats.pendingBookings - stats.confirmedBookings }
      ]
    },
    slots: {
      title: "Parking Slot Status",
      description: "Current status of parking slots",
      data: [
        { name: "Available", value: stats.availableSlots },
        { name: "Occupied", value: stats.occupiedSlots },
        { name: "Unavailable", value: stats.unavailableSlots }
      ]
    }
  };

  const selectedData = dataConfig[dataType];

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">{selectedData.title}</CardTitle>
          <CardDescription>{selectedData.description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={dataType}
            onValueChange={(value) => setDataType(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="bookings">Bookings</SelectItem>
              <SelectItem value="slots">Parking Slots</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md overflow-hidden">
            <button 
              onClick={() => setChartType("pie")} 
              className={`p-2 ${chartType === "pie" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              aria-label="Pie chart"
            >
              <ChartPie size={18} />
            </button>
            <button 
              onClick={() => setChartType("bar")} 
              className={`p-2 ${chartType === "bar" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              aria-label="Bar chart"
            >
              <BarChartIcon size={18} />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {chartType === "pie" ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selectedData.data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {selectedData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}`, '']} 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedData.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}`, '']} 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}