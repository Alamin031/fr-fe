# Implementation Guide - API Services & Components

## 📋 What's Been Created

### 1. **Type Definitions** (`src/types/index.ts`)
- 25+ TypeScript interfaces for all data models
- Complete type safety for API requests/responses
- Includes PaginatedResponse, ApiError, ApiResponse wrappers

### 2. **API Services** (`src/services/`)
13 service modules:
- `api-client.ts` - Axios instance with auth interceptors
- `auth.service.ts` - Authentication endpoints
- `users.service.ts` - User management, wishlist, compare
- `products.service.ts` - Product CRUD and filtering
- `categories.service.ts` - Category management
- `brands.service.ts` - Brand management
- `orders.service.ts` - Orders, EMI calculation
- `reviews.service.ts` - Product reviews
- `warranty.service.ts` - Warranty management
- `loyalty.service.ts` - Loyalty points
- `faqs.service.ts` - FAQ management
- `giveaways.service.ts` - Giveaway entries
- `policies.service.ts` - Policy pages
- `seo.service.ts` - SEO metadata and sitemap

### 3. **React Query Hooks** (`src/hooks/`)
8 custom hook modules with 50+ hooks:
- `useProducts` - Product queries and mutations
- `useCategories` - Category queries
- `useBrands` - Brand queries
- `useOrders` - Order management
- `useWishlist` - Wishlist operations
- `useCompare` - Product comparison
- `useReviews` - Review management
- `useAuth` - Already existed, now integrated

### 4. **Ready-to-Use Components** (`src/components/`)
- `ProductCard` - Individual product card with wishlist button
- `ProductGrid` - Grid layout with loading/error states
- `ProductDetails` - Full product page with options
- `CategoryCard` - Category card
- `CategoryGrid` - Category grid

## 🚀 Quick Start

### Step 1: Configure API Base URL

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Or use the provided `.env.example` as template:
```bash
cp .env.example .env.local
```

### Step 2: Ensure Backend is Running

Your backend should have these endpoints available:
- `/api/products` - GET/POST
- `/api/categories` - GET/POST
- `/api/brands` - GET/POST
- `/api/orders` - GET/POST
- `/api/users` - GET/POST
- And all others listed in your API documentation

### Step 3: Use in Components

#### Option A: Using React Query Hooks (Recommended)

```typescript
'use client';

import { useProducts, useFeaturedCategories } from '@/hooks';
import { ProductGrid, CategoryGrid } from '@/components';

export default function HomePage() {
  const { data: products, isLoading, error } = useProducts();
  const { data: categories } = useFeaturedCategories();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <CategoryGrid categories={categories || []} />
      <ProductGrid products={products?.data || []} />
    </>
  );
}
```

#### Option B: Direct Service Usage

```typescript
'use client';

import { useEffect, useState } from 'react';
import { productsService } from '@/services';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    productsService
      .getAll()
      .then(res => setProducts(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 📁 File Structure

```
src/
├── types/
│   └── index.ts                 # All TypeScript definitions (481 lines)
├── services/
│   ├── api-client.ts           # Axios configuration
│   ├── auth.service.ts         # Auth endpoints
│   ├── users.service.ts        # User management
│   ├── products.service.ts     # Product CRUD
│   ├── categories.service.ts   # Category CRUD
│   ├── brands.service.ts       # Brand CRUD
│   ├── orders.service.ts       # Order management
│   ├── reviews.service.ts      # Reviews
│   ├── warranty.service.ts     # Warranty
│   ├── loyalty.service.ts      # Loyalty points
│   ├── faqs.service.ts         # FAQs
│   ├── giveaways.service.ts    # Giveaways
│   ├── policies.service.ts     # Policies
│   ├── seo.service.ts          # SEO
│   ├── index.ts                # Service exports
│   └── README.md               # Service documentation
├── hooks/
│   ├── useProducts.ts          # Product hooks
│   ├── useCategories.ts        # Category hooks
│   ├── useBrands.ts            # Brand hooks
│   ├── useOrders.ts            # Order hooks
│   ├── useWishlist.ts          # Wishlist hooks
│   ├── useCompare.ts           # Compare hooks
│   ├── useReviews.ts           # Review hooks
│   ├── useAuth.ts              # Auth hooks (existing + integrated)
│   └── index.ts                # Hook exports
└── components/
    ├── products/
    │   ├── ProductCard.tsx     # Product card
    │   ├── ProductGrid.tsx     # Product grid
    │   └── ProductDetails.tsx  # Product details
    └── categories/
        ├── CategoryCard.tsx    # Category card
        └── CategoryGrid.tsx    # Category grid
```

## 🔑 Key Features

### ✅ Type Safety
- Full TypeScript support for all APIs
- IntelliSense in your IDE
- Compile-time error checking

### ✅ Data Caching
- React Query handles caching automatically
- Configurable stale time for each query
- Automatic refetching

### ✅ Error Handling
- Global error handling via API client interceptor
- Per-query error states
- Automatic 401 redirect on auth failure

### ✅ Mutations
- Loading states for create/update/delete
- Automatic cache invalidation
- Optimistic updates support

### ✅ Components
- Responsive design
- Loading skeleton states
- Error boundaries
- Wishlist integration
- Product options (color, storage, etc.)

## 📝 Common Patterns

### 1. Fetch Data with Loading States

```typescript
const { data, isLoading, error } = useProducts({ categoryId: 'cat1' });

return (
  <ProductGrid 
    products={data?.data || []} 
    isLoading={isLoading} 
    error={error} 
  />
);
```

### 2. Create/Update Operations

```typescript
const { mutate, isPending } = useCreateProduct();

const handleCreate = async (productData) => {
  mutate(productData, {
    onSuccess: () => {
      // Product created
      toast.success('Product created!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};
```

### 3. Search Products

```typescript
const [query, setQuery] = useState('');
const { data: results } = useSearchProducts(query);

return (
  <>
    <input 
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
    <ProductGrid products={results || []} />
  </>
);
```

### 4. Add to Wishlist

```typescript
const { mutate: addToWishlist } = useAddToWishlist();
const { data: wishlist } = useWishlist(userId);

const handleAddToWishlist = (productId) => {
  addToWishlist(
    { userId, productId },
    {
      onSuccess: () => toast.success('Added to wishlist!')
    }
  );
};

const isInWishlist = wishlist?.some(item => item.productId === productId);
```

## 🔒 Authentication Integration

The API client automatically includes auth from NextAuth:

```typescript
// In api-client.ts, the request interceptor gets the session:
const session = await getSession();
if (session?.user) {
  // You can add auth headers here if your backend uses JWT
  // config.headers.Authorization = `Bearer ${session.user.token}`;
}
```

If your backend uses JWT tokens, update `src/services/api-client.ts`:

```typescript
// After getting session
if (session?.user && 'token' in session.user) {
  config.headers.Authorization = `Bearer ${session.user.token}`;
}
```

## 📱 Responsive Design

All components are fully responsive:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

```typescript
// ProductGrid uses Tailwind responsive classes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

## 🧪 Testing

To test the integration:

1. Verify `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
2. Check backend is running at that URL
3. Create a test page:

```typescript
import { useProducts } from '@/hooks';

export default function TestPage() {
  const { data, isLoading, error } = useProducts();

  return (
    <div>
      <h1>API Test</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Loaded {data.data.length} products</p>}
    </div>
  );
}
```

## 🐛 Troubleshooting

### "Failed to fetch: 404"
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify backend is running
- Check endpoint paths in services

### "CORS error"
- Backend needs to allow requests from your frontend domain
- Check backend CORS configuration

### "Type errors"
- Make sure to import types from `@/types`
- Rebuild TypeScript: `npm run build`

### "Blank pages with no data"
- Check Network tab in DevTools
- Verify API responses match type definitions
- Check React Query DevTools (optional: @tanstack/react-query-devtools)

## 🚢 Deployment

1. Set `NEXT_PUBLIC_API_BASE_URL` in your hosting platform (Vercel, Netlify, etc.)
2. Ensure backend is deployed and accessible
3. Test API endpoints from production domain
4. Monitor for CORS issues

## 📚 Additional Documentation

- See `src/services/README.md` for detailed service documentation
- Check `src/types/index.ts` for all type definitions
- Review individual hook files for usage examples
- Component files have inline JSDoc comments

## 🎯 Next Steps

1. ✅ Configure API base URL
2. ✅ Test with a simple page
3. ✅ Integrate into existing pages
4. ✅ Add error handling and toasts
5. ✅ Add loading states
6. ✅ Implement cart functionality
7. ✅ Add checkout flow
8. ✅ Setup admin dashboard

## 💬 Questions?

Refer to:
- React Query docs: https://tanstack.com/query/latest
- Axios docs: https://axios-http.com/
- TypeScript handbook: https://www.typescriptlang.org/docs/
