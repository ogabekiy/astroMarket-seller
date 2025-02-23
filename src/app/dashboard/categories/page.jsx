"use client";

import { useGetAllCategoriesQuery } from "@/app/redux/api/allApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useGetAllCategoriesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.title}</TableCell>
              <TableCell>{category.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
