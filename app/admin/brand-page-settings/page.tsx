"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Plus, Trash2, Upload, Save, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

// Types
interface Brand {
  _id: string
  name: string
}

interface Product {
  _id: string
  id?: string
  name: string
  price: number
  images: string[]
}

interface Document {
  _id: string
  title: string
  fileUrl: string
  documentUrl?: string // Adding optional documentUrl field
}

interface Promotion {
  _id: string
  title: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  displayTab?: string
  isActive?: boolean
}

interface BrandSettings {
  _id: string
  aboutContent: string
  whyChooseReasons: { title: string; description: string }[]
  warrantyInformation: string
  technicalSupportInfo: string
  faqs: { question: string; answer: string }[]
  promotions: Promotion[]
  warrantyDocuments: Document[]
  featuredProducts: string[]
}

export default function BrandPageSettingsPage() {
  const { toast } = useToast()
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [savingSettings, setSavingSettings] = useState<boolean>(false)

  // Form state
  const [aboutContent, setAboutContent] = useState<string>("")
  const [whyChooseReasons, setWhyChooseReasons] = useState<{ title: string; description: string }[]>([{ title: "", description: "" }])
  const [warrantyInfo, setWarrantyInfo] = useState<string>("")
  const [technicalSupportInfo, setTechnicalSupportInfo] = useState<string>("")
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([{ question: "", answer: "" }])
  
  // Promotion state
  const [showAddPromotion, setShowAddPromotion] = useState<boolean>(false)
  const [promotionTitle, setPromotionTitle] = useState<string>("")
  const [promotionDescription, setPromotionDescription] = useState<string>("")
  const [promotionTab, setPromotionTab] = useState<string>("all")
  const [promotionImage, setPromotionImage] = useState<File | null>(null)
  const [promotionStartDate, setPromotionStartDate] = useState<Date>(new Date())
  const [promotionEndDate, setPromotionEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  
  // Products state
  const [brandProducts, setBrandProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showProductSelector, setShowProductSelector] = useState<boolean>(false)
  
  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/brands`, { withCredentials: true })
        setBrands(response.data)
      } catch (error) {
        console.error("Error fetching brands:", error)
        toast({
          title: "Error",
          description: "Failed to fetch brands",
          variant: "destructive",
        })
      }
    }
    
    fetchBrands()
  }, [])

  // Fetch brand settings when a brand is selected
  useEffect(() => {
    const fetchBrandSettings = async () => {
      if (!selectedBrand) return
      
      setLoading(true)
      try {
        const response = await axios.get(
          `${API_BASE}/api/brand-page-settings/${selectedBrand}`, 
          { withCredentials: true }
        )
        
        if (response.data.success) {
          const settings = response.data.settings
          
          if (settings) {
            setBrandSettings(settings)
            setAboutContent(settings.aboutContent || "")
            setWhyChooseReasons(settings.whyChooseReasons?.length > 0 ? 
              settings.whyChooseReasons : 
              [{ title: "", description: "" }]
            )
            setWarrantyInfo(settings.warrantyInformation || "")
            setTechnicalSupportInfo(settings.technicalSupportInfo || "")
            setFaqs(settings.faqs?.length > 0 ? 
              settings.faqs : 
              [{ question: "", answer: "" }]
            )
            
            // Handle featured products
            if (settings.featuredProducts?.length > 0) {
              const productIds = settings.featuredProducts.map((p: any) => {
                return typeof p === 'string' ? p : p._id || p.id
              })
              setSelectedProducts(productIds)
            } else {
              setSelectedProducts([])
            }
          } else {
            // Initialize with empty values if no settings found
            setBrandSettings(null)
            resetForm()
          }
        }
        
        // Also fetch brand products for selection
        const productsResponse = await axios.get(
          `${API_BASE}/api/brand-page-settings/${selectedBrand}/products`, 
          { withCredentials: true }
        )
        
        if (productsResponse.data.success) {
          setBrandProducts(productsResponse.data.products || [])
        }
      } catch (error) {
        console.error("Error fetching brand settings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch brand settings",
          variant: "destructive",
        })
        resetForm()
      } finally {
        setLoading(false)
      }
    }
    
    fetchBrandSettings()
  }, [selectedBrand])

  const resetForm = () => {
    setAboutContent("")
    setWhyChooseReasons([{ title: "", description: "" }])
    setWarrantyInfo("")
    setTechnicalSupportInfo("")
    setFaqs([{ question: "", answer: "" }])
    setSelectedProducts([])
  }

  const handleSaveSettings = async () => {
    if (!selectedBrand) return
    
    console.log("Saving brand settings", {
      brandId: selectedBrand,
      aboutContent: aboutContent?.substring(0, 20) + "...",
      whyChooseReasons: whyChooseReasons.length,
      selectedProducts: selectedProducts.length,
      faqs: faqs.length
    });
    
    setSavingSettings(true)
    try {
      // Prepare the data object
      const settingsData = {
        ...brandSettings,
        aboutContent,
        technicalSupportInfo,
        whyChooseReasons: whyChooseReasons.filter(r => r.title?.trim() !== "").map(r => ({
          title: r.title?.trim(),
          description: r.description?.trim()
        })),
        featuredProducts: selectedProducts,
        faqs: faqs.filter(faq => faq.question?.trim() !== "").map(faq => ({
          question: faq.question?.trim(),
          answer: faq.answer?.trim()
        }))
      }
      
      console.log('Sending settings data:', settingsData);

      const response = await axios.put(
        `${API_BASE}/api/brand-page-settings/${selectedBrand}`,
        settingsData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Brand page settings saved successfully",
        })
      }
    } catch (error) {
      console.error("Error saving brand settings:", error)
      toast({
        title: "Error",
        description: "Failed to save brand settings",
        variant: "destructive",
      })
    } finally {
      setSavingSettings(false)
    }
  }

  const handleAddPromotion = async () => {
    if (!selectedBrand || !promotionImage || !promotionTitle) return
    
    try {
      console.log("Adding promotion with data:", { 
        title: promotionTitle,
        description: promotionDescription,
        displayTab: promotionTab,
        startDate: promotionStartDate,
        endDate: promotionEndDate,
        imageFile: promotionImage?.name
      });
      
      const formData = new FormData()
      formData.append("title", promotionTitle)
      formData.append("description", promotionDescription)
      formData.append("displayTab", promotionTab)
      formData.append("startDate", promotionStartDate.toISOString())
      formData.append("endDate", promotionEndDate.toISOString())
      formData.append("isActive", "true")
      formData.append("image", promotionImage)
      
      const response = await axios.post(
        `${API_BASE}/api/brand-page-settings/${selectedBrand}/promotion`, 
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      )
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Promotion added successfully",
        })
        
        // Update the settings with the new promotion
        const updatedSettings = await axios.get(
          `${API_BASE}/api/brand-page-settings/${selectedBrand}`, 
          { withCredentials: true }
        )
        
        setBrandSettings(updatedSettings.data.settings)
        
        // Reset promotion form
        setPromotionTitle("")
        setPromotionDescription("")
        setPromotionTab("all")
        setPromotionImage(null)
        setPromotionStartDate(new Date())
        setPromotionEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
        setShowAddPromotion(false)
      }
    } catch (error) {
      console.error("Error adding promotion:", error)
      toast({
        title: "Error",
        description: "Failed to add promotion",
        variant: "destructive",
      })
    }
  }

  const handleDeletePromotion = async (promotionId: string) => {
    if (!selectedBrand || !promotionId) return
    
    if (!window.confirm("Are you sure you want to delete this promotion?")) return
    
    try {
      const response = await axios.delete(
        `${API_BASE}/api/brand-page-settings/${selectedBrand}/promotion/${promotionId}`, 
        { withCredentials: true }
      )
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Promotion deleted successfully",
        })
        
        // Update the settings without the deleted promotion
        const updatedSettings = await axios.get(
          `${API_BASE}/api/brand-page-settings/${selectedBrand}`, 
          { withCredentials: true }
        )
        
        setBrandSettings(updatedSettings.data.settings)
      }
    } catch (error) {
      console.error("Error deleting promotion:", error)
      toast({
        title: "Error",
        description: "Failed to delete promotion",
        variant: "destructive",
      })
    }
  }

  // Removed document-related functions as they are no longer needed

  // Handle why choose reasons changes
  const handleWhyChooseChange = (index: number, field: "title" | "description", value: string) => {
    const newReasons = [...whyChooseReasons]
    newReasons[index][field] = value
    setWhyChooseReasons(newReasons)
  }

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs]
    newFaqs[index][field] = value
    setFaqs(newFaqs)
  }

  const removeFaq = (index: number) => {
    if (faqs.length === 1) return
    const newFaqs = [...faqs]
    newFaqs.splice(index, 1)
    setFaqs(newFaqs)
  }

  const removeWhyChooseReason = (index: number) => {
    if (whyChooseReasons.length === 1) return
    const newReasons = [...whyChooseReasons]
    newReasons.splice(index, 1)
    setWhyChooseReasons(newReasons)
  }

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else if (selectedProducts.length < 5) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      toast({
        title: "Error",
        description: "You can only select up to 5 featured products",
        variant: "destructive"
      })
    }
  }

  // Add new FAQ
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  // Add new why choose reason
  const addWhyChooseReason = () => {
    setWhyChooseReasons([...whyChooseReasons, { title: "", description: "" }])
  }

  // File handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setter(file)
    }
  }

  // Promotions section
  const PromotionsList = () => {
    if (!brandSettings?.promotions) return null
    return (
      <div className="space-y-4">
        {brandSettings.promotions.map((promo) => (
          <div key={promo._id} className="border rounded-md p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{promo.title}</h3>
              <Button variant="destructive" size="sm" onClick={() => handleDeletePromotion(promo._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{promo.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">Start:</span>
                {new Date(promo.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">End:</span>
                {new Date(promo.endDate).toLocaleDateString()}
              </div>
              {promo.displayTab && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Tab:</span>
                  {promo.displayTab}
                </div>
              )}
            </div>
            {typeof promo.isActive !== 'undefined' && (
              <div className={`${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full inline-flex`}>
                {promo.isActive ? 'Active' : 'Inactive'}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 container mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Page Settings</h1>
          <p className="text-muted-foreground">
            Manage brand page content, promotions, and settings
          </p>
        </div>
      </div>
      
      {/* Brand selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Brand</CardTitle>
          <CardDescription>Choose a brand to manage its page settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedBrand && !loading ? (
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="featured">Featured Products</TabsTrigger>
            <TabsTrigger value="support">Support & FAQs</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          {/* About tab */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Content</CardTitle>
                <CardDescription>Content for the About tab on the brand page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="aboutContent">About Description</Label>
                    <Textarea
                      id="aboutContent"
                      value={aboutContent}
                      onChange={(e) => setAboutContent(e.target.value)}
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Why Choose This Brand</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addWhyChooseReason}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Reason
                      </Button>
                    </div>
                    
                    {whyChooseReasons.map((reason, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <Label>Reason {index + 1}</Label>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeWhyChooseReason(index)}
                            disabled={whyChooseReasons.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Title"
                          value={reason.title}
                          onChange={(e) => handleWhyChooseChange(index, "title", e.target.value)}
                        />
                        <Textarea
                          placeholder="Description"
                          value={reason.description}
                          onChange={(e) => handleWhyChooseChange(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full"
              onClick={handleSaveSettings}
              disabled={savingSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              Save About Content
            </Button>
          </TabsContent>

          {/* Featured Products tab */}
          <TabsContent value="featured" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
                <CardDescription>Select products to feature on the brand page</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mb-4"
                  onClick={() => setShowProductSelector(true)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Featured Products
                </Button>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProducts.length > 0 ? (
                    brandProducts
                      .filter(product => selectedProducts.includes(product._id))
                      .map(product => (
                        <div key={product._id} className="border rounded-md p-4">
                          <div className="aspect-square bg-gray-100 rounded-md mb-2 relative">
                            {product.images && product.images[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="object-contain w-full h-full p-2"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                          <p className="text-sm text-primary">${product.price}</p>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-muted-foreground">
                      No featured products selected
                    </div>
                  )}
                </div>
                
                {/* Product selector dialog */}
                <Dialog open={showProductSelector} onOpenChange={setShowProductSelector}>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Featured Products</DialogTitle>
                      <DialogDescription>
                        Check the products you want to feature on the brand page
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                        {brandProducts.length > 0 ? (
                          brandProducts.map(product => (
                            <div 
                              key={product._id} 
                              className="flex items-center space-x-2 py-2 border-b last:border-b-0"
                            >
                              <Checkbox
                                id={`product-${product._id}`}
                                checked={selectedProducts.includes(product._id)}
                                onCheckedChange={() => toggleProductSelection(product._id)}
                              />
                              <div className="w-12 h-12 bg-gray-100 rounded-md relative">
                                {product.images && product.images[0] ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="object-contain w-full h-full p-1"
                                  />
                                ) : null}
                              </div>
                              <Label 
                                htmlFor={`product-${product._id}`}
                                className="flex-1 cursor-pointer"
                              >
                                {product.name}
                              </Label>
                              <span className="text-primary font-medium">${product.price}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-muted-foreground">
                            No products available for this brand
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {selectedProducts.length} product(s) selected
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedProducts([])}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowProductSelector(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowProductSelector(false)}>
                        Confirm Selection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full"
              onClick={handleSaveSettings}
              disabled={savingSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Featured Products
            </Button>
          </TabsContent>

          {/* Support & FAQs tab */}
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Information</CardTitle>
                <CardDescription>Content for the Support tab on the brand page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Warranty Information */}
                  <div className="space-y-2">
                    <Label htmlFor="warrantyInfo">Brand Warranty Information</Label>
                    <Textarea
                      id="warrantyInfo"
                      value={warrantyInfo}
                      onChange={(e) => setWarrantyInfo(e.target.value)}
                      placeholder="Enter general warranty information for the brand. Note: Specific warranty details vary by product and should be managed at the product level."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Provide general warranty information. Product-specific warranty details should be added to individual product pages.
                    </p>
                  </div>
                  
                  {/* Technical Support Info */}
                  <div className="space-y-2">
                    <Label htmlFor="techSupportInfo">Technical Support Information</Label>
                    <Textarea
                      id="techSupportInfo"
                      value={technicalSupportInfo}
                      onChange={(e) => setTechnicalSupportInfo(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  {/* FAQs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Frequently Asked Questions</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addFaq}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add FAQ
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="space-y-2 p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <Label>FAQ {index + 1}</Label>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeFaq(index)}
                              disabled={faqs.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Question"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                          />
                          <Textarea
                            placeholder="Answer"
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full"
              onClick={handleSaveSettings}
              disabled={savingSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Support Content
            </Button>
          </TabsContent>

          {/* Promotions tab */}
          <TabsContent value="promotions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Promotions & Deals</CardTitle>
                <CardDescription>Manage promotions for the brand page</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mb-4"
                  onClick={() => setShowAddPromotion(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New Promotion
                </Button>
                
                <PromotionsList />
                
                {/* Add promotion dialog */}
                <Dialog open={showAddPromotion} onOpenChange={setShowAddPromotion}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Promotion</DialogTitle>
                      <DialogDescription>
                        Create a promotion or deal to display on the brand page
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="promotionTitle">Title</Label>
                        <Input
                          id="promotionTitle"
                          value={promotionTitle}
                          onChange={(e) => setPromotionTitle(e.target.value)}
                          placeholder="e.g., Summer Sale"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="promotionDesc">Description</Label>
                        <Textarea
                          id="promotionDesc"
                          value={promotionDescription}
                          onChange={(e) => setPromotionDescription(e.target.value)}
                          placeholder="Brief description of the promotion"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Display Tab</Label>
                        <Select value={promotionTab} onValueChange={setPromotionTab}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tab" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            <SelectItem value="featured">Featured Products</SelectItem>
                            <SelectItem value="about">About</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                {format(promotionStartDate, 'PPP')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={promotionStartDate}
                                onSelect={(date) => setPromotionStartDate(date || new Date())}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                {format(promotionEndDate, 'PPP')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={promotionEndDate}
                                onSelect={(date) => setPromotionEndDate(date || new Date())}
                                disabled={(date) => date < promotionStartDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="promotionImage">Promotion Image</Label>
                        <Input
                          id="promotionImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setPromotionImage)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Recommended size: 800x400px
                        </p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddPromotion(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddPromotion}
                        disabled={!promotionTitle || !promotionImage}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Promotion
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : selectedBrand && loading ? (
        <div className="py-16 text-center text-muted-foreground">
          Loading brand settings...
        </div>
      ) : (
        <div className="py-16 text-center text-muted-foreground">
          Select a brand to manage its page settings
        </div>
      )}
    </div>
  )
}