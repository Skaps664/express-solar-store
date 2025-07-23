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
import { MoreHorizontal, Search, Eye, Package, Truck } from "lucide-react"
import WarningBanner from "@/components/warning-banner"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface CustomerInfo {
  fullName?: string
  email?: string
  phoneNumber?: string
  whatsappNumber?: string
  shippingAddress?: string
  specialNotes?: string
}

interface Order {
  _id: string
  orderNumber?: string
  status: string
  paymentStatus?: string
  totalAmount?: number
  createdAt: string
  customerInfo?: CustomerInfo
  items?: OrderItem[]
  orderNotes?: string
  trackingNumber?: string
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        console.log("Fetching orders from:", `/api/orders/admin/all`)
        
        const response = await api.get('/api/orders/admin/all')
        console.log("Fetched orders:", response.data)
        setOrders((response.data as any).orders || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Update order status
  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const updateData: any = { status }
      if (paymentStatus) updateData.paymentStatus = paymentStatus
      
      await api.put(`/api/orders/${orderId}`, updateData)
      
      // Refresh orders after update
      const response = await api.get('/api/orders/admin/all')
      setOrders((response.data as any).orders || [])
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "outline"
      case "confirmed":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
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
      <WarningBanner/>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all orders from your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell>PKR {order.totalAmount?.toLocaleString() || "0"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>{order.status || "pending"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "Paid" ? "default" : "outline"}>
                      {order.paymentStatus || "Pending"}
                    </Badge>
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
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.orderNumber || order._id?.substring(0, 8)}</DialogTitle>
                              <DialogDescription>Complete order information and status</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Order Details</TabsTrigger>
                                <TabsTrigger value="customer">Customer Info</TabsTrigger>
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
                                </div>
                                <div>
                                  <strong>Items:</strong>
                                  {order.items?.map((item, index) => (
                                    <div key={index} className="border-b py-2">
                                      <div>{item.name} x {item.quantity}</div>
                                      <div className="text-sm text-muted-foreground">PKR {(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="text-lg font-semibold">
                                  <strong>Total:</strong>
                                  <div>PKR {order.totalAmount?.toLocaleString() || "0"}</div>
                                </div>
                              </TabsContent>
                              <TabsContent value="customer" className="space-y-4">
                                <div className="space-y-2">
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
                              </TabsContent>
                              <TabsContent value="shipping" className="space-y-4">
                                <div className="space-y-2">
                                  <div>
                                    <strong>Address:</strong> {order.customerInfo?.shippingAddress || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Special Notes:</strong> {order.customerInfo?.specialNotes || order.orderNotes || "None"}
                                  </div>
                                  {order.trackingNumber && (
                                    <div>
                                      <strong>Tracking:</strong> {order.trackingNumber}
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, "Processing")}>
                          <Package className="mr-2 h-4 w-4" />
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, "Shipped")}>
                          <Truck className="mr-2 h-4 w-4" />
                          Mark as Shipped
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
