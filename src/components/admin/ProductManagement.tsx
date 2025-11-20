import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Shadcn UI Toast
import { toast as sonnerToast } from "sonner"; // Sonner Toast for hook feedback
import ProductForm from "./ProductForm"; // Your updated form component
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAdminProducts, useGetProducts, useDeleteProduct } from "@/http-hooks/product"; // Import all needed hooks
import { Skeleton } from "@/components/ui/skeleton"; // <-- Make sure Skeleton is imported

// ... (BackendProduct interface) ...

// --- ADD THIS SKELETON COMPONENT ---
const ProductRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
    <TableCell className="text-right"><div className="flex justify-end gap-1"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
  </TableRow>
);
// Define a type matching your backend Mongoose schema for Product
interface BackendProduct {
  _id: string; // MongoDB ID
  productId: string; // Your custom product ID
  productName: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  features: string[];
  specifications: { label: string; value: string }[];
  images: string[]; // Array of image URLs
  originalPrice?: number;
  stock?: number;
  featured?: boolean;
  createdAt: string; // Timestamps
  updatedAt: string;
}

const ProductManagement = () => {
  // UI State
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);
  const { toast: shadcnToast } = useToast(); // For potential Shadcn specific toasts if needed

  // --- Data Fetching ---
  // const { data: productList = [], isLoading: isLoadingProducts, isError, error } = useGetProducts();
  const { data, isLoading: isLoadingProducts, isError, error } = useGetAdminProducts(page, debouncedSearchQuery);
  const { mutateAsync: deleteProductMutate, isPending: isDeleting } = useDeleteProduct();

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // --- Error Handling for Fetch ---
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching products:", error);
      sonnerToast.error(error.message || "Failed to fetch products."); // Use Sonner for hook feedback
    }
  }, [isError, error]);

  // --- Delete Action ---
  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        // Call the mutation hook, passing the productId
        await deleteProductMutate(selectedProduct.productId);
        // Success toast is handled by the hook's onSuccess
        setIsDeleteDialogOpen(false); // Close confirmation modal on success
        setSelectedProduct(null);   // Clear selection
      } catch (deleteError: any) {
        // Error toast is handled by the hook's onError
        console.error("Delete failed in component:", deleteError);
        // Decide if you want to keep the modal open on error
        // setIsDeleteDialogOpen(false);
        // setSelectedProduct(null);
      }
    }
  };

  // --- Dialog Openers ---
  const openEditDialog = (product: BackendProduct) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };
  const openDeleteDialog = (product: BackendProduct) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // --- Filtering Logic ---
  // const filteredProducts = productList.filter((product: BackendProduct) =>
  //   (product.productName && product.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //   (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  // );

  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Added padding */}
      {/* Search Bar and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 w-full sm:w-auto sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search products"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-background rounded-lg border border-border overflow-x-auto"> {/* Added overflow-x-auto */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] sm:w-[100px]">Image</TableHead> {/* Adjusted width */}
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Subcategory</TableHead> {/* Hide on small screens */}
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingProducts ? (
              <>
                <ProductRowSkeleton />
                <ProductRowSkeleton />
                <ProductRowSkeleton />
                <ProductRowSkeleton />
                <ProductRowSkeleton />
              </>
            ) : isError ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-destructive">Error loading products. Please try again.</TableCell></TableRow>
            ) : products.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No products found.</TableCell></TableRow>
            ) : (
              products.map((product: BackendProduct) => (
                <TableRow key={product.productId}> {/* Use unique backend ID */}
                  <TableCell>
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'} // Use placeholder
                      alt={product.productName || 'Product Image'}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md bg-muted" // Adjusted size
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} // Fallback for broken image links
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.productName || 'N/A'}</TableCell>
                  <TableCell className="capitalize">{product.category?.replace(/-/g, ' ') || 'N/A'}</TableCell>
                  <TableCell className="capitalize hidden sm:table-cell">{product.subcategory || '-'}</TableCell> {/* Hide on small screens */}
                  <TableCell>₹{product.price?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button aria-label="Edit Product" variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button aria-label="Delete Product" variant="ghost" size="icon" onClick={() => openDeleteDialog(product)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct} // Pass data for editing
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedProduct(null); // Clear selection on cancel
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{selectedProduct?.productName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting} // Disable Cancel while deleting
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isDeleting} // Use isDeleting state
            >
              {isDeleting ? "Deleting..." : "Delete"} {/* Show loading text */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductManagement;