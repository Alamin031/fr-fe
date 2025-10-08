'use client'
import axios from 'axios';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { Toggle } from "@/components/ui/toggle";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Palette,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Plus as PlusIcon,
  Undo,
  Redo, 
  Superscript,
  Subscript,
  Strikethrough
} from "lucide-react";

// Types
type Config = { 
  id: number; 
  label: string; 
  price: string; 
  shortDetails: string;
  inStock: boolean;
};

type ImageConfig = { 
  id: number; 
  image: string; 
  price: string;
  colorName?: string;
  inStock: boolean;
};

type RegionConfig = { name: string; price: string; inStock: boolean; };
type DetailConfig = { id: number; label: string; value: string; };

type PreOrderConfig = {
  isPreOrder: boolean;
  availabilityDate?: string;
  estimatedShipping?: string;
  preOrderDiscount?: number;
  maxPreOrderQuantity?: number;
};

type Product = { 
  name: string; 
  basePrice: string; 
  storageConfigs: Config[]; 
  imageConfigs: ImageConfig[]; 
  dynamicRegions: RegionConfig[]; 
  details: DetailConfig[]; 
  preOrderConfig: PreOrderConfig;
  accessories?: string;
  accessoriesType?: string;
  description?: string;
};

// Custom Table Extension (since the import was failing)
const CustomTableExtension = {
  // This is a simplified table implementation
  // In a real scenario, you'd want to use the proper table extensions
};

// Tiptap Toolbar Component with enhanced features
const TiptapToolbar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  // Simple table implementation using HTML
  const addTable = () => {
    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">Header 1</th>
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">Header 2</th>
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">Cell 1</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Cell 2</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Cell 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">Cell 4</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Cell 5</td>
            <td style="border: 1px solid #ccc; padding: 8px;">Cell 6</td>
          </tr>
        </tbody>
      </table>
    `;
    
    editor.chain().focus().insertContent(tableHTML).run();
  };

  return (
    <div className="border border-gray-200 rounded-t-lg bg-white">
      {/* Main Toolbar */}
      <div className="p-2 flex flex-wrap items-center gap-1 border-b">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'justify' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
            className="w-6 h-6 cursor-pointer border rounded"
            title="Text Color"
          />
          <Palette className="h-4 w-4 text-gray-600" />
        </div>

        {/* Highlight Color */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            onChange={(event) => editor.chain().focus().setHighlight({ color: event.target.value }).run()}
            className="w-6 h-6 cursor-pointer border rounded"
            title="Highlight Color"
          />
          <Highlighter className="h-4 w-4 text-gray-600" />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link */}
        <Toggle
          size="sm"
          pressed={editor.isActive('link')}
          onPressedChange={() => setShowLinkInput(!showLinkInput)}
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>

        {/* Image */}
        <Toggle
          size="sm"
          pressed={false}
          onPressedChange={() => setShowImageInput(!showImageInput)}
        >
          <ImageIcon className="h-4 w-4" />
        </Toggle>

        {/* Table */}
        <Button
          size="sm"
          variant="outline"
          onClick={addTable}
        >
          <TableIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
          <Input
            type="url"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={addLink}>
            Add Link
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              editor.chain().focus().unsetLink().run();
              setShowLinkInput(false);
            }}
          >
            Remove
          </Button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
          <Input
            type="url"
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={addImage}>
            Add Image
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowImageInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

// Enhanced Tiptap Editor with all features
const TiptapEditor = ({ onContentChange }: { onContentChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="min-h-[200px] p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <TiptapToolbar editor={editor} />
      <div className="min-h-[300px] p-4 bg-white prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const Accessories: React.FC = () => {
  // Product Info
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [accessories, setAccessories] = useState('');
  const [accessoriesType, setAccessoriesType] = useState('');
  const [description, setDescription] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-order Configuration
  const [preOrderConfig, setPreOrderConfig] = useState<PreOrderConfig>({
    isPreOrder: false,
    availabilityDate: '',
    estimatedShipping: '',
    preOrderDiscount: 0,
    maxPreOrderQuantity: 0
  });

  // Storage Configs
  const [storageConfigs, setStorageConfigs] = useState<Config[]>([]);
  const [newStorageLabel, setNewStorageLabel] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');
  const [newStorageShortDetails, setNewStorageShortDetails] = useState('');
  const [newStorageInStock, setNewStorageInStock] = useState(true);

  // Images (with optional color name)
  const [imageConfigs, setImageConfigs] = useState<ImageConfig[]>([]);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newImageInStock, setNewImageInStock] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Dynamic Regions
  const [dynamicProducts, setDynamicProducts] = useState<RegionConfig[]>([]);
  const [newRegionInStock, setNewRegionInStock] = useState(true);

  // Product Details
  const [details, setDetails] = useState<DetailConfig[]>([]);

  // Handlers
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

  const handleImageConfigChange = (id: number, field: 'price' | 'colorName' | 'inStock', value: string | boolean) => {
    setImageConfigs(prev => prev.map(cfg => 
      cfg.id === id ? { ...cfg, [field]: value } : cfg
    ));
  };

  const handleRemoveImage = (id: number) => {
    setImageConfigs(prev => prev.filter(config => config.id !== id));
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

  const handleAddImage = () => {
    if (!newImagePreview || !newPrice) { 
      alert('Image and price are required'); 
      return; 
    }
    const newImageConfig = { 
      id: Date.now(), 
      image: newImagePreview, 
      price: parseFloat(newPrice).toFixed(2),
      colorName: newColorName || undefined,
      inStock: newImageInStock
    };
    setImageConfigs(prev => [...prev, newImageConfig]);
    setNewImagePreview(null); 
    setNewPrice('');
    setNewColorName('');
    setNewImageInStock(true);
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
    
    const newProduct: Product = { 
      name: productName, 
      basePrice: parseFloat(productPrice).toFixed(2), 
      accessories: accessories,
      accessoriesType: accessoriesType,
      storageConfigs, 
      imageConfigs, 
      dynamicRegions: dynamicProducts, 
      details,
      preOrderConfig,
      description: description
    };
    console.log(newProduct)

    await axios.post('/api/', newProduct)
      .then(res => {
        console.log(res.data);
        alert('Product added successfully!');
        // Reset form
        setProductName('');
        setProductPrice('');
        setAccessories('');
        setAccessoriesType('');
        setDescription('');
        setStorageConfigs([]);
        setImageConfigs([]);
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

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 font-sans w-full">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading editor...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-sans w-full">
      <Card className="w-full max-w-6xl">
        <CardHeader className="bg-primary text-primary-foreground text-center">
          <CardTitle className="text-2xl font-bold">Apple Product Manager</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Manage your product configurations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Product Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    type="text" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    placeholder="Product Name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Base Price</Label>
                  <Input
                    id="productPrice"
                    type="number" 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                    placeholder="Base Price" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessories">Accessories Category</Label>
                <Input
                  id="accessories"
                  type="text" 
                  placeholder='Accessories Category (e.g., Cable, Battery, Case)' 
                  value={accessories}
                  onChange={(e) => setAccessories(e.target.value)}
                />
              </div>

              {/* Enhanced Tiptap Editor for Product Description */}
              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <TiptapEditor onContentChange={setDescription} />
                <p className="text-sm text-muted-foreground">
                  Use the toolbar to format your product description with rich text features including tables, images, and links
                </p>
              </div>
            </div>

            <Separator />

            {/* Rest of your existing components... */}
            {/* Images Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Images</h3>
              </div>
              
              {/* Add New Image Form */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        onClick={() => document.getElementById('newImage')?.click()} 
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 cursor-pointer w-20 h-20 flex items-center justify-center hover:border-primary transition-colors"
                      >
                        {uploading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : newImagePreview ? (
                          <Image src={newImagePreview} width={64} height={64} alt="preview" className="rounded object-cover" />
                        ) : (
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        )}
                        <input 
                          type="file" 
                          id="newImage" 
                          accept="image/*" 
                          onChange={handleNewImageUpload} 
                          className="hidden" 
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Input 
                          type="number" 
                          placeholder="Price" 
                          value={newPrice} 
                          onChange={(e) => setNewPrice(e.target.value)} 
                        />
                        <Input 
                          type="text" 
                          placeholder="Color Name (optional)" 
                          value={newColorName} 
                          onChange={(e) => setNewColorName(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center space-y-1">
                        <Label className="text-sm">In Stock</Label>
                        <Switch 
                          checked={newImageInStock} 
                          onCheckedChange={setNewImageInStock}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAddImage}
                        disabled={!newImagePreview || !newPrice}
                        className='border-gray-300 border '
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Display Existing Image Configurations */}
              {imageConfigs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {imageConfigs.map((config) => (
                    <Card key={config.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 flex-shrink-0">
                            <Image 
                              src={config.image} 
                              width={64} 
                              height={64} 
                              alt="Product" 
                              className="w-full h-full object-cover rounded border" 
                            />
                          </div>
                          
                          <div className="space-y-1 flex-1">
                            <Input 
                              type="number" 
                              placeholder="Price" 
                              value={config.price} 
                              onChange={(e) => handleImageConfigChange(config.id, 'price', e.target.value)} 
                              className="w-full"
                            />
                            <Input 
                              type="text" 
                              placeholder="Color Name (optional)" 
                              value={config.colorName || ''} 
                              onChange={(e) => handleImageConfigChange(config.id, 'colorName', e.target.value)} 
                              className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">${config.price} {config.colorName && `• ${config.colorName}`}</p>
                          </div>
                          
                          <div className="flex flex-col items-center space-y-1">
                            <Label className="text-sm">In Stock</Label>
                            <Switch 
                              checked={config.inStock} 
                              onCheckedChange={(checked) => handleImageConfigChange(config.id, 'inStock', checked)}
                            />
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleRemoveImage(config.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {imageConfigs.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No images added yet
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Storage Configs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessoriesType">Accessories Type</Label>
                <Input
                  id="accessoriesType"
                  type="text" 
                  placeholder='Accessories Type (e.g., USB-C, Lightning, Wireless)' 
                  value={accessoriesType}
                  onChange={(e) => setAccessoriesType(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Storage/Variant Configurations</h3>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-end gap-3 mb-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="storageLabel">Label</Label>
                      <Input
                        id="storageLabel"
                        type="text" 
                        placeholder="Label" 
                        value={newStorageLabel} 
                        onChange={(e) => setNewStorageLabel(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storagePrice">Price</Label>
                      <Input
                        id="storagePrice"
                        type="number" 
                        placeholder="Price" 
                        value={newStoragePrice} 
                        onChange={(e) => setNewStoragePrice(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="storageDetails">Short Details</Label>
                      <Input
                        id="storageDetails"
                        type="text" 
                        placeholder="Short Details" 
                        value={newStorageShortDetails} 
                        onChange={(e) => setNewStorageShortDetails(e.target.value)} 
                      />
                    </div>
                    
                    <div className="flex flex-col items-center space-y-1">
                      <Label className="text-sm">In Stock</Label>
                      <Switch 
                        checked={newStorageInStock} 
                        onCheckedChange={setNewStorageInStock}
                      />
                    </div>
                    
                    <Button className=' border border-gray-200' onClick={handleAddStorage}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {storageConfigs.map((config) => (
                      <div key={config.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <span className="font-medium w-20">{config.label}</span>
                        <Input 
                          type="number" 
                          placeholder="Price" 
                          value={config.price} 
                          onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'price', e.target.value)} 
                          className="w-24"
                        />
                        <Input 
                          type="text" 
                          placeholder="Short Details" 
                          value={config.shortDetails} 
                          onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'shortDetails', e.target.value)} 
                          className="flex-1"
                        />
                        
                        <div className="flex flex-col items-center space-y-1">
                          <Label className="text-sm">In Stock</Label>
                          <Switch 
                            checked={config.inStock} 
                            onCheckedChange={(checked) => handleConfigChange(setStorageConfigs, config.id, 'inStock', checked)}
                          />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveStorage(config.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Dynamic Regions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Dynamic Regions</h3>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center space-y-1">
                    <Label className="text-sm">In Stock</Label>
                    <Switch 
                      checked={newRegionInStock} 
                      onCheckedChange={setNewRegionInStock}
                    />
                  </div>
                  <Button className=' border border-gray-200' onClick={addRegion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Region
                  </Button>
                </div>
              </div>
              
              {dynamicProducts.map((region, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Input 
                        type="text" 
                        placeholder="Region Name" 
                        value={region.name} 
                        onChange={(e) => handleRegionChange(index, 'name', e.target.value)} 
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        placeholder="Price" 
                        value={region.price} 
                        onChange={(e) => handleRegionChange(index, 'price', e.target.value)} 
                        className="w-32"
                      />
                      
                      <div className="flex flex-col items-center space-y-1">
                        <Label className="text-sm">In Stock</Label>
                        <Switch 
                          checked={region.inStock} 
                          onCheckedChange={(checked) => handleRegionChange(index, 'inStock', checked)}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setDynamicProducts(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <Button onClick={addDetail} className=' border border-gray-200'>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Detail
                </Button>
              </div>
              
              {details.map((detail) => (
                <Card key={detail.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Input 
                        type="text" 
                        placeholder="Label" 
                        value={detail.label} 
                        onChange={(e) => handleDetailChange(detail.id, 'label', e.target.value)} 
                        className="flex-1"
                      />
                      <Input 
                        type="text" 
                        placeholder="Value" 
                        value={detail.value} 
                        onChange={(e) => handleDetailChange(detail.id, 'value', e.target.value)} 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => removeDetail(detail.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleAddProduct} 
              className=' border border-gray-300 w-full'              
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Accessories;