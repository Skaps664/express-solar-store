"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronRight } from "lucide-react";
import ProductSpecifications from "@/components/product-specifications";
import ProductResources from "@/components/product-resources";
import ProductReviews from "@/components/reviews/product-reviews";
import RelatedProducts from "@/components/related-products";
import { useRouter } from "next/navigation";
import { useProductAnalytics } from "@/hooks/useAnalyticTracking";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Format price in PKR with commas
const formatPrice = (price: number) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export default function ProductClientSection({ id }: { id: string }) {
  // State hooks
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const [reviewStats, setReviewStats] = useState({
    avgRating: 0,
    totalReviews: 0
  });

  // Ref hooks
  const resourcesRef = useRef<HTMLDivElement | null>(null);
  
  // Context hooks
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

    // Memoized values
    const resourceArray = useMemo(() => {
      console.log('Building resourceArray from product:', product);
      if (!product) return [];
      
      const resources: Array<{
        type: 'document' | 'video' | 'blog';
        id: string;
        name?: string;
        title?: string;
        description?: string;
        fileType?: string;
        duration?: string;
        views?: string;
        url?: string;
        slug?: string;
        excerpt?: any;
        featuredImage?: any;
        publishedAt?: string;
      }> = [];

      console.log('Initial resources array:', resources);    // Handle videos
    if (product.videos && Array.isArray(product.videos)) {
      product.videos.forEach((video: any, index: number) => {
        if (typeof video === 'string') {
          resources.push({
            type: "video",
            id: `video_${index}`,
            title: `Product Video ${index + 1}`,
            description: "",
            url: video,
            duration: "",
            views: ""
          });
        } else {
          resources.push({
            type: "video",
            id: video.id || `video_${index}`,
            title: video.title || `Product Video ${index + 1}`,
            description: video.description || "",
            duration: video.duration || "",
            views: video.views || "",
            url: video.url || video,
          });
        }
      });
    }

      // Handle documents
      console.log('Processing documents:', product.documents);
      if (product.documents && Array.isArray(product.documents)) {
        product.documents.forEach((doc: any, index: number) => {
          console.log('Processing document:', doc);
          if (doc && doc.url) {
            const documentResource = {
              type: "document" as const,
              id: doc.id || `doc_${index}`,
              name: doc.name || "Untitled Document",
              fileType: doc.fileType || doc.type || "pdf",
              url: doc.url,
              description: doc.description || `Document ${index + 1}`
            };
            console.log('Created document resource:', documentResource);
            resources.push(documentResource);
          }
        });
      }

      // Handle blogs
      console.log('Processing blogs:', product.relatedBlogs);
      if (product.relatedBlogs && Array.isArray(product.relatedBlogs)) {
        product.relatedBlogs.forEach((blog: any, index: number) => {
          console.log('Processing blog:', blog);
          if (blog && blog.slug) {
            const blogResource = {
              type: "blog" as const,
              id: blog._id || `blog_${index}`,
              title: blog.title?.en || blog.title || "Untitled Blog",
              slug: blog.slug,
              excerpt: blog.excerpt,
              description: blog.excerpt?.en || blog.excerpt || `Blog ${index + 1}`,
              featuredImage: blog.featuredImage,
              publishedAt: blog.publishedAt
            };
            console.log('Created blog resource:', blogResource);
            resources.push(blogResource);
          }
        });
      }    // Handle blogs
    console.log('Processing blogs:', product.relatedBlogs);
    if (product.relatedBlogs && Array.isArray(product.relatedBlogs)) {
      product.relatedBlogs.forEach((blog: any, index: number) => {
        console.log('Processing blog:', blog);
        if (blog && blog.slug) {
          const blogResource = {
            type: "blog" as const,
            id: blog._id || `blog_${index}`,
            title: blog.title?.en || blog.title || "Untitled Blog",
            slug: blog.slug,
            excerpt: blog.excerpt,
            description: blog.excerpt?.en || blog.excerpt || `Blog ${index + 1}`,
            featuredImage: blog.featuredImage,
            publishedAt: blog.publishedAt
          };
          console.log('Created blog resource:', blogResource);
          resources.push(blogResource);
        }
      });
    }

    console.log('Final resource array:', resources);
    // Ensure we're returning a proper array
    if (!Array.isArray(resources)) {
      console.error('Resources is not an array:', resources);
      return [];
    }
    return [...resources];
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product details from:', `${API_BASE}/api/products/${id}`);
        const response = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await response.json();
        if (data.success && data.product) {
          // Track product view and add to recently viewed - wrapped in try/catch to prevent errors from breaking page load
          try {
            const analytics = await import('@/lib/analytics').then(mod => mod.default.getInstance());
            analytics.trackProductView(data.product._id, id, data.product.brand?._id);
            
            // Add to recently viewed products
            const { addToRecentlyViewed } = await import('@/components/recently-viewed');
            addToRecentlyViewed(data.product._id);
          } catch (analyticsError) {
            console.warn("Analytics tracking failed:", analyticsError);
            // Continue with page rendering even if analytics fails
          }
          
          const transformedSpecifications = data.product.specifications.map(
            (spec: { groupName: string; items: Array<{ name: string; value: string; unit: string }> }) => ({
              groupName: spec.groupName,
              items: spec.items.map((item: { name: string; value: string; unit: string }) => ({
                name: item.name,
                value: item.value,
                unit: item.unit,
              })),
            })
          );

          const transformedDocuments = Array.isArray(data.product.documents) 
            ? data.product.documents.map((doc: any) => ({
                id: doc.id,
                name: doc.name,
                type: doc.type,
                fileType: doc.fileType || doc.type || 'pdf',
                url: doc.url,
                size: doc.size,
                uploadedAt: doc.uploadedAt
              }))
            : [];

          console.log("Product data received:", data.product);
          
          console.log('Raw product data:', data.product);
          console.log('Related blogs:', data.product.relatedBlogs);
          
          setProduct({
            _id: data.product._id,
            name: data.product.name,
            brand: data.product.brand?.name,
            brandSlug: data.product.brand?.slug,
            category: data.product.category?.name || "Unknown Category",
            price: data.product.price,
            discountPrice: data.product.originalPrice,
            stock: data.product.stock,
            inStock: data.product.stock > 0,
            description: data.product.description,
            features: data.product.keyFeatures,
            images: data.product.images,
            specifications: transformedSpecifications,
            relatedProducts: data.product.relatedProducts,
            relatedBlogs: Array.isArray(data.product.relatedBlogs) ? data.product.relatedBlogs.filter(blog => 
              blog && blog.status === 'published' && blog.isActive
            ) : [],
            videos: data.product.videos,
            documents: transformedDocuments,
          });
          setSelectedLabel(
            data.product.variants && data.product.variants.length > 0
              ? data.product.variants[0].label
              : ""
          );
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch review stats separately
  useEffect(() => {
    const fetchReviewStats = async () => {
      if (!product?._id) return;
      
      try {
        const response = await fetch(`${API_BASE}/api/reviews/product/${product._id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.stats) {
            setReviewStats({
              avgRating: data.data.stats.avgRating || 0,
              totalReviews: data.data.stats.totalReviews || 0
            });
          }
        }
      } catch (error) {
        console.error('Error fetching review stats:', error);
      }
    };

    fetchReviewStats();
  }, [product?._id]);

  // State for quantity selection
  const scrollToResources = () => {
    setActiveTab("faq"); // Switch to the Resources tab
    setTimeout(() => {
      resourcesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAddToCart = async () => {
    console.log("Add to Cart button clicked");
    if (!product || !product._id) {
      console.error("Invalid product data");
      return;
    }
    
    // Check stock availability
    if (!product.inStock || product.stock <= 0) {
      toast({
        title: "Product unavailable",
        description: "This product is currently out of stock",
        variant: "destructive"
      });
      return;
    }
    
    // Check for user authentication before attempting to add to cart
    if (!user) {
      console.log("User is not authenticated");
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive"
      });
      router.push(`/auth?redirect=${encodeURIComponent(`/product/${id}`)}`);
      return;
    }
    
    try {
      console.log("Sending add to cart request for product:", product._id);
      const success = await addToCart({ 
        productId: product._id, 
        quantity: quantity, 
        selectedVariant: selectedLabel 
      });
      
      if (success) {
        toast({
          title: "Added to cart!",
          description: `${product.name} has been added to your cart.`,
          variant: "default"
        });
        router.push("/cart");
      } else {
        toast({
          title: "Error adding to cart",
          description: "There was a problem adding this item to your cart.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in add to cart:", error);
      toast({
        title: "Server error",
        description: "There was a server error processing your request. Please try again later.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href="/store">Return to Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link href="/store" className="text-gray-500 hover:text-[#1a5ca4]">
          Store
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        {product.brandSlug && (
          <>
            <Link href={`/brand/${product.brandSlug}`} className="text-gray-500 hover:text-[#1a5ca4]">
              {product.brand}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </>
        )}
        <span className="text-[#1a5ca4]">{product.name}</span>
      </div>

      {/* Product Overview */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          {/* Desktop Layout: thumbnails on left, main image on right */}
          <div className="hidden lg:flex flex-row gap-4">
            {/* Thumbnails on the left for desktop */}
            <div className="flex flex-col gap-4">
              {product.images.slice(0, 4).map((image: string, index: number) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-lg overflow-hidden w-20 h-20 bg-gray-100 flex items-center justify-center cursor-pointer ${selectedImageIndex === index ? "ring-2 ring-[#1a5ca4]" : ""}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.nextSibling) {
                        (target.nextSibling as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                  <div className="text-gray-400 hidden w-full h-full items-center justify-center text-center p-2 text-xs">[{image}]</div>
                </div>
              ))}
            </div>

            {/* Main image on the right for desktop */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 flex-1">
              <div className="bg-gray-100 flex items-center justify-center" style={{ height: "24rem" }}>
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextSibling) {
                      (target.nextSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="text-gray-400 hidden w-full h-full items-center justify-center text-center p-4">[{product.images[selectedImageIndex]}]</div>
              </div>
            </div>
          </div>

          {/* Mobile Layout: main image on top, thumbnails below */}
          <div className="lg:hidden">
            {/* Main image for mobile */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="bg-gray-100 flex items-center justify-center" style={{ height: "20rem" }}>
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextSibling) {
                      (target.nextSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="text-gray-400 hidden w-full h-full items-center justify-center text-center p-4">[{product.images[selectedImageIndex]}]</div>
              </div>
            </div>

            {/* Thumbnails below main image for mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.slice(0, 4).map((image: string, index: number) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-lg overflow-hidden w-16 h-16 bg-gray-100 flex items-center justify-center cursor-pointer flex-shrink-0 ${selectedImageIndex === index ? "ring-2 ring-[#1a5ca4]" : ""}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.nextSibling) {
                        (target.nextSibling as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                  <div className="text-gray-400 hidden w-full h-full items-center justify-center text-center p-1 text-xs">[{image}]</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-700">{reviewStats.avgRating.toFixed(1)} ({reviewStats.totalReviews} reviews)</span>
            </div>
            <div className="text-gray-500">By {product.brand}</div>
            <div className="text-gray-500">Category: {product.category}</div>
          </div>

          <div className="mb-6">
            {product.discountPrice && product.discountPrice > product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-[#1a5ca4]">{formatPrice(product.price)}</span>
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.discountPrice)}</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-[#1a5ca4]">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">Availability:</span>
              {product.inStock && product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600">In Stock</span>
                  <span className="text-gray-500">({product.stock} available)</span>
                </div>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: { id: string; name: string }) => (
                  <button
                    key={variant.id}
                    className={`px-4 py-2 border rounded-md ${
                      selectedLabel === variant.name
                        ? "border-[#1a5ca4] bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedLabel(variant.name)}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Quantity Selector */}
          {product.inStock && product.stock > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  className="px-3 py-1 border rounded-l-md hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-16 text-center border-y p-1"
                  min="1"
                  max={product.stock}
                />
                <button 
                  className="px-3 py-1 border rounded-r-md hover:bg-gray-50"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum {product.stock} items available</p>
            </div>
          )}
          
          {/* Authentication Warning */}
          {!user && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> You are not currently logged in. Please{" "}
                <Link href={`/auth?redirect=${encodeURIComponent(`/product/${id}`)}`} className="text-blue-600 hover:underline">
                  log in or register
                </Link>{" "}
                to add items to your cart.
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            {/* Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className={`w-full ${
                  product.inStock && product.stock > 0 
                    ? "bg-[#1a5ca4] hover:bg-[#0e4a8a]" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
                disabled={!product.inStock || product.stock <= 0}
              >
                {product.inStock && product.stock > 0 ? (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </>
                ) : (
                  "Sold Out"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-[#1a5ca4] font-medium">
          Looking for manuals, blogs, or video reviews?{" "}
          <button
            onClick={scrollToResources}
            className="underline hover:text-[#0e4a8a] transition-colors"
          >
            Click here to jump to Resources
          </button>{" "}
          or explore the tab below.
        </p>
      </div>

      {/* Product Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="faq">Resources</TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="pt-6">
          <ProductSpecifications specifications={product.specifications.reduce((acc: Record<string, any>, spec: { groupName: string; items: Array<{ name: string; value: string; unit?: string }> }) => {
            acc[spec.groupName] = spec.items.reduce((itemsAcc: Record<string, string>, item: { name: string; value: string; unit?: string }) => {
              itemsAcc[item.name] = `${item.value} ${item.unit || ''}`.trim();
              return itemsAcc;
            }, {});
            return acc;
          }, {})} />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-6">
          <div>
            
            {/* Product ID for reviews: {product?._id} */}
            {product?._id ? (
              <ProductReviews productId={product._id} />
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-md">
                <p className="text-gray-600">
                  Product ID is missing. Unable to load reviews.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="pt-6">
          <div ref={resourcesRef}>
            <ProductResources resources={resourceArray} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {/* <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts productIds={product.relatedProducts || []} productsData={productsData} />
      </div> */}
    </div>
  );
}