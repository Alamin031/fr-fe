# API Services Layer

Complete TypeScript-based services layer for all backend APIs.

## Overview

- **API Client**: Axios-based HTTP client with automatic auth and error handling
- **Services**: 13 service modules covering all backend endpoints
- **React Hooks**: Custom React Query hooks for data fetching and mutations
- **Type Definitions**: Comprehensive TypeScript types for all models

## Configuration

Set your backend API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
# or for production:
# NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com/api
```

## Services

### 1. Authentication Service
```typescript
import { authService } from '@/services';

// Register new user
await authService.register({ username, email, password });

// Login
await authService.login({ email, password });

// Social login
await authService.socialLogin({ provider: 'google', token });

// Get current user
await authService.getCurrentUser();
```

### 2. Products Service
```typescript
import { productsService } from '@/services';

// Get all products with filters
await productsService.getAll({ 
  categoryId, 
  brandId, 
  minPrice, 
  maxPrice,
  sort: 'newest'
});

// Get by slug
await productsService.getBySlug('iphone-15-pro');

// Featured products
await productsService.getFeatured();

// Search
await productsService.search('iphone');

// Create (admin)
await productsService.create({ name, basePrice, ... });

// Update (admin)
await productsService.update(id, data);

// Delete (admin)
await productsService.delete(id);
```

### 3. Categories Service
```typescript
import { categoriesService } from '@/services';

// Get all categories
await categoriesService.getAll();

// Get featured categories
await categoriesService.getFeatured();

// Get products in category
await categoriesService.getProducts('smartphones', filters);

// CRUD operations (admin)
await categoriesService.create(data);
await categoriesService.update(id, data);
await categoriesService.delete(id);
```

### 4. Brands Service
```typescript
import { brandsService } from '@/services';

// Similar to categories
await brandsService.getAll();
await brandsService.getFeatured();
await brandsService.getProducts('apple', filters);
```

### 5. Orders Service
```typescript
import { ordersService } from '@/services';

// Create order
await ordersService.create({
  items: [{ productId, quantity, ... }],
  customer: { name, phone, ... }
});

// Get orders
await ordersService.getAll(page, limit);
await ordersService.getById(id);

// Update status (admin)
await ordersService.updateStatus(id, 'shipped');

// Calculate EMI
await ordersService.calculateEMI(amount, months);

// Get invoice
const invoice = await ordersService.getInvoice(id);
```

### 6. Users Service
```typescript
import { usersService } from '@/services';

// User CRUD
await usersService.getAll();
await usersService.getById(id);
await usersService.update(id, data);
await usersService.delete(id);

// Wishlist
await usersService.getWishlist(userId);
await usersService.addToWishlist(userId, productId);
await usersService.removeFromWishlist(userId, productId);

// Compare
await usersService.getCompare(userId);
await usersService.addToCompare(userId, productId);
await usersService.removeFromCompare(userId, productId);

// Orders
await usersService.getOrders(userId);
```

### 7. Reviews Service
```typescript
import { reviewsService } from '@/services';

// Create review
await reviewsService.create({ 
  productId, 
  rating: 5, 
  comment: '...' 
});

// Get reviews by product
await reviewsService.getByProduct(productId);

// Delete (admin)
await reviewsService.delete(id);
```

### 8. Warranty Service
```typescript
import { warrantyService } from '@/services';

// Activate warranty
await warrantyService.activate({
  imei, serial, phone, productId
});

// Lookup warranty
await warrantyService.lookup({ imei });

// Get logs (admin)
await warrantyService.getLogs(warrantyId);
```

### 9. Loyalty Service
```typescript
import { loyaltyService } from '@/services';

// Get points
await loyaltyService.getPoints(userId);

// Redeem points
await loyaltyService.redeem(userId, { points: 100 });
```

### 10. FAQs Service
```typescript
import { faqsService } from '@/services';

// Get FAQs
await faqsService.getAll(productId);
await faqsService.getById(id);

// CRUD (admin)
await faqsService.create({ question, answer, ... });
await faqsService.update(id, data);
await faqsService.delete(id);
```

### 11. Giveaways Service
```typescript
import { giveawaysService } from '@/services';

// Create entry
await giveawaysService.create({ name, email, phone, ... });

// Get entries (admin)
await giveawaysService.getAll(page, limit);

// Export (admin)
const blob = await giveawaysService.export();
```

### 12. Policies Service
```typescript
import { policiesService } from '@/services';

// Get policies
await policiesService.getAll();
await policiesService.getBySlug('privacy-policy');

// CRUD (admin)
await policiesService.create(data);
await policiesService.update(slug, data);
await policiesService.delete(slug);
```

### 13. SEO Service
```typescript
import { seoService } from '@/services';

// Get SEO metadata
await seoService.getProductSEO(id);
await seoService.getCategorySEO(id);
await seoService.getBrandSEO(id);

// Generate sitemap
await seoService.getSitemap();
```

## React Hooks

### Products Hooks
```typescript
import { 
  useProducts, 
  useFeaturedProducts, 
  useProductBySlug,
  useSearchProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useProductReviews,
  useProductFAQs
} from '@/hooks';

// Usage in component
function ProductsPage() {
  const { data, isLoading, error } = useProducts({ categoryId: '1' });
  const { mutate: createProduct } = useCreateProduct();
  
  return (
    // render products
  );
}
```

### Categories Hooks
```typescript
import { useCategories, useFeaturedCategories, useCategoryBySlug, useCategoryProducts } from '@/hooks';

const { data: categories } = useCategories();
const { data: products } = useCategoryProducts('smartphones');
```

### Other Hooks
```typescript
import { 
  useBrands,
  useOrders,
  useWishlist,
  useCompare,
  useReviews,
  useCreateOrder,
  useCalculateEMI
} from '@/hooks';
```

## Components

Ready-to-use components:

### Product Components
- `ProductCard` - Individual product card
- `ProductGrid` - Grid of products with loading/error states
- `ProductDetails` - Full product details with options

### Category Components
- `CategoryCard` - Individual category card
- `CategoryGrid` - Grid of categories

## Type Definitions

All TypeScript types are defined in `src/types/index.ts`:

```typescript
import { Product, Category, Order, User, Review, ... } from '@/types';
```

## Error Handling

The API client automatically handles:
- 401 Unauthorized - Redirects to login
- Network errors - Returns ApiError with message
- Request/Response transformation

```typescript
try {
  await productsService.getAll();
} catch (error: any) {
  console.error(error.message); // "Failed to fetch products"
  console.error(error.statusCode); // 500
}
```

## Next Steps

1. **Set API URL** in `.env.local`
2. **Ensure backend is running** and endpoints are available
3. **Import services** in your components
4. **Use hooks** for data fetching in functional components
5. **Update auth token handling** if your backend uses JWT tokens

## Example Page

```typescript
'use client';

import { useProducts, useFeaturedCategories } from '@/hooks';
import { ProductGrid, CategoryGrid } from '@/components';

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useFeaturedCategories();
  const { data: products, isLoading: productsLoading } = useProducts();

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6">Categories</h2>
        <CategoryGrid 
          categories={categories?.data || []} 
          isLoading={categoriesLoading}
        />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <ProductGrid 
          products={products?.data || []} 
          isLoading={productsLoading}
        />
      </section>
    </div>
  );
}
```

## Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [NextAuth.js Documentation](https://next-auth.js.org/)
