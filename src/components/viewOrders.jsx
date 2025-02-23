"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllOrdersQuery, useGetAllOrdersOfQuery } from "@/app/redux/api/allApi";

export default function ViewOrders() {
  const [selectedStatus, setSelectedStatus] = useState("all"); 

  const { data: orders, isLoading, error } =
    selectedStatus === "all" ? useGetAllOrdersQuery() : useGetAllOrdersOfQuery(selectedStatus);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Orders ({selectedStatus})</h2>

      <div className="mb-4 flex gap-4">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setSelectedStatus("all")}>Reset</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.cart?.user_id || "Unknown"}</TableCell>
              <TableCell>{order.total_price} UZS</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.payment_method}</TableCell>
              <TableCell>{new Date(order.createdAt).toISOString().split("T")[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
