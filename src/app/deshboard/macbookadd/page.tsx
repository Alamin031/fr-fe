'use client'
import axios from 'axios';
import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image'; // Import Next.js Image component

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

// Types
type Config = { id: number; label: string; price: string; };
type ColorImageConfig = { id: number; color: string; image: string; price: string; };
type RegionConfig = { name: string; price: string; };
type DetailConfig = { id: number; label: string; value: string; };
type SecondConfig = { id: number; seconddetails: string; value: string; };
type Product = { 
  id: number; 
  name: string; 
  price: string; 
  color: string; 
  coreConfigs: Config[]; 
  storageConfigs: Config[]; 
  ramConfigs: Config[]; 
  displayConfigs: Config[]; 
  colorImageConfigs: ColorImageConfig[]; 
  dynamicRegions: RegionConfig[]; 
  details: DetailConfig[]; 
  secondDetails: SecondConfig[];
};

const DynamicProductForm: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productColor, setProductColor] = useState('#4a6cf7');

  const [coreConfigs, setCoreConfigs] = useState<Config[]>([
    { id: 1, label: '10-core CPU', price: '' },
    { id: 2, label: '8-core GPU', price: '' },
    { id: 3, label: '10-core GPU', price: '' },
  ]);
  const [storageConfigs, setStorageConfigs] = useState<Config[]>([
    { id: 1, label: '256GB Storage', price: '' },
    { id: 2, label: '512GB Storage', price: '' },
    { id: 3, label: '1TB Storage', price: '' },
    { id: 4, label: '2TB Storage', price: '' },
  ]);
  const [ramConfigs, setRamConfigs] = useState<Config[]>([
    { id: 1, label: '16GB RAM', price: '' },
    { id: 2, label: '24GB RAM', price: '' },
    { id: 3, label: '32GB RAM', price: '' },
  ]);
  const [displayConfigs, setDisplayConfigs] = useState<Config[]>([
    { id: 1, label: '13.6" Display', price: '' },
    { id: 2, label: '15.3" Display', price: '' },
  ]);

  // New RAM input states
  const [newRamLabel, setNewRamLabel] = useState('');
  const [newRamPrice, setNewRamPrice] = useState('');

  // New Storage input states
  const [newStorageLabel, setNewStorageLabel] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');

  // New Display input states
  const [newDisplayLabel, setNewDisplayLabel] = useState('');
  const [newDisplayPrice, setNewDisplayPrice] = useState('');

  const [colorImageConfigs, setColorImageConfigs] = useState<ColorImageConfig[]>([]);
  const [newColor, setNewColor] = useState('#4a6cf7');
  // Removed unused newImageFile state
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [uploading, setUploading] = useState(false);

  const [dynamicProducts, setDynamicProducts] = useState<RegionConfig[]>([]);
  const [details, setDetails] = useState<DetailConfig[]>([]);
  const [secondDetails, setSecondDetails] = useState<SecondConfig[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Added missing products state

  // ==================== CONSOLE LOGGING ====================

  // Log all data whenever component mounts or key state changes
  
  // Log specific data changes
 
  // Add new RAM configuration
  const handleAddRam = () => {
  
    
    if (!newRamLabel || !newRamPrice) { 
      alert('Please fill in both RAM label and price'); 
      return; 
    }
    
    const newRamConfig = { 
      id: Date.now(), 
      label: newRamLabel, 
      price: parseFloat(newRamPrice).toFixed(2)
    };
    
    
    setRamConfigs(prev => {
      const updated = [...prev, newRamConfig];
      return updated;
    });
    
    // Reset form
    setNewRamLabel(''); 
    setNewRamPrice('');
  };

  // Remove RAM configuration
  const handleRemoveRam = (id: number) => {
    setRamConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Add new Storage configuration
  const handleAddStorage = () => {
    
    
    if (!newStorageLabel || !newStoragePrice) { 
      alert('Please fill in both Storage label and price'); 
      return; 
    }
    
    const newStorageConfig = { 
      id: Date.now(), 
      label: newStorageLabel, 
      price: parseFloat(newStoragePrice).toFixed(2)
    };
    
    
    setStorageConfigs(prev => {
      const updated = [...prev, newStorageConfig];
      return updated;
    });
    
    // Reset form
    setNewStorageLabel(''); 
    setNewStoragePrice('');
  };

  // Remove Storage configuration
  const handleRemoveStorage = (id: number) => {
    setStorageConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Add new Display configuration
  const handleAddDisplay = () => {
  
    
    if (!newDisplayLabel || !newDisplayPrice) { 
      alert('Please fill in both Display label and price'); 
      return; 
    }
    
    const newDisplayConfig = { 
      id: Date.now(), 
      label: newDisplayLabel, 
      price: parseFloat(newDisplayPrice).toFixed(2)
    };
    
    setDisplayConfigs(prev => {
      const updated = [...prev, newDisplayConfig];
      return updated;
    });
    
    // Reset form
    setNewDisplayLabel(''); 
    setNewDisplayPrice('');
  };

  // Remove Display configuration
  const handleRemoveDisplay = (id: number) => {
    setDisplayConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Image upload with loading
  const handleNewImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Removed unused newImageFile state assignment
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
          
          if (data.url) {
            setNewImagePreview(data.url);
          }
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
      price: parseFloat(newPrice).toFixed(2) 
    };
    
    setColorImageConfigs(prev => {
      const updated = [...prev, newColorConfig];
      return updated;
    });
    
    // Reset form
    setNewColor('#4a6cf7'); 
    // Removed unused newImageFile state reset
    setNewImagePreview(null); 
    setNewPrice('');
  };

  const handleConfigChange = (
    setter: React.Dispatch<React.SetStateAction<Config[]>>, 
    id: number, 
    value: string
  ) => {
    setter(prev => {
      const updated = prev.map(cfg => cfg.id === id ? { ...cfg, price: value } : cfg);
      return updated;
    });
  };

  const handleAddProduct = async() => {
    if (!productName || !productPrice) { 
      alert('Enter name and price'); 
      return; 
    }
    
    const newProduct = { 
      id: Date.now(),
      name: productName, 
      price: parseFloat(productPrice).toFixed(2),
      color: productColor,
      coreConfigs, 
      storageConfigs, 
      ramConfigs, 
      displayConfigs, 
      colorImageConfigs, 
      dynamicRegions: dynamicProducts, 
      details,
      secondDetails
    };

    try {
      const res = await axios.post('/api/macbook', newProduct);
      console.log(res.data);
      
      // Add to local products state
      setProducts(prev => [...prev, newProduct]);
      
      // Reset form
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setProductName(''); 
    setProductPrice(''); 
    setProductColor('#4a6cf7');
    setCoreConfigs([
      { id: 1, label: '10-core CPU', price: '' }, 
      { id: 2, label: '8-core GPU', price: '' }, 
      { id: 3, label: '10-core GPU', price: '' }
    ]);
    setStorageConfigs([
      { id: 1, label: '256GB Storage', price: '' }, 
      { id: 2, label: '512GB Storage', price: '' }, 
      { id: 3, label: '1TB Storage', price: '' }, 
      { id: 4, label: '2TB Storage', price: '' }
    ]);
    setRamConfigs([
      { id: 1, label: '16GB RAM', price: '' }, 
      { id: 2, label: '24GB RAM', price: '' }, 
      { id: 3, label: '32GB RAM', price: '' }
    ]);
    setDisplayConfigs([
      { id: 1, label: '13.6" Display', price: '' }, 
      { id: 2, label: '15.3" Display', price: '' }
    ]);
    setColorImageConfigs([]); 
    setDynamicProducts([]); 
    setDetails([]);
    setSecondDetails([]);
    setNewColor('#4a6cf7'); 
    // Removed unused newImageFile state reset
    setNewImagePreview(null); 
    setNewPrice('');
    setNewRamLabel('');
    setNewRamPrice('');
    setNewStorageLabel('');
    setNewStoragePrice('');
    setNewDisplayLabel('');
    setNewDisplayPrice('');
  };

  const addRegion = () => {
    setDynamicProducts(prev => {
      const updated = [...prev, { name: '', price: '' }];
      return updated;
    });
  };
  
  const handleRegionChange = (index: number, field: 'name'|'price', value: string) => {
    const updated = [...dynamicProducts]; 
    updated[index][field] = value; 
    setDynamicProducts(updated);
  };
  
  const addDetail = () => {
    const newDetail = { id: Date.now(), label: '', value: '' };
    setDetails(prev => {
      const updated = [...prev, newDetail];
      return updated;
    });
  };
  
  const handleDetailChange = (id: number, field: 'label'|'value', value: string) => {
    setDetails(prev => {
      const updated = prev.map(d => d.id === id ? {...d, [field]: value} : d);
      return updated;
    });
  };
  
  const removeDetail = (id: number) => {
    setDetails(prev => {
      const updated = prev.filter(d => d.id !== id);
      return updated;
    });
  };

  const addSecondDetail = () => {
    const newDetail = { id: Date.now(), seconddetails: '', value: '' };
    setSecondDetails(prev => {
      const updated = [...prev, newDetail];
      return updated;
    });
  };

  const handleSecondDetailChange = (id: number, field: 'seconddetails'|'value', value: string) => {
    setSecondDetails(prev => {
      const updated = prev.map(d => d.id === id ? {...d, [field]: value} : d);
      return updated;
    });
  };

  const removeSecondDetail = (id: number) => {
    setSecondDetails(prev => {
      const updated = prev.filter(d => d.id !== id);
      return updated;
    });
  };

  // Log form field changes
  const handleProductNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductName(value);
  };

  const handleProductPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductPrice(value);
  };

  // Removed unused handleProductColorChange function

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-sans w-full">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className=" text-white text-center p-6 bg-orange-400">
          <h1 className="text-2xl font-bold mb-1">macbook</h1>
        </div>
        
        <div className="p-8">
          <div className="bg-gray-100 p-6 rounded-xl mb-6">
            <input 
              type="text" 
              value={productName} 
              onChange={handleProductNameChange} 
              placeholder="Product Name" 
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2" 
            />
            <input 
              type="number" 
              value={productPrice} 
              onChange={handleProductPriceChange} 
              placeholder="Price" 
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4" 
            />

            <div className="mb-4">
              <label className="font-semibold text-gray-700">Colors & Images</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={newColor} 
                  onChange={(e) => setNewColor(e.target.value)} 
                  className="w-16 h-10" 
                />
                <div 
                  onClick={() => document.getElementById('newColorImage')?.click()} 
                  className="border-2 border-dashed p-2 rounded cursor-pointer w-20 h-20 flex items-center justify-center"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="text-xs text-gray-500 mt-1">Uploading...</span>
                    </div>
                  ) : (
                    newImagePreview ? 
                      <Image 
                        src={newImagePreview} 
                        alt="preview" 
                        width={64} 
                        height={64} 
                        className="object-cover rounded" 
                      /> : 
                      <span className="text-gray-500 text-sm text-center">Click to Upload</span>
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
                <button 
                  onClick={handleAddColorImage} 
                  className=" text-white px-3 py-1 rounded hover:bg-green-600 transition-colors bg-amber-500"
                >
                  + Add
                </button>
              </div>
              
              {/* Display added color/image configs */}
              {colorImageConfigs.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Added Colors & Images:</h4>
                  <div className="flex flex-wrap gap-2">
                    {colorImageConfigs.map((config) => (
                      <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                        <div 
                          className="w-6 h-6 rounded border-2 border-gray-300" 
                          style={{ backgroundColor: config.color }}
                        ></div>
                        <Image 
                          src={config.image} 
                          alt="product" 
                          width={32} 
                          height={32} 
                          className="object-cover rounded" 
                        />
                        <span className="text-sm font-medium">{config.price}</span>
                        <button 
                          onClick={() => setColorImageConfigs(prev => prev.filter(c => c.id !== config.id))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Core Configs Section */}
            <div className="mb-4">
              <label className="font-semibold text-gray-700 mb-2 block">Core Configurations</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {coreConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 flex-1">{config.label}</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={config.price}
                      onChange={(e) => handleConfigChange(setCoreConfigs, config.id, e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Configs Section - Enhanced with Add/Remove functionality */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Storage Configurations</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Storage Label (e.g., 4TB SSD)"
                    value={newStorageLabel}
                    required
                    onChange={(e) => setNewStorageLabel(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-40"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newStoragePrice}
                    onChange={(e) => setNewStoragePrice(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-20"
                  />
                  <button 
                    onClick={handleAddStorage} 
                    className=" text-white px-3 py-1 rounded text-sm hover:bg-emerald-600 transition-colors bg-amber-500"
                  >
                    + Add Storage
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {storageConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 flex-1">{config.label}</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={config.price}
                      onChange={(e) => handleConfigChange(setStorageConfigs, config.id, e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
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

            {/* RAM Configs Section - Enhanced with Add/Remove functionality */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">RAM Configurations</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="RAM Label (e.g., 64GB RAM)"
                    value={newRamLabel}
                    onChange={(e) => setNewRamLabel(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-40"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newRamPrice}
                    onChange={(e) => setNewRamPrice(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-20"
                  />
                  <button 
                    onClick={handleAddRam} 
                    className=" text-white px-3 py-1 rounded text-sm hover:bg-indigo-600 transition-colors bg-amber-500"
                  >
                    + Add RAM
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {ramConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 flex-1">{config.label}</span>
                    <input
                      type="number"
                      placeholder="Price"
                      required
                      value={config.price}
                      onChange={(e) => handleConfigChange(setRamConfigs, config.id, e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <button 
                      onClick={() => handleRemoveRam(config.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Configs Section - Enhanced with Add/Remove functionality */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Display Configurations</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Display Label (e.g., 17 Inch Display)"
                    value={newDisplayLabel}
                    onChange={(e) => setNewDisplayLabel(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-40"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newDisplayPrice}
                    onChange={(e) => setNewDisplayPrice(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-20"
                  />
                  <button 
                    onClick={handleAddDisplay} 
                    className=" text-white px-3 py-1 rounded text-sm hover:bg-cyan-600 transition-colors bg-amber-500"
                  >
                    + Add Display
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {displayConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 flex-1">{config.label}</span>
                    <input
                      type="number"
                      placeholder="Price"
                      required
                      value={config.price}
                      onChange={(e) => handleConfigChange(setDisplayConfigs, config.id, e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <button 
                      onClick={() => handleRemoveDisplay(config.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Regions Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Dynamic Regions</label>
                <button 
                  onClick={addRegion} 
                  className=" text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors bg-amber-500"
                >
                  + Add Region
                </button>
              </div>
              {dynamicProducts.map((region, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Region Name"
                    value={region.name}
                    onChange={(e) => handleRegionChange(index, 'name', e.target.value)}
                    className="border border-gray-300 p-2 rounded flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={region.price}
                    onChange={(e) => handleRegionChange(index, 'price', e.target.value)}
                    className="border border-gray-300 p-2 rounded w-24"
                  />
                  <button 
                    onClick={() => setDynamicProducts(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Details Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Product Details</label>
                <button 
                  onClick={addDetail} 
                  className=" text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors bg-amber-500"
                >
                  + Add Detail
                </button>
              </div>
        
              {details.map((detail) => (
                <div key={detail.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={detail.label}
                    onChange={(e) => handleDetailChange(detail.id, 'label', e.target.value)}
                    className="border border-gray-300 p-2 rounded flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={detail.value}
                    onChange={(e) => handleDetailChange(detail.id, 'value', e.target.value)}
                    className="border border-gray-300 p-2 rounded flex-1"
                  />
                  <button 
                    onClick={() => removeDetail(detail.id)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Second Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">Second Details</label>
                <div className="flex gap-2">
                  <button 
                    onClick={addSecondDetail} 
                    className=" text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors bg-amber-500"
                  >
                    + Add Second Detail
                  </button>
                </div>
              </div>
        
              {secondDetails.map((detail) => (
                <div key={detail.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Second Details"
                    value={detail.seconddetails}
                    onChange={(e) => handleSecondDetailChange(detail.id, 'seconddetails', e.target.value)}
                    className="border border-gray-300 p-2 rounded flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={detail.value}
                    onChange={(e) => handleSecondDetailChange(detail.id, 'value', e.target.value)}
                    className="border border-gray-300 p-2 rounded flex-1"
                  />
                  <button 
                    onClick={() => removeSecondDetail(detail.id)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddProduct} 
              className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Add Product
            </button>
          </div>
          
          {/* Display added products */}
          {products.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Added Products ({products.length})</h3>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-gray-600">Base Price: ${product.price}</p>
                        <p className="text-sm text-gray-500">
                          Colors: {product.colorImageConfigs.length} | 
                          Storage: {product.storageConfigs.length} |
                          Regions: {product.dynamicRegions.length} | 
                          RAM Configs: {product.ramConfigs.length} |
                          Display Configs: {product.displayConfigs.length} |
                          Details: {product.details.length} | 
                          Second Details: {product.secondDetails.length}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {product.colorImageConfigs.slice(0, 3).map((config) => (
                          <Image 
                            key={config.id} 
                            src={config.image} 
                            alt="product" 
                            width={40} 
                            height={40} 
                            className="object-cover rounded border" 
                          />
                        ))}
                        {product.colorImageConfigs.length > 3 && (
                          <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center text-xs">
                            +{product.colorImageConfigs.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicProductForm;