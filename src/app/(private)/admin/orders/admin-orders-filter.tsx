import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface OrderFilters {
  status: string;
  email: string;
  date: string;
}

interface AdminOrdersFilterProps {
  filters: OrderFilters;
  setFilters: (filters: OrderFilters) => void;
}

const AdminOrdersFilter: React.FC<AdminOrdersFilterProps> = ({ filters, setFilters }) => {
  const handleChange = (key: keyof OrderFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({ status: "all", email: "", date: "" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-primary mt-6">
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
        <Select
          value={filters.status}
          onValueChange={(val) => handleChange("status", val)}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Customer Email</label>
        <Input
          type="text"
          placeholder="Search by email..."
          value={filters.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
        <Input
          type="date"
          value={filters.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="w-full sm:w-auto">
        <Button variant="outline" onClick={clearFilters} className="w-full h-10">
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default AdminOrdersFilter;
