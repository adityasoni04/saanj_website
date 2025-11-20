import { fetcher } from '../lib/fetcher';
import { BackendProduct } from "@/http-hooks/product"

export interface ProductApiResponse {
    products: BackendProduct[];
    page: number;
    totalPages: number;
    totalProducts: number;
}

export const createProduct = async (productFormData: any) => {
    return fetcher('/products', {
        method: 'POST',
        data: productFormData,
        headers: {
            'Content-Type': undefined,
        },
    });
};

export const getProducts = async (
    categorySlug?: string,
    subcategorySlug?: string,
    q?: string
) => {

    const params = new URLSearchParams();
    if (categorySlug) {
        params.append('categorySlug', categorySlug);
    }
    if (subcategorySlug) {
        params.append('subcategorySlug', subcategorySlug);
    }
    if (q) {
        params.append('q', q); // <-- ADD THIS
    }

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`; // e.g., /products?q=leather

    return fetcher(endpoint, {
        method: 'GET',
    });
};

export const getAdminProducts = async (
    page: number = 1,
    q: string = ""
): Promise<ProductApiResponse> => {

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '10');
    if (q) { params.append('q', q); }

    const queryString = params.toString();
    const endpoint = `/products/admin?${queryString}`;
    return fetcher(endpoint, { method: 'GET' });
};

export const updateProduct = async (productId: string, productUpdateData: FormData) => {
    return fetcher(`/products/${productId}`, {
        method: 'PUT',
        data: productUpdateData,
        headers: {
            'Content-Type': undefined,
        },
    });
};

export const deleteProduct = async (productId: string) => {
    return fetcher(`/products/${productId}`, { // Use the productId in the URL
        method: 'DELETE',
    });
};

export const getProductById = async (productId: string) => {
    if (!productId) {
        throw new Error("Product ID is required to fetch product details.");
    }
    return fetcher(`/products/${productId}`, {
        method: 'GET',
    });
};