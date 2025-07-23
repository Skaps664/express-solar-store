"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Edit, Trash2, Calendar, DollarSign } from "lucide-react"


export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editOffer, setEditOffer] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Form states
  const [selectedProduct, setSelectedProduct] = useState("")
  const [offerName, setOfferName] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [calculatedPrice, setCalculatedPrice] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Edit states
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDiscountType, setEditDiscountType] = useState("")
  const [editDiscountValue, setEditDiscountValue] = useState("")
  const [editOriginalPrice, setEditOriginalPrice] = useState("")
  const [editCalculatedPrice, setEditCalculatedPrice] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [editEndDate, setEditEndDate] = useState("")
  const [editIsActive, setEditIsActive] = useState(true)

  // Fetch all data on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/api/offers`),
      api.get(`/api/products/admin/all`),
    ])
      .then(([offerRes, productRes]) => {
        setOffers(offerRes.data || [])
        setProducts(productRes.data.products || [])
      })
      .catch(err => {
        console.error("Error fetching data:", err)
        alert("Failed to fetch data")
      })
      .finally(() => setLoading(false))
  }, [])

  // Calculate discounted price
  useEffect(() => {
    if (originalPrice && discountValue) {
      if (discountType === "percentage") {
        const discount = originalPrice * (discountValue / 100)
        setCalculatedPrice((originalPrice - discount).toFixed(2))
      } else {
        setCalculatedPrice((originalPrice - discountValue).toFixed(2))
      }
    } else {
      setCalculatedPrice("")
    }
  }, [originalPrice, discountValue, discountType])

  // Calculate edited discounted price
  useEffect(() => {
    if (editOriginalPrice && editDiscountValue) {
      if (editDiscountType === "percentage") {
        const discount = editOriginalPrice * (editDiscountValue / 100)
        setEditCalculatedPrice((editOriginalPrice - discount).toFixed(2))
      } else {
        setEditCalculatedPrice((editOriginalPrice - editDiscountValue).toFixed(2))
      }
    } else {
      setEditCalculatedPrice("")
    }
  }, [editOriginalPrice, editDiscountValue, editDiscountType])

  // Set original price when product changes
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find(p => p._id === selectedProduct)
      if (product) {
        setOriginalPrice(product.price)
      }
    }
  }, [selectedProduct, products])

  // Handle creating new offer
  const handleCreateOffer = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post(
        `/api/offers/create`,
        {
          product: selectedProduct,
          name: offerName,
          description,
          discountType,
          discountValue: Number(discountValue),
          originalPrice: Number(originalPrice),
          startDate,
          endDate,
        },
        { withCredentials: true }
      )

      // Update offers list
      const offerRes = await api.get(`/api/offers`)
      setOffers(offerRes.data || [])
      setIsAddDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error creating offer:", err)
      alert(`Failed to create offer: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle updating offer
  const handleUpdateOffer = async (e) => {
    e.preventDefault()
    if (!editOffer) return

    setLoading(true)

    try {
      await api.put(
        `/api/offers/update/${editOffer._id}`,
        {
          name: editName,
          description: editDescription,
          discountType: editDiscountType,
          discountValue: Number(editDiscountValue),
          originalPrice: Number(editOriginalPrice),
          startDate: editStartDate,
          endDate: editEndDate,
          isActive: editIsActive,
        },
        { withCredentials: true }
      )

      // Update offers list
      const offerRes = await api.get(`/api/offers`)
      setOffers(offerRes.data || [])
      setIsEditDialogOpen(false)
      resetEditForm()
    } catch (err) {
      console.error("Error updating offer:", err)
      alert(`Failed to update offer: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle deleting offer
  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return
    setLoading(true)

    try {
      await api.delete(`/api/offers/delete/${id}`)
      // Update offers list
      const offerRes = await api.get(`/api/offers`)
      setOffers(offerRes.data || [])
    } catch (err) {
      console.error("Error deleting offer:", err)
      alert("Failed to delete offer")
    } finally {
      setLoading(false)
    }
  }

  // Reset form fields
  const resetForm = () => {
    setSelectedProduct("")
    setOfferName("")
    setDescription("")
    setDiscountType("percentage")
    setDiscountValue("")
    setOriginalPrice("")
    setCalculatedPrice("")
    setStartDate("")
    setEndDate("")
  }

  // Reset edit form
  const resetEditForm = () => {
    setEditOffer(null)
    setEditName("")
    setEditDescription("")
    setEditDiscountType("")
    setEditDiscountValue("")
    setEditOriginalPrice("")
    setEditCalculatedPrice("")
    setEditStartDate("")
    setEditEndDate("")
    setEditIsActive(true)
  }

  // Populate edit form
  const populateEditForm = (offer) => {
    setEditOffer(offer)
    setEditName(offer.name)
    setEditDescription(offer.description || "")
    setEditDiscountType(offer.discountType)
    setEditDiscountValue(offer.discountValue)
    setEditOriginalPrice(offer.originalPrice)
    setEditStartDate(new Date(offer.startDate).toISOString().split('T')[0])
    setEditEndDate(new Date(offer.endDate).toISOString().split('T')[0])
    setEditIsActive(offer.isActive)
    setIsEditDialogOpen(true)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Check if offer is current
  const isOfferActive = (offer) => {
    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)
    return offer.isActive && now >= start && now <= end
  }

  // Filter offers by search term
  const filteredOffers = offers.filter(offer => {
    const productName = products.find(p => p._id === offer.product?._id)?.name || ""
    return (
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Offers</h1>
          <p className="text-muted-foreground">Create and manage special offers and discounts.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
              <DialogDescription>Set up a special discount offer for a product.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOffer} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Select Product *</Label>
                <select
                  id="product"
                  className="border rounded p-2"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Offer Name *</Label>
                <Input
                  id="name"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="e.g. Summer Sale, Holiday Special"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the offer details"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <select
                    id="discountType"
                    className="border rounded p-2"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step={discountType === "percentage" ? "0.01" : "1"}
                    max={discountType === "percentage" ? "100" : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 50"}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">Original Price *</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calculatedPrice">Final Price</Label>
                  <Input
                    id="calculatedPrice"
                    type="text"
                    value={calculatedPrice}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Create Offer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Offer Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) resetEditForm()
          setIsEditDialogOpen(open)
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Offer</DialogTitle>
              <DialogDescription>Update the details of this offer.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateOffer} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editName">Offer Name *</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editDiscountType">Discount Type *</Label>
                  <select
                    id="editDiscountType"
                    className="border rounded p-2"
                    value={editDiscountType}
                    onChange={(e) => setEditDiscountType(e.target.value)}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editDiscountValue">Discount Value *</Label>
                  <Input
                    id="editDiscountValue"
                    type="number"
                    min="0"
                    step={editDiscountType === "percentage" ? "0.01" : "1"}
                    max={editDiscountType === "percentage" ? "100" : undefined}
                    value={editDiscountValue}
                    onChange={(e) => setEditDiscountValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editOriginalPrice">Original Price *</Label>
                  <Input
                    id="editOriginalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editCalculatedPrice">Final Price</Label>
                  <Input
                    id="editCalculatedPrice"
                    type="text"
                    value={editCalculatedPrice}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editStartDate">Start Date *</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEndDate">End Date *</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    min={editStartDate}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                />
                <Label htmlFor="isActive">Is Active</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Update Offer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Offers</CardTitle>
            <CardDescription>Manage your product offers and discounts.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading offers...</div>
            ) : filteredOffers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No offers found.</p>
                <p className="text-sm text-gray-400 mt-2">Create your first offer to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Final Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => {
                    const product = products.find(p => p._id === offer.product?._id);
                    const isActive = isOfferActive(offer);
                    
                    return (
                      <TableRow key={offer._id}>
                        <TableCell>
                          <div className="font-medium">
                            {product?.name || "Unknown Product"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{offer.name}</div>
                          {offer.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {offer.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {offer.discountType === "percentage" ? (
                            <span>{offer.discountValue}%</span>
                          ) : (
                            <span>${offer.discountValue.toFixed(2)}</span>
                          )}
                        </TableCell>
                        <TableCell>${offer.originalPrice.toFixed(2)}</TableCell>
                        <TableCell>${offer.discountedPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <Calendar className="inline-block mr-1 h-3 w-3" />
                            {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge variant="success" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => populateEditForm(offer)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOffer(offer._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
