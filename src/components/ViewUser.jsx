"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetAllUserWithRoleQuery,
  useAddAdminMutation,
  useDeleteOneUserMutation,
} from "@/app/redux/api/allApi";


//validation admin qo'shish uchun
const adminValidationSchema = yup.object().shape({
  firstname: yup.string().required("Firstname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string()
    .matches(/^\d+$/, "Phone number must contain only digits")
    .length(9, "Phone number must be exactly 9 digits")
    .required("Phone is required"),
  gender: yup.string().oneOf(["male", "female"], "Invalid gender").required("Gender is required"),
  age: yup.number()
    .min(1, "Age must be at least 1")
    .max(150, "Age must be at most 150")
    .required("Age is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function ViewUser({ children }) {
  const { data: users, isLoading, error, refetch } = useGetAllUserWithRoleQuery(children || "user");
  const [addAdmin] = useAddAdminMutation();
  const [removeUser] = useDeleteOneUserMutation();

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      email: "",
      phone: "",
      gender: "",
      age: "",
      password: "",
    },
    validationSchema: adminValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Yuborilayotgan ma'lumot:", values);
        await addAdmin({ ...values, role: "admin" }).unwrap();
        resetForm();
        setShowAddAdminModal(false);
        refetch();
      } catch (err) {
        console.error("Failed to add admin:", err);
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

 

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 capitalize">{children}</h2>
     {children === "admin" && (
  <div className="mb-4">
    <Button onClick={() => setShowAddAdminModal(true)}>Add Admin</Button>
  </div>
)}


      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.phone || "N/A"}</TableCell>
              <TableCell>{user.gender || "N/A"}</TableCell>
              <TableCell>{user.age || "N/A"}</TableCell>
              <TableCell>
                          {children !== "admin" && (
              <div className="mb-4">
                <Button onClick={() => removeUser(user.id)} >remove user</Button>
              </div> 
            )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showAddAdminModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" name="firstname" onChange={formik.handleChange} value={formik.values.firstname} />
                {formik.errors.firstname && <div className="text-red-500">{formik.errors.firstname}</div>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
                {formik.errors.email && <div className="text-gray-500">{formik.errors.email}</div>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" onChange={formik.handleChange} value={formik.values.phone} />
                {formik.errors.phone && <div className="text-red-500">{formik.errors.phone}</div>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {formik.errors.gender && <div className="text-red-500">{formik.errors.gender}</div>}
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" onChange={formik.handleChange} value={formik.values.age} />
                {formik.errors.age && <div className="text-red-500">{formik.errors.age}</div>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" onChange={formik.handleChange} value={formik.values.password} />
                {formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddAdminModal(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
