'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle2, XCircle, Loader2, Trash2, Save, Download, Edit } from 'lucide-react';

interface MongoDBData {
  _id: string;
  section1: string[];
  section2: string[];
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function LandingPage() {
  const [uploading, setUploading] = useState(false);
  const [section1Images, setSection1Images] = useState<string[]>([]);
  const [section2Images, setSection2Images] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingData, setExistingData] = useState<MongoDBData | null>(null);

  // Fetch existing data on component mount
  useEffect(() => {
    fetchDataFromMongoDB();
  }, []);

  const fetchDataFromMongoDB = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/lendingbenar`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('📥 Fetched Data from MongoDB:', data);
        
        // Assuming your API returns an array, take the first item or handle accordingly
        if (Array.isArray(data) && data.length > 0) {
          const latestData = data[0]; // Get the first document
          setExistingData(latestData);
          setSection1Images(latestData.section1 || []);
          setSection2Images(latestData.section2 || []);
        } else if (data.section1) {
          // If it's a single object
          setExistingData(data);
          setSection1Images(data.section1 || []);
          setSection2Images(data.section2 || []);
        }
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      console.error('❌ Data Fetch Error:', err);
      setError('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, section: 1 | 2) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Section 1 এ শুধু 2টি ইমেজ allowed
    if (section === 1 && section1Images.length + files.length > 2) {
      setError('প্রথম সেকশনে সর্বোচ্চ ২টি ইমেজ আপলোড করতে পারবেন');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      try {
        await new Promise((resolve, reject) => {
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
                  uploadedUrls.push(data.url);
                  resolve(data.url);
                } else {
                  reject('No URL returned');
                }
              } catch (err) {
                console.error('📸 Image Upload Error:', err);
                reject(err);
              }
            }
          };
        });
      } catch (err) {
        console.error('Image upload failed:', err);
        setError('ইমেজ আপলোড করতে সমস্যা হয়েছে');
        setUploading(false);
        return;
      }
    }

    if (section === 1) {
      setSection1Images(prev => [...prev, ...uploadedUrls].slice(0, 2));
    } else {
      setSection2Images(prev => [...prev, ...uploadedUrls]);
    }

    setUploading(false);
    setSuccess(true);
    // Clear file input
    e.target.value = '';
  };

  const removeImage = (section: 1 | 2, index: number) => {
    if (section === 1) {
      setSection1Images(prev => prev.filter((_, i) => i !== index));
    } else {
      setSection2Images(prev => prev.filter((_, i) => i !== index));
    }
  };

  const saveToMongoDB = async () => {
    setSaving(true);
    setError(null);
    
    const dataToSave = {
      section1: section1Images,
      section2: section2Images,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/lendingbenar/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        setSuccess(true);
        setError(null);
        console.log('✅ Data saved to MongoDB:', dataToSave);
        // Refresh data after saving
        await fetchDataFromMongoDB();
      } else {
        throw new Error('Failed to save data');
      }
    } catch (err) {
      console.error('❌ MongoDB Save Error:', err);
      setError('MongoDB তে ডাটা সেভ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const updateInMongoDB = async () => {
    if (!existingData) {
      setError('আপডেট করার জন্য কোন ডাটা পাওয়া যায়নি');
      return;
    }

    setUpdating(true);
    setError(null);
    
    const dataToUpdate = {
      section1: section1Images,
      section2: section2Images,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/lendingbenar/${existingData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      if (res.ok) {
        setSuccess(true);
        setError(null);
        console.log('✅ Data updated in MongoDB:', dataToUpdate);
        // Refresh data after updating
        await fetchDataFromMongoDB();
      } else {
        throw new Error('Failed to update data');
      }
    } catch (err) {
      console.error('❌ MongoDB Update Error:', err);
      setError('MongoDB তে ডাটা আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setUpdating(false);
    }
  };

  const clearAllImages = () => {
    setSection1Images([]);
    setSection2Images([]);
    setError(null);
    setSuccess(false);
  };

  const hasChanges = () => {
    if (!existingData) return true;
    
    return (
      JSON.stringify(section1Images) !== JSON.stringify(existingData.section1) ||
      JSON.stringify(section2Images) !== JSON.stringify(existingData.section2)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            ইমেজ আপলোড সিস্টেম
          </h1>
          <p className="text-slate-600">
            দুইটি আলাদা সেকশনে ইমেজ আপলোড করুন এবং MongoDB তে সেভ করুন
          </p>
          
          {existingData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
              <p className="text-sm text-blue-700">
                সর্বশেষ আপডেট: {new Date(existingData.updatedAt).toLocaleString('bn-BD')}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Section 1: 2 Images Only */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>সেকশন ১ (সর্বোচ্চ ২টি ইমেজ)</span>
                <span className="text-sm font-normal text-slate-500">
                  {section1Images.length}/2
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                disabled={uploading || section1Images.length >= 2}
                onClick={() => document.getElementById('section1Input')?.click()}
                className="w-full mb-4"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আপলোড হচ্ছে...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    ইমেজ আপলোড করুন
                  </>
                )}
              </Button>

              <input
                type="file"
                id="section1Input"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 1)}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-3">
                {section1Images.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Section 1 - ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow"
                    />
                    <button
                      onClick={() => removeImage(1, idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Multiple Images */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>সেকশন ২ (আনলিমিটেড ইমেজ)</span>
                <span className="text-sm font-normal text-slate-500">
                  {section2Images.length} টি ইমেজ
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                disabled={uploading}
                onClick={() => document.getElementById('section2Input')?.click()}
                className="w-full mb-4"
                variant="secondary"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আপলোড হচ্ছে...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    একাধিক ইমেজ আপলোড করুন
                  </>
                )}
              </Button>

              <input
                type="file"
                id="section2Input"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 2)}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {section2Images.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Section 2 - ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow"
                    />
                    <button
                      onClick={() => removeImage(2, idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && !error && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>সফলভাবে সম্পন্ন হয়েছে!</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <Card className="shadow-lg">
          <CardContent className="p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-center ">
              
              <Button
                onClick={updateInMongoDB}
                disabled={updating || !existingData || !hasChanges()}
                className="w-full"
                size="lg"
                variant="secondary"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-5 w-5" />
                    আপডেট করুন
                  </>
                )}
              </Button>

              <Button
                onClick={fetchDataFromMongoDB}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                রিফ্রেশ করুন
              </Button>

              <Button
                onClick={clearAllImages}
                variant="destructive"
                className="w-full"
                size="lg"
                disabled={section1Images.length === 0 && section2Images.length === 0}
              >
                <Trash2 className="mr-2 h-5 w-5" />
                সব ডিলিট করুন
              </Button>
            </div>

            {/* Changes Indicator */}
            {existingData && !hasChanges() && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 text-center">
                  ✅ কোন পরিবর্তন নেই - ডাটা আপ-টু-ডেট
                </p>
              </div>
            )}

            {existingData && hasChanges() && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 text-center">
                  ⚠️ পরিবর্তন হয়েছে - আপডেট করুন
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Data Info */}
        {existingData && (
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle>বর্তমান ডাটা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>সেকশন ১:</strong> {existingData.section1.length} টি ইমেজ</p>
                  <p><strong>সেকশন ২:</strong> {existingData.section2.length} টি ইমেজ</p>
                </div>
                <div>
                  <p><strong>সর্বশেষ আপডেট:</strong> {new Date(existingData.updatedAt).toLocaleString('bn-BD')}</p>
                  <p><strong>আইডি:</strong> {existingData._id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}