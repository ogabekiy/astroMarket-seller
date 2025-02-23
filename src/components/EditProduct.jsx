"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOneProductQuery, useUpdateOneProductMutation, useGetAllCategoriesQuery } from "@/app/redux/api/allApi";

export default function EditProductModal({ productId }) {
  const { data: product, isLoading: isProductLoading, error: productError } = useGetOneProductQuery(productId, {
    skip: !productId,
  });

  const { data: categories, isLoading: isCategoriesLoading,  error: categoriesError } = useGetAllCategoriesQuery();

  const [updateProduct] = useUpdateOneProductMutation();

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    price: "",
    description: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    if (product) {
      setFormData({
        title: product.title || "",
        category_id: product.category_id || "",
        price: product.price || "",
        description: product.description || "",
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category_id: value });
  };

  const handleUpdateProduct = async () => {
    console.log(formData);
    
    try {
      await updateProduct({id:productId,title:formData.title,description:formData.description,price:formData.price,category_id: formData.category_id} );
      setShowModal(false); 
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({ title: "", category_id: "", price: "", description: "" }); 
  };

  if (isProductLoading || isCategoriesLoading) return <div>Loading...</div>;
  if (productError || categoriesError) return <div>Error loading data</div>;

  return (
    <div>
      <Button variant="outline" onClick={handleOpenModal}>
        Edit
      </Button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={formData.category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}