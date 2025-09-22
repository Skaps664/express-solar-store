"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/services/api"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Edit, Trash2, UserPlus, Key } from "lucide-react"

export default function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false)
  const { toast } = useToast()
  const [creating, setCreating] = useState(false)
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '', cnic: '', mobile: '' })

  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(false)

  const roles = [
    {
      name: "admin",
      label: "Administrator",
      description: "Full access to all features",
      permissions: ["all"],
    },
    {
      name: "editor",
      label: "Editor",
      description: "Can manage content and products",
      permissions: ["products", "blog", "orders", "customers"],
    },
    {
      name: "moderator",
      label: "Moderator",
      description: "Can manage users and reviews",
      permissions: ["users", "reviews", "customers"],
    },
  ]

  const permissions = [
    { id: "products", label: "Products", description: "Manage product catalog" },
    { id: "orders", label: "Orders", description: "View and manage orders" },
    { id: "customers", label: "Customers", description: "Manage customer accounts" },
    { id: "users", label: "User Management", description: "Block/unblock users" },
    { id: "blog", label: "Blog", description: "Create and edit blog posts" },
    { id: "cms", label: "CMS", description: "Access content management" },
    { id: "brands", label: "Brands", description: "Manage product brands" },
    { id: "categories", label: "Categories", description: "Manage product categories" },
    { id: "analytics", label: "Analytics", description: "View analytics and reports" },
    { id: "settings", label: "Settings", description: "Modify system settings" },
    { id: "roles", label: "Role Management", description: "Manage user roles and permissions" },
  ]

  const filteredUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    let mounted = true
    const loadAdmins = async () => {
      try {
        setLoadingAdmins(true)
        const res = await api.get('/api/user/admin/users')
        const data: any = res.data
        if (data?.success && mounted) {
          // normalize returned users to expected shape
          const users = (data?.data?.users || data?.data || []).map((u: any) => ({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role || (u.isAdmin ? 'admin' : 'user'),
            status: u.isBlocked ? 'inactive' : 'active',
            lastLogin: u.updatedAt ? new Date(u.updatedAt).toLocaleString() : '',
            permissions: u.permissions || [],
          }))
          setAdminUsers(users)
        }
      } catch (err) {
        console.error('Failed to load admin users', err)
      } finally {
        setLoadingAdmins(false)
      }
    }

    loadAdmins()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">Manage admin users, roles, and permissions.</p>
        </div>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>Create a new admin user with specific role and permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user-name">Full Name</Label>
                <Input id="user-name" value={newAdminForm.name} onChange={(e) => setNewAdminForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" value={newAdminForm.email} onChange={(e) => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Enter email address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-password">Temporary Password</Label>
                <Input id="user-password" type="password" value={newAdminForm.password} onChange={(e) => setNewAdminForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Enter temporary password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-mobile">Phone / Mobile</Label>
                <Input id="user-mobile" type="text" value={newAdminForm.mobile} onChange={(e) => setNewAdminForm(prev => ({ ...prev, mobile: e.target.value }))} placeholder="Enter mobile number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-cnic">CNIC (optional)</Label>
                <Input id="user-cnic" type="text" value={newAdminForm.cnic} onChange={(e) => setNewAdminForm(prev => ({ ...prev, cnic: e.target.value }))} placeholder="Enter CNIC" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.name} value={role.name}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAddUserDialogOpen(false)} disabled={creating}>Cancel</Button>
              <Button onClick={async () => {
                try {
                  setCreating(true)
                  const payload = {
                    name: newAdminForm.name,
                    email: newAdminForm.email,
                    password: newAdminForm.password,
                    mobile: newAdminForm.mobile,
                    cnic: newAdminForm.cnic,
                  }
                  const res = await api.post('/api/user/admin/create', payload)
                  const resData: any = res.data
                  if (resData?.success) {
                    toast({ title: 'Admin created', description: 'New admin user created successfully' })
                    setIsAddUserDialogOpen(false)
                    setNewAdminForm({ name: '', email: '', password: '', cnic: '', mobile: '' })
                    // reload admins
                    try {
                      const listRes = await api.get('/api/user/admin/users')
                      const listData: any = listRes.data
                      if (listData?.success) {
                        const users = (listData?.data?.users || listData?.data || []).map((u: any) => ({
                          id: u._id || u.id,
                          name: u.name,
                          email: u.email,
                          role: u.role || (u.isAdmin ? 'admin' : 'user'),
                          status: u.isBlocked ? 'inactive' : 'active',
                          lastLogin: u.updatedAt ? new Date(u.updatedAt).toLocaleString() : '',
                          permissions: u.permissions || [],
                        }))
                        setAdminUsers(users)
                      }
                    } catch (e) {
                      console.error('Failed to refresh admin list', e)
                    }
                  } else {
                    throw new Error(resData?.message || 'Failed to create admin')
                  }
                } catch (err: any) {
                  console.error('Create admin error', err)
                  toast({ title: 'Error', description: err?.message || 'Failed to create admin', variant: 'destructive' })
                } finally {
                  setCreating(false)
                }
              }} disabled={creating}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage admin users and their access levels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deactivate
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

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Role management is disabled. Admins may create other admins using the "Add Admin User" button. Detailed role editing is not available.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
