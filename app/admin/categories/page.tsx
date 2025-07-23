"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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
import { MoreHorizontal, Plus, Search, Edit, Trash2, Sun, Battery, Zap, Tag } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<any | null>(null)

  // Form state for controlled inputs
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editIcon, setEditIcon] = useState("")
  const [editLevel, setEditLevel] = useState(1)
  const [editParentCategory, setEditParentCategory] = useState("")
  const [editIsActive, setEditIsActive] = useState(true)
  const [editIsFeatured, setEditIsFeatured] = useState(false)
  const [editSortOrder, setEditSortOrder] = useState(0)

  // Populate edit form when category is selected
  const populateEditForm = (category: any) => {
    setEditName(category.name || "")
    setEditDescription(category.description || "")
    setEditIcon(category.icon || "")
    setEditLevel(category.level || 1)
    setEditParentCategory(category.parentCategory || "")
    setEditIsActive(category.isActive ?? true)
    setEditIsFeatured(category.isFeatured ?? false)
    setEditSortOrder(category.sortOrder ?? 0)
  }

  // Clear edit form
  const clearEditForm = () => {
    setEditName("")
    setEditDescription("")
    setEditIcon("")
    setEditLevel(1)
    setEditParentCategory("")
    setEditIsActive(true)
    setEditIsFeatured(false)
    setEditSortOrder(0)
  }

  // Fetch categories
  useEffect(() => {
    setLoading(true)
    axios.get(`${API_BASE}/api/category/admin/all`, { withCredentials: true })
      .then(res => {
        // Normalize IDs for easier use
        setCategories(res.data.map((cat: any) => ({
          ...cat,
          id: cat._id,
          status: cat.isActive ? "active" : "inactive",
          featured: cat.isFeatured ?? false,
          productCount: cat.productCount ?? 0,
          sortOrder: cat.sortOrder ?? 0,
          parentCategory: cat.parentCategory?._id || cat.parentCategory || "",
        })))
      })
      .catch(err => {
        console.error("Error fetching categories:", err)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      (category.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (category.description?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()),
  )

  const getIcon = (iconName: any) => {
    switch (iconName) {
      case "Sun":
        return Sun
      case "Battery":
        return Battery
      case "Zap":
        return Zap
      default:
        return Tag
    }
  }

  const getCategoryStats = () => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      featured: categories.filter((c) => c.featured).length,
      mainCategories: categories.filter((c) => !c.parentCategory).length,
      subCategories: categories.filter((c) => c.parentCategory).length,
    }
  }

  const stats = getCategoryStats()

  // --- ADD CATEGORY ---
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    
    setLoading(true)
    try {
      const formData = new FormData(form)
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        icon: formData.get("icon") as string,
        level: parseInt(formData.get("level") as string) || 1,
        sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
        parentCategory: (formData.get("parentCategory") as string) || null,
        isActive: (form.querySelector('#isActive') as HTMLInputElement)?.checked ?? true,
        isFeatured: (form.querySelector('#isFeatured') as HTMLInputElement)?.checked ?? false,
      }

      await axios.post(
        `${API_BASE}/api/category/new/create`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      setIsAddDialogOpen(false)
      form.reset()
      const res = await axios.get(`${API_BASE}/api/category/admin/all`, { withCredentials: true })
      setCategories(res.data.map((cat: any) => ({
        ...cat,
        id: cat._id,
        status: cat.isActive ? "active" : "inactive",
        featured: cat.isFeatured ?? false,
        productCount: cat.productCount ?? 0,
        sortOrder: cat.sortOrder ?? 0,
        parentCategory: cat.parentCategory?._id || cat.parentCategory || "",
      })))
    } catch (err: any) {
      alert("Failed to add category")
      console.error("Add category error:", err?.response?.data || err)
    } finally {
      setLoading(false)
    }
  }

  // --- EDIT CATEGORY ---
  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    try {
      const data = {
        name: editName,
        description: editDescription,
        icon: editIcon,
        level: editLevel,
        parentCategory: editParentCategory || null,
        isActive: editIsActive,
        isFeatured: editIsFeatured,
        sortOrder: editSortOrder,
      }

      await axios.put(
        `${API_BASE}/api/category/update/${editCategory.id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      setIsEditDialogOpen(false)
      setEditCategory(null)
      clearEditForm()
      const res = await axios.get(`${API_BASE}/api/category/admin/all`, { withCredentials: true })
      setCategories(res.data.map((cat: any) => ({
        ...cat,
        id: cat._id,
        status: cat.isActive ? "active" : "inactive",
        featured: cat.isFeatured ?? false,
        productCount: cat.productCount ?? 0,
        sortOrder: cat.sortOrder ?? 0,
        parentCategory: cat.parentCategory?._id || cat.parentCategory || "",
      })))
    } catch (err: any) {
      alert("Failed to update category")
      console.error("Update category error:", err?.response?.data || err)
    } finally {
      setLoading(false)
    }
  }

  // --- DELETE CATEGORY ---
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      await axios.delete(`${API_BASE}/api/category/delete/${id}`, { withCredentials: true })
      
      // Refetch categories
      const res = await axios.get(`${API_BASE}/api/category/admin/all`, { withCredentials: true })
      setCategories(res.data.map((cat: any) => ({
        ...cat,
        id: cat._id,
        status: cat.isActive ? "active" : "inactive",
        featured: cat.isFeatured ?? false,
        productCount: cat.productCount ?? 0,
        sortOrder: cat.sortOrder ?? 0,
        parentCategory: cat.parentCategory?._id || cat.parentCategory || "",
      })))
    } catch (err: any) {
      console.error("Failed to delete category:", err)
      alert(`Failed to delete category: ${err?.response?.data?.message || err.message || "Please try again."}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories and subcategories.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new product category or subcategory.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input id="category-name" name="name" required placeholder="Enter category name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea id="category-description" name="description" required placeholder="Describe this category" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-icon">Icon</Label>
                <Input id="category-icon" name="icon" placeholder="e.g. Sun, Battery, Zap, Tag" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-level">Level</Label>
                <Input id="category-level" name="level" type="number" min={1} defaultValue={1} required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sort-order">Sort Order</Label>
                <Input id="sort-order" name="sortOrder" type="number" min={0} defaultValue={0} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="parent-category">Parent Category</Label>
                <select id="parent-category" name="parentCategory" className="border rounded p-2">
                  <option value="">None (Main Category)</option>
                  {categories.filter((c) => !c.parentCategory).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isFeatured" name="isFeatured" />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Edit category details.</DialogDescription>
            </DialogHeader>
            {editCategory && (
              <form onSubmit={handleEditCategory} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category-name">Category Name</Label>
                  <Input id="edit-category-name" name="name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category-description">Description</Label>
                  <Textarea id="edit-category-description" name="description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category-icon">Icon</Label>
                  <Input id="edit-category-icon" name="icon" value={editIcon} onChange={(e) => setEditIcon(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-level">Level</Label>
                  <Input id="edit-level" name="level" type="number" min={1} value={editLevel} onChange={(e) => setEditLevel(parseInt(e.target.value) || 1)} required />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-sort-order">Sort Order</Label>
                  <Input id="edit-sort-order" name="sortOrder" type="number" min={0} value={editSortOrder} onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-parent-category">Parent Category</Label>
                  <select id="edit-parent-category" name="parentCategory" className="border rounded p-2" value={editParentCategory} onChange={(e) => setEditParentCategory(e.target.value)}>
                    <option value="">None (Main Category)</option>
                    {categories.filter((c) => !c.parentCategory && c.id !== editCategory?.id).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-isActive" name="isActive" checked={editIsActive} onCheckedChange={setEditIsActive} />
                  <Label htmlFor="edit-isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-isFeatured" name="isFeatured" checked={editIsFeatured} onCheckedChange={setEditIsFeatured} />
                  <Label htmlFor="edit-isFeatured">Featured</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sortOrder">Sort Order</Label>
                  <Input id="edit-sortOrder" name="sortOrder" type="number" min={0} value={editSortOrder} onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Categories</CardTitle>
            <Tag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.mainCategories}</div>
            <p className="text-xs text-muted-foreground">Top level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <Tag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.subCategories}</div>
            <p className="text-xs text-muted-foreground">Child categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Tag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Tag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Homepage display</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Categories Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {categories
          .filter((category) => !category.parentCategory)
          .map((category) => {
            const IconComponent = getIcon(category.icon)
            const subCategories = categories.filter((c) => c.parentCategory === category.id)
            return (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                  <div className="p-2 rounded-md" style={{ backgroundColor: category.color }}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category.productCount}</div>
                  <p className="text-xs text-muted-foreground mb-2">{subCategories.length} subcategories</p>
                  {category.featured && <Badge variant="outline">Featured</Badge>}
                </CardContent>
              </Card>
            )
          })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
          <CardDescription>Manage all categories and their relationships.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => {
                const IconComponent = getIcon(category.icon)
                const isSubCategory = !!category.parentCategory
                const parentName = isSubCategory ? categories.find((c) => c.id === category.parentCategory)?.name : null

                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md" style={{ backgroundColor: category.color }}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {isSubCategory && "↳ "}
                            {category.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isSubCategory
                              ? `Under ${parentName}`
                              : category.description
                                ? `${category.description.substring(0, 50)}...`
                                : ""}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isSubCategory ? "secondary" : "default"}>
                        {isSubCategory ? "Subcategory" : "Main"}
                      </Badge>
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <Badge variant={category.status === "active" ? "default" : "secondary"}>{category.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {category.featured ? (
                        <Badge variant="outline">Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setEditCategory(category)
                            populateEditForm(category)
                            setIsEditDialogOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
