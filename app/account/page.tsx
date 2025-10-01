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
  Lock,
  Star,
  MessageSquare,
  ThumbsUp
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ReviewForm } from "@/components/review-form"

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

interface EligibleReviewItem {
  orderItemId: string
  orderId: string
  orderNumber: string
  product: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  purchaseDate: string
  deliveryDate: string
  quantity: number
  price: number
}

interface UserReview {
  _id: string
  product: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  order: {
    orderNumber: string
  }
  rating: number
  title: string
  comment: string
  images: string[]
  helpfulVotes: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [eligibleReviews, setEligibleReviews] = useState<EligibleReviewItem[]>([])
  const [userReviews, setUserReviews] = useState<UserReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedReviewItem, setSelectedReviewItem] = useState<EligibleReviewItem | null>(null)
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
    if (!user) {
      router.push("/login")
      return
    }
  }, [user, router])

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

  // Fetch eligible products for review
  const fetchEligibleReviews = async () => {
    try {
      const response = await api.get("/api/reviews/eligible")
      const data = response.data as { success: boolean; data: EligibleReviewItem[] }
      setEligibleReviews(data.data || [])
    } catch (error) {
      console.error("Error fetching eligible reviews:", error)
      toast.error("Failed to load eligible products for review")
    }
  }

  // Fetch user's existing reviews
  const fetchUserReviews = async () => {
    try {
      const response = await api.get("/api/reviews/user")
      const data = response.data as { success: boolean; data: UserReview[] }
      setUserReviews(data.data || [])
    } catch (error) {
      console.error("Error fetching user reviews:", error)
      toast.error("Failed to load your reviews")
    }
  }

  // Fetch review data
  const fetchReviewData = async () => {
    try {
      setReviewsLoading(true)
      await Promise.all([fetchEligibleReviews(), fetchUserReviews()])
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchOrders()
      fetchAddresses()
      fetchReviewData()
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

  // Open review dialog for a specific product
  const openReviewDialog = (item: EligibleReviewItem) => {
    setSelectedReviewItem(item)
    setShowReviewDialog(true)
  }

  // Submit review
  const submitReview = async (reviewData: { rating: number; title: string; comment: string; images?: string[] }) => {
    if (!selectedReviewItem) return

    try {
      const response = await api.post("/api/reviews", {
        orderItemId: selectedReviewItem.orderItemId,
        ...reviewData
      })
      
      if (response.data.success) {
        toast.success("Review submitted successfully!")
        setShowReviewDialog(false)
        setSelectedReviewItem(null)
        // Refresh review data
        fetchReviewData()
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast.error(error.response?.data?.message || "Failed to submit review")
    }
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
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your account and track your orders</p>
        </div>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addresses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {editMode ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button onClick={updateProfile} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{profile?.name}</div>
                      <div className="text-sm text-muted-foreground">Full Name</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{profile?.email}</div>
                      <div className="text-sm text-muted-foreground">Email Address</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{profile?.mobile || "Not provided"}</div>
                      <div className="text-sm text-muted-foreground">Mobile Number</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium capitalize">{profile?.role}</div>
                      <div className="text-sm text-muted-foreground">Account Type</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{profile?.city || "Not provided"}</div>
                      <div className="text-sm text-muted-foreground">City</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">Member Since</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4">
            {/* Eligible for Review Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Products to Review
                </CardTitle>
                <CardDescription>Review products from your delivered orders</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-lg">Loading...</div>
                  </div>
                ) : eligibleReviews.length > 0 ? (
                  <div className="space-y-4">
                    {eligibleReviews.map((item) => (
                      <div key={item.orderItemId} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {item.product.image && (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium">{item.product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Order #{item.orderNumber} • Delivered {new Date(item.deliveryDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} • PKR {item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => openReviewDialog(item)}
                            className="flex items-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            Write Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium">No products to review</div>
                    <div className="text-muted-foreground">Products from delivered orders will appear here</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Existing Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Your Reviews
                </CardTitle>
                <CardDescription>Manage your product reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-lg">Loading...</div>
                  </div>
                ) : userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {userReviews.map((review) => (
                      <div key={review._id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-4">
                            {review.product.image && (
                              <img 
                                src={review.product.image} 
                                alt={review.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium">{review.product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Order #{review.order.orderNumber} • {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {review.helpfulVotes > 0 && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <ThumbsUp className="h-4 w-4" />
                                {review.helpfulVotes}
                              </div>
                            )}
                            {!review.isVisible && (
                              <Badge variant="secondary">Hidden</Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium">No reviews yet</div>
                    <div className="text-muted-foreground">Your product reviews will appear here</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    setEditingAddress(null)
                    resetAddressForm()
                    setShowAddressDialog(true)
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {addressesLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading addresses...</div>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{address.label}</h3>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditAddress(address)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAddress(address._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{address.fullName}</div>
                        <div>{address.street}</div>
                        <div>{address.city}, {address.state} {address.postalCode}</div>
                        <div>{address.country}</div>
                        <div className="text-muted-foreground">{address.phoneNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-lg font-medium">No addresses saved</div>
                  <div className="text-muted-foreground">Add an address to make checkout faster</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">Keep your account secure with a strong password</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setShowPasswordDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {profile?.isVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>
                  {!profile?.isVerified && (
                    <Button variant="outline">Verify Email</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Account Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your address information" : "Add a new shipping address"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLabel">Label</Label>
                <Select
                  value={addressFormData.label}
                  onValueChange={(value) => setAddressFormData({...addressFormData, label: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={addressFormData.fullName}
                  onChange={(e) => setAddressFormData({...addressFormData, fullName: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={addressFormData.phoneNumber}
                onChange={(e) => setAddressFormData({...addressFormData, phoneNumber: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={addressFormData.street}
                onChange={(e) => setAddressFormData({...addressFormData, street: e.target.value})}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressFormData.city}
                  onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={addressFormData.state}
                  onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})}
                  placeholder="Enter state"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={addressFormData.postalCode}
                  onChange={(e) => setAddressFormData({...addressFormData, postalCode: e.target.value})}
                  placeholder="Enter postal code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addressFormData.country}
                  onChange={(e) => setAddressFormData({...addressFormData, country: e.target.value})}
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressFormData.isDefault}
                onChange={(e) => setAddressFormData({...addressFormData, isDefault: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="isDefault" className="text-sm">Set as default address</Label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={editingAddress ? updateAddress : addAddress}
                className="flex-1"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddressDialog(false)
                  setEditingAddress(null)
                  resetAddressForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordFormData.currentPassword}
                onChange={(e) => setPasswordFormData({...passwordFormData, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordFormData.newPassword}
                onChange={(e) => setPasswordFormData({...passwordFormData, newPassword: e.target.value})}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordFormData.confirmPassword}
                onChange={(e) => setPasswordFormData({...passwordFormData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={changePassword}
                className="flex-1"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false)
                  setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Form Dialog */}
      <ReviewForm
        isOpen={showReviewDialog}
        onClose={() => {
          setShowReviewDialog(false)
          setSelectedReviewItem(null)
        }}
        item={selectedReviewItem}
        onSubmit={submitReview}
      />
    </div>
  )
}
