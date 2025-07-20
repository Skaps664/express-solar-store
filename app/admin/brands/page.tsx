"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"

// For multi-select
import Select from "react-select"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<any | null>(null)

  // Categories for multi-select
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<any[]>([])
  const [editSelectedCategories, setEditSelectedCategories] = useState<any[]>([])

  // Form state for controlled inputs in edit dialog
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editTagline, setEditTagline] = useState("")
  const [editEstablishedYear, setEditEstablishedYear] = useState("")
  const [editHeadquarters, setEditHeadquarters] = useState("")
  const [editIsFeatured, setEditIsFeatured] = useState(false)
  const [editIsActive, setEditIsActive] = useState(true)

  // Fetch brands from API
  useEffect(() => {
    setLoading(true)
    // Fetch brands
    axios.get(`${API_BASE}/api/brands/admin/all`, { withCredentials: true })
      .then(res => setBrands(res.data))
      .catch(err => {
        console.error("Error fetching brands:", err)
      })
      .finally(() => setLoading(false))
    // Fetch categories (use public endpoint for all active main categories)
    axios.get(`${API_BASE}/api/category/`)
      .then(res => {
        setCategories(res.data.map((cat: any) => ({ value: cat._id, label: cat.name })))
      })
      .catch(err => {
        console.error("Error fetching categories:", err)
      })
  }, [])

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getBrandStats = () => {
    return {
      total: brands.length,
      active: brands.filter((b) => b.isActive === true).length,
      featured: brands.filter((b) => b.isFeatured === true).length,
      totalProducts: brands.reduce((sum, b) => sum + (b.allProductCount || 0), 0),
    }
  }

  const stats = getBrandStats()

  const handleAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Get boolean values properly
    const isFeatured = (form.querySelector('#isFeatured') as HTMLInputElement)?.checked || false
    const isActive = (form.querySelector('#isActive') as HTMLInputElement)?.checked || false

    formData.set("isFeatured", isFeatured.toString())
    formData.set("isActive", isActive.toString())

    // Add selected categories as array
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((cat: any) => {
        formData.append("categories[]", cat.value)
      })
    }

    setLoading(true)
    try {
      await axios.post(
        `${API_BASE}/api/brands/new/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )
      setIsAddDialogOpen(false)
      form.reset()
      setSelectedCategories([])
      // Refetch brands
      const res = await axios.get(`${API_BASE}/api/brands/admin/all`, { withCredentials: true })
      setBrands(res.data)
    } catch (err) {
      alert("Failed to add brand")
      console.error("Add brand error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editBrand) return

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add controlled form data
    formData.set("name", editName)
    formData.set("description", editDescription)
    formData.set("tagline", editTagline)
    formData.set("establishedYear", editEstablishedYear)
    formData.set("headquarters", editHeadquarters)
    formData.set("isFeatured", editIsFeatured ? "true" : "false")
    formData.set("isActive", editIsActive ? "true" : "false")

    // Add selected categories as array
    if (editSelectedCategories.length > 0) {
      editSelectedCategories.forEach((cat: any) => {
        formData.append("categories[]", cat.value)
      })
    }

    setLoading(true)
    try {
      // Always use the brand's slug for update
      await axios.put(
        `${API_BASE}/api/brands/update/${editBrand.slug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )
      setIsEditDialogOpen(false)
      setEditBrand(null)
      clearEditForm()
      setEditSelectedCategories([])
      // Refetch brands
      const res = await axios.get(`${API_BASE}/api/brands/admin/all`, { withCredentials: true })
      setBrands(res.data)
    } catch (err) {
      alert("Failed to update brand")
      console.error("Update brand error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBrand = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this brand? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
      await axios.delete(`${API_BASE}/api/brands/del/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        withCredentials: true,
      });
      // Refetch brands after deletion
      const res = await axios.get(`${API_BASE}/api/brands/admin/all`, { withCredentials: true })
      setBrands(res.data)
      alert("Brand deleted successfully.");
    } catch (err) {
      console.error("Failed to delete brand:", err);
      alert("Failed to delete brand. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Populate edit form when brand is selected
  const populateEditForm = (brand: any) => {
    setEditName(brand.name || "")
    setEditDescription(brand.description || "")
    setEditTagline(brand.tagline || "")
    setEditEstablishedYear(brand.establishedYear ? String(brand.establishedYear) : "")
    setEditHeadquarters(brand.headquarters || "")
    setEditIsFeatured(brand.isFeatured === true)
    setEditIsActive(brand.isActive === true)
    setEditSelectedCategories(
      Array.isArray(brand.categories)
        ? brand.categories.map((cat: any) => ({ value: cat._id || cat, label: cat.name || cat }))
        : []
    )
  }

  // Clear edit form
  const clearEditForm = () => {
    setEditName("")
    setEditDescription("")
    setEditTagline("")
    setEditEstablishedYear("")
    setEditHeadquarters("")
    setEditIsFeatured(false)
    setEditIsActive(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground">Manage product brands and their information.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>Create a new brand for your product catalog.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBrand} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input id="brand-name" name="name" required placeholder="Enter brand name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-description">Description</Label>
                <Textarea id="brand-description" name="description" required placeholder="Brief description of the brand" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-tagline">Tagline</Label>
                <Input id="brand-tagline" name="tagline" placeholder="Brand tagline" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-categories">Categories</Label>
                <Select
                  isMulti
                  options={categories}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                  classNamePrefix="react-select"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-logo">Logo Upload</Label>
                <Input id="brand-logo" name="logo" type="file" accept="image/*" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-banner">Banner Upload</Label>
                <Input id="brand-banner" name="banner" type="file" accept="image/*" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-thumbnail">Thumbnail Upload</Label>
                <Input id="brand-thumbnail" name="thumbnail" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-establishedYear">Established Year</Label>
                <Input id="brand-establishedYear" name="establishedYear" type="number" min="1800" max={new Date().getFullYear()} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-headquarters">Headquarters</Label>
                <Input id="brand-headquarters" name="headquarters" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" name="isFeatured" />
                <Label htmlFor="isFeatured">Featured Brand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Add Brand</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered brands</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Brands</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Homepage featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all brands</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Directory</CardTitle>
          <CardDescription>Manage all product brands and their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <div className="font-medium">{brand.name}</div>
                        <div className="text-sm text-muted-foreground">{brand.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{brand.allProductCount ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {brand.isFeatured ? (
                      <Badge variant="outline">Featured</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditBrand(brand);
                            populateEditForm(brand);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Brand
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteBrand(brand.slug)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Brand
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

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Edit brand details.</DialogDescription>
          </DialogHeader>
          {editBrand && (
            <form onSubmit={handleEditBrand} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input id="brand-name" name="name" required placeholder="Enter brand name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-description">Description</Label>
                <Textarea id="brand-description" name="description" required placeholder="Brief description of the brand" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-tagline">Tagline</Label>
                <Input id="brand-tagline" name="tagline" placeholder="Brand tagline" value={editTagline} onChange={(e) => setEditTagline(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-categories">Categories</Label>
                <Select
                  isMulti
                  options={categories}
                  value={editSelectedCategories}
                  onChange={setEditSelectedCategories}
                  placeholder="Select categories..."
                  classNamePrefix="react-select"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-logo">Logo Upload</Label>
                <Input id="brand-logo" name="logo" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-banner">Banner Upload</Label>
                <Input id="brand-banner" name="banner" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-thumbnail">Thumbnail Upload</Label>
                <Input id="brand-thumbnail" name="thumbnail" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-establishedYear">Established Year</Label>
                <Input id="brand-establishedYear" name="establishedYear" type="number" min="1800" max={new Date().getFullYear()} value={editEstablishedYear} onChange={(e) => setEditEstablishedYear(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-headquarters">Headquarters</Label>
                <Input id="brand-headquarters" name="headquarters" value={editHeadquarters} onChange={(e) => setEditHeadquarters(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" name="isFeatured" checked={editIsFeatured} onCheckedChange={(checked) => setEditIsFeatured(checked)} />
                <Label htmlFor="isFeatured">Featured Brand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" checked={editIsActive} onCheckedChange={(checked) => setEditIsActive(checked)} />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
