"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  User, 
  Package, 
  Settings, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  Edit,
  Plus,
  Trash2,
  Home,
  Building,
  Save,
  Lock
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface OrderItem {
  name: string
  quantity: number
  price: number
  selectedVariant?: string
  image?: string
}

interface Order {
  _id: string
  orderNumber?: string
  status: string
  paymentStatus?: string
  totalAmount?: number
  createdAt: string
  items?: OrderItem[]
  orderNotes?: string
  trackingNumber?: string
  whatsappMessageContent?: string
  customerInfo?: {
    fullName?: string
    email?: string
    phoneNumber?: string
    whatsappNumber?: string
    shippingAddress?: string
    specialNotes?: string
  }
}

interface UserProfile {
  _id: string
  name: string
  email: string
  mobile?: string
  role: string
  createdAt: string
  lastLogin?: string
  isVerified?: boolean
  city?: string
  postalCode?: string
}

interface Address {
  _id: string
  label: string
  fullName: string
  phoneNumber: string
  street: string
  city: string
  state?: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function OrdersPage() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  
  const [formData, setFormData] = useState({
    mobile: "",
    city: "",
    postalCode: ""
  })

  const [addressFormData, setAddressFormData] = useState({
    label: "Home",
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    isDefault: false
  })

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
      return
    }
  }, [user, router, authLoading])

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/user/profile")
      const data = response.data as { success: boolean; user: UserProfile }
      setProfile(data.user)
      setFormData({
        mobile: data.user.mobile || "",
        city: data.user.city || "",
        postalCode: data.user.postalCode || ""
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await api.get("/api/orders/user")
      const data = response.data as { success: boolean; orders: Order[] }
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setOrdersLoading(false)
    }
  }

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true)
      const response = await api.get("/api/user/addresses")
      const data = response.data as { success: boolean; addresses: Address[] }
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error("Error fetching addresses:", error)
      toast.error("Failed to load addresses")
    } finally {
      setAddressesLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchOrders()
      fetchAddresses()
    }
  }, [user])

  // Update profile
  const updateProfile = async () => {
    try {
      const response = await api.put("/api/user/profile", formData)
      const data = response.data as { success: boolean; user: UserProfile; message: string }
      
      if (data.success) {
        setProfile(data.user)
        setEditMode(false)
        toast.success(data.message || "Profile updated successfully!")
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "Error updating profile. Please try again.")
    }
  }

  // Add address
  const addAddress = async () => {
    try {
      const response = await api.post("/api/user/addresses", addressFormData)
      const data = response.data as { success: boolean; address: Address; message: string }
      
      if (data.success) {
        setAddresses(prev => [...prev, data.address])
        setShowAddressDialog(false)
        resetAddressForm()
        toast.success(data.message || "Address added successfully!")
      }
    } catch (error: any) {
      console.error("Error adding address:", error)
      toast.error(error.response?.data?.message || "Error adding address. Please try again.")
    }
  }

  // Update address
  const updateAddress = async () => {
    if (!editingAddress) return
    
    try {
      const response = await api.put(`/api/user/addresses/${editingAddress._id}`, addressFormData)
      const data = response.data as { success: boolean; address: Address; message: string }
      
      if (data.success) {
        setAddresses(prev => prev.map(addr => 
          addr._id === editingAddress._id ? data.address : addr
        ))
        setShowAddressDialog(false)
        setEditingAddress(null)
        resetAddressForm()
        toast.success(data.message || "Address updated successfully!")
      }
    } catch (error: any) {
      console.error("Error updating address:", error)
      toast.error(error.response?.data?.message || "Error updating address. Please try again.")
    }
  }

  // Delete address
  const deleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return
    
    try {
      const response = await api.delete(`/api/user/addresses/${addressId}`)
      const data = response.data as { success: boolean; message: string }
      
      if (data.success) {
        setAddresses(prev => prev.filter(addr => addr._id !== addressId))
        toast.success(data.message || "Address deleted successfully!")
      }
    } catch (error: any) {
      console.error("Error deleting address:", error)
      toast.error(error.response?.data?.message || "Error deleting address. Please try again.")
    }
  }

  // Change password
  const changePassword = async () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordFormData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    try {
      const response = await api.put("/api/user/change-password", {
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword
      })
      const data = response.data as { success: boolean; message: string }
      
      if (data.success) {
        setShowPasswordDialog(false)
        setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        toast.success(data.message || "Password changed successfully!")
      }
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error(error.response?.data?.message || "Error changing password. Please try again.")
    }
  }

  const resetAddressForm = () => {
    setAddressFormData({
      label: "Home",
      fullName: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Pakistan",
      isDefault: false
    })
  }

  const openEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressFormData({
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      city: address.city,
      state: address.state || "",
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    })
    setShowAddressDialog(true)
  }

  // Get status color and icon
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "refunded":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Generate WhatsApp link for reordering
  const generateWhatsAppLink = async (orderId: string) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/whatsapp`)
      const data = response.data as { success: boolean; whatsappURL?: string }
      if (data.whatsappURL) {
        window.open(data.whatsappURL, '_blank')
      }
    } catch (error) {
      console.error("Error generating WhatsApp link:", error)
      toast.error("Error generating WhatsApp link. Please try again.")
    }
  }

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Checking authentication...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Please log in to access your account.</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading your account...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
          <p className="text-muted-foreground">Manage and track your orders</p>
        </div>
      </div>

      {/* Account Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(order => order.status?.toLowerCase() === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(order => order.status?.toLowerCase() === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Track your orders and view order details</CardDescription>
                </div>
                <Button variant="outline" onClick={fetchOrders} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading orders...</div>
                </div>
              ) : orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order.orderNumber || order._id?.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {order.items?.length || 0} item(s)
                        </TableCell>
                        <TableCell>
                          PKR {order.totalAmount?.toLocaleString() || "0"}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(order.paymentStatus || "pending")}>
                            {order.paymentStatus || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Order Details - {order.orderNumber || order._id?.substring(0, 8)}</DialogTitle>
                                  <DialogDescription>Complete order information and tracking</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong>Order Number:</strong> {order.orderNumber || order._id}
                                    </div>
                                    <div>
                                      <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <div>
                                      <strong>Status:</strong> 
                                      <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                                        {order.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <strong>Payment Status:</strong>
                                      <Badge className={`ml-2 ${getPaymentStatusColor(order.paymentStatus || "pending")}`}>
                                        {order.paymentStatus || "Pending"}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {order.trackingNumber && (
                                    <div>
                                      <strong>Tracking Number:</strong> {order.trackingNumber}
                                    </div>
                                  )}

                                  <div>
                                    <strong>Items Ordered:</strong>
                                    {order.items?.map((item, index) => (
                                      <div key={index} className="border-b py-2 mt-2">
                                        <div className="flex justify-between">
                                          <div>
                                            <div className="font-medium">{item.name}</div>
                                            {item.selectedVariant && (
                                              <div className="text-sm text-gray-500">Variant: {item.selectedVariant}</div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div>Qty: {item.quantity}</div>
                                            <div className="text-sm text-muted-foreground">
                                              PKR {(item.price * item.quantity).toLocaleString()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="text-lg font-semibold mt-4 pt-2 border-t">
                                      Total: PKR {order.totalAmount?.toLocaleString() || "0"}
                                    </div>
                                  </div>

                                  {order.customerInfo?.shippingAddress && (
                                    <div>
                                      <strong>Shipping Address:</strong>
                                      <div className="mt-1 p-2 bg-gray-50 rounded">
                                        {order.customerInfo.shippingAddress}
                                      </div>
                                    </div>
                                  )}

                                  {order.orderNotes && (
                                    <div>
                                      <strong>Order Notes:</strong>
                                      <div className="mt-1 p-2 bg-gray-50 rounded">
                                        {order.orderNotes}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generateWhatsAppLink(order._id)}
                              title="Contact via WhatsApp"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-lg font-medium">No orders yet</div>
                  <div className="text-muted-foreground">Start shopping to see your orders here</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>     
      </Tabs>
    </div>
  )
}
