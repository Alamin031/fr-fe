'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";

import { 
  Loader2, Plus, Trash2, Upload, X, Package, Image as ImageIconLucide, 
  Database, FileText, Settings, Palette, Calendar, Truck, Tag, PackageX,
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Highlighter,
  Heading1, Heading2, Heading3, Undo, Redo, Strikethrough, Video
} from "lucide-react";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import axios from 'axios';
import AdminManagementProvider from '@/providers/AdminManagementProvider';

type StorageConfig = {
  id: number;
  name: string;
  basicPrice: string;
  prices: { [colorId: string]: string };
  shortDetails: string;
  inStock: boolean;
  colorStocks?: { [colorId: string]: boolean };
};

type ImageConfig = { 
  id: number; 
  image: string; 
  colorName: string;
  colorHex: string;
  inStock: boolean;
};

type DetailConfig = { id: number; label: string; value: string; };

type PreOrderConfig = {
  isPreOrder: boolean;
  availabilityDate?: string;
  estimatedShipping?: string;
  preOrderDiscount?: number;
  maxPreOrderQuantity?: number;
};

type DynamicInputItem = {
  label: string;
  price: string;
  inStock: boolean;
};

type DynamicInputForm = {
  type: string;
  items: DynamicInputItem[];
};

// SIMPLE and RELIABLE YouTube ID extraction
const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle youtu.be URLs
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return id || null;
  }
  
  // Handle youtube.com URLs
  if (url.includes('youtube.com')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  }
  
  return null;
};

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
    if (!videoUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    const videoId = extractYoutubeId(videoUrl);
    console.log('🎬 Video URL:', videoUrl);
    console.log('🎬 Extracted Video ID:', videoId);
    
    if (videoId && editor) {
      try {
        console.log('🎬 Inserting YouTube video with ID:', videoId);
        
        // METHOD 1: Direct HTML insertion (MOST RELIABLE)
        const youtubeEmbed = `
          <div class="youtube-embed-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1rem 0; border-radius: 8px;">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 8px;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        `;
        
        // Insert the YouTube embed HTML directly
        editor.chain().focus().insertContent(youtubeEmbed).run();
        
        console.log('🎬 YouTube video inserted successfully!');
        setVideoUrl('');
        setShowVideoInput(false);
        
      } catch (error) {
        console.error('🎬 Error inserting video:', error);
        alert('Error inserting video. Please try again.');
      }
    } else {
      alert('Please enter a valid YouTube URL. Examples:\n• https://www.youtube.com/watch?v=dQw4w9WgXcQ\n• https://youtu.be/dQw4w9WgXcQ');
    }
  };

  return (
    <div className="border border-gray-300 rounded-t-lg bg-gray-50 overflow-hidden">
      <div className="p-2 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1 mr-2">
          <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="h-8 w-8 p-0">
            <Undo className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="h-8 w-8 p-0">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="h-8 w-8 p-0">
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="h-8 w-8 p-0">
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="h-8 w-8 p-0">
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()} className="h-8 w-8 p-0">
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} className="h-8 w-8 p-0">
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()} className="h-8 w-8 p-0">
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()} className="h-8 w-8 p-0">
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()} className="h-8 w-8 p-0">
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} className="h-8 w-8 p-0">
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} className="w-7 h-7 cursor-pointer border rounded" title="Text Color" />
        <input type="color" onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()} className="w-7 h-7 cursor-pointer border rounded" title="Highlight" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={() => setShowLinkInput(!showLinkInput)} className="h-8 w-8 p-0">
          <LinkIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={false} onPressedChange={() => setShowImageInput(!showImageInput)} className="h-8 w-8 p-0">
          <ImageIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={false} onPressedChange={() => setShowVideoInput(!showVideoInput)} className="h-8 w-8 p-0">
          <Video className="h-4 w-4" />
        </Toggle>
      </div>

      {showLinkInput && (
        <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
          <Input type="url" placeholder="Enter URL..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="flex-1 h-9" />
          <Button size="sm" onClick={addLink} className="h-9 bg-gray-900 hover:bg-black">Add</Button>
          <Button size="sm" variant="outline" onClick={() => setShowLinkInput(false)} className="h-9">Cancel</Button>
        </div>
      )}

      {showImageInput && (
        <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
          <Input type="url" placeholder="Enter image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 h-9" />
          <Button size="sm" onClick={addImage} className="h-9 bg-gray-900 hover:bg-black">Add</Button>
          <Button size="sm" variant="outline" onClick={() => setShowImageInput(false)} className="h-9">Cancel</Button>
        </div>
      )}

      {showVideoInput && (
        <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
          <Input 
            type="url" 
            placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)" 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            className="flex-1 h-9" 
          />
          <Button size="sm" onClick={addVideo} className="h-9 bg-gray-900 hover:bg-black">Add Video</Button>
          <Button size="sm" variant="outline" onClick={() => setShowVideoInput(false)} className="h-9">Cancel</Button>
        </div>
      )}
    </div>
  );
};

const TiptapEditor = ({ onContentChange }: { onContentChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3] } 
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
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
      const html = editor.getHTML();
      console.log('📝 Editor content:', html);
      onContentChange(html); 
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="min-h-[200px] p-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <TiptapToolbar editor={editor} />
      <div className="min-h-[300px] p-4 bg-white prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

// Add this CSS to your global styles or component
const YouTubeStyles = () => (
  <style jsx global>{`
    .youtube-embed-wrapper {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 100%;
      margin: 1rem 0;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .youtube-embed-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 8px;
    }
    
    .ProseMirror {
      iframe {
        border-radius: 8px;
      }
    }
  `}</style>
);

// ... (Keep all the other components exactly the same: DynamicInputForm, PreOrderConfigSection)

const DynamicInputForm = ({ forms, setForms }: { forms: DynamicInputForm[], setForms: React.Dispatch<React.SetStateAction<DynamicInputForm[]>> }) => {
  const handleCreateInput = () => {
    setForms([...forms, { type: "", items: [{ label: "", price: "", inStock: true }] }]);
  };

  const handleAddItem = (formIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].items.push({ label: "", price: "", inStock: true });
    setForms(updatedForms);
  };

  const handleChange = (formIndex: number, itemIndex: number, key: keyof DynamicInputItem, value: string | boolean) => {
    const updatedForms = [...forms];
    if (key === 'inStock') {
      updatedForms[formIndex].items[itemIndex][key] = value as boolean;
    } else {
      updatedForms[formIndex].items[itemIndex][key] = value as string;
    }
    setForms(updatedForms);
  };

  const handleTypeChange = (formIndex: number, value: string) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].type = value;
    setForms(updatedForms);
  };

  const handleRemoveForm = (formIndex: number) => {
    setForms(forms.filter((_, index) => index !== formIndex));
  };

  const handleRemoveItem = (formIndex: number, itemIndex: number) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].items = updatedForms[formIndex].items.filter((_, index) => index !== itemIndex);
    setForms(updatedForms);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateInput} variant="outline" className="w-full border-dashed border-2 hover:bg-gray-50">
        <Plus className="w-4 h-4 mr-2" />
        Create Input Form
      </Button>

      {forms.map((form, formIndex) => (
        <Card key={formIndex} className="border-2 shadow-sm">
          <CardContent className="p-5 relative">
            <Button
              onClick={() => handleRemoveForm(formIndex)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor={`form-type-${formIndex}`} className="text-sm font-semibold mb-2 block">
                  Form Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`form-type-${formIndex}`}
                  type="text"
                  placeholder="e.g., Warranty, Protection"
                  value={form.type}
                  onChange={(e) => handleTypeChange(formIndex, e.target.value)}
                  className="h-10"
                  required
                />
                {!form.type && (
                  <p className="text-red-500 text-xs mt-1.5">Form type is required</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Options</Label>
                {form.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      <div>
                        <Input
                          type="text"
                          placeholder="Label"
                          value={item.label}
                          onChange={(e) => handleChange(formIndex, itemIndex, "label", e.target.value)}
                          className="h-10"
                          required
                        />
                        {!item.label && (
                          <p className="text-red-500 text-xs mt-1">Required</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => handleChange(formIndex, itemIndex, "price", e.target.value)}
                          className="h-10"
                          required
                        />
                        {!item.price && (
                          <p className="text-red-500 text-xs mt-1">Required</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={item.inStock} 
                          onCheckedChange={(checked) => handleChange(formIndex, itemIndex, 'inStock', checked)}
                          id={`dynamic-stock-${formIndex}-${itemIndex}`}
                        />
                        <Label 
                          htmlFor={`dynamic-stock-${formIndex}-${itemIndex}`} 
                          className={`text-xs font-medium cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            item.inStock ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </Label>
                      </div>
                      
                      {form.items.length > 1 && (
                        <Button
                          onClick={() => handleRemoveItem(formIndex, itemIndex)}
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => handleAddItem(formIndex)} variant="outline" size="sm" className="w-full border-dashed">
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
    <Card className="border-2 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PackageX className="w-5 h-5 text-gray-700" />
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
                  placeholder="e.g., 2-3 weeks"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPreOrderQuantity" className="text-sm font-medium">
                  Max Pre-Order Quantity
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
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {config.availabilityDate && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(config.availabilityDate).toLocaleDateString()}
                </Badge>
              )}
              {config.estimatedShipping && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  {config.estimatedShipping}
                </Badge>
              )}
              {config.preOrderDiscount && config.preOrderDiscount > 0 && (
                <Badge className="bg-green-600">{config.preOrderDiscount}% OFF</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProductManager = () => {
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

  const [storageConfigs, setStorageConfigs] = useState<StorageConfig[]>([]);
  const [newStorageName, setNewStorageName] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState('');
  const [newStorageShortDetails, setNewStorageShortDetails] = useState('');
  const [newStorageInStock, setNewStorageInStock] = useState(true);

  const [imageConfigs, setImageConfigs] = useState<ImageConfig[]>([]);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newImageInStock, setNewImageInStock] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [details, setDetails] = useState<DetailConfig[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (newImagePreview && newImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(newImagePreview);
      }
    };
  }, [newImagePreview]);

  // Fixed Image Upload Function
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
  const handleColorStockChange = (storageId: number, colorId: number, inStock: boolean) => {
    setStorageConfigs(prev =>
      prev.map(storage =>
        storage.id === storageId
          ? {
              ...storage,
              colorStocks: {
                ...storage.colorStocks,
                [colorId]: inStock
              }
            } 
          : storage
      )
    );
  };

  const handleAddStorage = () => {
    if (!newStorageName || !newStoragePrice) {
      alert('Please enter storage name and basic price');
      return;
    }

    const initialPrices: { [key: string]: string } = {};
    const initialColorStocks: { [key: string]: boolean } = {};
    
    imageConfigs.forEach(color => {
      initialPrices[color.id] = '';
      initialColorStocks[color.id] = true;
    });

    const newStorageConfig = {
      id: Date.now(),
      name: newStorageName,
      basicPrice: newStoragePrice,
      prices: initialPrices,
      shortDetails: newStorageShortDetails,
      inStock: newStorageInStock,
      colorStocks: initialColorStocks
    };
    
    setStorageConfigs(prev => [...prev, newStorageConfig]);
    setNewStorageName('');
    setNewStoragePrice('');
    setNewStorageShortDetails('');
    setNewStorageInStock(true);
  };

  const handlePriceChange = (storageId: number, colorId: number, price: string) => {
    setStorageConfigs(prev =>
      prev.map(storage =>
        storage.id === storageId
          ? {
              ...storage,
              prices: { ...storage.prices, [colorId]: price }
            }
          : storage
      )
    );
  };

  const handleStorageConfigChange = (
    id: number, 
    field: 'name' | 'basicPrice' | 'shortDetails' | 'inStock',
    value: string | boolean
  ) => {
    setStorageConfigs(prev => prev.map(cfg => cfg.id === id ? { ...cfg, [field]: value } : cfg));
  };

  const handleRemoveStorage = (id: number) => {
    setStorageConfigs(prev => prev.filter(config => config.id !== id));
  };

  const handleImageConfigChange = (id: number, field: 'colorName' | 'colorHex' | 'inStock', value: string | boolean) => {
    setImageConfigs(prev => prev.map(cfg => 
      cfg.id === id ? { ...cfg, [field]: value } : cfg
    ));
  };

  const handleRemoveImage = (id: number) => {
    setImageConfigs(prev => prev.filter(config => config.id !== id));
  };

  const handleAddImage = () => {
    if (!newImagePreview || !newColorName) {
      alert('Image and color name are required');
      return;
    }

    const newImageConfig = {
      id: Date.now(),
      image: newImagePreview,
      colorName: newColorName,
      colorHex: newColorHex,
      inStock: newImageInStock
    };
    
    setImageConfigs(prev => [...prev, newImageConfig]);
    setNewImagePreview(null); 
    setNewColorName('');
    setNewColorHex('#000000');
    setNewImageInStock(true);
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

    const hasInvalidForms = dynamicInputForms.some(form => 
      !form.type || form.items.some(item => !item.label || !item.price)
    );

    if (hasInvalidForms) {
      alert('Please fill all required fields in Dynamic Options');
      return;
    }

    const hasMissingPrices = storageConfigs.some(storage => 
      imageConfigs.some(color => !storage.prices[color.id] || storage.prices[color.id] === '')
    );

    if (hasMissingPrices) {
      alert('Please set prices for all colors in all storage configurations');
      return;
    }
    
    alert('Product data ready! (API call would happen here)');
    console.log('Product:', {
      name: productName,
      basePrice: productPrice,
      accessories,
      accessoriesType,
      storageConfigs,
      imageConfigs,
      details,
      description,
      dynamicInputs: dynamicInputForms,
      preOrderConfig: preOrderConfig.isPreOrder ? preOrderConfig : undefined
    });
   const data = {
    name: productName,
      basePrice: productPrice,
      accessories,
      accessoriesType,
      storageConfigs,
      imageConfigs,
      details,
      description,
      dynamicInputs: dynamicInputForms,
      preOrderConfig: preOrderConfig.isPreOrder ? preOrderConfig : undefined

    }

    // const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/iphone/post`, data ).then(() => {
    //   console.log('Accessories list API called');
    // }).catch((error) => {
    //   console.error('Error calling accessories list API:', error);
    // });
    // console.log('Accessories List API Response:', res);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/accessories/api/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('API Response:', res);

    if (res.ok) {
      alert('Product added successfully!');
      // Reset form or redirect as needed
    } else {
      alert('Failed to add product');
    }

  };




  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-4xl shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-900 mr-3" />
              <span className="text-lg font-medium">Loading editor...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminManagementProvider>
       <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 text-black">
      <YouTubeStyles />
      <div className="max-w-7xl mx-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-black border-b">
            <div className="flex items-center gap-3 justify-center">
              <Package className="w-8 h-8" />
              <div className="text-center">
                <CardTitle className="text-3xl font-bold">Accessories Manager</CardTitle>
                <CardDescription className=" mt-1">
                  Create and manage product configurations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold text-gray-800">Product Information</h3>
              </div>
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName" className="text-sm font-semibold text-gray-700">Product Name *</Label>
                      <Input
                        id="productName"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        className="h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice" className="text-sm font-semibold text-gray-700">Base Price (৳) *</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="0.00"
                        className="h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessories" className="text-sm font-semibold text-gray-700">Accessories Category</Label>
                    <Input
                      id="accessories"
                      type="text"
                      placeholder='e.g., Cable, Battery, Case'
                      value={accessories}
                      onChange={(e) => setAccessories(e.target.value)}
                      className="h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            <section>
              <PreOrderConfigSection config={preOrderConfig} setConfig={setPreOrderConfig} />
            </section>

            <Separator className="my-8" />

            <section>
              <div className="flex items-center gap-2 mb-4">
                <ImageIconLucide className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold text-gray-800">Product Colors</h3>
                <Badge className="bg-gray-900 text-white">{imageConfigs.length} added</Badge>
              </div>
              
              <Card className="border-2 border-dashed border-gray-300 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative">
                        <div
                          onClick={() => !uploading && document.getElementById('newImage')?.click()}
                          className={`border-2 border-dashed border-gray-300 rounded-xl p-8 w-full lg:w-56 h-56 flex items-center justify-center transition-all ${
                            uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {uploading ? (
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-gray-900 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">Uploading...</p>
                            </div>
                          ) : newImagePreview ? (
                            <div className="relative w-full h-full">
                              <img
                                src={newImagePreview}
                                alt="Preview"
                                className="w-full h-full rounded-lg object-cover"
                              />
                              {newColorHex && (
                                <div 
                                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full border-2 border-white shadow-lg"
                                  style={{ backgroundColor: newColorHex }}
                                  title={newColorName || newColorHex}
                                />
                              )}
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-600">Upload Image</p>
                              <p className="text-xs text-gray-400 mt-1">Click to select</p>
                              <p className="text-xs text-gray-400">Max 5MB</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="newImage"
                          accept="image/*"
                          onChange={handleNewImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Color Name *</Label>
                            <Input
                              type="text"
                              placeholder="e.g., Midnight Black"
                              value={newColorName}
                              onChange={(e) => setNewColorName(e.target.value)}
                              className="h-10 border-gray-300 focus:border-gray-900"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Color Hex Code</Label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="#000000"
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                className="h-10 flex-1 border-gray-300 focus:border-gray-900"
                              />
                              <input
                                type="color"
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                className="h-10 w-14 cursor-pointer border border-gray-300 rounded"
                                title="Pick a color"
                              />
                            </div>
                          </div>
                        </div>

                        {newColorHex && (
                          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div 
                              className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
                              style={{ backgroundColor: newColorHex }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700">{newColorName || 'Color Preview'}</p>
                              <code className="text-xs text-gray-500">{newColorHex}</code>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={newImageInStock}
                              onCheckedChange={setNewImageInStock}
                              id="newImageStock"
                            />
                            <Label htmlFor="newImageStock" className="text-sm font-medium cursor-pointer">
                              {newImageInStock ? '✓ In Stock' : '✗ Out of Stock'}
                            </Label>
                          </div>

                          <Button
                            onClick={handleAddImage}
                            disabled={!newImagePreview || !newColorName || uploading}
                            className="bg-gray-900 hover:bg-black disabled:bg-gray-300"
                          >
                            {uploading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 mr-2" />
                            )}
                            Add Color
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {imageConfigs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {imageConfigs.map((config) => (
                    <Card key={config.id} className="overflow-hidden hover:shadow-xl transition-all border-2 border-gray-100">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="relative h-48 w-full bg-gray-100">
                            <img
                              src={config.image}
                              alt={config.colorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {!config.inStock && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">Out of Stock</Badge>
                          )}
                          <div 
                            className="absolute top-2 right-12 w-7 h-7 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: config.colorHex }}
                            title={config.colorName}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveImage(config.id)}
                            className="absolute top-2 right-2 h-8 w-8 shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="p-4 space-y-3 bg-white">
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-800 text-lg">{config.colorName}</h4>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <div 
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: config.colorHex }}
                              />
                              <code className="text-xs text-gray-500 font-mono">{config.colorHex}</code>
                            </div>
                          </div>

                          <div className="flex items-center justify-center pt-2 border-t">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={config.inStock}
                                onCheckedChange={(checked) => handleImageConfigChange(config.id, 'inStock', checked)}
                                id={`stock-${config.id}`}
                              />
                              <Label htmlFor={`stock-${config.id}`} className={`text-sm font-medium cursor-pointer ${config.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {config.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                              </Label>
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

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold text-gray-800">Storage Configuration</h3>
                <Badge className="bg-gray-900 text-white">{storageConfigs.length} added</Badge>
              </div>
              
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessoriesType" className="text-sm font-semibold text-gray-700">Configuration Type</Label>
                    <Input
                      id="accessoriesType"
                      type="text"
                      placeholder='e.g., Storage, RAM, Cable Type'
                      value={accessoriesType}
                      onChange={(e) => setAccessoriesType(e.target.value)}
                      className="h-10 border-gray-300 focus:border-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-3 space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">Storage Name *</Label>
                      <Input
                        type="text"
                        placeholder="e.g., 128GB"
                        value={newStorageName}
                        onChange={(e) => setNewStorageName(e.target.value)}
                        className="h-10 border-gray-300 focus:border-gray-900"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">Basic Price (৳) *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newStoragePrice}
                        onChange={(e) => setNewStoragePrice(e.target.value)}
                        className="h-10 border-gray-300 focus:border-gray-900"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <Label className="text-sm font-semibold text-gray-700">Short Details</Label>
                      <Input
                        type="text"
                        placeholder="Info"
                        value={newStorageShortDetails}
                        onChange={(e) => setNewStorageShortDetails(e.target.value)}
                        className="h-10 border-gray-300 focus:border-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-10">
                        <Switch
                          checked={newStorageInStock}
                          onCheckedChange={setNewStorageInStock}
                          id="storageStock"
                        />
                        <Label htmlFor="storageStock" className="text-xs font-medium cursor-pointer whitespace-nowrap">
                          {newStorageInStock ? 'In' : 'Out'}
                        </Label>
                      </div>
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <Button
                        onClick={handleAddStorage}
                        disabled={!newStorageName || !newStoragePrice}
                        className="w-full h-10 bg-gray-900 hover:bg-black disabled:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {storageConfigs.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                      {storageConfigs.map((storage) => (
                        <Card key={storage.id} className="border-2 border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="font-mono text-sm px-3 py-1.5 bg-gray-50 border-gray-300">
                                  {storage.name}
                                </Badge>
                                <span className="text-sm font-bold text-green-600">
                                  ৳{storage.basicPrice}
                                </span>
                                <Input
                                  type="text"
                                  placeholder="Details"
                                  value={storage.shortDetails}
                                  onChange={(e) => handleStorageConfigChange(storage.id, 'shortDetails', e.target.value)}
                                  className="h-8 w-40 text-sm border-gray-300"
                                />
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={storage.inStock}
                                    onCheckedChange={(checked) => handleStorageConfigChange(storage.id, 'inStock', checked)}
                                    id={`storage-${storage.id}`}
                                  />
                                  <Label htmlFor={`storage-${storage.id}`} className="text-xs font-medium cursor-pointer">
                                    {storage.inStock ? 'In' : 'Out'}
                                  </Label>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveStorage(storage.id)}
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="mt-4">
                              <Label className="text-sm font-semibold mb-3 block text-gray-700">Color-wise Pricing & Stock</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {imageConfigs.map(color => (
                                  <div key={color.id} className="flex items-center justify-between p-3 border-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all">
                                    <div className="flex items-center gap-2 flex-1">
                                      <div 
                                        className="w-7 h-7 rounded-lg border-2 border-white shadow-md flex-shrink-0"
                                        style={{ backgroundColor: color.colorHex }}
                                      />
                                      <span className="text-sm font-medium text-gray-700 truncate">{color.colorName}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        placeholder="Price"
                                        value={storage.prices[color.id] || ''}
                                        onChange={(e) => handlePriceChange(storage.id, color.id, e.target.value)}
                                        className="h-8 w-20 text-xs border-gray-300"
                                        required
                                      />

                                      <Switch
                                        checked={storage.colorStocks?.[color.id] ?? true}
                                        onCheckedChange={(checked) => handleColorStockChange(storage.id, color.id, checked)}
                                        id={`stock-${storage.id}-${color.id}`}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
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

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold text-gray-800">Dynamic Options</h3>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <DynamicInputForm forms={dynamicInputForms} setForms={setDynamicInputForms} />
                </CardContent>
              </Card>
            </section>

            <Separator className="my-8" />

            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-900" />
                  <h3 className="text-xl font-semibold text-gray-800">Product Details</h3>
                  <Badge className="bg-gray-900 text-white">{details.length} specs</Badge>
                </div>
                <Button onClick={addDetail} variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Detail
                </Button>
              </div>
              
              {details.length > 0 ? (
                <div className="space-y-3">
                  {details.map((detail) => (
                    <Card key={detail.id} className="border-2 border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Input
                            type="text"
                            placeholder="Label (e.g., Display)"
                            value={detail.label}
                            onChange={(e) => handleDetailChange(detail.id, 'label', e.target.value)}
                            className="flex-1 h-10 border-gray-300 focus:border-gray-900"
                          />
                          <Input
                            type="text"
                            placeholder="Value (e.g., 6.1-inch OLED)"
                            value={detail.value}
                            onChange={(e) => handleDetailChange(detail.id, 'value', e.target.value)}
                            className="flex-1 h-10 border-gray-300 focus:border-gray-900"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDetail(detail.id)}
                            className="h-10 w-10 text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No product details added yet</p>
                  </CardContent>
                </Card>
              )}
            </section>

            <Separator className="my-8" />

            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold text-gray-800">Product Description</h3>
              </div>
              <TiptapEditor onContentChange={setDescription} />
              <p className="text-sm text-gray-500 mt-3 italic">
                Use the rich text editor to create a detailed product description with images, videos, and formatted text
              </p>
            </section>

            <div className="pt-6">
              <Button
                onClick={handleAddProduct}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all"
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

    </AdminManagementProvider>
   
  );
};

export default ProductManager;