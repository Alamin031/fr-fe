'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LandingPageDashboardFeaturesComponent = () => {
  const [products, setProducts] = useState([]);
  const [landingProducts, setLandingProducts] = useState([]); // holds landing docs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPriceBDT = (price) =>
    new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);

  // 🔹 Fetch main product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/product`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Fetch landing data
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/get`);
        const data = await res.json();
        setLandingProducts(data.data || []);
      } catch (err) {
        console.error('Failed to fetch landing data:', err);
      }
    };
    fetchLandingData();
  }, []);

  // 🔹 Add to Landing
  const handleAddToLanding = async (product) => {
    try {
      const payload = {
        name: product.name,
        price: product.basePrice,
        image: product.imageConfigs?.[0]?.image,
        category: product.category,
        productlink: product.productlinkname,
        id: product._id, // store main product id
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add product to landing');

      const result = await response.json();
      setLandingProducts((prev) => [...prev, result.product]);
      alert(`${product.name} added to landing successfully!`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // 🔹 Delete from Landing
  const handleRemoveFromLanding = async (productId) => {
    try {
      // find landing document by its product id
      const landingDoc = landingProducts.find((p) => p.id === productId);
      if (!landingDoc) return alert('Landing product not found');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URI}/landingetproduct/delete/${landingDoc._id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete product from landing');

      setLandingProducts((prev) => prev.filter((p) => p.id !== productId));
      alert('Product removed from landing successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // 🔹 Products not yet added to landing
  const isOnLanding = (productId) =>
    landingProducts.some((lp) => lp.id === productId);

  // 🔹 Render
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const inLanding = isOnLanding(product._id);
          return (
            <Card key={product._id} className="overflow-hidden">
              <img
                src={product.imageConfigs?.[0]?.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-lg font-bold text-green-600 mb-4">
                  {formatPriceBDT(product.basePrice)}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full text-white ${
                    inLanding ? 'bg-gray-400' : 'bg-black'
                  }`}
                  onClick={() =>
                    inLanding
                      ? handleRemoveFromLanding(product._id)
                      : handleAddToLanding(product)
                  }
                >
                  {inLanding ? 'Remove from Landing' : 'Add to Landing'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPageDashboardFeaturesComponent;
