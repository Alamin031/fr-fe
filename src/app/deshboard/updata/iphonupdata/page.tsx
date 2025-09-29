'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Plus, Save, Trash } from 'lucide-react';

// Define TypeScript interfaces
interface StorageConfig {
  id: number;
  label: string;
  price: string;
}

interface ColorImageConfig {
  id: number;
  color: string;
  image: string;
  price: string;
}

interface RegionConfig {
  name: string;
  price: string;
}

interface DetailConfig {
  id: number;
  label: string;
  value: string;
}

interface PreOrderConfig {
  isPreOrder: boolean;
  availabilityDate: string;
  estimatedShipping: string;
  preOrderDiscount: number;
  maxPreOrderQuantity: number;
}

interface Product {
  _id: string;
  name: string;
  basePrice: string;
  sku: string;
  accessories: string;
  storageConfigs: StorageConfig[];
  colorImageConfigs: ColorImageConfig[];
  dynamicRegions: RegionConfig[];
  details: DetailConfig[];
  preOrderConfig: PreOrderConfig;
  createdAt: string;
}

interface FormData {
  name: string;
  basePrice: string;
  sku: string;
  accessories: string;
  storageConfigs: StorageConfig[];
  colorImageConfigs: ColorImageConfig[];
  dynamicRegions: RegionConfig[];
  details: DetailConfig[];
  preOrderConfig: PreOrderConfig;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('basic');

  // Initial form data structure
  const initialFormData: FormData = {
    name: '',
    basePrice: '',
    sku: '',
    accessories: 'iphone',
    storageConfigs: [],
    colorImageConfigs: [],
    dynamicRegions: [],
    details: [],
    preOrderConfig: {
      isPreOrder: false,
      availabilityDate: '',
      estimatedShipping: '',
      preOrderDiscount: 0,
      maxPreOrderQuantity: 0
    }
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/iphonelist`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Handle create button click
  const handleCreate = () => {
    setIsCreateMode(true);
    setSelectedProduct(null);
    setFormData(initialFormData);
    setActiveTab('basic');
    setIsDialogOpen(true);
  };

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setIsCreateMode(false);
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      basePrice: product.basePrice || '',
      sku: product.sku || '',
      accessories: product.accessories || 'iphone',
      storageConfigs: product.storageConfigs || [],
      colorImageConfigs: product.colorImageConfigs || [],
      dynamicRegions: product.dynamicRegions || [],
      details: product.details || [],
      preOrderConfig: product.preOrderConfig || initialFormData.preOrderConfig
    });
    setActiveTab('basic');
    setIsDialogOpen(true);
  };

  // Handle basic form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('preOrder.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preOrderConfig: {
          ...prev.preOrderConfig,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Storage Config Functions
  const addStorageConfig = () => {
    const newConfig: StorageConfig = {
      id: Date.now(),
      label: '',
      price: '0.00'
    };
    setFormData(prev => ({
      ...prev,
      storageConfigs: [...prev.storageConfigs, newConfig]
    }));
  };

  const updateStorageConfig = (index: number, field: keyof StorageConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      storageConfigs: prev.storageConfigs.map((config, i) => 
        i === index ? { ...config, [field]: value } : config
      )
    }));
  };

  const removeStorageConfig = (index: number) => {
    setFormData(prev => ({
      ...prev,
      storageConfigs: prev.storageConfigs.filter((_, i) => i !== index)
    }));
  };

  // Color Config Functions
  const addColorConfig = () => {
    const newConfig: ColorImageConfig = {
      id: Date.now(),
      color: '#000000',
      image: '',
      price: '0.00'
    };
    setFormData(prev => ({
      ...prev,
      colorImageConfigs: [...prev.colorImageConfigs, newConfig]
    }));
  };

  const updateColorConfig = (index: number, field: keyof ColorImageConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      colorImageConfigs: prev.colorImageConfigs.map((config, i) => 
        i === index ? { ...config, [field]: value } : config
      )
    }));
  };

  const removeColorConfig = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colorImageConfigs: prev.colorImageConfigs.filter((_, i) => i !== index)
    }));
  };

  // Region Config Functions
  const addRegionConfig = () => {
    const newConfig: RegionConfig = {
      name: '',
      price: '0'
    };
    setFormData(prev => ({
      ...prev,
      dynamicRegions: [...prev.dynamicRegions, newConfig]
    }));
  };

  const updateRegionConfig = (index: number, field: keyof RegionConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      dynamicRegions: prev.dynamicRegions.map((config, i) => 
        i === index ? { ...config, [field]: value } : config
      )
    }));
  };

  const removeRegionConfig = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dynamicRegions: prev.dynamicRegions.filter((_, i) => i !== index)
    }));
  };

  // Detail Config Functions
  const addDetailConfig = () => {
    const newDetail: DetailConfig = {
      id: Date.now(),
      label: '',
      value: ''
    };
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, newDetail]
    }));
  };

  const updateDetailConfig = (index: number, field: keyof DetailConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const removeDetailConfig = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      if (isCreateMode) {
        // Create new product
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/createproduct`,
          formData
        );
      } else {
        // Update existing product
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/upadataApi/phonupadata/${selectedProduct?._id}`,
          formData
        );
      }
      
      // Refresh the product list
      const response = await axios.get<Product[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getproduct/iphonelist`
      );
      setProducts(response.data);
      
      setIsDialogOpen(false);
      setSelectedProduct(null);
      setIsCreateMode(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    }
  };

  // Handle delete
  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/deleteapi/iphonedelete/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setIsCreateMode(false);
    setFormData(initialFormData);
    setActiveTab('basic');
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatPrice = (price: string) => `$${parseFloat(price).toLocaleString()}`;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'storage', label: 'Storage' },
    { id: 'colors', label: 'Colors' },
    { id: 'regions', label: 'Regions' },
    { id: 'details', label: 'Details' },
    { id: 'preorder', label: 'Pre-order' }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-800">iPhone Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatPrice(product.basePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {product.storageConfigs?.length || 0} Storage
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {product.colorImageConfigs?.length || 0} Colors
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {product.dynamicRegions?.length || 0} Regions
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
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
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">No products found</p>
    <p className="text-gray-400 text-sm mt-2">Click &quot;Create Product&quot; to add your first product</p>
  </div>
)}
      </div>

      {/* Create/Edit Dialog Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleCloseDialog}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden z-50">
            {/* Dialog Header */}
            <div className="flex justify-between items-center border-b p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {isCreateMode ? 'Create New Product' : 'Edit Product'}
              </h3>
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b bg-gray-50">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        placeholder="Enter base price"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="Auto-generated if empty"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
                      <select
                        name="accessories"
                        value={formData.accessories}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="iphone">iPhone</option>
                        <option value="ipad">iPad</option>
                        <option value="macbook">MacBook</option>
                        <option value="watch">Apple Watch</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Configs Tab */}
              {activeTab === 'storage' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">Storage Configurations</h4>
                    <button
                      onClick={addStorageConfig}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      <span>Add Storage</span>
                    </button>
                  </div>
                  {formData.storageConfigs.map((config, index) => (
                    <div key={config.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <input
                        type="text"
                        placeholder="Storage label (e.g., 128GB)"
                        value={config.label}
                        onChange={(e) => updateStorageConfig(index, 'label', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Price adjustment"
                        value={config.price}
                        onChange={(e) => updateStorageConfig(index, 'price', e.target.value)}
                        className="w-32 border border-gray-300 rounded px-3 py-2"
                        step="0.01"
                      />
                      <button
                        onClick={() => removeStorageConfig(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Color Configs Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">Color & Image Configurations</h4>
                    <button
                      onClick={addColorConfig}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      <span>Add Color</span>
                    </button>
                  </div>
                  {formData.colorImageConfigs.map((config, index) => (
                    <div key={config.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={config.color}
                              onChange={(e) => updateColorConfig(index, 'color', e.target.value)}
                              className="w-12 h-10 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={config.color}
                              onChange={(e) => updateColorConfig(index, 'color', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-3 py-2"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment</label>
                          <input
                            type="number"
                            value={config.price}
                            onChange={(e) => updateColorConfig(index, 'price', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={config.image}
                            onChange={(e) => updateColorConfig(index, 'image', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <button
                          onClick={() => removeColorConfig(index)}
                          className="text-red-600 hover:text-red-800 p-2 mt-6"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Regions Tab */}
              {activeTab === 'regions' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">Dynamic Regions</h4>
                    <button
                      onClick={addRegionConfig}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      <span>Add Region</span>
                    </button>
                  </div>
                  {formData.dynamicRegions.map((region, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <input
                        type="text"
                        placeholder="Region name (e.g., US, EU)"
                        value={region.name}
                        onChange={(e) => updateRegionConfig(index, 'name', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Price adjustment"
                        value={region.price}
                        onChange={(e) => updateRegionConfig(index, 'price', e.target.value)}
                        className="w-32 border border-gray-300 rounded px-3 py-2"
                        step="0.01"
                      />
                      <button
                        onClick={() => removeRegionConfig(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">Product Details</h4>
                    <button
                      onClick={addDetailConfig}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      <span>Add Detail</span>
                    </button>
                  </div>
                  {formData.details.map((detail, index) => (
                    <div key={detail.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                          <input
                            type="text"
                            placeholder="e.g., Display Size"
                            value={detail.label}
                            onChange={(e) => updateDetailConfig(index, 'label', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeDetailConfig(index)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <textarea
                          placeholder="e.g., 6.3 inches"
                          value={detail.value}
                          onChange={(e) => updateDetailConfig(index, 'value', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pre-order Tab */}
              {activeTab === 'preorder' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Pre-order Configuration</h4>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="preOrder.isPreOrder"
                      checked={formData.preOrderConfig.isPreOrder}
                      onChange={handleChange}
                      className="rounded border-gray-300"
                    />
                    <label className="text-sm font-medium text-gray-700">Enable Pre-order</label>
                  </div>

                  {formData.preOrderConfig.isPreOrder && (
                    <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Availability Date</label>
                          <input
                            type="date"
                            name="preOrder.availabilityDate"
                            value={formData.preOrderConfig.availabilityDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Shipping</label>
                          <input
                            type="text"
                            name="preOrder.estimatedShipping"
                            value={formData.preOrderConfig.estimatedShipping}
                            onChange={handleChange}
                            placeholder="e.g., 2-3 weeks"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pre-order Discount (%)</label>
                          <input
                            type="number"
                            name="preOrder.preOrderDiscount"
                            value={formData.preOrderConfig.preOrderDiscount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Pre-order Quantity</label>
                          <input
                            type="number"
                            name="preOrder.maxPreOrderQuantity"
                            value={formData.preOrderConfig.maxPreOrderQuantity}
                            onChange={handleChange}
                            min="0"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                <span>{isCreateMode ? 'Create Product' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;