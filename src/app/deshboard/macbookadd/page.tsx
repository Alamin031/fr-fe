'use client'
import Image from 'next/image'
import axios from 'axios';
import React, { useState, ChangeEvent, useEffect } from 'react';

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
type Config = { id: number; label: string; price: string; inStock: boolean };
type ColorImageConfig = { id: number; color: string; image: string; price: string; inStock: boolean };
type RegionConfig = { name: string; price: string; inStock: boolean };
type DetailConfig = { id: number; label: string; value: string; };
type SecondConfig = { id: number; seconddetails: string; value: string; };

const DynamicProductForm: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productColor, setProductColor] = useState('#4a6cf7');

  const [cpuCoreConfigs, setCpuCoreConfigs] = useState<Config[]>([
    { id: 1, label: '8-core CPU', price: '', inStock: true },
    { id: 2, label: '10-core CPU', price: '', inStock: true },
  ]);
  
  const [gpuCoreConfigs, setGpuCoreConfigs] = useState<Config[]>([
    { id: 1, label: '7-core GPU', price: '', inStock: true },
    { id: 2, label: '8-core GPU', price: '', inStock: true },
    { id: 3, label: '10-core GPU', price: '', inStock: true },
  ]);
  
  // New CPU Core input states
  const [newCpuCoreLabel, setNewCpuCoreLabel] = useState('');
  const [newCpuCorePrice, setNewCpuCorePrice] = useState('');
  const [newCpuCoreInStock, setNewCpuCoreInStock] = useState(true);
  
  // New GPU Core input states
  const [newGpuCoreLabel, setNewGpuCoreLabel] = useState('');
  const [newGpuCorePrice, setNewGpuCorePrice] = useState('');
  const [newGpuCoreInStock, setNewGpuCoreInStock] = useState(true);
  
  const [storageConfigs, setStorageConfigs] = useState<Config[]>([
    { id: 1, label: '256GB Storage', price: '', inStock: true },
    { id: 2, label: '512GB Storage', price: '', inStock: true },
    { id: 3, label: '1TB Storage', price: '', inStock: true },
    { id: 4, label: '2TB Storage', price: '', inStock: true },
  ]);
  const [ramConfigs, setRamConfigs] = useState<Config[]>([
    { id: 1, label: '16GB RAM', price: '', inStock: true },
    { id: 2, label: '24GB RAM', price: '', inStock: true },
    { id: 3, label: '32GB RAM', price: '', inStock: true },
  ]);
  const [displayConfigs, setDisplayConfigs] = useState<Config[]>([
    { id: 1, label: '13.6" Display', price: '', inStock: true },
    { id: 2, label: '15.3" Display', price: '', inStock: true },
  ]);

  // New RAM input states
  const [newRamLabel, setNewRamLabel] = useState('');
  const [newRamPrice, setNewRamPrice] = useState('');
  const [newRamInStock, setNewRamInStock] = useState(true);

  // New Storage input states
  const [newStorageLabel, setNewStorageLabel] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');
  const [newStorageInStock, setNewStorageInStock] = useState(true);

  // New Display input states
  const [newDisplayLabel, setNewDisplayLabel] = useState('');
  const [newDisplayPrice, setNewDisplayPrice] = useState('');
  const [newDisplayInStock, setNewDisplayInStock] = useState(true);

  const [colorImageConfigs, setColorImageConfigs] = useState<ColorImageConfig[]>([]);
  const [newColor, setNewColor] = useState('#4a6cf7');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [newColorInStock, setNewColorInStock] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [dynamicProducts, setDynamicProducts] = useState<RegionConfig[]>([]);
  const [details, setDetails] = useState<DetailConfig[]>([]);
  const [secondDetails, setSecondDetails] = useState<SecondConfig[]>([]);

  // Debug useEffect to track productPrice changes
  useEffect(() => {
    console.log('productPrice changed:', productPrice);
  }, [productPrice]);

  // Debug useEffect to log all product data
  useEffect(() => {
    console.log('Current product data:', {
      productName,
      productPrice,
      productColor,
      cpuCoreConfigs,
      gpuCoreConfigs,
      storageConfigs,
      ramConfigs,
      displayConfigs,
      colorImageConfigs,
      dynamicProducts,
      details,
      secondDetails
    });
  }, [productName, productPrice, productColor, cpuCoreConfigs, gpuCoreConfigs, storageConfigs, ramConfigs, displayConfigs, colorImageConfigs, dynamicProducts, details, secondDetails]);

  // Add new CPU Core configuration
  const handleAddCpuCore = () => {
    if (!newCpuCoreLabel || !newCpuCorePrice) { 
      alert('Please fill in both CPU Core label and price'); 
      return; 
    }
    
    const newCpuCoreConfig = { 
      id: Date.now(), 
      label: newCpuCoreLabel, 
      price: parseFloat(newCpuCorePrice).toFixed(2),
      inStock: newCpuCoreInStock
    };
    
    setCpuCoreConfigs(prev => {
      const updated = [...prev, newCpuCoreConfig];
      return updated;
    });
    
    // Reset form
    setNewCpuCoreLabel(''); 
    setNewCpuCorePrice('');
    setNewCpuCoreInStock(true);
  };

  // Remove CPU Core configuration
  const handleRemoveCpuCore = (id: number) => {
    setCpuCoreConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Toggle CPU Core stock status
  const toggleCpuCoreStock = (id: number) => {
    setCpuCoreConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, inStock: !config.inStock } : config
      );
      return updated;
    });
  };

  // Add new GPU Core configuration
  const handleAddGpuCore = () => {
    if (!newGpuCoreLabel || !newGpuCorePrice) { 
      alert('Please fill in both GPU Core label and price'); 
      return; 
    }
    
    const newGpuCoreConfig = { 
      id: Date.now(), 
      label: newGpuCoreLabel, 
      price: parseFloat(newGpuCorePrice).toFixed(2),
      inStock: newGpuCoreInStock
    };
    
    setGpuCoreConfigs(prev => {
      const updated = [...prev, newGpuCoreConfig];
      return updated;
    });
    
    // Reset form
    setNewGpuCoreLabel(''); 
    setNewGpuCorePrice('');
    setNewGpuCoreInStock(true);
  };

  // Remove GPU Core configuration
  const handleRemoveGpuCore = (id: number) => {
    setGpuCoreConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Toggle GPU Core stock status
  const toggleGpuCoreStock = (id: number) => {
    setGpuCoreConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, inStock: !config.inStock } : config
      );
      return updated;
    });
  };

  // Add new RAM configuration
  const handleAddRam = () => {
    if (!newRamLabel || !newRamPrice) { 
      alert('Please fill in both RAM label and price'); 
      return; 
    }
    
    const newRamConfig = { 
      id: Date.now(), 
      label: newRamLabel, 
      price: parseFloat(newRamPrice).toFixed(2),
      inStock: newRamInStock
    };
    
    setRamConfigs(prev => {
      const updated = [...prev, newRamConfig];
      return updated;
    });
    
    // Reset form
    setNewRamLabel(''); 
    setNewRamPrice('');
    setNewRamInStock(true);
  };

  // Remove RAM configuration
  const handleRemoveRam = (id: number) => {
    setRamConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Toggle RAM stock status
  const toggleRamStock = (id: number) => {
    setRamConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, inStock: !config.inStock } : config
      );
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
      price: parseFloat(newStoragePrice).toFixed(2),
      inStock: newStorageInStock
    };
    
    setStorageConfigs(prev => {
      const updated = [...prev, newStorageConfig];
      return updated;
    });
    
    // Reset form
    setNewStorageLabel(''); 
    setNewStoragePrice('');
    setNewStorageInStock(true);
  };

  // Remove Storage configuration
  const handleRemoveStorage = (id: number) => {
    setStorageConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Toggle Storage stock status
  const toggleStorageStock = (id: number) => {
    setStorageConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, inStock: !config.inStock } : config
      );
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
      price: parseFloat(newDisplayPrice).toFixed(2),
      inStock: newDisplayInStock
    };
    
    setDisplayConfigs(prev => {
      const updated = [...prev, newDisplayConfig];
      return updated;
    });
    
    // Reset form
    setNewDisplayLabel(''); 
    setNewDisplayPrice('');
    setNewDisplayInStock(true);
  };

  // Remove Display configuration
  const handleRemoveDisplay = (id: number) => {
    setDisplayConfigs(prev => {
      const updated = prev.filter(config => config.id !== id);
      return updated;
    });
  };

  // Toggle Display stock status
  const toggleDisplayStock = (id: number) => {
    setDisplayConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, inStock: !config.inStock } : config
      );
      return updated;
    });
  };

  // Image upload with loading
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
      price: parseFloat(newPrice).toFixed(2),
      inStock: newColorInStock
    };
    
    setColorImageConfigs(prev => {
      const updated = [...prev, newColorConfig];
      return updated;
    });
    
    // Reset form
    setNewColor('#4a6cf7'); 
    setNewImagePreview(null); 
    setNewPrice('');
    setNewColorInStock(true);
  };

  // Toggle Color Image stock status
  const toggleColorImageStock = (id: number) => {
    setColorImageConfigs(prev => {
      const updated = prev.map(config => 
        config.id === id ? { ...config, inStock: !config.inStock } : config
      );
      return updated;
    });
  };

  const handleConfigChange = (
    setter: React.Dispatch<React.SetStateAction<Config[]>>, 
    id: number, 
    field: 'price' | 'inStock',
    value: string | boolean
  ) => {
    setter(prev => {
      const updated = prev.map(cfg => 
        cfg.id === id ? { ...cfg, [field]: value } : cfg
      );
      return updated;
    });
  };

  const handleAddProduct = async() => {
    if (!productName || !productPrice) { 
      alert('Enter name and price'); 
      return; 
    }
    
    const priceValue = parseFloat(productPrice);
    if (isNaN(priceValue)) {
      alert('Please enter a valid price');
      return;
    }
    
    const newProduct = { 
      name: productName,
      basePrice: priceValue.toFixed(2),
      cpuCoreConfigs,
      gpuCoreConfigs,
      storageConfigs,
      ramConfigs,
      displayConfigs,
      colorImageConfigs,
      dynamicRegions: dynamicProducts,
      details,
      secondDetails
    };
    
    console.log('all data'  , newProduct)
    try {
      const res = await axios.post('/api/macbook', newProduct);
      console.log('API Response:', res.data);
      
      
      resetForm();
    } catch (err) {
      console.error('API Error:', err);
      alert('Failed to add product. Check console for details.');
    }
  };

  const resetForm = () => {
    setProductName(''); 
    setProductPrice(''); 
    setProductColor('#4a6cf7');
    setCpuCoreConfigs([
      { id: 1, label: '8-core CPU', price: '', inStock: true },
      { id: 2, label: '10-core CPU', price: '', inStock: true },
    ]);
    setGpuCoreConfigs([
      { id: 1, label: '7-core GPU', price: '', inStock: true },
      { id: 2, label: '8-core GPU', price: '', inStock: true },
      { id: 3, label: '10-core GPU', price: '', inStock: true },
    ]);
    setStorageConfigs([
      { id: 1, label: '256GB Storage', price: '', inStock: true }, 
      { id: 2, label: '512GB Storage', price: '', inStock: true }, 
      { id: 3, label: '1TB Storage', price: '', inStock: true }, 
      { id: 4, label: '2TB Storage', price: '', inStock: true }
    ]);
    setRamConfigs([
      { id: 1, label: '16GB RAM', price: '', inStock: true }, 
      { id: 2, label: '24GB RAM', price: '', inStock: true }, 
      { id: 3, label: '32GB RAM', price: '', inStock: true }
    ]);
    setDisplayConfigs([
      { id: 1, label: '13.6" Display', price: '', inStock: true }, 
      { id: 2, label: '15.3" Display', price: '', inStock: true }
    ]);
    setColorImageConfigs([]); 
    setDynamicProducts([]); 
    setDetails([]);
    setSecondDetails([]);
    setNewColor('#4a6cf7'); 
    setNewImagePreview(null); 
    setNewPrice('');
    setNewCpuCoreLabel('');
    setNewCpuCorePrice('');
    setNewCpuCoreInStock(true);
    setNewGpuCoreLabel('');
    setNewGpuCorePrice('');
    setNewGpuCoreInStock(true);
    setNewRamLabel('');
    setNewRamPrice('');
    setNewRamInStock(true);
    setNewStorageLabel('');
    setNewStoragePrice('');
    setNewStorageInStock(true);
    setNewDisplayLabel('');
    setNewDisplayPrice('');
    setNewDisplayInStock(true);
    setNewColorInStock(true);
  };

  const addRegion = () => {
    setDynamicProducts(prev => {
      const updated = [...prev, { name: '', price: '', inStock: true }];
      return updated;
    });
  };
  
  const handleRegionChange = (index: number, field: 'name'|'price'|'inStock', value: string | boolean) => {
    const updated = [...dynamicProducts]; 
    updated[index] = { ...updated[index], [field]: value }; 
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
    // Ensure only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setProductPrice(value);
    }
  };

  // In Stock toggle button component
  const InStockToggle: React.FC<{ 
    inStock: boolean; 
    onToggle: () => void;
    size?: 'sm' | 'md';
  }> = ({ inStock, onToggle, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-12 h-6',
      md: 'w-14 h-7'
    };
    
    const toggleClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5'
    };
    
    const translateClasses = {
      sm: inStock ? 'translate-x-6' : 'translate-x-1',
      md: inStock ? 'translate-x-7' : 'translate-x-1'
    };
    
    return (
      <button
        type="button"
        className={`${sizeClasses[size]} relative rounded-full transition-colors duration-300 ease-in-out ${
          inStock ? 'bg-green-500' : 'bg-gray-300'
        }`}
        onClick={onToggle}
      >
        <div
          className={`${toggleClasses[size]} ${translateClasses[size]} absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full transition-transform duration-300 ease-in-out`}
        />
        <span className="sr-only">{inStock ? 'In Stock' : 'Out of Stock'}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-sans w-full">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className=" text-white text-center p-6 bg-orange-400">
          <h1 className="text-2xl font-bold mb-1">macbook</h1>
        </div>
        
        <div className="p-8">
          {/* Debug Button */}
          

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
              <div className="flex items-center gap-2 mb-2">
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
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600 mb-1">In Stock</span>
                  <InStockToggle 
                    inStock={newColorInStock} 
                    onToggle={() => setNewColorInStock(!newColorInStock)}
                    size="sm"
                  />
                </div>
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
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">Stock</span>
                          <InStockToggle 
                            inStock={config.inStock} 
                            onToggle={() => toggleColorImageStock(config.id)}
                            size="sm"
                          />
                        </div>
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

            {/* CPU Core Configs Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">CPU Core Configurations</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="CPU Core Label (e.g., 12-core CPU)"
                    value={newCpuCoreLabel}
                    onChange={(e) => setNewCpuCoreLabel(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-40"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newCpuCorePrice}
                    onChange={(e) => setNewCpuCorePrice(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-20"
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <InStockToggle 
                      inStock={newCpuCoreInStock} 
                      onToggle={() => setNewCpuCoreInStock(!newCpuCoreInStock)}
                      size="sm"
                    />
                  </div>
                  <button 
                    onClick={handleAddCpuCore} 
                    className=" text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors bg-blue-500"
                  >
                    + Add CPU Core
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {cpuCoreConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 flex-1">{config.label}</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={config.price}
                      onChange={(e) => handleConfigChange(setCpuCoreConfigs, config.id, 'price', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Stock</span>
                      <InStockToggle 
                        inStock={config.inStock} 
                        onToggle={() => toggleCpuCoreStock(config.id)}
                        size="sm"
                      />
                    </div>
                    <button 
                      onClick={() => handleRemoveCpuCore(config.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* GPU Core Configs Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700">GPU Core Configurations</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="GPU Core Label (e.g., 16-core GPU)"
                    value={newGpuCoreLabel}
                    onChange={(e) => setNewGpuCoreLabel(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-40"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newGpuCorePrice}
                    onChange={(e) => setNewGpuCorePrice(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-sm w-20"
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <InStockToggle 
                      inStock={newGpuCoreInStock} 
                      onToggle={() => setNewGpuCoreInStock(!newGpuCoreInStock)}
                      size="sm"
                    />
                  </div>
                  <button 
                    onClick={handleAddGpuCore} 
                    className=" text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors bg-green-500"
                  >
                    + Add GPU Core
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {gpuCoreConfigs.map((config) => (
                  <div key={config.id} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600 flex-1">{config.label}</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={config.price}
                      onChange={(e) => handleConfigChange(setGpuCoreConfigs, config.id, 'price', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Stock</span>
                      <InStockToggle 
                        inStock={config.inStock} 
                        onToggle={() => toggleGpuCoreStock(config.id)}
                        size="sm"
                      />
                    </div>
                    <button 
                      onClick={() => handleRemoveGpuCore(config.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Configs Section */}
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
                      onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'price', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Stock</span>
                      <InStockToggle 
                        inStock={config.inStock} 
                        onToggle={() => toggleStorageStock(config.id)}
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

            {/* RAM Configs Section */}
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
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <InStockToggle 
                      inStock={newRamInStock} 
                      onToggle={() => setNewRamInStock(!newRamInStock)}
                      size="sm"
                    />
                  </div>
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
                      onChange={(e) => handleConfigChange(setRamConfigs, config.id, 'price', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Stock</span>
                      <InStockToggle 
                        inStock={config.inStock} 
                        onToggle={() => toggleRamStock(config.id)}
                        size="sm"
                      />
                    </div>
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

            {/* Display Configs Section */}
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
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">In Stock</span>
                    <InStockToggle 
                      inStock={newDisplayInStock} 
                      onToggle={() => setNewDisplayInStock(!newDisplayInStock)}
                      size="sm"
                    />
                  </div>
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
                      onChange={(e) => handleConfigChange(setDisplayConfigs, config.id, 'price', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-20 text-sm"
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Stock</span>
                      <InStockToggle 
                        inStock={config.inStock} 
                        onToggle={() => toggleDisplayStock(config.id)}
                        size="sm"
                      />
                    </div>
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
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Stock</span>
                    <InStockToggle 
                      inStock={region.inStock} 
                      onToggle={() => handleRegionChange(index, 'inStock', !region.inStock)}
                      size="sm"
                    />
                  </div>
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
          
        </div>
      </div>
    </div>
  );
};

export default DynamicProductForm;