"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Editor {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const availablePermissions: Permission[] = [
  { id: 'manage_users', name: 'Manage Users', description: 'Can view, block, and delete users' },
  { id: 'manage_products', name: 'Manage Products', description: 'Can create, edit, and delete products' },
  { id: 'manage_orders', name: 'Manage Orders', description: 'Can view and manage orders' },
  { id: 'manage_categories', name: 'Manage Categories', description: 'Can create and manage categories' },
  { id: 'manage_brands', name: 'Manage Brands', description: 'Can create and manage brands' },
  { id: 'manage_editors', name: 'Manage Editors', description: 'Can create and manage editor accounts' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Can view analytics and reports' },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Can modify system settings' },
];

export default function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roles, setRoles] = useState<Role[]>([])
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRole, setNewRole] = useState({ name: '', description: '' })
  const { toast } = useToast()

  useEffect(() => {
    fetchRoles()
    fetchEditors()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/roles`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch roles');
      
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const fetchEditors = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/editors`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch editors');
      
      const data = await response.json();
      if (data.success) {
        setEditors(data.data);
      }
    } catch (error) {
      console.error('Error fetching editors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch editors",
        variant: "destructive"
      });
    }
  }

  const handleCreateRole = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/roles`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRole.name,
          description: newRole.description,
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) throw new Error('Failed to create role');

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Role created successfully",
        });
        fetchRoles();
        setNewRole({ name: '', description: '' });
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  }

  const handleUpdateRole = async (roleId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/roles/${roleId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingRole?.name,
          description: editingRole?.description,
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
        fetchRoles();
        setEditingRole(null);
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive"
      });
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/roles/${roleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete role');

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        });
        fetchRoles();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive"
      });
    }
  }

  const filteredRoles = roles.filter(
    (role) => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        <p className="text-muted-foreground">Create and manage editor roles and permissions.</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Create a new role with specific permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Content Editor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role's responsibilities"
                />
              </div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          setSelectedPermissions(prev =>
                            checked
                              ? [...prev, permission.id]
                              : prev.filter(p => p !== permission.id)
                          )
                        }}
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor={permission.id}>{permission.name}</Label>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Manage custom roles and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No roles found. Create your first role to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Editors</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="font-medium">{role.name}</div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map(permId => {
                          const permission = availablePermissions.find(p => p.id === permId);
                          return permission ? (
                            <Badge key={permId} variant="outline">
                              {permission.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editors.filter(editor => editor.role === role.id).length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Role</DialogTitle>
                              <DialogDescription>Modify role details and permissions.</DialogDescription>
                            </DialogHeader>
                            {/* Add edit form similar to create form */}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
