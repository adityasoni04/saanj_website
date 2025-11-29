import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createProduct, getProducts, getAdminProducts, ProductApiResponse, getFeaturedProducts, updateProduct, getProductById, deleteProduct } from '@/services/product'; // Adjust path
import { toast } from 'react-hot-toast'; // Or your toast library

// Define the structure for specifications
export interface Specification {
    label: string;
    value: string;
}

// Define the type for a product coming from the backend
export interface BackendProduct {
    _id: string; // MongoDB's default ID
    productId: string; // Your custom 7-character ID
    productName: string;
    description: string;
    price: number;
    category: string; // Slug
    subcategory?: string; // Slug (Optional)
    features: string[];
    specifications: Specification[];
    images: string[]; // Array of image URLs
    originalPrice?: number; // Optional
    stock?: number; // Optional
    featured?: boolean; // Optional
    createdAt: string; // Added by timestamps: true
    updatedAt: string; // Added by timestamps: true
}


export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<
        any,
        Error,
        FormData
    >({
        mutationFn: (productFormData: FormData) => createProduct(productFormData),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product added successfully!');
            console.log('Product created:', data);
        },
        onError: (error: Error) => {
            console.error('Error creating product:', error);
            toast.error(error.message || 'Failed to add product.');
        },
    });
};

export const useGetProducts = (
    categorySlug?: string,
    subcategorySlug?: string,
    q?: string // <-- ADD THIS
) => {
    return useQuery<
        any[], // Replace 'any' with your BackendProduct type
        Error
    >({
        // Query key now includes all 3 filters to make it unique
        queryKey: ['products', categorySlug || 'all', subcategorySlug || 'none', q || 'no-query'],

        // Pass 'q' to the service function
        queryFn: () => getProducts(categorySlug, subcategorySlug, q),
    });
};

export const useGetAdminProducts = (
    page: number,
    q: string
) => {
    return useQuery<ProductApiResponse, Error>({
        queryKey: ['products', 'admin', { page, q }],
        queryFn: () => getAdminProducts(page, q),
        placeholderData: (previousData) => previousData,
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<
        any,
        Error,
        { productId: string; updateData: FormData }
    >({
        mutationFn: ({ productId, updateData }) => updateProduct(productId, updateData),

        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
            console.log('Product updated:', data);
        },

        onError: (error: Error) => {
            console.error('Error updating product:', error);
            toast.error(error.message || 'Failed to update product.');
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<
        any,
        Error,
        string
    >({
        mutationFn: (productId: string) => deleteProduct(productId),

        onSuccess: (data, productId) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data?.message || 'Product deleted successfully!');
            console.log('Product deleted:', productId);
        },

        onError: (error: Error) => {
            console.error('Error deleting product:', error);
            toast.error(error.message || 'Failed to delete product.');
        },
    });
};

export const useGetProductById = (productId?: string) => {
    return useQuery<
        BackendProduct, // Specify the expected data type
        Error           // Specify the error type
    >({
        // Query key includes the productId to make it unique per product
        queryKey: ['product', productId],

        // Query function calls the service with the productId
        // The '!' asserts productId is defined because 'enabled' is true
        queryFn: () => getProductById(productId!),

        // --- IMPORTANT ---
        // Only enable and run the query if a valid productId is provided
        enabled: !!productId,

    });
};

export const useGetFeaturedProducts = () => {
    return useQuery<
        BackendProduct[],
        Error
    >({
        queryKey: ['products', 'featured'],
        queryFn: getFeaturedProducts,
    });
};