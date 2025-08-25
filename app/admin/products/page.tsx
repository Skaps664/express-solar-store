"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/services/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

function safeJsonParse(val: string) {
  try {
    return val ? JSON.parse(val) : undefined
  } catch {
    return undefined
  }
}

function emptySpecGroup() {
  return { groupName: "", items: [{ name: "", value: "", unit: "" }] }
}
function emptyVariant() {
  return { label: "", sku: "", price: "", stock: "", images: [] }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [specifications, setSpecifications] = useState<any[]>([emptySpecGroup()])
  const [shippingInfo, setShippingInfo] = useState<any>({ freeShipping: false, estimatedDelivery: "", returnPolicy: "", warrantyService: "" })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any | null>(null)
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [relatedProductsSearch, setRelatedProductsSearch] = useState("");
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  
  // New state for multiple items
  const [parsedKeyFeatures, setParsedKeyFeatures] = useState<string[]>([]);
  const [parsedVideos, setParsedVideos] = useState<Array<{
    url: string;
    title: string;
    description?: string;
  }>>([]);
  const [parsedTags, setParsedTags] = useState<string[]>([]);
  const [docFiles, setDocFiles] = useState<Array<{file: File, type: string}>>([]);
  const [documentTypes, setDocumentTypes] = useState<Record<string, string>>({});
  
  const [editKeyFeatures, setEditKeyFeatures] = useState<string[]>([]);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editVideos, setEditVideos] = useState<string[]>([]);
  
  // Additional edit form state variables
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editViewCount, setEditViewCount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");
  const [editBrand, setEditBrand] = useState("");

  // Fetch all data on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get<{ success: boolean; products: any[] }>('/api/products/admin/all'),
      api.get<any[]>('/api/category/admin/all'),
      api.get<any[]>('/api/brands'),
    ])
      .then(([prodRes, catRes, brandRes]) => {
        if (!prodRes.data.success) {
          throw new Error('Failed to fetch products');
        }
        setProducts(prodRes.data.products)
        setCategories(catRes.data)
        setBrands(brandRes.data)
      })
      .catch(err => {
        console.error("Error fetching data:", err)
      })
      .finally(() => setLoading(false))
  }, [])

  // Debug effect to log when edit form state changes
  useEffect(() => {
    if (isEditDialogOpen && editProduct) {
      console.log("Edit dialog opened with state:", {
        editName,
        editDescription, 
        editPrice,
        editOriginalPrice,
        editStock,
        editCategory,
        editBrand,
        isFeatured,
        isBestSeller,
        isNewArrival,
        specifications: specifications.length,
        keyFeatures: editKeyFeatures.length,
        tags: editTags.length,
        videos: editVideos.length
      });
    }
  }, [isEditDialogOpen, editProduct, editName, editDescription, editPrice, editOriginalPrice, editStock, editCategory, editBrand, isFeatured, isBestSeller, isNewArrival]);

  // Effect to populate form when editProduct changes
  useEffect(() => {
    if (editProduct) {
      console.log("Populating form from useEffect for product:", editProduct.name);
      console.log("Product description from database:", editProduct.description);
      
      // Basic fields
      setEditName(editProduct.name || "");
      setEditDescription(editProduct.description || "");
      setEditPrice(editProduct.price?.toString() || "");
      setEditOriginalPrice(editProduct.originalPrice?.toString() || "");
      setEditStock(editProduct.stock?.toString() || "");
      setEditViewCount(editProduct.viewCount?.toString() || "0");
      
      // Category and brand - handle both object and string formats
      setEditCategory(typeof editProduct.category === 'object' ? editProduct.category?._id : editProduct.category || "");
      setEditSubCategory(typeof editProduct.subCategory === 'object' ? editProduct.subCategory?._id : editProduct.subCategory || "");
      setEditBrand(typeof editProduct.brand === 'object' ? editProduct.brand?._id : editProduct.brand || "");

      // Arrays (keyFeatures, tags, videos)
      const parseArrayField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field.map(item => item?.toString() || '');
        if (typeof field === "string") {
          try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed.map(item => item?.toString() || '') : [field];
          } catch {
            return field ? [field] : [];
          }
        }
        return [];
      };

      // Marketing flags
      setIsFeatured(Boolean(editProduct.isFeatured));
      setIsBestSeller(Boolean(editProduct.isBestSeller));
      setIsNewArrival(Boolean(editProduct.isNewArrival));

      // Handle arrays
      const keyFeatures = parseArrayField(editProduct.keyFeatures);
      const tags = parseArrayField(editProduct.tags);
      const videos = parseArrayField(editProduct.videos);

      setEditKeyFeatures(keyFeatures);
      setEditTags(tags);
      setEditVideos(videos);
      setParsedKeyFeatures(keyFeatures);
      setParsedTags(tags);
      setParsedVideos(videos.map((video, index) => {
        if (typeof video === 'string') {
          return {
            url: video,
            title: `Product Video ${index + 1}`,
            description: '',
          };
        }
        return video;
      }));

      // Handle specifications
      if (editProduct.specifications) {
        try {
          let specs = editProduct.specifications;
          if (typeof specs === 'string') {
            specs = JSON.parse(specs);
          }
          
          // Ensure specs is an array and has proper structure
          if (!Array.isArray(specs)) {
            specs = [specs].filter(Boolean);
          }

          // Log the specifications data for debugging
          console.log("Raw specifications:", specs);
          
          // Normalize the specifications structure
          const normalizedSpecs = specs.map((group: any) => ({
            groupName: group.groupName || '',
            items: Array.isArray(group.items) 
              ? group.items.map((item: any) => ({
                  name: item.name || '',
                  value: item.value || '',
                  unit: item.unit || ''
                }))
              : [{ name: '', value: '', unit: '' }]
          }));
          
          setSpecifications(normalizedSpecs.length > 0 ? normalizedSpecs : [emptySpecGroup()]);
          console.log("Setting specifications:", normalizedSpecs);
        } catch (error) {
          console.error("Error parsing specifications:", error);
          setSpecifications([emptySpecGroup()]);
        }
      } else {
        setSpecifications([emptySpecGroup()]);
      }

      // Handle shipping info
      const defaultShippingInfo = {
        freeShipping: false,
        estimatedDelivery: "",
        returnPolicy: "",
        warrantyService: "",
      };
      
      let shippingData = editProduct.shippingInfo;
      let finalShippingInfo = defaultShippingInfo;
      
      try {
        if (typeof shippingData === 'string') {
          shippingData = JSON.parse(shippingData);
        }
        
        // Ensure we have an object
        shippingData = typeof shippingData === 'object' ? shippingData : {};
        
        // Create the final shipping info object with all fields properly handled
        finalShippingInfo = {
          freeShipping: shippingData.freeShipping === true || shippingData.freeShipping === 'true' || false,
          estimatedDelivery: shippingData.estimatedDelivery || "",
          returnPolicy: shippingData.returnPolicy || "",
          warrantyService: shippingData.warrantyService || "",
        };
        
        console.log("Setting shipping info:", finalShippingInfo);
        setShippingInfo(finalShippingInfo);
        
      } catch (error) {
        console.error("Error parsing shipping info:", error);
        setShippingInfo(defaultShippingInfo);
      }

      // Related products
      setSelectedRelatedProducts(
        Array.isArray(editProduct.relatedProducts)
          ? editProduct.relatedProducts.map((p: any) => (typeof p === "object" ? p._id : p))
          : []
      );

      // Document types and files
      const documentTypesData: Record<string, string> = {};
      if (editProduct.documents || editProduct.documentTypes) {
        try {
          // Handle documents array
          let docs = editProduct.documents;
          if (typeof docs === 'string') {
            docs = JSON.parse(docs);
          }
          if (Array.isArray(docs)) {
            docs.forEach((doc: any) => {
              if (doc.name || doc.fileName) {
                documentTypesData[doc.name || doc.fileName] = doc.type || "";
              }
            });
          }

          // Handle documentTypes array
          let docTypes = editProduct.documentTypes;
          if (typeof docTypes === 'string') {
            docTypes = JSON.parse(docTypes);
          }
          if (Array.isArray(docTypes)) {
            docTypes.forEach((doc: any) => {
              if (doc.name) {
                documentTypesData[doc.name] = doc.type || "";
              }
            });
          }
        } catch (error) {
          console.error("Error parsing document data:", error);
        }
      }
      
      setDocumentTypes(documentTypesData);
      setDocFiles([]);

      console.log("Set form data:", {
        name: editProduct.name,
        description: editProduct.description?.length || 0,
        keyFeatures: keyFeatures.length,
        tags: tags.length,
        videos: videos.length,
        specifications: specifications.length,
        shippingInfo: finalShippingInfo,
        documents: Object.keys(documentTypesData).length
      });
    }
  }, [editProduct]);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.slug === selectedCategory ||
      product.category?._id === selectedCategory

    const matchesBrand =
      selectedBrand === "all" ||
      product.brand?.slug === selectedBrand ||
      product.brand?._id === selectedBrand

    return matchesSearch && matchesCategory && matchesBrand
  })

  // --- ADD PRODUCT ---
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    // Convert JSON fields properly
    formData.set("specifications", JSON.stringify(specifications.map(spec => ({
      groupName: spec.groupName,
      items: spec.items.map((item: { name: string; value: string; unit: string }) => ({
        name: item.name,
        value: item.value,
        unit: item.unit,
      }))
    }))));

    // Set key features from parsed state
    formData.set("keyFeatures", JSON.stringify(
      parsedKeyFeatures.filter(f => f.trim() !== "")
    ));

    // Set tags from parsed state
    formData.set("tags", JSON.stringify(
      parsedTags.filter(t => t.trim() !== "")
    ));

    // Set videos from parsed state
    formData.set("videos", JSON.stringify(
      parsedVideos.map(video => {
        if (typeof video === 'string') {
          return {
            url: video,
            title: `Product Video ${parsedVideos.indexOf(video) + 1}`,
            description: '',
            id: `video_${Date.now()}_${parsedVideos.indexOf(video)}`,
          };
        }
        return video;
      }).filter(Boolean)
    ));

    // Handle related products
    formData.set("relatedProducts", JSON.stringify(selectedRelatedProducts));

    // Handle boolean fields
    formData.set("isFeatured", isFeatured ? "true" : "false");
    formData.set("isBestSeller", isBestSeller ? "true" : "false");
    formData.set("isNewArrival", isNewArrival ? "true" : "false");

    // Add shipping info
    formData.set("shippingInfo", JSON.stringify(shippingInfo));

    // Handle documents with types - append actual files to FormData
    if (docFiles.length > 0) {
      // First append all document files
      docFiles.forEach((docFile, index) => {
        if (docFile.file && docFile.file.size > 0) {
          formData.append("documents", docFile.file);
        }
      });
      
      // Then append document types as metadata
      formData.set("documentTypes", JSON.stringify(
        docFiles.map(doc => ({
          name: doc.file.name,
          type: doc.type || 'other',
          size: Math.round(doc.file.size / 1024)
        }))
      ));
    }

    setLoading(true);
    try {
      await api.post('/api/products/create', formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        }
      });
      setIsAddDialogOpen(false);
      // Reset form state
      setSpecifications([emptySpecGroup()]);
      setShippingInfo({ freeShipping: false, estimatedDelivery: "", returnPolicy: "", warrantyService: "" });
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsNewArrival(false);
      setSelectedRelatedProducts([]);
      setRelatedProductsSearch("");
      setDocumentTypes({});
      
      const prodRes = await api.get<{ success: boolean; products: any[] }>('/api/products/admin/all');
      setProducts(prodRes.data.products || (prodRes.data as any));
    } catch (err: any) {
      console.error("Product creation error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to add product";
      alert(`Error: ${errorMessage}. ${err.response?.status === 401 ? "Please make sure you are logged in as an admin." : "Please check all required fields and try again."}`);
    } finally {
      setLoading(false);
    }
  }

  // --- EDIT PRODUCT ---
  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editProduct) return

    // Validate required fields more specifically
    const requiredFields = [
      { name: "name", value: editName, label: "Product Name" },
      { name: "price", value: editPrice, label: "Price" },
      { name: "stock", value: editStock, label: "Stock" },
      { name: "category", value: editCategory, label: "Category" },
      { name: "brand", value: editBrand, label: "Brand" }
    ];

    const missingFields = requiredFields.filter(field => !field.value || field.value.trim() === "");

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(", ")}`);
      return;
    }

    const form = e.currentTarget as HTMLFormData
    const formData = new FormData()

    // Set controlled form data explicitly
    formData.set("name", editName);
    formData.set("description", editDescription || ""); // Allow empty description
    formData.set("price", editPrice);
    formData.set("originalPrice", editOriginalPrice || "");
    formData.set("stock", editStock);
    formData.set("viewCount", editViewCount || "0");
    formData.set("category", editCategory);
    formData.set("brand", editBrand);

    // Handle subCategory field - explicitly omit it if empty to avoid MongoDB casting errors
    if (editSubCategory && editSubCategory !== "") {
      formData.set("subCategory", editSubCategory);
    }

    // Handle images from file input
    const imageInput = e.currentTarget.querySelector('input[name="images"]') as HTMLInputElement;
    if (imageInput?.files && imageInput.files.length > 0) {
      Array.from(imageInput.files).forEach(file => {
        formData.append("images", file);
      });
    }

    // Handle documents from file input
    const docInput = e.currentTarget.querySelector('input[name="documents"]') as HTMLInputElement;
    if (docInput?.files && docInput.files.length > 0) {
      Array.from(docInput.files).forEach(file => {
        formData.append("documents", file);
      });
      
      // Add document types for new uploads
      if (Object.keys(documentTypes).length > 0) {
        const validDocTypes = Object.keys(documentTypes)
          .filter(fileName => documentTypes[fileName].trim() !== '')
          .map(fileName => ({
            name: fileName,
            type: documentTypes[fileName],
          }));
          
        if (validDocTypes.length > 0) {
          formData.set("documentTypes", JSON.stringify(validDocTypes));
        }
      }
    }

    // Convert specifications properly - ensure valid structure
    try {
      if (!Array.isArray(specifications)) {
        throw new Error("Specifications is not an array");
      }
      
      // Format each specification group correctly and filter out empty ones
      const formattedSpecs = specifications
        .filter(spec => {
          // Keep groups that have a name or have items with data
          return spec.groupName || (spec.items && spec.items.some((item: any) => 
            item.name || item.value || item.unit
          ));
        })
        .map(spec => {
          const groupName = spec.groupName || "Specifications";
          
          // Filter and clean items
          const items = Array.isArray(spec.items) 
            ? spec.items
              .filter((item: any) => item.name || item.value || item.unit)
              .map((item: any) => ({
                name: item.name || "",
                value: item.value || "",
                unit: item.unit || "",
              }))
            : [];
          
          return { groupName, items };
        })
        .filter(spec => spec.items.length > 0); // Only include groups with items
      
      formData.set("specifications", JSON.stringify(formattedSpecs));
      console.log("Sending specifications:", formattedSpecs);
      
    } catch (e) {
      console.error("Error formatting specifications:", e);
      formData.set("specifications", JSON.stringify([]));
    }

    // Handle arrays (keyFeatures, tags, videos) with proper validation
    try {
      const sanitizeArray = (arr: any): string[] => {
        if (!arr) return [];
        if (Array.isArray(arr)) {
          return arr.filter(item => item && typeof item === 'string' && item.trim() !== "");
        }
        if (typeof arr === 'string') {
          try {
            const parsed = JSON.parse(arr);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [arr].filter(Boolean);
          } catch (e) {
            return arr.trim() ? [arr] : [];
          }
        }
        return [];
      };
      
      formData.set("keyFeatures", JSON.stringify(sanitizeArray(editKeyFeatures)));
      formData.set("tags", JSON.stringify(sanitizeArray(editTags)));
      formData.set("videos", JSON.stringify(
        editVideos.filter(video => video && video.trim() !== "").map((video, index) => {
          if (typeof video === 'string') {
            return {
              url: video,
              title: `Product Video ${index + 1}`,
              description: '',
              id: `video_${Date.now()}_${index}`,
            };
          }
          return video;
        })
      ));
      
    } catch (e) {
      console.error("Error processing array fields:", e);
      formData.set("keyFeatures", JSON.stringify(editKeyFeatures || []));
      formData.set("tags", JSON.stringify(editTags || []));
      formData.set("videos", JSON.stringify(editVideos || []));
    }

    // Handle related products
    formData.set("relatedProducts", JSON.stringify(selectedRelatedProducts));

    // Handle boolean fields - ensure they're always included in the form data
    formData.set("isFeatured", String(Boolean(isFeatured)));
    formData.set("isBestSeller", String(Boolean(isBestSeller)));
    formData.set("isNewArrival", String(Boolean(isNewArrival)));

    // Add shipping info
    formData.set("shippingInfo", JSON.stringify(shippingInfo));

    console.log("Edit form data being sent:");
    for (let [key, value] of formData.entries()) {
      if (key !== 'specifications') { // Don't log huge specifications object
        console.log(key, typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value);
      }
    }

    setLoading(true)
    try {
      await api.put(`/api/products/update/${editProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setIsEditDialogOpen(false)
      clearEditForm()
      const prodRes = await api.get<{ success: boolean; products: any[] }>('/api/products/admin/all')
      setProducts(prodRes.data.products || (prodRes.data as any))
    } catch (err: any) {
      console.error("Product update error:", err);
      console.error("Error response:", err?.response?.data);
      alert(`Failed to update product. Error: ${err?.response?.data?.message || err.message || "Please check all required fields and try again."}`)
    } finally {
      setLoading(false)
    }
  }

  // --- DELETE PRODUCT ---
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    setLoading(true)
    try {
      console.log("Deleting product with ID:", id)
      const deleteResponse = await api.delete(`/api/products/delete/${id}`)
      console.log("Delete response:", deleteResponse.data)
      
      console.log("Refetching products...")
      const prodRes = await api.get<{ success: boolean; products: any[] }>('/api/products/admin/all')
      console.log("Fetched products after deletion:", prodRes.data)
      
      const newProducts = prodRes.data.products || (prodRes.data as any)
      console.log("Setting new products:", newProducts.length, "products")
      setProducts(newProducts)
      
      alert("Product deleted successfully!")
    } catch (err: any) {
      console.error("Failed to delete product:", err)
      alert(`Failed to delete product: ${err?.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryStats = () => {
    return categories.map((category) => {
      // Compare category IDs properly, considering category might be an object or ID string
      const count = products.filter(p => {
        // Extract the category ID from various formats
        const productCategoryId = typeof p.category === 'object' ? p.category?._id : p.category;
        return productCategoryId === category._id;
      }).length;
      
      // Count active products using the same ID comparison approach
      const activeCount = products.filter(p => {
        const productCategoryId = typeof p.category === 'object' ? p.category?._id : p.category;
        return productCategoryId === category._id && p.status === "active";
      }).length;
      
      // If no explicit "status" field exists, all products are considered "active" by default
      const finalActiveCount = activeCount > 0 ? activeCount : count;
      
      return {
        ...category,
        count,
        activeCount: finalActiveCount,
        id: category._id, // Ensure we have an id property for the key prop in rendering
      };
    });
  };

  // Function to populate edit form
  const populateEditForm = (product: any) => {
    console.log("Populating edit form with product:", product);
    
    // Set the product which will trigger useEffect to populate the form
    setEditProduct(product);
    
    // Open dialog after a short delay to ensure state is set
    setTimeout(() => {
      console.log("Opening edit dialog...");
      setIsEditDialogOpen(true);
    }, 200);
  };

  // Function to clear edit form state
  const clearEditForm = () => {
    setEditProduct(null);
    
    // Clear all form state variables
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditOriginalPrice("");
    setEditStock("");
    setEditViewCount("");
    setEditCategory("");
    setEditSubCategory("");
    setEditBrand("");
    
    // Reset all complex data structures
    setSpecifications([emptySpecGroup()]);
    setShippingInfo({ 
      freeShipping: false, 
      estimatedDelivery: "", 
      returnPolicy: "", 
      warrantyService: "" 
    });
    
    // Reset flags
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(false);
    
    // Reset arrays
    setSelectedRelatedProducts([]);
    setEditKeyFeatures([]);
    setEditTags([]);
    setEditVideos([]);
    setParsedKeyFeatures([]);
    setParsedTags([]);
    setParsedVideos([]);
    
    // Reset search and document state
    setRelatedProductsSearch("");
    setDocumentTypes({});
    setDocFiles([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your solar energy product inventory.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill in the details below to add a new product.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Enter product name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Enter product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" required className="border rounded p-2">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subCategory">Subcategory</Label>
                  <select id="subCategory" name="subCategory" className="border rounded p-2">
                    <option value="">None</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <select id="brand" name="brand" required className="border rounded p-2">
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Pricing and Inventory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" required placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label>Pricing Note</Label>
                  <p className="text-sm text-gray-500">Use the Offers page to manage special pricing and discounts.</p>
                </div>
                <input type="hidden" name="viewCount" value="0" />
              </div>
              {/* Media */}
              <div className="grid gap-2">
                <Label htmlFor="images">Images</Label>
                <Input id="images" name="images" type="file" accept="image/*" multiple />
              </div>
              <div className="grid gap-2">
                <Label>YouTube Videos</Label>
                <div className="border rounded-md p-4">
                  <div className="mb-2 text-sm text-gray-500">
                    Paste YouTube video URLs (e.g., https://www.youtube.com/watch?v=xxxxx or https://youtu.be/xxxxx)
                  </div>
                  <div id="video-inputs" className="space-y-2 mb-3">
                    {Array.isArray(parsedVideos) && parsedVideos.map((video, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input 
                          value={video} 
                          onChange={e => {
                            const newVideos = [...parsedVideos];
                            let url = e.target.value;
                            // Convert youtu.be URLs to full format
                            if (url.includes('youtu.be/')) {
                              const id = url.split('youtu.be/')[1]?.split('?')[0];
                              if (id) {
                                url = `https://www.youtube.com/watch?v=${id}`;
                              }
                            }
                            // Extract video ID if full URL
                            if (url.includes('youtube.com/watch?v=')) {
                              const id = new URLSearchParams(url.split('?')[1]).get('v');
                              if (id) {
                                url = `https://www.youtube.com/watch?v=${id}`;
                              }
                            }
                            newVideos[idx] = url;
                            setParsedVideos(newVideos);
                          }}
                          placeholder="YouTube video URL"
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => {
                            const newVideos = parsedVideos.filter((_, i) => i !== idx);
                            setParsedVideos(newVideos);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setParsedVideos([...parsedVideos, ""])}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" /> Add Video
                  </Button>
                  <input 
                    type="hidden" 
                    name="videos" 
                    value={JSON.stringify(parsedVideos.filter(v => v.trim() !== ""))} 
                  />
                </div>
              </div>
              {/* Key Features */}
              <div className="grid gap-2">
                <Label>Key Features</Label>
                <div className="border rounded-md p-4">
                  {parsedKeyFeatures.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No key features added yet.</p>
                  ) : null}
                  <div id="keyfeature-inputs" className="space-y-2 mb-3">
                    {Array.isArray(parsedKeyFeatures) && parsedKeyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input 
                          value={feature} 
                          onChange={e => {
                            const newFeatures = [...parsedKeyFeatures];
                            newFeatures[idx] = e.target.value;
                            setParsedKeyFeatures(newFeatures);
                          }}
                          placeholder="Key feature"
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => {
                            const newFeatures = parsedKeyFeatures.filter((_, i) => i !== idx);
                            setParsedKeyFeatures(newFeatures);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setParsedKeyFeatures([...parsedKeyFeatures, ""])}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" /> Add Key Feature
                  </Button>
                  <input 
                    type="hidden" 
                    name="keyFeatures" 
                    value={JSON.stringify(parsedKeyFeatures.filter(f => f.trim() !== ""))} 
                  />
                </div>
              </div>
              {/* Tags */}
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="border rounded-md p-4">
                  {parsedTags.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No tags added yet.</p>
                  ) : null}
                  <div id="tags-inputs" className="space-y-2 mb-3">
                    {Array.isArray(parsedTags) && parsedTags.map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input 
                          value={tag} 
                          onChange={e => {
                            const newTags = [...parsedTags];
                            newTags[idx] = e.target.value;
                            setParsedTags(newTags);
                          }}
                          placeholder="Tag"
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => {
                            const newTags = parsedTags.filter((_, i) => i !== idx);
                            setParsedTags(newTags);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setParsedTags([...parsedTags, ""])}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" /> Add Tag
                  </Button>
                  <input 
                    type="hidden" 
                    name="tags" 
                    value={JSON.stringify(parsedTags.filter(t => t.trim() !== ""))} 
                  />
                </div>
              </div>
              {/* Related Products */}
              <div>
                <Label>Related Products</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Search products by name, brand, or category"
                    value={relatedProductsSearch}
                    onChange={(e) => setRelatedProductsSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {products
                    .filter((product) =>
                      product.name.toLowerCase().includes(relatedProductsSearch.toLowerCase()) ||
                      product.brand?.name.toLowerCase().includes(relatedProductsSearch.toLowerCase()) ||
                      product.category?.name.toLowerCase().includes(relatedProductsSearch.toLowerCase())
                    )
                    .map((product) => (
                      <div key={product._id} className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          id={`relatedProduct-${product._id}`}
                          checked={selectedRelatedProducts.includes(product._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRelatedProducts([...selectedRelatedProducts, product._id]);
                            } else {
                              setSelectedRelatedProducts(selectedRelatedProducts.filter(id => id !== product._id));
                            }
                          }}
                        />
                        <label htmlFor={`relatedProduct-${product._id}`} className="text-sm">
                          {product.name} ({product.brand?.name || "Unknown Brand"}, {product.category?.name || "Unknown Category"})
                        </label>
                      </div>
                    ))}
                </div>
                {selectedRelatedProducts.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {selectedRelatedProducts.length} product(s)
                  </div>
                )}
              </div>
              {/* Specifications */}
              <div>
                <Label>Specifications</Label>
                <Button
                  type="button"
                  onClick={() => setSpecifications([...specifications, emptySpecGroup()])}
                  className="mb-2"
                >
                  <Plus size={16} /> Add Specification Group
                </Button>
                {specifications.map((spec, idx) => (
                  <div key={idx} className="mb-4 border rounded p-2">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={spec.groupName}
                        onChange={e => {
                          const arr = [...specifications]
                          arr[idx].groupName = e.target.value
                          setSpecifications(arr)
                        }}
                        placeholder="Group Name"
                      />
                      <Button type="button" variant="destructive" onClick={() => setSpecifications(specifications.filter((_, i) => i !== idx))} disabled={specifications.length === 1}><Trash2 size={16} /></Button>
                    </div>
                    <div>
                      {spec.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex gap-2 mb-2">
                          <Input
                            value={item.name}
                            onChange={e => {
                              const arr = [...specifications]
                              arr[idx].items[itemIdx].name = e.target.value
                              setSpecifications(arr)
                            }}
                            placeholder="Item Name"
                          />
                          <Input
                            value={item.value}
                            onChange={e => {
                              const arr = [...specifications]
                              arr[idx].items[itemIdx].value = e.target.value
                              setSpecifications(arr)
                            }}
                            placeholder="Value"
                          />
                          <Input
                            value={item.unit}
                            onChange={e => {
                              const arr = [...specifications]
                              arr[idx].items[itemIdx].unit = e.target.value
                              setSpecifications(arr)
                            }}
                            placeholder="Unit"
                          />
                          <Button type="button" variant="destructive" onClick={() => {
                            const arr = [...specifications]
                            arr[idx].items = arr[idx].items.filter((_: any, i: number) => i !== itemIdx)
                            setSpecifications(arr)
                          }} disabled={spec.items.length === 1}><Trash2 size={16} /></Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => {
                        const arr = [...specifications]
                        arr[idx].items.push({ name: "", value: "", unit: "" })
                        setSpecifications(arr)
                      }}><Plus size={16} /> Add Item</Button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Documents */}
              <div className="grid gap-2">
                <Label htmlFor="documents">Documents (PDFs, etc.)</Label>
                <div className="border rounded-md p-4">
                  <div id="document-inputs" className="space-y-2 mb-3">
                    {docFiles.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                        <div className="flex-1 truncate">
                          <p className="font-medium text-sm">{doc.file.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(doc.file.size / 1024)} KB
                          </p>
                        </div>
                        <select
                          value={doc.type}
                          onChange={(e) => {
                            const newFiles = [...docFiles];
                            newFiles[idx].type = e.target.value;
                            setDocFiles(newFiles);
                          }}
                          className="border rounded p-1 text-sm"
                          required
                        >
                          <option value="">Select type</option>
                          <option value="manual">Manual</option>
                          <option value="datasheet">Datasheet</option>
                          <option value="warranty">Warranty</option>
                          <option value="certificate">Certificate</option>
                          <option value="other">Other</option>
                        </select>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newFiles = docFiles.filter((_, i) => i !== idx);
                            setDocFiles(newFiles);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <label
                    htmlFor="document-upload"
                    className="flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <div className="text-center">
                      <Plus size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium">Upload document</p>
                      <p className="text-xs text-gray-500">PDF, Word, Excel, etc.</p>
                    </div>
                  </label>
                  <input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setDocFiles([
                          ...docFiles,
                          ...files.map(file => ({ file, type: "" }))
                        ]);
                        // Reset the input so the same file can be selected again
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
                {/* These hidden fields will be populated when the form is submitted */}
                <input 
                  type="hidden" 
                  id="document-types-json" 
                  name="documentTypes" 
                  value={JSON.stringify(docFiles.map(doc => ({
                    name: doc.file.name,
                    type: doc.type,
                    size: Math.round(doc.file.size / 1024)
                  })))} 
                />
              </div>
              {/* Shipping Info */}
              <div>
                <Label>Shipping Info</Label>
                <div className="flex gap-2 mb-2">
                  <Switch checked={shippingInfo.freeShipping} onCheckedChange={v => setShippingInfo({ ...shippingInfo, freeShipping: v })} />
                  <Label>Free Shipping</Label>
                </div>
                <Input
                  value={shippingInfo.estimatedDelivery}
                  onChange={e => setShippingInfo({ ...shippingInfo, estimatedDelivery: e.target.value })}
                  placeholder="Estimated Delivery"
                />
                <Input
                  value={shippingInfo.returnPolicy}
                  onChange={e => setShippingInfo({ ...shippingInfo, returnPolicy: e.target.value })}
                  placeholder="Return Policy"
                />
                <Input
                  value={shippingInfo.warrantyService}
                  onChange={e => setShippingInfo({ ...shippingInfo, warrantyService: e.target.value })}
                  placeholder="Warranty Service"
                />
              </div>
              {/* Marketing Flags */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isFeatured" 
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isBestSeller" 
                    checked={isBestSeller}
                    onCheckedChange={setIsBestSeller}
                  />
                  <Label htmlFor="isBestSeller">Best Seller</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isNewArrival" 
                    checked={isNewArrival}
                    onCheckedChange={setIsNewArrival}
                  />
                  <Label htmlFor="isNewArrival">New Arrival</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            clearEditForm();
          }
          setIsEditDialogOpen(open);
        }}>
          <DialogContent 
            className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below. Required fields are marked.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subCategory">Subcategory</Label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={editSubCategory}
                      onChange={(e) => setEditSubCategory(e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="">None</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <select
                      id="brand"
                      name="brand"
                      required
                      value={editBrand}
                      onChange={(e) => setEditBrand(e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="">Select brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      required
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Pricing Note</Label>
                    <p className="text-sm text-gray-500">Use the Offers page to manage special pricing and discounts.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="viewCount">View Count</Label>
                    <Input
                      id="viewCount"
                      name="viewCount"
                      type="number"
                      value={editViewCount}
                      onChange={(e) => setEditViewCount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                {/* Media */}
                <div className="grid gap-2">
                  <Label htmlFor="images">Images</Label>
                  <Input id="images" name="images" type="file" accept="image/*" multiple />
                  {editProduct?.images && editProduct.images.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-sm text-gray-500">Current Images:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {editProduct.images.map((img: string, idx: number) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`Product image ${idx + 1}`} 
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>YouTube Videos</Label>
                  <div className="border rounded-md p-4">
                    <div className="mb-2 text-sm text-gray-500">
                      Paste YouTube video URLs (e.g., https://www.youtube.com/watch?v=xxxxx or https://youtu.be/xxxxx)
                    </div>
                    <div className="space-y-2 mb-3">
                      {editVideos.map((video, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input 
                            value={video} 
                            onChange={(e) => {
                              const newVideos = [...editVideos];
                              let url = e.target.value;
                              // Convert youtu.be URLs to full format
                              if (url.includes('youtu.be/')) {
                                const id = url.split('youtu.be/')[1]?.split('?')[0];
                                if (id) {
                                  url = `https://www.youtube.com/watch?v=${id}`;
                                }
                              }
                              // Extract video ID if full URL
                              if (url.includes('youtube.com/watch?v=')) {
                                const id = new URLSearchParams(url.split('?')[1]).get('v');
                                if (id) {
                                  url = `https://www.youtube.com/watch?v=${id}`;
                                }
                              }
                              newVideos[idx] = url;
                              setEditVideos(newVideos);
                            }}
                            placeholder="YouTube video URL"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => {
                              const newVideos = editVideos.filter((_, i) => i !== idx);
                              setEditVideos(newVideos);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      {editVideos.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No videos added yet.</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setEditVideos([...editVideos, ""])}
                      className="w-full"
                    >
                      <Plus size={16} className="mr-2" /> Add Video
                    </Button>
                  </div>
                </div>
                {/* Key Features */}
                <div>
                  <Label>Key Features</Label>
                  <div className="border rounded-md p-4">
                    {editKeyFeatures.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No key features added yet.</p>
                    ) : null}
                    <div className="space-y-2 mb-3">
                      {editKeyFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input 
                            value={feature} 
                            onChange={(e) => {
                              const newFeatures = [...editKeyFeatures];
                              newFeatures[idx] = e.target.value;
                              setEditKeyFeatures(newFeatures);
                            }}
                            placeholder="Key feature"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => {
                              const newFeatures = editKeyFeatures.filter((_, i) => i !== idx);
                              setEditKeyFeatures(newFeatures);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setEditKeyFeatures([...editKeyFeatures, ""])}
                      className="w-full"
                    >
                      <Plus size={16} className="mr-2" /> Add Key Feature
                    </Button>
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="border rounded-md p-4">
                    {editTags.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No tags added yet.</p>
                    ) : null}
                    <div className="space-y-2 mb-3">
                      {editTags.map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input 
                            value={tag} 
                            onChange={(e) => {
                              const newTags = [...editTags];
                              newTags[idx] = e.target.value;
                              setEditTags(newTags);
                            }}
                            placeholder="Tag"
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => {
                              const newTags = editTags.filter((_, i) => i !== idx);
                              setEditTags(newTags);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setEditTags([...editTags, ""])}
                      className="w-full"
                    >
                      <Plus size={16} className="mr-2" /> Add Tag
                    </Button>
                  </div>
                </div>
                {/* Related Products */}
                <div>
                  <Label>Related Products</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Search products by name, brand, or category"
                      value={relatedProductsSearch}
                      onChange={(e) => setRelatedProductsSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto border rounded p-2">
                    {products
                      .filter((product) =>
                        product.name.toLowerCase().includes(relatedProductsSearch.toLowerCase()) ||
                        product.brand?.name.toLowerCase().includes(relatedProductsSearch.toLowerCase()) ||
                        product.category?.name.toLowerCase().includes(relatedProductsSearch.toLowerCase())
                      )
                      .map((product) => (
                        <div key={product._id} className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            id={`editRelatedProduct-${product._id}`}
                            checked={selectedRelatedProducts.includes(product._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRelatedProducts([...selectedRelatedProducts, product._id]);
                              } else {
                                setSelectedRelatedProducts(selectedRelatedProducts.filter(id => id !== product._id));
                              }
                            }}
                          />
                          <label htmlFor={`editRelatedProduct-${product._id}`} className="text-sm">
                            {product.name} ({product.brand?.name || "Unknown Brand"}, {product.category?.name || "Unknown Category"})
                          </label>
                        </div>
                      ))}
                  </div>
                  {selectedRelatedProducts.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {selectedRelatedProducts.length} product(s)
                    </div>
                  )}
                </div>
                {/* Specifications */}
                <div>
                  <Label>Specifications</Label>
                  <Button
                    type="button"
                    onClick={() => setSpecifications([...specifications, emptySpecGroup()])}
                    className="mb-2"
                  >
                    <Plus size={16} /> Add Specification Group
                  </Button>
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="mb-4 border rounded p-2">
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={spec.groupName}
                          onChange={e => {
                            const arr = [...specifications]
                            arr[idx].groupName = e.target.value
                            setSpecifications(arr)
                          }}
                          placeholder="Group Name"
                        />
                        <Button type="button" variant="destructive" onClick={() => setSpecifications(specifications.filter((_, i) => i !== idx))} disabled={specifications.length === 1}><Trash2 size={16} /></Button>
                      </div>
                      <div>
                        {spec.items.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="flex gap-2 mb-2">
                            <Input
                              value={item.name}
                              onChange={e => {
                                const arr = [...specifications]
                                arr[idx].items[itemIdx].name = e.target.value
                                setSpecifications(arr)
                              }}
                              placeholder="Item Name"
                            />
                            <Input
                              value={item.value}
                              onChange={e => {
                                const arr = [...specifications]
                                arr[idx].items[itemIdx].value = e.target.value
                                setSpecifications(arr)
                              }}
                              placeholder="Value"
                            />
                            <Input
                              value={item.unit}
                              onChange={e => {
                                const arr = [...specifications]
                                arr[idx].items[itemIdx].unit = e.target.value
                                setSpecifications(arr)
                              }}
                              placeholder="Unit"
                            />
                            <Button type="button" variant="destructive" onClick={() => {
                              const arr = [...specifications]
                              arr[idx].items = arr[idx].items.filter((_: any, i: number) => i !== itemIdx)
                              setSpecifications(arr)
                            }} disabled={spec.items.length === 1}><Trash2 size={16} /></Button>
                          </div>
                        ))}
                        <Button type="button" onClick={() => {
                          const arr = [...specifications]
                          arr[idx].items.push({ name: "", value: "", unit: "" })
                          setSpecifications(arr)
                        }}><Plus size={16} /> Add Item</Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Documents */}
                <div className="grid gap-2">
                  <Label htmlFor="documents">Documents (PDFs, etc.)</Label>
                  
                  {/* Show existing documents */}
                  {editProduct?.documents && editProduct.documents.length > 0 && (
                    <div className="mb-4">
                      <Label className="text-sm text-gray-500">Current Documents:</Label>
                      <div className="space-y-2 mt-2">
                        {editProduct.documents.map((doc: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Type: {doc.type || 'Unknown'} • Size: {doc.size || 'Unknown'} KB
                              </p>
                            </div>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-xs"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Input 
                    id="documents" 
                    name="documents" 
                    type="file" 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" 
                    multiple 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const newTypes: Record<string, string> = {};
                      files.forEach((file, index) => {
                        newTypes[file.name] = "";
                      });
                      setDocumentTypes(newTypes);
                    }}
                  />
                  {Object.keys(documentTypes).length > 0 && (
                    <div className="space-y-2">
                      <Label>Document Types for New Uploads</Label>
                      {Object.keys(documentTypes).map((fileName) => (
                        <div key={fileName} className="flex gap-2 items-center">
                          <span className="text-sm flex-1 truncate">{fileName}</span>
                          <select 
                            value={documentTypes[fileName]} 
                            onChange={(e) => setDocumentTypes({...documentTypes, [fileName]: e.target.value})}
                            className="border rounded p-1 text-sm"
                            required
                          >
                            <option value="">Select type</option>
                            <option value="manual">Manual</option>
                            <option value="datasheet">Datasheet</option>
                            <option value="warranty">Warranty</option>
                            <option value="certificate">Certificate</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Shipping Info */}
                <div>
                  <Label>Shipping Info</Label>
                  <div className="flex gap-2 mb-2">
                    <Switch checked={shippingInfo.freeShipping} onCheckedChange={v => setShippingInfo({ ...shippingInfo, freeShipping: v })} />
                    <Label>Free Shipping</Label>
                  </div>
                  <Input
                    value={shippingInfo.estimatedDelivery}
                    onChange={e => setShippingInfo({ ...shippingInfo, estimatedDelivery: e.target.value })}
                    placeholder="Estimated Delivery"
                  />
                  <Input
                    value={shippingInfo.returnPolicy}
                    onChange={e => setShippingInfo({ ...shippingInfo, returnPolicy: e.target.value })}
                    placeholder="Return Policy"
                  />
                  <Input
                    value={shippingInfo.warrantyService}
                    onChange={e => setShippingInfo({ ...shippingInfo, warrantyService: e.target.value })}
                    placeholder="Warranty Service"
                  />
                </div>
                {/* Marketing Flags */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="editIsFeatured" 
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                    <Label htmlFor="editIsFeatured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="editIsBestSeller" 
                      checked={isBestSeller}
                      onCheckedChange={setIsBestSeller}
                    />
                    <Label htmlFor="editIsBestSeller">Best Seller</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="editIsNewArrival" 
                      checked={isNewArrival}
                      onCheckedChange={setIsNewArrival}
                    />
                    <Label htmlFor="editIsNewArrival">New Arrival</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>Save Changes</Button>
                </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>
      </div>

      

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {getCategoryStats().map((category) => {
          // Get a category color based on name to have consistent coloring
          const getColorClass = (name) => {
            const colors = ['bg-primary', 'bg-green-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
            const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
            return colors[hash % colors.length];
          };

          return (
            <Card key={category._id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <div className={`p-2 rounded-md ${getColorClass(category.name)}`}>
                  {/* Use a simple icon or text instead of dynamic component */}
                  <div className="h-4 w-4 text-white flex items-center justify-center text-xs font-bold">
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{category.count}</div>
                <p className="text-xs text-muted-foreground">
                  {category.activeCount} active • {category.count - category.activeCount} inactive
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Complete product catalog with category and brand filtering.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* TABle HEre ------------------------------------------ */}
              <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.description?.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category?.name || "N/A"}</TableCell>
              <TableCell>{product.brand?.name || "N/A"}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => populateEditForm(product)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual category tabs would have filtered content */}
        {categories.map((category) => {
          // Get a category color based on name for icon background
          const getColorClass = (name) => {
            const colors = ['text-primary', 'text-green-500', 'text-blue-500', 'text-amber-500', 'text-rose-500', 'text-purple-500'];
            const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
            return colors[hash % colors.length];
          };

          return (
            <TabsContent key={category._id} value={category._id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${getColorClass(category.name)}`}>
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                    {category.name}
                  </CardTitle>
                  <CardDescription>Products in the {category.name.toLowerCase()} category.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <div className={`h-12 w-12 mx-auto mb-4 opacity-50 flex items-center justify-center text-xl font-bold rounded-full border-2 ${getColorClass(category.name)}`}>
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <p>Category-specific product management would be implemented here.</p>
                    <p className="text-sm">Filter and manage only {category.name.toLowerCase()} products.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  )
}