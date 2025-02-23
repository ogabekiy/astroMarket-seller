"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetAllReviewsQuery, useDeleteOneReviewMutation } from "@/app/redux/api/allApi";

export default function ViewReviews() {
  const { data: reviews, isLoading, error, refetch } = useGetAllReviewsQuery();
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Reviews</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews?.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{review.id}</TableCell>
              <TableCell>{review.user_id}</TableCell>
              <TableCell>{review.user?.firstname || "Unknown"}</TableCell>
              <TableCell>{review.product_id}</TableCell>
              <TableCell>{review.product?.title || "Unknown Product"}</TableCell>
              <TableCell>{review.rating} ⭐</TableCell>
              <TableCell>{review.comment}</TableCell>
              <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(review.updatedAt).toLocaleDateString()}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
