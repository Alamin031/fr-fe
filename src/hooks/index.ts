// Export all custom hooks
export { useAuth, useRequireAuth, useRequireAdmin, useHasPermission, useIsAdmin } from './useAuth';
export { useProducts, useFeaturedProducts, useNewProducts, useHotProducts, useProductBySlug, useSearchProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useProductReviews, useProductFAQs } from './useProducts';
export { useCategories, useFeaturedCategories, useCategoryBySlug, useCategoryProducts, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategories';
export { useBrands, useFeaturedBrands, useBrandBySlug, useBrandProducts, useCreateBrand, useUpdateBrand, useDeleteBrand } from './useBrands';
export { useOrders, useOrderById, useCreateOrder, useUpdateOrderStatus, useGetInvoice, useCalculateEMI } from './useOrders';
export { useWishlist, useAddToWishlist, useRemoveFromWishlist } from './useWishlist';
export { useCompare, useAddToCompare, useRemoveFromCompare } from './useCompare';
export { useProductReviews as useReviews, useCreateReview, useDeleteReview } from './useReviews';
