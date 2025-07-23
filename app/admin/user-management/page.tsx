"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MoreHorizontal, Search, Eye, UserX, UserCheck, Users, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  isBlocked: boolean;
  accountType: string;
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/user/all/');
      const data = response.data;
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setUsers(data.data.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.mobile,
          status: user.isBlocked ? "blocked" : "active",
          joinDate: new Date(user.createdAt).toISOString().split('T')[0],
          lastLogin: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Never',
          totalOrders: user.purchaseHistory?.length || 0,
          totalSpent: user.purchaseHistory?.reduce((total, purchase) => total + (purchase.price || 0), 0) || 0,
          isBlocked: user.isBlocked,
          accountType: user.role,
        })));
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }
  

  const filteredUsers = users.filter(
    (user) => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "blocked":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleBlockUser = async (userId: string, block: boolean = true) => {
    try {
      const response = await fetch(`${API_BASE}/api/user/${block ? 'block' : 'unblock'}/${userId}`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `User ${block ? 'blocked' : 'unblocked'} successfully`,
        });
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: `Failed to ${block ? 'block' : 'unblock'} user`,
        variant: "destructive"
      });
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  }

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter((u) => !u.isBlocked).length,
      blocked: users.filter((u) => u.isBlocked).length,
    }
  }

  const stats = getUserStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage customer accounts and user access.</p>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Can place orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <p className="text-xs text-muted-foreground">Account suspended</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage all customer accounts and their access permissions.</CardDescription>
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

              {loading && (
                <div className="text-center py-4">Loading users...</div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {!loading && !error && users.length === 0 && (
                <Alert>
                  <AlertDescription>
                    No users found.
                  </AlertDescription>
                </Alert>
              )}
              {!loading && !error && users.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.accountType}</Badge>
                      </TableCell>
                      <TableCell>{user.totalOrders}</TableCell>
                      <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>User Profile - {user.name}</DialogTitle>
                                  <DialogDescription>Complete user account information.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src="/placeholder-user.jpg" />
                                      <AvatarFallback>
                                        {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{user.name}</h3>
                                      <p className="text-muted-foreground">Member since {user.joinDate}</p>
                                      <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <div>
                                      <strong>Email:</strong> {user.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong> {user.phone}
                                    </div>
                                    <div>
                                      <strong>Account Type:</strong> {user.accountType}
                                    </div>
                                    <div>
                                      <strong>Verification:</strong> {user.verificationStatus}
                                    </div>
                                    <div>
                                      <strong>Total Orders:</strong> {user.totalOrders}
                                    </div>
                                    <div>
                                      <strong>Total Spent:</strong> ${user.totalSpent.toFixed(2)}
                                    </div>
                                    <div>
                                      <strong>Last Login:</strong> {user.lastLogin}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {user.isBlocked ? (
                              <DropdownMenuItem onClick={() => handleBlockUser(user.id, false)}>
                                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                Unblock User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user.id, true)}
                                className="text-destructive"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Block User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Users who can currently access and use the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search active users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              {loading && (
                <div className="text-center py-4">Loading users...</div>
              )}
              {!loading && filteredUsers.filter(user => !user.isBlocked).length === 0 && (
                <Alert>
                  <AlertDescription>
                    No active users found.
                  </AlertDescription>
                </Alert>
              )}
              {!loading && filteredUsers.filter(user => !user.isBlocked).length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => !user.isBlocked).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder-user.jpg`} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.accountType}</Badge>
                        </TableCell>
                        <TableCell>{user.totalOrders}</TableCell>
                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user.id, true)}
                                className="text-destructive"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Block User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Users</CardTitle>
              <CardDescription>Users who have been blocked from accessing the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blocked users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              {loading && (
                <div className="text-center py-4">Loading users...</div>
              )}
              {!loading && filteredUsers.filter(user => user.isBlocked).length === 0 && (
                <Alert>
                  <AlertDescription>
                    No blocked users found.
                  </AlertDescription>
                </Alert>
              )}
              {!loading && filteredUsers.filter(user => user.isBlocked).length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(user => user.isBlocked).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder-user.jpg`} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.accountType}</Badge>
                        </TableCell>
                        <TableCell>{user.totalOrders}</TableCell>
                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleBlockUser(user.id, false)}>
                                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                Unblock User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
