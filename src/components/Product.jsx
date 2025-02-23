"use client";
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Trash, X, Upload, Pencil } from "lucide-react";
import {
  useAddImageToProductMutation,
  useApproveProductMutation,
  useDeleteImageOfProductMutation,
  useDeleteOneProductMutation,
  useGetAllNotApprovedProductsQuery,
  useGetAllProductsQuery,
} from "@/app/redux/api/allApi";
import { Button } from "./ui/button";
import EditProductModal from "./EditProduct";
import AddProduct from "./AddProduct";

export default function DashboardProducts({ status }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { 
    data: products, 
    refetch, 
    error, 
    isLoading 
  } = status === "notApproved"
    ? useGetAllNotApprovedProductsQuery()
    : useGetAllProductsQuery();

  const [approveProduct] = useApproveProductMutation();
  const [deleteProduct] = useDeleteOneProductMutation();
  const [deleteImage] = useDeleteImageOfProductMutation();
  const [addImageToProduct] = useAddImageToProductMutation();

  const GetItApproved = async (id) => {
    try {
      await approveProduct(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to approve product:", error);
    }
  };

  const deleteOneProduct = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const deleteImageOfProduct = async (productId, imagePath) => {
    try {
      await deleteImage({ id: productId, body: { image: imagePath } }).unwrap();
      setSelectedImages((prev) => prev.filter((img) => img !== imagePath));
      if (currentImageIndex >= selectedImages.length - 1 && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
      refetch();
      if (selectedImages.length <= 1) {
        modalniYop();
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Rasmni o‘chirishda xato yuz berdi!");
    }
  };

  const handleImageClick = (product) => {
    setSelectedImages(product.images || []);
    setCurrentImageIndex(0);
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const modalniYop = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async (productId) => {
    if (!selectedFile) {
      alert("Rasm tanlang!");
      return;
    }

    const formData = new FormData();
    formData.append("images", selectedFile);

    try {
      await addImageToProduct({ productId, images: formData }).unwrap();
      refetch();
      setSelectedFile(null);
      alert("Rasm yuklandi!");
    } catch (err) {
      console.error("Rasm yuklashda xatolik:", err);
      alert("Rasm yuklashda xato yuz berdi!");
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    refetch(); // Refresh data after editing
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") modalniYop();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) return <p className="text-center text-gray-600 py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-8">Error loading products: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-6 w-full max-w-[100vw] overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 md:text-xl sm:text-lg">Products</h2>
      <div className="mb-4">
        <Button onClick={() => setIsAddModalOpen(true)}>Add Product</Button>
      </div>
      <div className="min-w-[768px] lg:min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead>Nomi</TableHead>
              <TableHead>Rasmlar</TableHead>
              <TableHead>Rasm Qo‘shish</TableHead>
              <TableHead>Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell className="hidden md:table-cell">{product.id}</TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.images?.length > 0 ? (
                      product.images.slice(0, 2).map((img, index) => (
                        <div
                          key={index}
                          className="relative w-10 h-10 cursor-pointer group sm:w-8 sm:h-8"
                          onClick={() => handleImageClick(product)}
                        >
                          <img
                            src={`http://localhost:3000/${img}`}
                            alt={`Product ${index}`}
                            className="w-full h-full rounded-md object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Rasm yo‘q</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="mb-2"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => uploadImage(product.id)}
                    disabled={!selectedFile}
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    
                          <EditProductModal productId={product.id} />

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteOneProduct(product.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Product Images</h3>
              <Button variant="ghost" onClick={modalniYop}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <img
                src={`http://localhost:3000/${selectedImages[currentImageIndex]}`}
                alt="Product"
                className="w-full h-[400px] object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => deleteImageOfProduct(selectedProduct.id, selectedImages[currentImageIndex])}
              >
                <Trash className="h-4 w-4" />
              </Button>
              {selectedImages.length > 1 && (
                <>
                  <Button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={handleNextImage}
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>
            <div className="mt-2 text-center">
              <span>{`${currentImageIndex + 1} / ${selectedImages.length}`}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal 
          product={selectedProduct} 
          onClose={closeEditModal} 
        />
      )}

      {/* Add Product Modal */}
    </div>
  );
}