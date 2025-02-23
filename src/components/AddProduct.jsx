// AddProduct.jsx
"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateProductMutation, useGetAllCategoriesQuery } from "@/app/redux/api/allApi";
import { Button } from "./ui/button";

const AddProduct = ({ onClose }) => {
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetAllCategoriesQuery();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = new FormData();
    console.log(formData);
    
    productData.append('title', formData.title);
    productData.append('description', formData.description);
    productData.append('category_id', Number(formData.category)); 
    productData.append('price', Number(formData.price));
    productData.append('quantity', Number(formData.quantity));

    console.log("Title:", formData.title, typeof formData.title);
    console.log("Description:", formData.description, typeof formData.description);
    console.log("Category ID:", formData.category, typeof formData.category);
    console.log("Price:", formData.price, typeof formData.price);
    console.log("Quantity:", formData.quantity, typeof formData.quantity);


    images.forEach((image) => {
      productData.append('images', image);
    });

    try {
        console.log(productData);
        
      await createProduct(productData).unwrap();
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
      });
      setImages([]);
      setImagePreviews([]);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Product creation failed!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (so'm)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;