"use client"

import { useState, useEffect } from "react"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Eye, Package, Truck, Download, Calendar, Users, ShoppingCart, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import WarningBanner from "@/components/warning-banner"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

interface OrderItem {
  name: string
  quantity: number
  price: number
  selectedVariant?: string
  image?: string
}

interface CustomerInfo {
  fullName?: string
  email?: string
  phoneNumber?: string
  whatsappNumber?: string
  shippingAddress?: string
  specialNotes?: string
}

interface User {
  _id: string
  name?: string
  email?: string
  mobile?: string
  role?: string
  createdAt?: string
}

interface Order {
  _id: string
  orderNumber?: string
  status: string
  paymentStatus?: string
  paymentMethod?: string
  totalAmount?: number
  createdAt: string
  customerInfo?: CustomerInfo
  user?: User
  items?: OrderItem[]
  orderNotes?: string
  trackingNumber?: string
  whatsappMessageContent?: string
}

interface OrderStats {
  total: number
  pending: number
  confirmed: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Fetch orders from API
  const fetchOrders = async (status = "all") => {
    try {
      setLoading(true)
      console.log("Fetching orders from:", `/api/orders/admin/all`)
      
      // Always fetch all orders and filter on frontend for better UX
      const response = await api.get(`/api/orders/admin/all`)
      console.log("Fetched orders:", response.data)
      
      setOrders((response.data as any).orders || [])
      setStats((response.data as any).stats || stats)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Update order status
  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const updateData: any = { status }
      if (paymentStatus) updateData.paymentStatus = paymentStatus
      
      await api.put(`/api/orders/${orderId}`, updateData)
      
      // Update the order in the local state instead of refetching
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: status, ...(paymentStatus && { paymentStatus }) }
            : order
        )
      )

      // Update stats
      await fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  // Download orders report
  const downloadReport = async () => {
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : ""
      
      // Use the api service to make the request (it handles auth automatically)
      const response = await api.get(`/api/orders/admin/export${params}`, {
        responseType: 'blob', // Important for file downloads
      })
      
      // Create download
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `orders-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      console.log('Report downloaded successfully')
    } catch (error) {
      console.error("Error downloading report:", error)
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.')
      } else if (error.response?.status === 403) {
        alert('Access denied. Admin privileges required.')
      } else {
        alert('Error downloading report. Please try again.')
      }
    }
  }

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    if (activeTab === "all") {
      return orders.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return orders.filter(
      (order) => {
        const matchesStatus = order.status?.toLowerCase() === activeTab.toLowerCase()
        const matchesSearch = 
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        
        return matchesStatus && matchesSearch
      }
    )
  }

  const filteredOrders = getFilteredOrders()

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

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track all customer orders with detailed insights.</p>
        </div>
        <Button onClick={downloadReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage all orders from your customers.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabs for filtering by status */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-7 w-fit">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, or logged users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Logged User</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderNumber || order._id?.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerInfo?.fullName || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{order.customerInfo?.email || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{order.customerInfo?.phoneNumber || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user?.name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{order.user?.email || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{order.user?.role || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell>PKR {order.totalAmount?.toLocaleString() || "0"}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.status)}
                          {order.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start">
                          <Badge className={getPaymentStatusColor(order.paymentStatus || "pending")}>
                            {order.paymentStatus || "Pending"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.paymentMethod || "-"}</div>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Order Details - {order.orderNumber || order._id?.substring(0, 8)}</DialogTitle>
                                  <DialogDescription>Complete order information and status</DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="details" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="details">Order Details</TabsTrigger>
                                    <TabsTrigger value="customer">Customer Info</TabsTrigger>
                                    <TabsTrigger value="user">Logged User</TabsTrigger>
                                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <strong>Order ID:</strong> {order._id}
                                      </div>
                                      <div>
                                        <strong>Order Number:</strong> {order.orderNumber || "N/A"}
                                      </div>
                                      <div>
                                        <strong>Status:</strong> 
                                        <select 
                                          value={order.status} 
                                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                          className="ml-2 p-1 border rounded"
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Confirmed">Confirmed</option>
                                          <option value="Processing">Processing</option>
                                          <option value="Shipped">Shipped</option>
                                          <option value="Delivered">Delivered</option>
                                          <option value="Cancelled">Cancelled</option>
                                        </select>
                                      </div>
                                      <div>
                                        <strong>Payment Status:</strong>
                                        <select 
                                          value={order.paymentStatus || "Pending"} 
                                          onChange={(e) => updateOrderStatus(order._id, order.status, e.target.value)}
                                          className="ml-2 p-1 border rounded"
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Paid">Paid</option>
                                          <option value="Failed">Failed</option>
                                          <option value="Refunded">Refunded</option>
                                        </select>
                                      </div>
                                      <div>
                                        <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
                                      </div>
                                    </div>
                                    <div>
                                      <strong>Items:</strong>
                                      {order.items?.map((item, index) => (
                                        <div key={index} className="border-b py-2">
                                          <div className="flex justify-between">
                                            <div>
                                              <div className="font-medium">{item.name}</div>
                                              {item.selectedVariant && (
                                                <div className="text-sm text-gray-500">Variant: {item.selectedVariant}</div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div>Qty: {item.quantity}</div>
                                              <div className="text-sm text-muted-foreground">PKR {(item.price * item.quantity).toLocaleString()}</div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-lg font-semibold border-t pt-2">
                                      <strong>Total: PKR {order.totalAmount?.toLocaleString() || "0"}</strong>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="customer" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <strong>Name:</strong> {order.customerInfo?.fullName || "N/A"}
                                      </div>
                                      <div>
                                        <strong>Email:</strong> {order.customerInfo?.email || "N/A"}
                                      </div>
                                      <div>
                                        <strong>Phone:</strong> {order.customerInfo?.phoneNumber || "N/A"}
                                      </div>
                                      <div>
                                        <strong>WhatsApp:</strong> {order.customerInfo?.whatsappNumber || "N/A"}
                                      </div>
                                    </div>
                                    <div>
                                      <strong>Shipping Address:</strong> 
                                      <div className="mt-1 p-2 bg-gray-50 rounded">{order.customerInfo?.shippingAddress || "N/A"}</div>
                                    </div>
                                    <div>
                                      <strong>Special Notes:</strong> 
                                      <div className="mt-1 p-2 bg-gray-50 rounded">{order.customerInfo?.specialNotes || "None"}</div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="user" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <strong>User Name:</strong> {order.user?.name || "N/A"}
                                      </div>
                                      <div>
                                        <strong>User Email:</strong> {order.user?.email || "N/A"}
                                      </div>
                                      <div>
                                        <strong>User Mobile:</strong> {order.user?.mobile || "N/A"}
                                      </div>
                                      <div>
                                        <strong>User Role:</strong> {order.user?.role || "N/A"}
                                      </div>
                                      <div>
                                        <strong>User Joined:</strong> {order.user?.createdAt ? new Date(order.user.createdAt).toLocaleDateString() : "N/A"}
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="shipping" className="space-y-4">
                                    <div className="space-y-2">
                                      <div>
                                        <strong>Address:</strong> {order.customerInfo?.shippingAddress || "N/A"}
                                      </div>
                                      <div>
                                        <strong>Order Notes:</strong> {order.orderNotes || "None"}
                                      </div>
                                      {order.trackingNumber && (
                                        <div>
                                          <strong>Tracking:</strong> {order.trackingNumber}
                                        </div>
                                      )}
                                      {order.whatsappMessageContent && (
                                        <div>
                                          <strong>WhatsApp Message:</strong>
                                          <div className="mt-1 p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">{order.whatsappMessageContent}</div>
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order._id, "Confirmed");
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Confirmed
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order._id, "Processing");
                              }}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order._id, "Shipped");
                              }}
                            >
                              <Truck className="mr-2 h-4 w-4" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.preventDefault();
                                updateOrderStatus(order._id, "Delivered");
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">No orders found</div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
