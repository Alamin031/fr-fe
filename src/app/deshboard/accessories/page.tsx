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
import { Badge } from "@/components/ui/badge";

import { Loader2, Plus, Trash2, Upload, X, Package, Image as ImageIconLucide, Database, Globe, FileText, Settings, Palette, Calendar, Truck, Tag, PackageX } from "lucide-react";

// Tiptap imports
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
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
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo, 
  Strikethrough,
  Video
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
  colorHex?: string;
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
  details: DetailConfig[]; 
  accessories?: string;
  accessoriesType?: string;
  description?: string;
  dynamicInputs?: DynamicInputForm[];
  preOrderConfig?: PreOrderConfig;
};

type DynamicInputItem = {
  label: string;
  price: string;
};

type DynamicInputForm = {
  type: string;
  items: DynamicInputItem[];
};

// Tiptap Toolbar Component with Video Support
const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);

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

  const addVideo = () => {
    if (videoUrl) {
      const videoId = extractYoutubeId(videoUrl);
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({ src: videoId }).run();
        setVideoUrl('');
        setShowVideoInput(false);
      } else {
        alert('Please enter a valid YouTube URL');
      }
    }
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

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
        </tbody>
      </table>
    `;
    editor.chain().focus().insertContent(tableHTML).run();
  };

  return (
    <div className="border border-gray-200 rounded-t-lg bg-white">
      <div className="p-2 flex flex-wrap items-center gap-1 border-b">
        <div className="flex items-center gap-1 mr-2">
          <Button size="sm" variant="outline" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <div className="flex items-center gap-1">
          <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} className="w-6 h-6 cursor-pointer border rounded" title="Text Color" />
          <Palette className="h-4 w-4 text-gray-600" />
        </div>
        <div className="flex items-center gap-1">
          <input type="color" onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()} className="w-6 h-6 cursor-pointer border rounded" title="Highlight" />
          <Highlighter className="h-4 w-4 text-gray-600" />
        </div>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={() => setShowLinkInput(!showLinkInput)}>
          <LinkIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={false} onPressedChange={() => setShowImageInput(!showImageInput)}>
          <ImageIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={false} onPressedChange={() => setShowVideoInput(!showVideoInput)}>
          <Video className="h-4 w-4" />
        </Toggle>
        <Button size="sm" variant="outline" onClick={addTable}>
          <TableIcon className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
          <Input type="url" placeholder="Enter URL..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="flex-1" />
          <Button size="sm" onClick={addLink}>Add Link</Button>
          <Button size="sm" variant="outline" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }}>Remove</Button>
        </div>
      )}

      {showImageInput && (
        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
          <Input type="url" placeholder="Enter image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1" />
          <Button size="sm" onClick={addImage}>Add Image</Button>
          <Button size="sm" variant="outline" onClick={() => setShowImageInput(false)}>Cancel</Button>
        </div>
      )}

      {showVideoInput && (
        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
          <Input 
            type="url" 
            placeholder="Enter YouTube URL..." 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            className="flex-1" 
          />
          <Button size="sm" onClick={addVideo}>Add Video</Button>
          <Button size="sm" variant="outline" onClick={() => setShowVideoInput(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
};

const TiptapEditor = ({ onContentChange }: { onContentChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-500 underline' } }),
      ImageExtension.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' } }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full h-64 md:h-96 rounded-lg border-0',
        },
        inline: false,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => { onContentChange(editor.getHTML()); },
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
        <style jsx>{`
          .prose :global(.ProseMirror iframe) {
            border: 0;
            border-radius: 8px;
            margin: 1rem 0;
          }
          
          .prose :global(.ProseMirror .youtube-video) {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            margin: 1rem 0;
          }
          
          .prose :global(.ProseMirror .youtube-video iframe) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const DynamicInputForm = ({ forms, setForms }: { forms: DynamicInputForm[], setForms: React.Dispatch<React.SetStateAction<DynamicInputForm[]>> }) => {
  const handleCreateInput = () => {
    setForms([...forms, { type: "", items: [{ label: "", price: "" }] }]);
  };

  const handleAddItem = (formIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].items.push({ label: "", price: "" });
    setForms(updatedForms);
  };

  const handleChange = (formIndex: number, itemIndex: number, key: keyof DynamicInputItem, value: string) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].items[itemIndex][key] = value;
    setForms(updatedForms);
  };

  const handleTypeChange = (formIndex: number, value: string) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].type = value;
    setForms(updatedForms);
  };

  const handleRemoveForm = (formIndex: number) => {
    const updatedForms = forms.filter((_, index) => index !== formIndex);
    setForms(updatedForms);
  };

  const handleRemoveItem = (formIndex: number, itemIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].items = updatedForms[formIndex].items.filter((_, index) => index !== itemIndex);
    setForms(updatedForms);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateInput} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Create Input Form
      </Button>

      {forms.map((form, formIndex) => (
        <Card key={formIndex}>
          <CardContent className="p-4 relative">
            <Button
              onClick={() => handleRemoveForm(formIndex)}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-3 pt-8">
              <div>
                <Label>Form Type</Label>
                <Input
                  type="text"
                  placeholder="Enter type (e.g., Warranty, Protection)"
                  value={form.type}
                  onChange={(e) => handleTypeChange(formIndex, e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                {form.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => handleChange(formIndex, itemIndex, "label", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleChange(formIndex, itemIndex, "price", e.target.value)}
                      className="w-32"
                    />
                    {form.items.length > 1 && (
                      <Button
                        onClick={() => handleRemoveItem(formIndex, itemIndex)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={() => handleAddItem(formIndex)} variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// PreOrder Configuration Component
const PreOrderConfigSection = ({ config, setConfig }: { 
  config: PreOrderConfig; 
  setConfig: React.Dispatch<React.SetStateAction<PreOrderConfig>>;
}) => {
  const handlePreOrderToggle = (isPreOrder: boolean) => {
    setConfig({
      isPreOrder,
      availabilityDate: isPreOrder ? config.availabilityDate : '',
      estimatedShipping: isPreOrder ? config.estimatedShipping : '',
      preOrderDiscount: isPreOrder ? config.preOrderDiscount : 0,
      maxPreOrderQuantity: isPreOrder ? config.maxPreOrderQuantity : 0
    });
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PackageX className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Pre-Order Configuration</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.isPreOrder}
              onCheckedChange={handlePreOrderToggle}
              id="preOrderToggle"
            />
            <Label htmlFor="preOrderToggle" className="text-sm font-medium cursor-pointer">
              Enable Pre-Order
            </Label>
          </div>
        </div>

        {config.isPreOrder && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availabilityDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Availability Date
                </Label>
                <Input
                  id="availabilityDate"
                  type="date"
                  value={config.availabilityDate || ''}
                  onChange={(e) => setConfig({ ...config, availabilityDate: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedShipping" className="text-sm font-medium flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Estimated Shipping
                </Label>
                <Input
                  id="estimatedShipping"
                  type="text"
                  placeholder="e.g., 2-3 weeks, Within 30 days"
                  value={config.estimatedShipping || ''}
                  onChange={(e) => setConfig({ ...config, estimatedShipping: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preOrderDiscount" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Pre-Order Discount (%)
                </Label>
                <Input
                  id="preOrderDiscount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={config.preOrderDiscount || 0}
                  onChange={(e) => setConfig({ ...config, preOrderDiscount: Number(e.target.value) })}
                  className="h-10"
                />
                {config.preOrderDiscount && config.preOrderDiscount > 0 && (
                  <p className="text-sm text-green-600">
                    Customers will get {config.preOrderDiscount}% off on pre-orders
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPreOrderQuantity" className="text-sm font-medium">
                  Maximum Pre-Order Quantity
                </Label>
                <Input
                  id="maxPreOrderQuantity"
                  type="number"
                  min="0"
                  placeholder="0 for unlimited"
                  value={config.maxPreOrderQuantity || 0}
                  onChange={(e) => setConfig({ ...config, maxPreOrderQuantity: Number(e.target.value) })}
                  className="h-10"
                />
                <p className="text-xs text-gray-500">
                  {config.maxPreOrderQuantity ? `Limited to ${config.maxPreOrderQuantity} units` : 'Unlimited pre-orders'}
                </p>
              </div>
            </div>

            {/* Summary Badge */}
            <div className="flex flex-wrap gap-2 pt-2">
              {config.availabilityDate && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Available: {new Date(config.availabilityDate).toLocaleDateString()}
                </Badge>
              )}
              {config.estimatedShipping && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Ships: {config.estimatedShipping}
                </Badge>
              )}
              {config.preOrderDiscount && config.preOrderDiscount > 0 && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  {config.preOrderDiscount}% OFF
                </Badge>
              )}
              {config.maxPreOrderQuantity && config.maxPreOrderQuantity > 0 && (
                <Badge variant="outline">
                  Limited: {config.maxPreOrderQuantity} units
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Accessories: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [accessories, setAccessories] = useState('');
  const [accessoriesType, setAccessoriesType] = useState('');
  const [description, setDescription] = useState('');
  const [mounted, setMounted] = useState(false);
  const [dynamicInputForms, setDynamicInputForms] = useState<DynamicInputForm[]>([]);
  const [preOrderConfig, setPreOrderConfig] = useState<PreOrderConfig>({
    isPreOrder: false,
    availabilityDate: '',
    estimatedShipping: '',
    preOrderDiscount: 0,
    maxPreOrderQuantity: 0
  });

  const [storageConfigs, setStorageConfigs] = useState<Config[]>([]);
  const [newStorageLabel, setNewStorageLabel] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');
  const [newStorageShortDetails, setNewStorageShortDetails] = useState('');
  const [newStorageInStock, setNewStorageInStock] = useState(true);

  const [imageConfigs, setImageConfigs] = useState<ImageConfig[]>([]);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('');
  const [newImageInStock, setNewImageInStock] = useState(true);
  const [uploading, setUploading] = useState(false);

  // কালার পিকার স্টেট
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const [dynamicProducts, setDynamicProducts] = useState<RegionConfig[]>([]);
  const [newRegionInStock, setNewRegionInStock] = useState(true);
  const [details, setDetails] = useState<DetailConfig[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleImageConfigChange = (id: number, field: 'price' | 'colorName' | 'colorHex' | 'inStock', value: string | boolean) => {
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

  // কালার অ্যাড করার ফাংশন
  const handleAddColor = () => {
    setNewColorHex(selectedColor);
    setShowColorPicker(false);
  };

  // কালার পিকার থেকে কালার সিলেক্ট করা হলে
  const handleColorPickerChange = (color: string) => {
    setSelectedColor(color);
    setNewColorHex(color);
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
      colorHex: newColorHex || undefined,
      inStock: newImageInStock
    };
    
    setImageConfigs(prev => [...prev, newImageConfig]);
    setNewImagePreview(null); 
    setNewPrice('');
    setNewColorName('');
    setNewColorHex('');
    setNewImageInStock(true);
    setShowColorPicker(false);
  };

  const addRegion = () => {
    setDynamicProducts(prev => [...prev, { name: '', price: '', inStock: newRegionInStock }]);
    setNewRegionInStock(true);
  };
  
  const handleRegionChange = (index: number, field: 'name' | 'price' | 'inStock', value: string | boolean) => {
    const updated = [...dynamicProducts]; 
    if (field === 'inStock') {
      updated[index][field] = value as boolean;
    } else {
      updated[index][field] = value as string;
    }
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
      details,
      description: description,
      dynamicInputs: dynamicInputForms,
      preOrderConfig: preOrderConfig.isPreOrder ? preOrderConfig : undefined
    };
    console.log(newProduct)

    await axios.post('/api/accessorieslist', newProduct)
      .then(res => {
        console.log(res.data);
        alert('Product added successfully!');
        setProductName('');
        setProductPrice('');
        setAccessories('');
        setAccessoriesType('');
        setDescription('');
        setStorageConfigs([]);
        setImageConfigs([]);
        setDynamicProducts([]);
        setDetails([]);
        setDynamicInputForms([]);
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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading editor...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className=" border-0">
          <CardHeader className=" text-black ">
            <div className="flex items-center gap-3 justify-center">
              <Package className="w-8 h-8" />
              <div >
                <CardTitle className="text-3xl font-bold flex justify-center">Product Manager</CardTitle>
                <CardDescription className="text-black mt-1">
                  Create and manage product configurations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Product Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">Product Information</h3>
              </div>
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName" className="text-sm font-medium">Product Name</Label>
                      <Input
                        id="productName"
                        type="text" 
                        value={productName} 
                        onChange={(e) => setProductName(e.target.value)} 
                        placeholder="Enter product name" 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice" className="text-sm font-medium">Base Price (৳)</Label>
                      <Input
                        id="productPrice"
                        type="number" 
                        value={productPrice} 
                        onChange={(e) => setProductPrice(e.target.value)} 
                        placeholder="0.00" 
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessories" className="text-sm font-medium">Accessories Category</Label>
                    <Input
                      id="accessories"
                      type="text" 
                      placeholder='e.g., Cable, Battery, Case' 
                      value={accessories}
                      onChange={(e) => setAccessories(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            {/* Pre-Order Configuration */}
            <section>
              <PreOrderConfigSection config={preOrderConfig} setConfig={setPreOrderConfig} />
            </section>

            <Separator className="my-8" />

            {/* Product Images */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ImageIconLucide className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">Product Images</h3>
                <Badge>{imageConfigs.length} added</Badge>
              </div>
              
              <Card className="border-2 border-dashed">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div 
                        onClick={() => document.getElementById('newImage')?.click()} 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer w-full md:w-32 h-32 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all relative"
                      >
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        ) : newImagePreview ? (
                          <>
                            <Image src={newImagePreview} width={96} height={96} alt="preview" className="rounded object-cover w-full h-full" />
                            {/* কালার ইন্ডিকেটর */}
                            {newColorHex && (
                              <div 
                                className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
                                style={{ backgroundColor: newColorHex }}
                                title={newColorName || newColorHex}
                              />
                            )}
                          </>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Upload Image</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          id="newImage" 
                          accept="image/*" 
                          onChange={handleNewImageUpload} 
                          className="hidden" 
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Price (৳)</Label>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              value={newPrice} 
                              onChange={(e) => setNewPrice(e.target.value)} 
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Color Name</Label>
                            <Input 
                              type="text" 
                              placeholder="e.g., Midnight Black" 
                              value={newColorName} 
                              onChange={(e) => setNewColorName(e.target.value)} 
                              className="h-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 relative">
                          <Label className="text-sm font-medium">Color Hex Code</Label>
                          <div className="flex gap-2">
                            <Input 
                              type="text" 
                              placeholder="#000000" 
                              value={newColorHex} 
                              onChange={(e) => setNewColorHex(e.target.value)} 
                              className="h-10 flex-1"
                            />
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => setShowColorPicker(!showColorPicker)}
                              className="h-10 px-3"
                            >
                              <Palette className="w-4 h-4" />
                            </Button>
                            {newColorHex && (
                              <div 
                                className="w-10 h-10 rounded border-2 border-gray-300"
                                style={{ backgroundColor: newColorHex }}
                                title={newColorHex}
                              />
                            )}
                          </div>
                          
                          {/* কালার পিকার */}
                          {showColorPicker && (
                            <div className="absolute mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <div className="flex gap-2 mb-2">
                                <input 
                                  type="color" 
                                  value={selectedColor} 
                                  onChange={(e) => handleColorPickerChange(e.target.value)}
                                  className="w-10 h-10 cursor-pointer"
                                />
                                <Input 
                                  type="text" 
                                  value={selectedColor} 
                                  onChange={(e) => handleColorPickerChange(e.target.value)}
                                  placeholder="#000000"
                                  className="h-10 w-32"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleAddColor} size="sm">
                                  Apply Color
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowColorPicker(false)}
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={newImageInStock} 
                              onCheckedChange={setNewImageInStock}
                              id="newImageStock"
                            />
                            <Label htmlFor="newImageStock" className="text-sm cursor-pointer">In Stock</Label>
                          </div>
                          
                          <Button 
                            onClick={handleAddImage}
                            disabled={!newImagePreview || !newPrice}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {imageConfigs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {imageConfigs.map((config) => (
                    <Card key={config.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image 
                            src={config.image} 
                            width={400} 
                            height={300} 
                            alt="Product" 
                            className="w-full h-48 object-cover" 
                          />
                          {!config.inStock && (
                            <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>
                          )}
                          {/* কালার ইন্ডিকেটর */}
                          {config.colorHex && (
                            <div 
                              className="absolute top-2 left-12 w-6 h-6 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: config.colorHex }}
                              title={config.colorName || config.colorHex}
                            />
                          )}
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleRemoveImage(config.id)}
                            className="absolute top-2 right-2 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <Input 
                            type="number" 
                            placeholder="Price" 
                            value={config.price} 
                            onChange={(e) => handleImageConfigChange(config.id, 'price', e.target.value)} 
                            className="h-9"
                          />
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Color Name</Label>
                              <Input 
                                type="text" 
                                placeholder="Color Name" 
                                value={config.colorName || ''} 
                                onChange={(e) => handleImageConfigChange(config.id, 'colorName', e.target.value)} 
                                className="h-9 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Color Hex</Label>
                              <div className="flex gap-1">
                                <Input 
                                  type="text" 
                                  placeholder="#000000" 
                                  value={config.colorHex || ''} 
                                  onChange={(e) => handleImageConfigChange(config.id, 'colorHex', e.target.value)} 
                                  className="h-9 text-xs flex-1"
                                />
                                <div 
                                  className="w-9 h-9 rounded border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: config.colorHex || '#fff' }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-medium text-gray-700">৳{config.price}</span>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={config.inStock} 
                                onCheckedChange={(checked) => handleImageConfigChange(config.id, 'inStock', checked)}
                                id={`stock-${config.id}`}
                              />
                              <Label htmlFor={`stock-${config.id}`} className="text-xs cursor-pointer">In Stock</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <Separator className="my-8" />

            {/* Storage/Variant Configurations */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">Storage/Variant Configurations</h3>
                <Badge>{storageConfigs.length} added</Badge>
              </div>
              
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessoriesType" className="text-sm font-medium">Configuration Type</Label>
                    <Input
                      id="accessoriesType"
                      type="text" 
                      placeholder='e.g., Storage, RAM, Cable Type' 
                      value={accessoriesType}
                      onChange={(e) => setAccessoriesType(e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-3 space-y-1.5">
                      <Label className="text-sm font-medium">Label</Label>
                      <Input
                        type="text" 
                        placeholder="e.g., 256GB" 
                        value={newStorageLabel} 
                        onChange={(e) => setNewStorageLabel(e.target.value)} 
                        className="h-10"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-sm font-medium">Price (৳)</Label>
                      <Input
                        type="number" 
                        placeholder="0.00" 
                        value={newStoragePrice} 
                        onChange={(e) => setNewStoragePrice(e.target.value)} 
                        className="h-10"
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <Label className="text-sm font-medium">Short Details</Label>
                      <Input
                        type="text" 
                        placeholder="Additional info" 
                        value={newStorageShortDetails} 
                        onChange={(e) => setNewStorageShortDetails(e.target.value)} 
                        className="h-10"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-10">
                        <Switch 
                          checked={newStorageInStock} 
                          onCheckedChange={setNewStorageInStock}
                          id="storageStock"
                        />
                        <Label htmlFor="storageStock" className="text-xs cursor-pointer whitespace-nowrap">In Stock</Label>
                      </div>
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <Button onClick={handleAddStorage} className="w-full h-10 bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {storageConfigs.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      {storageConfigs.map((config) => (
                        <Card key={config.id} className="border hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                                {config.label}
                              </Badge>
                              <Input 
                                type="number" 
                                placeholder="Price" 
                                value={config.price} 
                                onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'price', e.target.value)} 
                                className="w-24 h-9"
                              />
                              <Input 
                                type="text" 
                                placeholder="Details" 
                                value={config.shortDetails} 
                                onChange={(e) => handleConfigChange(setStorageConfigs, config.id, 'shortDetails', e.target.value)} 
                                className="flex-1 h-9"
                              />
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  checked={config.inStock} 
                                  onCheckedChange={(checked) => handleConfigChange(setStorageConfigs, config.id, 'inStock', checked)}
                                  id={`config-${config.id}`}
                                />
                                <Label htmlFor={`config-${config.id}`} className="text-xs cursor-pointer whitespace-nowrap">Stock</Label>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveStorage(config.id)}
                                className="h-9 w-9"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />
            {/* Dynamic Input Forms */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">Dynamic Options</h3>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <Card className="border-2">
                <CardContent className="p-6">
                  <DynamicInputForm forms={dynamicInputForms} setForms={setDynamicInputForms} />
                </CardContent>
              </Card>
            </section>

            {/* Product Details */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Product Details</h3>
                  <Badge>{details.length} specifications</Badge>
                </div>
                <Button onClick={addDetail} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Detail
                </Button>
              </div>
              
              {details.length > 0 ? (
                <div className="space-y-3">
                  {details.map((detail) => (
                    <Card key={detail.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Input 
                            type="text" 
                            placeholder="Label (e.g., Display)" 
                            value={detail.label} 
                            onChange={(e) => handleDetailChange(detail.id, 'label', e.target.value)} 
                            className="flex-1 h-10"
                          />
                          <Input 
                            type="text" 
                            placeholder="Value (e.g., 6.1-inch OLED)" 
                            value={detail.value} 
                            onChange={(e) => handleDetailChange(detail.id, 'value', e.target.value)} 
                            className="flex-1 h-10"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeDetail(detail.id)}
                            className="h-10 w-10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-gray-500">
                    No product details added yet
                  </CardContent>
                </Card>
              )}
            </section>

            <Separator className="my-8" />

            {/* Product Description */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">Product Description</h3>
              </div>
              <TiptapEditor onContentChange={setDescription} />
              <p className="text-sm text-gray-500 mt-2">
                Use the rich text editor to create a detailed product description with formatting, images, tables, and links
              </p>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                onClick={handleAddProduct} 
                className="w-full h-12 text-lg bg-gray-200 border border-black"              
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accessories;