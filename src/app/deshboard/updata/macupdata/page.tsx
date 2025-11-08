'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Navbar from "../Updatanav";
import AdminManagementProvider from "@/providers/AdminManagementProvider";

// Types based on your MongoDB schema
type ImageConfig = {
  colorHex: string;
  colorName: string;
  id: number;
  image: string;
  inStock: boolean;
  _id?: string;
};

type StorageConfig = {
  basicPrice: string;
  colorStocks: any[];
  id: number;
  inStock: boolean;
  name: string;
  prices: any[];
  shortDetails: string;
  _id?: string;
};

type DynamicInputItem = {
  label: string;
  price: string;
  inStock: boolean;
};

type DynamicInput = {
  type: string;
  items: DynamicInputItem[];
};

type Detail = {
  id: number;
  label: string;
  value: string;
  _id?: string;
};

type PreOrderConfig = {
  enabled: boolean;
  message?: string;
  date?: string;
} | null;

type Product = {
  _id: string;
  name: string;
  basePrice: number;
  description: string;
  accessories: string;
  accessoriesType: string;
  storageConfigs: StorageConfig[];
  imageConfigs: ImageConfig[];
  dynamicInputs: DynamicInput[];
  details: Detail[];
  preOrderConfig: PreOrderConfig;
  productlinkname: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}/macbooklist/all`);
      console.log('API Response:', res.data);
      
      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.warn('Unexpected API response structure:', res.data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URI}/accessories/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete product");
    }
  };

  const openEditDialog = async (productLinkName: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URI}/macbooklist/getBySlug/${productLinkName}`
      );
      console.log('Product data for editing:', response.data);
      const productData = response.data.product || response.data;
      setEditingProduct(productData);
      setIsEditDialogOpen(true);
    } catch (err) {
      console.error("Error fetching product details:", err);
      alert("Failed to load product data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URI}/macbooklist/update/${editingProduct.productlinkname}`,
        editingProduct
      );
      
      console.log('Update response:', response.data);
      
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  // Basic input handlers
  const handleInputChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [field]: value
      });
    }
  };

  // Image Config handlers
  const handleImageConfigChange = (index: number, field: keyof ImageConfig, value: any) => {
    if (!editingProduct) return;

    const updatedImageConfigs = [...editingProduct.imageConfigs];
    updatedImageConfigs[index] = {
      ...updatedImageConfigs[index],
      [field]: value
    };

    setEditingProduct({
      ...editingProduct,
      imageConfigs: updatedImageConfigs
    });
  };

  // Storage Config handlers
  const handleStorageConfigChange = (index: number, field: keyof StorageConfig, value: any) => {
    if (!editingProduct) return;

    const updatedStorageConfigs = [...editingProduct.storageConfigs];
    updatedStorageConfigs[index] = {
      ...updatedStorageConfigs[index],
      [field]: value
    };

    setEditingProduct({
      ...editingProduct,
      storageConfigs: updatedStorageConfigs
    });
  };

  // Dynamic Input handlers
  const handleDynamicInputChange = (index: number, field: keyof DynamicInput, value: any) => {
    if (!editingProduct) return;

    const updatedDynamicInputs = [...editingProduct.dynamicInputs];
    updatedDynamicInputs[index] = {
      ...updatedDynamicInputs[index],
      [field]: value
    };

    setEditingProduct({
      ...editingProduct,
      dynamicInputs: updatedDynamicInputs
    });
  };

  const handleDynamicItemChange = (inputIndex: number, itemIndex: number, field: keyof DynamicInputItem, value: any) => {
    if (!editingProduct) return;

    const updatedDynamicInputs = [...editingProduct.dynamicInputs];
    const updatedItems = [...updatedDynamicInputs[inputIndex].items];
    
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [field]: value
    };

    updatedDynamicInputs[inputIndex] = {
      ...updatedDynamicInputs[inputIndex],
      items: updatedItems
    };

    setEditingProduct({
      ...editingProduct,
      dynamicInputs: updatedDynamicInputs
    });
  };

  // Detail handlers
  const handleDetailChange = (index: number, field: keyof Detail, value: any) => {
    if (!editingProduct) return;

    const updatedDetails = [...editingProduct.details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    };

    setEditingProduct({
      ...editingProduct,
      details: updatedDetails
    });
  };

  // Pre-order Config handlers
  const handlePreOrderConfigChange = (field: keyof NonNullable<PreOrderConfig>, value: any) => {
    if (!editingProduct) return;

    const currentPreOrderConfig = editingProduct.preOrderConfig || { enabled: false };
    
    setEditingProduct({
      ...editingProduct,
      preOrderConfig: {
        ...currentPreOrderConfig,
        [field]: value
      }
    });
  };

  // Add new items functions
  const addImageConfig = () => {
    if (!editingProduct) return;

    const newImageConfig: ImageConfig = {
      colorHex: "#ffffff",
      colorName: "",
      id: Date.now(),
      image: "",
      inStock: true
    };

    setEditingProduct({
      ...editingProduct,
      imageConfigs: [...editingProduct.imageConfigs, newImageConfig]
    });
  };

  const addStorageConfig = () => {
    if (!editingProduct) return;

    const newStorageConfig: StorageConfig = {
      basicPrice: "0",
      colorStocks: [],
      id: Date.now(),
      inStock: true,
      name: "",
      prices: [],
      shortDetails: ""
    };

    setEditingProduct({
      ...editingProduct,
      storageConfigs: [...editingProduct.storageConfigs, newStorageConfig]
    });
  };

  const addDynamicInput = () => {
    if (!editingProduct) return;

    const newDynamicInput: DynamicInput = {
      type: "",
      items: [{ label: "", price: "0", inStock: true }]
    };

    setEditingProduct({
      ...editingProduct,
      dynamicInputs: [...editingProduct.dynamicInputs, newDynamicInput]
    });
  };

  const addDetail = () => {
    if (!editingProduct) return;

    const newDetail: Detail = {
      id: Date.now(),
      label: "",
      value: ""
    };

    setEditingProduct({
      ...editingProduct,
      details: [...editingProduct.details, newDetail]
    });
  };

  const addDynamicItem = (inputIndex: number) => {
    if (!editingProduct) return;

    const updatedDynamicInputs = [...editingProduct.dynamicInputs];
    const newItem: DynamicInputItem = {
      label: "",
      price: "0",
      inStock: true
    };

    updatedDynamicInputs[inputIndex].items.push(newItem);
    
    setEditingProduct({
      ...editingProduct,
      dynamicInputs: updatedDynamicInputs
    });
  };

  // Remove items functions
  const removeImageConfig = (index: number) => {
    if (!editingProduct) return;
    const updated = editingProduct.imageConfigs.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, imageConfigs: updated });
  };

  const removeStorageConfig = (index: number) => {
    if (!editingProduct) return;
    const updated = editingProduct.storageConfigs.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, storageConfigs: updated });
  };

  const removeDynamicInput = (index: number) => {
    if (!editingProduct) return;
    const updated = editingProduct.dynamicInputs.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, dynamicInputs: updated });
  };

  const removeDetail = (index: number) => {
    if (!editingProduct) return;
    const updated = editingProduct.details.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, details: updated });
  };

  const removeDynamicItem = (inputIndex: number, itemIndex: number) => {
    if (!editingProduct) return;
    const updatedDynamicInputs = [...editingProduct.dynamicInputs];
    updatedDynamicInputs[inputIndex].items = updatedDynamicInputs[inputIndex].items.filter((_, i) => i !== itemIndex);
    setEditingProduct({ ...editingProduct, dynamicInputs: updatedDynamicInputs });
  };

  const filteredProducts = (products || []).filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.accessories?.toLowerCase().includes(query) ||
      product.basePrice?.toString().includes(query)
    );
  });

  return (
    <>
    <AdminManagementProvider>
      <Card className="shadow-lg rounded-2xl w-full mt-4">
            <Navbar></Navbar>

        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Products List</h2>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Type</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      {searchQuery ? "No products match your search" : "No products found"}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 capitalize">{product.accessories || "-"}</td>
                      <td className="p-3 flex items-center gap-3">
                        {product.imageConfigs?.[0]?.image && (
                          <img
                            src={product.imageConfigs[0].image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        {product.name}
                      </td>
                      <td className="p-3 font-medium">৳{product.basePrice}</td>
                      <td className="p-3 text-center flex justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product.productlinkname)}
                          disabled={isLoading}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {searchQuery && (
            <p className="mt-4 text-sm text-gray-600">
              Found {filteredProducts.length} of {products.length} products
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle>Edit Product - {editingProduct?.name}</DialogTitle>
            <DialogDescription>
              Make changes to your product here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={editingProduct.basePrice}
                    onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessories">Accessories Category</Label>
                  <Input
                    id="accessories"
                    value={editingProduct.accessories}
                    onChange={(e) => handleInputChange('accessories', e.target.value)}
                    placeholder="e.g., iphone, macbook"
                  />
                </div>
                
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (HTML supported)</Label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded-md min-h-[100px] font-mono text-sm"
                  value={editingProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="You can use HTML tags like <h3>, <p>, etc."
                />
              </div>

              {/* Pre-order Configuration */}
              <div className="space-y-4 p-4 border rounded-md">
                <Label className="text-lg font-semibold">Pre-order Configuration</Label>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={editingProduct.preOrderConfig?.enabled || false}
                    onChange={(e) => handlePreOrderConfigChange('enabled', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label>Enable Pre-order</Label>
                </div>
                {editingProduct.preOrderConfig?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pre-order Message</Label>
                      <Input
                        value={editingProduct.preOrderConfig?.message || ""}
                        onChange={(e) => handlePreOrderConfigChange('message', e.target.value)}
                        placeholder="e.g., Available for pre-order"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pre-order Date</Label>
                      <Input
                        type="date"
                        value={editingProduct.preOrderConfig?.date || ""}
                        onChange={(e) => handlePreOrderConfigChange('date', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Storage Configurations */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                         <Label className="text-lg font-semibold">Storage Configurations</Label>
                  <div className="space-y-2">
                  <Input
                    id="accessoriesType"
                    value={editingProduct.accessoriesType}
                    onChange={(e) => handleInputChange('accessoriesType', e.target.value)}
                    placeholder="e.g., Storage, Region"
                  />
                </div>
                    </div>
                 
                  
                  <Button type="button" onClick={addStorageConfig} variant="outline" size="sm">
                    Add Storage
                  </Button>
                </div>
                {editingProduct.storageConfigs.map((storage, index) => (
                    
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative text-black">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-6 h-6 p-0 text-black"
                      onClick={() => removeStorageConfig(index)}
                    >
                      ×
                    </Button>
                    <div className="space-y-2">
                      <Label>Storage Name *</Label>
                      <Input
                        value={storage.name}
                        onChange={(e) => handleStorageConfigChange(index, 'name', e.target.value)}
                        placeholder="e.g., 128GB, 256GB"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Basic Price</Label>
                      <Input
                        value={storage.basicPrice}
                        onChange={(e) => handleStorageConfigChange(index, 'basicPrice', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Details</Label>
                      <Input
                        value={storage.shortDetails}
                        onChange={(e) => handleStorageConfigChange(index, 'shortDetails', e.target.value)}
                        placeholder="e.g., 128GB storage"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={storage.inStock}
                        onChange={(e) => handleStorageConfigChange(index, 'inStock', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label>In Stock</Label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Configurations */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Image Configurations</Label>
                  <Button type="button" onClick={addImageConfig} variant="outline" size="sm">
                    Add Image Config
                  </Button>
                </div>
                {editingProduct.imageConfigs.map((config, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-6 h-6 p-0"
                      onClick={() => removeImageConfig(index)}
                    >
                      ×
                    </Button>
                    <div className="space-y-2">
                      <Label>Color Name *</Label>
                      <Input
                        value={config.colorName}
                        onChange={(e) => handleImageConfigChange(index, 'colorName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color Hex</Label>
                      <Input
                        value={config.colorHex}
                        onChange={(e) => handleImageConfigChange(index, 'colorHex', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Image URL *</Label>
                      <Input
                        value={config.image}
                        onChange={(e) => handleImageConfigChange(index, 'image', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.inStock}
                        onChange={(e) => handleImageConfigChange(index, 'inStock', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label>In Stock</Label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Inputs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Dynamic Inputs</Label>
                  <Button type="button" onClick={addDynamicInput} variant="outline" size="sm">
                    Add Dynamic Input
                  </Button>
                </div>
                {editingProduct.dynamicInputs.map((input, inputIndex) => (
                  <div key={inputIndex} className="p-4 border rounded-md space-y-4 relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-6 h-6 p-0"
                      onClick={() => removeDynamicInput(inputIndex)}
                    >
                      ×
                    </Button>
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Input
                        value={input.type}
                        onChange={(e) => handleDynamicInputChange(inputIndex, 'type', e.target.value)}
                        placeholder="e.g., Region, Cable, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Items</Label>
                        <Button 
                          type="button" 
                          onClick={() => addDynamicItem(inputIndex)} 
                          variant="outline" 
                          size="sm"
                        >
                          Add Item
                        </Button>
                      </div>
                      {input.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded relative text-black">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 w-5 h-5 p-0 text-xs text-black"
                            onClick={() => removeDynamicItem(inputIndex, itemIndex)}
                          >
                            ×
                          </Button>
                          <div className="space-y-1">
                            <Label className="text-xs">Label *</Label>
                            <Input
                              placeholder="e.g., USA, SG/AUS"
                              value={item.label}
                              onChange={(e) => handleDynamicItemChange(inputIndex, itemIndex, 'label', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Price</Label>
                            <Input
                              placeholder="0"
                              value={item.price}
                              onChange={(e) => handleDynamicItemChange(inputIndex, itemIndex, 'price', e.target.value)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={item.inStock}
                              onChange={(e) => handleDynamicItemChange(inputIndex, itemIndex, 'inStock', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <Label className="text-xs">In Stock</Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Product Details</Label>
                  <Button type="button" onClick={addDetail} variant="outline" size="sm">
                    Add Detail
                  </Button>
                </div>
                {editingProduct.details.map((detail, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded relative ">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 w-5 h-5 p-0 text-xs"
                      onClick={() => removeDetail(index)}
                    >
                      ×
                    </Button>
                    <div className="space-y-1">
                      <Label className="text-xs">Label *</Label>
                      <Input
                        placeholder="e.g., Model, Dimensions"
                        value={detail.label}
                        onChange={(e) => handleDetailChange(index, 'label', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Value *</Label>
                      <Input
                        placeholder="e.g., iPhone 16 Pro, 149.6 x 71.5 x 8.3 mm"
                        value={detail.value}
                        onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-black text-white">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      
    </AdminManagementProvider>
      
    </>
  );
}