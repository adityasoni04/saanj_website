import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { categories, Subcategory } from "@/data/categories"; // Import Subcategory type
import { X, Plus } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/http-hooks/product"; // Adjust path as needed

// --- Type Definitions ---
interface Specification {
    label: string;
    value: string;
}
interface BackendProduct {
    _id: string;
    productId: string;
    productName: string;
    description: string;
    price: number;
    category: string; // Stored as slug
    subcategory?: string; // Stored as slug
    features: string[];
    specifications: Specification[];
    images: string[];
    originalPrice?: number;
    stock?: number;
    featured?: boolean;
}
interface ProductFormData {
    productName: string;
    description: string;
    price: number;
    category: string; // Slug
    subcategory?: string; // Slug
    features: string[];
    specifications: Specification[];
    existingImageUrls: string[];
    imageFiles: (File | null)[];
}
interface ProductFormProps {
    onCancel: () => void;
    product?: BackendProduct | null;
}

// --- Component ---
const ProductForm = ({ onCancel, product }: ProductFormProps) => {
    const isEditMode = !!product;
    const { mutateAsync: addProduct, isPending: isCreating } = useCreateProduct();
    const { mutateAsync: updateProductMutate, isPending: isUpdating } = useUpdateProduct();
    const isLoading = isCreating || isUpdating;

    const [formData, setFormData] = useState<ProductFormData>({
        productName: "", description: "", price: 0, category: "", subcategory: "",
        features: [""], specifications: [{ label: "", value: "" }],
        existingImageUrls: [], imageFiles: [null],
    });

    // State for the dynamic subcategory options
    const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

    // Effect to populate form when editing
    useEffect(() => {
        if (isEditMode && product) {
            const currentCategory = categories.find(cat => cat.slug === product.category);
            setFormData({
                productName: product.productName || "",
                description: product.description || "",
                price: product.price || 0,
                category: product.category || "",
                subcategory: product.subcategory || "", // Pre-populate subcategory slug
                features: product.features?.length > 0 ? product.features : [""],
                specifications: product.specifications?.length > 0 ? product.specifications : [{ label: "", value: "" }],
                existingImageUrls: product.images || [],
                imageFiles: [null],
            });
            // Set initial subcategories based on the loaded product's category
            setAvailableSubcategories(currentCategory?.subcategories || []);
        } else if (!isEditMode) {
            // Reset form for Add mode
            setFormData({
                productName: "", description: "", price: 0, category: "", subcategory: "",
                features: [""], specifications: [{ label: "", value: "" }],
                existingImageUrls: [], imageFiles: [null],
            });
            setAvailableSubcategories([]); // Reset subcategories
        }
    }, [product, isEditMode]);

    // --- Input Handlers ---
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Update subcategories if the category changed
        if (name === 'category') {
            const selectedCategory = categories.find(cat => cat.slug === value);
            setAvailableSubcategories(selectedCategory?.subcategories || []);
            // Reset selected subcategory when main category changes
            setFormData(prev => ({ ...prev, subcategory: '' }));
        }
    };

    // --- Dynamic Array Handlers ---
    const addFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });
    const updateFeature = (index: number, value: string) => { const newFeatures = [...formData.features]; newFeatures[index] = value; setFormData({ ...formData, features: newFeatures }); };
    const removeFeature = (index: number) => { setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) }); };
    const addSpecification = () => setFormData({ ...formData, specifications: [...formData.specifications, { label: "", value: "" }] });
    const updateSpecification = (index: number, field: keyof Specification, value: string) => { const newSpecs = [...formData.specifications]; if (!newSpecs[index]) newSpecs[index] = { label: '', value: '' }; newSpecs[index] = { ...newSpecs[index], [field]: value }; setFormData({ ...formData, specifications: newSpecs }); };
    const removeSpecification = (index: number) => { setFormData({ ...formData, specifications: formData.specifications.filter((_, i) => i !== index) }); };
    const removeExistingImage = (index: number) => { setFormData(prev => ({ ...prev, existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== index) })); };

    // --- Dynamic Image Input Handlers ---
    const addImageInput = () => { setFormData(prev => ({ ...prev, imageFiles: [...prev.imageFiles, null] })); };
    const handleSingleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0] || null; const newImageFiles = [...formData.imageFiles]; newImageFiles[index] = file; setFormData(prev => ({ ...prev, imageFiles: newImageFiles })); };
    const removeImageInput = (index: number) => { if (formData.imageFiles.length <= 1) { setFormData(prev => ({ ...prev, imageFiles: [null] })); return; } setFormData(prev => ({ ...prev, imageFiles: prev.imageFiles.filter((_, i) => i !== index) })); };

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSend = new FormData();

        // Append standard fields
        dataToSend.append('productName', formData.productName);
        dataToSend.append('description', formData.description);
        dataToSend.append('price', formData.price.toString());
        dataToSend.append('category', formData.category); // Sends category slug
        if (formData.subcategory) dataToSend.append('subcategory', formData.subcategory); // Sends subcategory slug

        // Append features and specifications
        formData.features.forEach(f => { if (f.trim()) dataToSend.append('features', f.trim()); });
        const validSpecs = formData.specifications.filter(s => s.label.trim() && s.value.trim());
        dataToSend.append('specifications', JSON.stringify(validSpecs));

        // Append Images
        if (isEditMode) {
            formData.existingImageUrls.forEach(url => dataToSend.append('existingImageUrls', url));
        }
        formData.imageFiles.forEach(file => {
            if (file) { dataToSend.append('images', file); }
        });

        try {
            if (isEditMode && product) {
                await updateProductMutate({ productId: product.productId, updateData: dataToSend });
            } else {
                await addProduct(dataToSend);
            }
            onCancel();
        } catch (error) {
            console.error("Form submission failed:", error);
        }
    };

    // --- JSX ---
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid for top-level fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"> <Label htmlFor="productName">Product Name *</Label> <Input id="productName" name="productName" value={formData.productName} onChange={handleTextChange} required /> </div>
                <div className="md:col-span-2"> <Label htmlFor="description">Description *</Label> <Textarea id="description" name="description" value={formData.description} onChange={handleTextChange} rows={3} required /> </div>
                <div> <Label htmlFor="price">Price (₹) *</Label> <Input id="price" name="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })} required min="0" /> </div>
                <div>
                    <Label htmlFor="category">Category *</Label>
                    <select id="category" name="category" value={formData.category} onChange={handleTextChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                        <option value="">Select category</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)} {/* Uses slug as value */}
                    </select>
                </div>

                {/* --- Updated Subcategory Dropdown --- */}
                <div className="md:col-span-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <select
                        id="subcategory"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleTextChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!formData.category || availableSubcategories.length === 0}
                    >
                        <option value="">{availableSubcategories.length > 0 ? "Select subcategory (optional)" : "-- Select category first --"}</option>
                        {availableSubcategories.map((sub) => (
                            <option key={sub.id} value={sub.slug}> {/* Uses subcategory slug */}
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div> {/* End grid */}

            {/* --- IMAGE HANDLING SECTION --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between"> <Label className="text-base font-semibold">Product Images</Label> <Button type="button" variant="outline" size="sm" onClick={addImageInput} aria-label="Add another image input"> <Plus className="h-4 w-4 mr-1" /> Add Image </Button> </div>
                {isEditMode && formData.existingImageUrls.length > 0 && ( /* Existing images */ <div> <Label className="text-sm font-medium text-muted-foreground">Current Images (Click X to remove)</Label> <div className="flex flex-wrap gap-4 mt-2"> {formData.existingImageUrls.map((url, index) => ( <div key={index} className="relative w-24 h-auto"> <img src={url} alt={`Current ${index + 1}`} className="w-full h-24 object-cover rounded-md border bg-muted" /> <Button type="button" variant="destructive" size="icon" className="absolute top-0 right-0 h-6 w-6 rounded-full z-10 transform translate-x-1/3 -translate-y-1/3 p-1" onClick={() => removeExistingImage(index)} aria-label={`Remove image ${index + 1}`}> <X className="h-4 w-4" /> </Button> <p className="mt-1 text-xs text-muted-foreground break-all truncate" title={url}> {url.substring(url.lastIndexOf('/') + 1)} </p> </div> ))} </div> </div> )}
                <div className="space-y-3"> {/* Dynamic Image Inputs */} {formData.imageFiles.map((file, index) => ( <div key={index} className="flex gap-2 items-start"> <div className="flex-1 space-y-2"> <Label htmlFor={`image-${index}`} className="text-xs text-muted-foreground">{index === 0 && !isEditMode ? 'Primary Image *' : `Image ${index + 1}`}</Label> <Input id={`image-${index}`} type="file" accept="image/*" onChange={(e) => handleSingleFileChange(index, e)} className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" required={!isEditMode && index === 0 && !file} /> {file && (<div className="relative w-24 h-24 border rounded-md overflow-hidden bg-muted flex items-center justify-center mt-1"> <img src={URL.createObjectURL(file)} alt={`New preview ${index + 1}`} className="w-full h-full object-cover" onLoad={e => URL.revokeObjectURL(e.currentTarget.src)} /> </div>)} </div> {(formData.imageFiles.length > 1 || file) && (<Button type="button" variant="ghost" size="icon" onClick={() => removeImageInput(index)} className="hover:bg-destructive/10 hover:text-destructive shrink-0 mt-5" aria-label={`Remove image input ${index + 1}`}> <X className="h-4 w-4" /> </Button>)} </div> ))} </div> <p className="text-xs text-muted-foreground mt-1">First image uploaded will be the primary image.</p>
            </div>

            {/* --- Features --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between"> <Label className="text-base font-semibold">Features</Label> <Button type="button" variant="outline" size="sm" onClick={addFeature} aria-label="Add new feature"> <Plus className="h-4 w-4 mr-1" /> Add Feature </Button> </div>
                <div className="space-y-2"> {formData.features.map((feature, index) => ( <div key={index} className="flex gap-2 items-center"> <Input value={feature} onChange={(e) => updateFeature(index, e.target.value)} placeholder={`Feature ${index + 1}`} aria-label={`Feature ${index + 1}`} /> <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="hover:bg-destructive/10 hover:text-destructive shrink-0" aria-label={`Remove feature ${index + 1}`}> <X className="h-4 w-4" /> </Button> </div> ))} </div>
            </div>

            {/* --- Specifications --- */}
            <div className="space-y-4">
                <div className="flex items-center justify-between"> <Label className="text-base font-semibold">Specifications</Label> <Button type="button" variant="outline" size="sm" onClick={addSpecification} aria-label="Add new specification"> <Plus className="h-4 w-4 mr-1" /> Add Spec </Button> </div>
                <div className="space-y-2"> {formData.specifications.map((spec, index) => ( <div key={index} className="flex gap-2 items-center"> <Input value={spec.label} onChange={(e) => updateSpecification(index, "label", e.target.value)} placeholder="Label" className="flex-1" aria-label={`Specification label ${index + 1}`} /> <Input value={spec.value} onChange={(e) => updateSpecification(index, "value", e.target.value)} placeholder="Value" className="flex-1" aria-label={`Specification value ${index + 1}`} /> <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(index)} className="hover:bg-destructive/10 hover:text-destructive shrink-0" aria-label={`Remove specification ${index + 1}`}> <X className="h-4 w-4" /> </Button> </div> ))} </div>
            </div>

            {/* --- Buttons --- */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}> Cancel </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Product" : "Add Product")}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;