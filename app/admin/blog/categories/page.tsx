"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Tag } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/services/api"

interface BlogCategory {
  _id: string
  name: {
    en: string
    ur: string
    ps: string
  }
  slug: string
  description: {
    en: string
    ur: string
    ps: string
  }
  parent?: string | {
    _id: string
    name: {
      en: string
      ur: string
      ps: string
    }
    slug: string
  }
  isActive: boolean
  blogCount: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function BlogCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ur' | 'ps'>('en')
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState<Partial<BlogCategory>>({
    name: { en: '', ur: '', ps: '' },
    slug: '',
    description: { en: '', ur: '', ps: '' },
    isActive: true,
    sortOrder: 0
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        // Add cache-busting timestamp and includeInactive parameter
        const timestamp = Date.now()
        const response = await api.get(`/api/blog-categories?includeInactive=true&_t=${timestamp}`)
        const data = response.data as any
        console.log('Fetched categories response:', data) // Debug log
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle name change and auto-generate slug
  const handleNameChange = (value: string, lang: 'en' | 'ur' | 'ps') => {
    setFormData(prev => ({
      ...prev,
      name: {
        ...prev.name!,
        [lang]: value
      },
      slug: lang === 'en' ? generateSlug(value) : prev.slug
    }))
  }

  // Save category
  const handleSaveCategory = async () => {
    try {
      if (!formData.name?.en.trim()) {
        toast.error('Please enter a category name in English')
        return
      }

      // Prepare data for API (remove slug for creation, backend generates it)
      const apiData = { ...formData }
      if (!selectedCategory) {
        delete apiData.slug // Let backend generate slug for new categories
      }

      if (selectedCategory) {
        // Update existing category
        await api.put(`/api/blog-categories/${selectedCategory._id}`, apiData)
        toast.success('Category updated successfully')
      } else {
        // Create new category
        console.log('Sending data:', apiData) // Debug log
        await api.post('/api/blog-categories', apiData)
        toast.success('Category created successfully')
      }

      setIsAddDialogOpen(false)
      setSelectedCategory(null)
      setFormData({
        name: { en: '', ur: '', ps: '' },
        slug: '',
        description: { en: '', ur: '', ps: '' },
        isActive: true,
        sortOrder: 0
      })
      
      // Refresh categories list
      const timestamp = Date.now()
      const response = await api.get(`/api/blog-categories?includeInactive=true&_t=${timestamp}`)
      const data = response.data as any
      console.log('Refreshed categories after save:', data) // Debug log
      setCategories(data.categories || [])
    } catch (error: any) {
      console.error('Error saving category:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Failed to save category'
      toast.error(errorMessage)
    }
  }

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId)
    if (category && category.blogCount > 0) {
      toast.error(`Cannot delete category "${category.name.en}" as it contains ${category.blogCount} blog(s)`)
      return
    }

    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await api.delete(`/api/blog-categories/${categoryId}`)
      toast.success('Category deleted successfully')
      setCategories(categories.filter(category => category._id !== categoryId))
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  // Edit category
  const handleEditCategory = (category: BlogCategory) => {
    setSelectedCategory(category)
    setFormData(category)
    setIsAddDialogOpen(true)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.ur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.ps.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Categories</h1>
          <p className="text-muted-foreground">Organize your blog content with multilingual categories.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {selectedCategory ? 'Edit Category' : 'New Category'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedCategory ? 'Edit Blog Category' : 'Create New Blog Category'}</DialogTitle>
              <DialogDescription>
                Create multilingual blog categories to organize your content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label>Language:</Label>
                <Select value={activeLanguage} onValueChange={(value: 'en' | 'ur' | 'ps') => setActiveLanguage(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                    <SelectItem value="ps">Pashto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name ({activeLanguage.toUpperCase()})</Label>
                  <Input
                    id="name"
                    value={formData.name?.[activeLanguage] || ''}
                    onChange={(e) => handleNameChange(e.target.value, activeLanguage)}
                    placeholder={`Enter category name in ${activeLanguage === 'en' ? 'English' : activeLanguage === 'ur' ? 'Urdu' : 'Pashto'}`}
                  />
                </div>

                {activeLanguage === 'en' && (
                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="category-url-slug"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="description">Description ({activeLanguage.toUpperCase()})</Label>
                  <Textarea
                    id="description"
                    value={formData.description?.[activeLanguage] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: {
                        ...prev.description!,
                        [activeLanguage]: e.target.value
                      }
                    }))}
                    placeholder={`Category description in ${activeLanguage === 'en' ? 'English' : activeLanguage === 'ur' ? 'Urdu' : 'Pashto'}`}
                    rows={3}
                  />
                </div>

                {activeLanguage === 'en' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="parent">Parent Category</Label>
                      <Select
                        value={typeof formData.parent === 'string' ? formData.parent : formData.parent?._id || 'none'}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, parent: value === 'none' ? undefined : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Top Level)</SelectItem>
                          {categories
                            .filter(cat => cat._id !== selectedCategory?._id && cat.isActive)
                            .map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name.en}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active Category</Label>
                    </div>
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCategory}>
                <Tag className="mr-2 h-4 w-4" />
                {selectedCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Categories</CardTitle>
          <CardDescription>Manage your multilingual blog categories and hierarchy.</CardDescription>
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
                <TableHead>Name</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Blogs</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{category.name.en}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{category.description.en}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeof category.parent === 'object' && category.parent?.name ? 
                      category.parent.name.en : 
                      'Top Level'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.blogCount}</TableCell>
                  <TableCell>{category.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {category.name.en && <Badge variant="outline" className="text-xs">EN</Badge>}
                      {category.name.ur && <Badge variant="outline" className="text-xs">UR</Badge>}
                      {category.name.ps && <Badge variant="outline" className="text-xs">PS</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteCategory(category._id)}
                          disabled={category.blogCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
    </div>
  )
}
