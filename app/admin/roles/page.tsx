"use client"

import { useState } from "react"
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

  // Mock data - replace with your API calls
  const adminUsers = [
    {
      id: "1",
      name: "John Admin",
      email: "john@admin.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 10:30",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Jane Editor",
      email: "jane@editor.com",
      role: "editor",
      status: "active",
      lastLogin: "2024-01-14 15:45",
      permissions: ["products", "blog", "orders"],
    },
    {
      id: "3",
      name: "Bob Moderator",
      email: "bob@moderator.com",
      role: "moderator",
      status: "inactive",
      lastLogin: "2024-01-10 09:15",
      permissions: ["users", "reviews"],
    },
  ]

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
                <Input id="user-name" placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="Enter email address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-password">Temporary Password</Label>
                <Input id="user-password" type="password" placeholder="Enter temporary password" />
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
              <Button onClick={() => setIsAddUserDialogOpen(false)}>Create User</Button>
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
              <CardDescription>Configure roles and their associated permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roles.map((role) => (
                  <div key={role.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{role.label}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Edit Permissions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Permissions - {role.label}</DialogTitle>
                            <DialogDescription>Configure what this role can access and modify.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${role.name}-${permission.id}`}
                                  defaultChecked={
                                    role.permissions.includes("all") || role.permissions.includes(permission.id)
                                  }
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <Label htmlFor={`${role.name}-${permission.id}`} className="font-medium">
                                    {permission.label}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button>Save Permissions</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.includes("all") ? (
                        <Badge>All Permissions</Badge>
                      ) : (
                        role.permissions.map((perm) => (
                          <Badge key={perm} variant="outline">
                            {permissions.find((p) => p.id === perm)?.label || perm}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
