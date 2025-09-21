'use client'
import axios from 'axios';
import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';

// Loading Spinner Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

// In Stock Toggle Component
const InStockToggle: React.FC<{ 
  inStock: boolean; 
  onToggle: () => void; 
  size?: 'sm' | 'md' | 'lg' 
}> = ({ inStock, onToggle, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };
  
  const thumbClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${sizeClasses[size]} flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        inStock ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`${thumbClasses[size]} inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
          inStock ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

// Types
type Config = { 
  id: number; 
  label: string; 
  price: string; 
  shortDetails: string;
  inStock: boolean;
};

type ColorImageConfig = { 
  id: number; 
  color: string; 
  image: string; 
  price: string;
  inStock: boolean;
};

type SimConfig = {
  id: number;
  type: 'Wi-Fi' | 'Wi-Fi + Cell';
  price: string;
  inStock: boolean;
};

type RegionConfig = { name: string; price: string; inStock: boolean; };
type DetailConfig = { id: number; label: string; value: string; };

// Pre-order Configuration Type
type PreOrderConfig = {
  isPreOrder: boolean;
  availabilityDate?: string;
  estimatedShipping?: string;
  preOrderDiscount?: number;
  maxPreOrderQuantity?: number;
};

// Product Type
type Product = { 
  name: string; 
  basePrice: string; 
  storageConfigs: Config[]; 
  colorImageConfigs: ColorImageConfig[]; 
  simConfigs: SimConfig[];
  dynamicRegions: RegionConfig[]; 
  details: DetailConfig[]; 
  preOrderConfig: PreOrderConfig;
  sku?: string;
  accessories?: string;
};

const Ipadaddproduct: React.FC = () => {
  // Product Info
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productSku, setProductSku] = useState('');
  const [accessories, setAccessories] = useState('iphone');

  // Pre-order Configuration
  const [preOrderConfig, setPreOrderConfig] = useState<PreOrderConfig>({
    isPreOrder: false,
    availabilityDate: '',
    estimatedShipping: '',
    preOrderDiscount: 0,
    maxPreOrderQuantity: 0
  });

  // Storage Configs
  const [storageConfigs, setStorageConfigs] = useState<Config[]>([
    { id: 1, label: '256GB ', price: '', shortDetails: '', inStock: true },
    { id: 2, label: '512GB ', price: '', shortDetails: '', inStock: true },
    { id: 3, label: '1TB ', price: '', shortDetails: '', inStock: true },
    { id: 4, label: '2TB ', price: '', shortDetails: '', inStock: true },
  ]);
  const [newStorageLabel, setNewStorageLabel] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');
  const [newStorageShortDetails, setNewStorageShortDetails] = useState('');
  const [newStorageInStock, setNewStorageInStock] = useState(true);

  // Sim Configs
  const [simConfigs, setSimConfigs] = useState<SimConfig[]>([
    { id: 1, type: 'Wi-Fi', price: '', inStock: true },
    { id: 2, type: 'Wi-Fi + Cell', price: '', inStock: true }
  ]);

  // Colors & Images
  const [colorImageConfigs, setColorImageConfigs] = useState<ColorImageConfig[]>([]);
  const [newColor, setNewColor] = useState('#');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [newColorInStock, setNewColorInStock] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Dynamic Regions
  const [dynamicProducts, setDynamicProducts] = useState<RegionConfig[]>([]);
  const [newRegionInStock, setNewRegionInStock] = useState(true);

  // Product Details
  const [details, setDetails] = useState<DetailConfig[]>([]);

  // Handlers
  const handlePreOrderToggle = (enabled: boolean) => {
    setPreOrderConfig(prev => ({
      ...prev,
      isPreOrder: enabled,
      ...(enabled ? {} : {
        availabilityDate: '',
        estimatedShipping: '',
        preOrderDiscount: 0,
        maxPreOrderQuantity: 0
      })
    }));
  };

  const handleAddStorage = () => {
    if (!newStorageLabel || !newStoragePrice) { 
      alert('Please fill in both Storage label and price'); 
      return; 
    }
    const newStorageConfig = { 
      id: Date.now(), 
      label: newStorageLabel, 
      price: parseFloat(newStoragePrice).toFixed(2),
      shortDetails: newStorageShortDetails,
      inStock: newStorageInStock
    };
    setStorageConfigs(prev => [...prev, newStorageConfig]);
    setNewStorageLabel(''); 
    setNewStoragePrice('');
    setNewStorageShortDetails('');
    setNewStorageInStock(true);
  };

  const handleRemoveStorage = (id: number) => {
    setStorageConfigs(prev => prev.filter(config => config.id !== id));
  };

  const handleConfigChange = (
    setter: React.Dispatch<React.SetStateAction<Config[]>>, 
    id: number, 
    field: 'price' | 'shortDetails' | 'inStock',
    value: string | boolean
  ) => {
    setter(prev => prev.map(cfg => cfg.id === id ? { ...cfg, [field]: value } : cfg));
  };

  // Sim Config Handlers
  const handleSimConfigChange = (id: number, field: 'price' | 'inStock', value: string | boolean) => {
    setSimConfigs(prev => prev.map(cfg => 
      cfg.id === id ? { ...cfg, [field]: value } : cfg
    ));
  };

  const handleColorImageConfigChange = (id: number, field: 'price' | 'inStock', value: string | boolean) => {
    setColorImageConfigs(prev => prev.map(cfg => 
      cfg.id === id ? { ...cfg, [field]: value } : cfg
    ));
  };

  const handleRemoveColorImage = (id: number) => {
    setColorImageConfigs(prev => prev.filter(config => config.id !== id));
  };

  const handleNewImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const base64File = reader.result.split(',')[1];
        try {
          const res = await fetch('/api/imagekit_auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64File, fileName: file.name }),
          });
          const data = await res.json();
          if (data.url) setNewImagePreview(data.url);
        } catch (err) {
          console.error('📸 Image Upload Error:', err);
          alert('Image upload failed');
        } finally {
          setUploading(false);
        }
      }
    };
  };

  const handleAddColorImage = () => {
    if (!newColor || !newImagePreview || !newPrice) { 
      alert('Fill all fields'); 
      return; 
    }
    const newColorConfig = { 
      id: Date.now(), 
      color: newColor, 
      image: newImagePreview, 
      price: parseFloat(newPrice).toFixed(2),
      inStock: newColorInStock
    };
    setColorImageConfigs(prev => [...prev, newColorConfig]);
    setNewColor('#4a6cf7'); 
    setNewImagePreview(null); 
    setNewPrice('');
    setNewColorInStock(true);
  };

  const addRegion = () => {
    setDynamicProducts(prev => [...prev, { name: '', price: '', inStock: newRegionInStock }]);
    setNewRegionInStock(true);
  };
  
  const handleRegionChange = (index: number, field: 'name'|'price'|'inStock', value: string | boolean) => {
    const updated = [...dynamicProducts]; 
    updated[index][field] = value; 
    setDynamicProducts(updated);
  };
  
  const addDetail = () => {
    const newDetail = { id: Date.now(), label: '', value: '' };
    setDetails(prev => [...prev, newDetail]);
  };
  
  const handleDetailChange = (id: number, field: 'label'|'value', value: string) => {
    setDetails(prev => prev.map(d => d.id === id ? {...d, [field]: value} : d));
  };
  
  const removeDetail = (id: number) => {
    setDetails(prev => prev.filter(d => d.id !== id));
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice) { 
      alert('Enter name and price'); 
      return; 
    }
    
    const newProduct: Product & { sku?: string; accessories?: string } = { 
      name: productName, 
      basePrice: parseFloat(productPrice).toFixed(2), 
      ...(productSku && { sku: productSku }),
      accessories: accessories,
      storageConfigs, 
      colorImageConfigs, 
      simConfigs,
      dynamicRegions: dynamicProducts, 
      details,
      preOrderConfig
    };
    console.log(newProduct)

    await axios.post('/api/ipadpostlist', newProduct)
      .then(res => {
        console.log(res.data);
        alert('Product added successfully!');
        // Reset form
        setProductName('');
        setProductPrice('');
        setProductSku('');
        setAccessories('iphone');
        setStorageConfigs([
          { id: 1, label: '256GB ', price: '', shortDetails: '', inStock: true },
          { id: 2, label: '512GB ', price: '', shortDetails: '', inStock: true },
          { id: 3, label: '1TB ', price: '', shortDetails: '', inStock: true },
          { id: 4, label: '2TB ', price: '', shortDetails: '', inStock: true },
        ]);
        setSimConfigs([
          { id: 1, type: 'Wi-Fi', price: '', inStock: true },
          { id: 2, type: 'Wi-Fi + Cell', price: '', inStock: true }
        ]);
        setColorImageConfigs([]);
        setDynamicProducts([]);
        setDetails([]);
        setPreOrderConfig({
          isPreOrder: false,
          availabilityDate: '',
          estimatedShipping: '',
          preOrderDiscount: 0,
          maxPreOrderQuantity: 0
        });
      })
      .catch(err => {
        console.log(err);
        alert('Failed to add product. Please try again.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-sans w-full">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className=" text-white text-center p-6 bg-orange-400">
          <h1 className="text-2xl font-bold mb-1">Apple Product Manager</h1>
        </div>
        
        <div className="p-8">
          <div className="bg-gray-100 p-6 rounded-xl mb-6">
            {/* Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                placeholder="Product Name" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg" 
              />
              <input 
                type="number" 
                value={productPrice} 
                onChange={(e) => setProductPrice(e.target.value)} 
                placeholder="Base Price" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg" 
              />
            </div>

            {/* Pre-order Configuration */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="preOrderToggle"
                  checked={preOrderConfig.isPreOrder}
                  onChange={(e) => handlePreOrderToggle(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="preOrderToggle" className="font-semibold text-gray-700 cursor-pointer">
                  Enable Pre-order
                </label>
              </div>
              {preOrderConfig.isPreOrder && (
                <div className="space-y-4">
                  <input
                    type="date"
                    value={preOrderConfig.availabilityDate}
                    onChange={(e) => setPreOrderConfig(prev => ({ ...prev, availabilityDate: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="number"
                    placeholder="Pre-order Discount"
                    value={preOrderConfig.preOrderDiscount || ''}
                    onChange={(e) => setPreOrderConfig(prev => ({ ...prev, preOrderDiscount: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2"
                  />
                </div>
              )}
            </div>

            {/* Sim Configurations */}
            <div className="mb-6 bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <label className="font-semibold text-gray-700 mb-3 block">Sim Configurations</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simConfigs.map((config) => (
                  <div key={config.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        config.type === 'Wi-Fi' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}>
                        {config.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">In Stock</span>
                        <InStockToggle 
                          inStock={config.inStock} 
                          onToggle={() => handleSimConfigChange(config.id, 'inStock', !config.inStock)} 
                          size="sm" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600"></span>
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={config.price} 
                        onChange={(e) => handleSimConfigChange(config.id, 'price', e.target.value)} 
                        className="border border-gray-300 p-2 rounded flex-1 text-sm" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors & Images */}
            <div className="mb-4">
              <label className="font-semibold text-gray-700">Colors & Images</label>
              
              {/* Add New Color/Image Form */}
              <div className="flex items-center gap-2 mt-2 mb-4 p-3 bg-white rounded-lg border">
                <input 
                  type="color" 
                  value={newColor} 
                  onChange={(e) => setNewColor(e.target.value)} 
                  className="w-16 h-10 border border-gray-300 rounded" 
                />
                <div 
                  onClick={() => document.getElementById('newColorImage')?.click()} 
                  className="border-2 border-dashed border-gray-300 p-2 rounded cursor-pointer w-20 h-20 flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  {uploading ? (
                    <LoadingSpinner size="sm" />
                  ) : newImagePreview ? (
                    <Image src={newImagePreview} width={64} height={64} alt="preview" className="rounded object-cover" />
                  ) : (
                    <span className="text-gray-500 text-xs text-center">Click to Upload</span>
                  )}
                  <input 
                    type="file" 
                    id="newColorImage" 
                    accept="image/*" 
                    onChange={handleNewImageUpload} 
                    className="hidden" 
                  />
                </div>
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={newPrice} 
                  onChange={(e) => setNewPrice(e.target.value)} 
                  className="border-2 border-gray-300 p-2 rounded flex-1" 
                />
                
                {/* In Stock Toggle for Colors */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">In Stock</span>
                  <InStockToggle 
                    inStock={newColorInStock} 
                    onToggle={() => setNewColorInStock(!newColorInStock)} 
                    size="sm" 
                  />
                </div>
                
                <button 
                  onClick={handleAddColorImage} 
                  className="text-white px-4 py-2 rounded hover:bg-green-600 transition-colors bg-amber-500 font-medium"
                >
                  + Add
                </button>
              </div>

              {/* Display Existing Color/Image Configurations */}
              {colorImageConfigs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colorImageConfigs.map((config) => (
                    <div key={config.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
                      {/* Color Preview */}
                      <div 
                        className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: config.color }}
                        title={`Color: ${config.color}`}
                      ></div>
                      
                      {/* Image Preview */}
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image 
                          src={config.image} 
                          width={48} 
                          height={48} 
                          alt="Product" 
                          className="w-full h-full object-cover rounded border border-gray-200" 
                        />
                      </div>
                      
                      {/* Price Input */}
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={config.price} 
                        onChange={(e) => handleColorImageConfigChange(config.id, 'price', e.target.value)} 
                        className="border border-gray-300 p-2 rounded w-24 text-sm" 
                      />
                      
                      {/* Price Label */}
                      <span className="text-sm text-gray-600 flex-1">${config.price}</span>
                      
                      {/* In Stock Toggle */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">In Stock</span>
                        <InStockToggle 
                          inStock={config.inStock} 
                          onToggle={() => handleColorImageConfigChange(config.id, 'inStock', !config.inStock)} 
                          size="sm" 
                        />
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => handleRemoveColorImage(config.id)} 
                        className="text-red-500 hover:text-red-700 text-lg font-bold flex-shrink-0"
                        title="Remove this color/image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {colorImageConfigs.length === 0 && (
                <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  No color/image configurations added yet
                </div>
              )}
            </div>

            {/* Storage Configs */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Storage Configurations</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Storage Label" 
                    value={newStorageLabel} 
                    onChange={(e) => setNewStorageLabel(e.target.value)} 
                    className="border border-gray-300 p-1 rounded text-sm w-32" 
                  />
                  <input 
                    type="number" 
                    placeholder="Price" 
                    value={newStoragePrice} 
                    onChange={(e) => setNewStoragePrice(e.target.value)} 
                    className="border border-gray-300 p-1 rounded text-sm w-20" 
                  />
                  <input 
                    type="text" 
                    placeholder="Short Details" 
                    value={newStorageShortDetails} 
                    onChange={(e) => setNewStorageShortDetails(e.target.value)} 
                    className="border border-gray-300 p-1 rounded text-sm w-32" 
                  />
                  
                  {/* In Stock Toggle for Storage */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <InStockToggle 
                      inStock={newStorageInStock} 
                      onToggle={() => setNewStorageInStock(!newStorageInStock)} 
                      size="sm" 
                    />
                  </div>
                  
                  <button 
                    onClick={handleAddStorage} 
                    className="text-white px-3 py-1 rounded text-sm hover:bg-emerald-600 transition-colors bg-amber-500"
                  >
                    + Add Storage
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {storageConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 w-20">{config.label}</span>
                    <input 
                      type="number" 
                      placeholder="Price" 
                      value={config.price} 
                      onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'price', e.target.value)} 
                      className="border border-gray-300 p-1 rounded w-20 text-sm" 
                    />
                    <input 
                      type="text" 
                      placeholder="Short Details" 
                      value={config.shortDetails} 
                      onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'shortDetails', e.target.value)} 
                      className="border border-gray-300 p-1 rounded flex-1 text-sm" 
                    />
                    
                    {/* In Stock Toggle for existing storage */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">In Stock</span>
                      <InStockToggle 
                        inStock={config.inStock} 
                        onToggle={() => handleConfigChange(setStorageConfigs, config.id, 'inStock', !config.inStock)} 
                        size="sm" 
                      />
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveStorage(config.id)} 
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Regions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Dynamic Regions</label>
                <div className="flex items-center gap-2">
                  {/* In Stock Toggle for new regions */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <InStockToggle 
                      inStock={newRegionInStock} 
                      onToggle={() => setNewRegionInStock(!newRegionInStock)} 
                      size="sm" 
                    />
                  </div>
                  <button onClick={addRegion} className="text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors bg-amber-500">+ Add Region</button>
                </div>
              </div>
              {dynamicProducts.map((region, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input type="text" placeholder="Region Name" value={region.name} onChange={(e) => handleRegionChange(index, 'name', e.target.value)} className="border border-gray-300 p-2 rounded flex-1" />
                  <input type="number" placeholder="Price" value={region.price} onChange={(e) => handleRegionChange(index, 'price', e.target.value)} className="border border-gray-300 p-2 rounded w-24" />
                  
                  {/* In Stock Toggle for existing regions */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">In Stock</span>
                    <InStockToggle 
                      inStock={region.inStock} 
                      onToggle={() => handleRegionChange(index, 'inStock', !region.inStock)} 
                      size="sm" 
                    />
                  </div>
                  
                  <button onClick={() => setDynamicProducts(prev => prev.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700">×</button>
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Product Details</label>
                <button onClick={addDetail} className="text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors bg-amber-500">+ Add Detail</button>
              </div>
              {details.map((detail) => (
                <div key={detail.id} className="flex items-center gap-2 mb-2">
                  <input type="text" placeholder="Label" value={detail.label} onChange={(e) => handleDetailChange(detail.id, 'label', e.target.value)} className="border border-gray-300 p-2 rounded flex-1" />
                  <input type="text" placeholder="Value" value={detail.value} onChange={(e) => handleDetailChange(detail.id, 'value', e.target.value)} className="border border-gray-300 p-2 rounded flex-1" />
                  <button onClick={() => removeDetail(detail.id)} className="text-red-500 hover:text-red-700">×</button>
                </div>
              ))}
            </div>

            <button onClick={handleAddProduct} className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">+ Add Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ipadaddproduct;