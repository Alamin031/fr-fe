'use client';
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// Type definitions
interface ConfigItem {
  id: string;
  label: string;
  price: string;
}

interface ColorConfigItem extends ConfigItem {
  color: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  basePrice: string;
  porductlinkname: string;
  accessories: string;
  cpuCoreConfigs: ConfigItem[];
  gpuCoreConfigs: ConfigItem[];
  colorImageConfigs: ColorConfigItem[];
  displayConfigs: ConfigItem[];
  storageConfigs: ConfigItem[];
  ramConfigs: ConfigItem[];
  createdAt: string;
  updatedAt?: string;
}

interface EditingProduct extends Omit<Product, '_id'> {
  _id: string;
}

const MacBookTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const res = await fetch('/api/getproduct/macbooklist');
        const data: Product[] = await res.json();
        setProducts(data);
        setLoading(false);
        toast.success('Products loaded successfully', {
          duration: 2000,
          position: 'top-right',
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        toast.error('Failed to load products. Please try again.', {
          duration: 4000,
          position: 'top-right',
        });
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product): void => {
    setEditingProduct({
      ...product,
      cpuCoreConfigs: [...product.cpuCoreConfigs],
      gpuCoreConfigs: [...product.gpuCoreConfigs],
      colorImageConfigs: [...product.colorImageConfigs],
      displayConfigs: [...product.displayConfigs],
      storageConfigs: [...product.storageConfigs],
      ramConfigs: [...product.ramConfigs],
    });
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingProduct) return;

    const savePromise = (async () => {
      const res = await fetch(`/api/upadataApi/macbookupdata/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct: Product = await res.json();
      setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      setIsDialogOpen(false);
      setEditingProduct(null);
      return updatedProduct;
    })();

    toast.promise(
      savePromise,
      {
        loading: 'Saving changes...',
        success: 'Product updated successfully!',
        error: 'Failed to update product. Please try again.',
      },
      {
        position: 'top-right',
        success: {
          duration: 3000,
          icon: '✅',
        },
        error: {
          duration: 4000,
          icon: '❌',
        },
      }
    );
  };

  const handleDelete = async (id: string): Promise<void> => {
    const productToDelete = products.find(p => p._id === id);
    
    if (window.confirm(`Are you sure you want to delete "${productToDelete?.name}"?`)) {
      const deletePromise = (async () => {
        const res = await fetch(`/api/deleteapi/macbookdelete/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete product');
        }

        setProducts(products.filter(p => p._id !== id));
        return productToDelete;
      })();

      toast.promise(
        deletePromise,
        {
          loading: 'Deleting product...',
          success: (product) => `"${product?.name}" deleted successfully`,
          error: 'Failed to delete product. Please try again.',
        },
        {
          position: 'top-right',
          success: {
            duration: 3000,
            icon: '🗑️',
          },
          error: {
            duration: 4000,
            icon: '❌',
          },
        }
      );
    }
  };

  const formatPrice = (price: string): string => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return '৳ 0';
    
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const updateEditingField = (field: keyof EditingProduct, value: string): void => {
    setEditingProduct(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const addConfigItem = (configType: keyof Pick<EditingProduct, 
    'cpuCoreConfigs' | 'gpuCoreConfigs' | 'colorImageConfigs' | 'displayConfigs' | 'storageConfigs' | 'ramConfigs'
  >): void => {
    if (!editingProduct) return;

    const newItem: ConfigItem | ColorConfigItem = configType === 'colorImageConfigs' 
      ? {
          id: Date.now().toString(),
          label: '',
          price: '0',
          color: '',
          image: ''
        }
      : {
          id: Date.now().toString(),
          label: '',
          price: '0'
        };
    
    setEditingProduct(prev => prev ? {
      ...prev,
      [configType]: [...prev[configType], newItem]
    } : null);

    toast.success('Option added', {
      duration: 2000,
      position: 'bottom-right',
      icon: '➕',
    });
  };

  const removeConfigItem = (
    configType: keyof Pick<EditingProduct, 
      'cpuCoreConfigs' | 'gpuCoreConfigs' | 'colorImageConfigs' | 'displayConfigs' | 'storageConfigs' | 'ramConfigs'
    >, 
    index: number
  ): void => {
    if (!editingProduct) return;

    setEditingProduct(prev => prev ? {
      ...prev,
      [configType]: prev[configType].filter((_, idx) => idx !== index)
    } : null);

    toast.success('Option removed', {
      duration: 2000,
      position: 'bottom-right',
      icon: '➖',
    });
  };

  const updateConfigItem = (
    configType: keyof Pick<EditingProduct, 
      'cpuCoreConfigs' | 'gpuCoreConfigs' | 'colorImageConfigs' | 'displayConfigs' | 'storageConfigs' | 'ramConfigs'
    >,
    index: number, 
    field: string, 
    value: string
  ): void => {
    if (!editingProduct) return;

    setEditingProduct(prev => {
      if (!prev) return null;
      
      const updated = [...prev[configType]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [configType]: updated };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">MacBook Products</h1>
          <p className="text-base md:text-lg text-gray-600 mt-2">Manage your MacBook inventory</p>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10">
              <DialogTitle className="text-xl flex items-center gap-2">
                <Pencil size={20} />
                Edit Product
              </DialogTitle>
              <DialogDescription>
                Make changes to your product here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50">
              {editingProduct && (
                <div className="space-y-6">
                  {/* Basic Info Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                        <Input
                          id="name"
                          value={editingProduct.name}
                          onChange={(e) => updateEditingField('name', e.target.value)}
                          className="h-10"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="basePrice" className="text-sm font-medium">Base Price (৳)</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          step="1"
                          min="0"
                          value={editingProduct.basePrice}
                          onChange={(e) => updateEditingField('basePrice', e.target.value)}
                          className="h-10"
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="porductlinkname" className="text-sm font-medium">Product Link Name</Label>
                        <Input
                          id="porductlinkname"
                          value={editingProduct.porductlinkname}
                          onChange={(e) => updateEditingField('porductlinkname', e.target.value)}
                          className="h-10"
                          placeholder="product-link-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accessories" className="text-sm font-medium">Accessories</Label>
                        <Input
                          id="accessories"
                          value={editingProduct.accessories}
                          onChange={(e) => updateEditingField('accessories', e.target.value)}
                          className="h-10"
                          placeholder="Included accessories"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configuration Sections */}
                  {[
                    { key: 'cpuCoreConfigs' as const, title: 'CPU Core Configurations', description: 'Configure CPU options and their prices' },
                    { key: 'gpuCoreConfigs' as const, title: 'GPU Core Configurations', description: 'Configure GPU options and their prices' },
                    { key: 'storageConfigs' as const, title: 'Storage Configurations', description: 'Configure storage options and their prices' },
                    { key: 'ramConfigs' as const, title: 'RAM Configurations', description: 'Configure RAM options and their prices' },
                  ].map(({ key, title, description }) => (
                    <div key={key} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            {title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{description}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addConfigItem(key)}
                          className="h-9"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Option
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {editingProduct[key].map((item, idx) => (
                          <div key={item.id} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`${key}-label-${idx}`} className="text-xs font-medium text-gray-700">
                                  Option Label
                                </Label>
                                <Input
                                  id={`${key}-label-${idx}`}
                                  value={item.label}
                                  onChange={(e) => updateConfigItem(key, idx, 'label', e.target.value)}
                                  className="h-9"
                                  placeholder={`e.g., 8-core CPU, 16GB RAM, etc.`}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`${key}-price-${idx}`} className="text-xs font-medium text-gray-700">
                                  Additional Price (৳)
                                </Label>
                                <Input
                                  id={`${key}-price-${idx}`}
                                  type="number"
                                  step="1"
                                  min="0"
                                  value={item.price}
                                  onChange={(e) => updateConfigItem(key, idx, 'price', e.target.value)}
                                  className="h-9"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeConfigItem(key, idx)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors mt-6"
                              title="Remove option"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        
                        {editingProduct[key].length === 0 && (
                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-3xl mb-2">⚙️</div>
                            <p className="text-sm font-medium">No {title.toLowerCase()} added yet</p>
                            <p className="text-xs mt-1">Click "Add Option" to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Color Configuration */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          Color Configurations
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Manage available colors and their images</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addConfigItem('colorImageConfigs')}
                        className="h-9"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Color
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {editingProduct.colorImageConfigs.map((color, idx) => (
                        <div key={color.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`color-${idx}`} className="text-xs font-medium text-gray-700">
                                Color Name/Value
                              </Label>
                              <Input
                                id={`color-${idx}`}
                                value={color.color}
                                onChange={(e) => updateConfigItem('colorImageConfigs', idx, 'color', e.target.value)}
                                className="h-9"
                                placeholder="e.g., Space Gray, #8B8B8B"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`color-image-${idx}`} className="text-xs font-medium text-gray-700">
                                Image URL
                              </Label>
                              <Input
                                id={`color-image-${idx}`}
                                value={color.image}
                                onChange={(e) => updateConfigItem('colorImageConfigs', idx, 'image', e.target.value)}
                                className="h-9"
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-6">
                            {color.color && (
                              <div
                                className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                                style={{ backgroundColor: color.color }}
                                title={color.color}
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removeConfigItem('colorImageConfigs', idx)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove color"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {editingProduct.colorImageConfigs.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-3xl mb-2">🎨</div>
                          <p className="text-sm font-medium">No colors configured yet</p>
                          <p className="text-xs mt-1">Click "Add Color" to get started</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-white sticky bottom-0">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-500">
                  {editingProduct && (
                    <>Last updated: {formatDate(editingProduct.updatedAt || editingProduct.createdAt)}</>
                  )}
                </div>
                <div className="flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="min-w-24">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleSaveEdit} 
                    className="min-w-24 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    CPU Options
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    GPU Options
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Colors
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600">
                        {formatPrice(product.basePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        {product.cpuCoreConfigs.slice(0, 2).map((cpu, idx) => (
                          <div key={idx} className="truncate max-w-xs">
                            {cpu.label}
                          </div>
                        ))}
                        {product.cpuCoreConfigs.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{product.cpuCoreConfigs.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        {product.gpuCoreConfigs.slice(0, 2).map((gpu, idx) => (
                          <div key={idx} className="truncate max-w-xs">
                            {gpu.label}
                          </div>
                        ))}
                        {product.gpuCoreConfigs.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{product.gpuCoreConfigs.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap max-w-[120px]">
                        {product.colorImageConfigs.map((config, idx) => (
                          <div
                            key={idx}
                            className="w-7 h-7 rounded-full border-2 border-gray-300 shadow-sm"
                            style={{ backgroundColor: config.color }}
                            title={config.color}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(product.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-150"
                          title="Edit product"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-150"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-4">📦</div>
              <div className="text-lg font-medium">No products found</div>
              <div className="text-sm mt-1">Start by adding your first MacBook product</div>
            </div>
          )}
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(product.basePrice)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 p-2.5 rounded-lg hover:bg-blue-50 transition-all duration-150"
                    title="Edit product"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800 p-2.5 rounded-lg hover:bg-red-50 transition-all duration-150"
                    title="Delete product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    CPU Options
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    {product.cpuCoreConfigs.map((cpu, idx) => (
                      <div key={idx} className="py-1">
                        {cpu.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    GPU Options
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    {product.gpuCoreConfigs.map((gpu, idx) => (
                      <div key={idx} className="py-1">
                        {gpu.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Available Colors
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colorImageConfigs.map((config, idx) => (
                      <div
                        key={idx}
                        className="w-9 h-9 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: config.color }}
                        title={config.color}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created: <span className="text-gray-700 font-medium">{formatDate(product.createdAt)}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center text-gray-500">
              <div className="text-5xl mb-4">📦</div>
              <div className="text-lg font-medium">No products found</div>
              <div className="text-sm mt-2">Start by adding your first MacBook product</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacBookTable;