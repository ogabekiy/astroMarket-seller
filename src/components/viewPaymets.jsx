"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllPaymentsQuery } from "@/app/redux/api/allApi";

export default function ViewPayments() {
  const { data: payments, isLoading, error } = useGetAllPaymentsQuery();

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Error loading payments</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payments</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.order_id}</TableCell>
              <TableCell>{payment.order?.user_id || "Unknown"}</TableCell>
              <TableCell>{payment.amount} UZS</TableCell>
              <TableCell>{payment.order?.status || "N/A"}</TableCell>
              <TableCell>{payment.order?.payment_method || "N/A"}</TableCell>
              <TableCell>{new Date(payment.createdAt).toISOString().split("T")[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
