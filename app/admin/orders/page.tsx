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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Eye, Package, Truck } from "lucide-react"
import WarningBanner from "@/components/warning-banner"

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Mock data - replace with your API calls
  const orders = [
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 234 567 8900",
      },
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 199.99 },
        { name: "Phone Case", quantity: 2, price: 29.99 },
      ],
      total: 259.97,
      status: "completed",
      paymentStatus: "paid",
      shippingAddress: "123 Main St, City, State 12345",
      date: "2024-01-15",
      trackingNumber: "TRK123456789",
    },
    {
      id: "ORD-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 234 567 8901",
      },
      items: [{ name: "Running Shoes", quantity: 1, price: 89.99 }],
      total: 89.99,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: "456 Oak Ave, City, State 12345",
      date: "2024-01-15",
      trackingNumber: null,
    },
    {
      id: "ORD-003",
      customer: {
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1 234 567 8902",
      },
      items: [
        { name: "Coffee Mug", quantity: 3, price: 15.99 },
        { name: "T-Shirt", quantity: 1, price: 24.99 },
      ],
      total: 72.96,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: "789 Pine St, City, State 12345",
      date: "2024-01-14",
      trackingNumber: "TRK987654321",
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
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
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "outline"}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
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
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                              <DialogDescription>Complete information about this order.</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="customer">Customer</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Order Items</h4>
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                                      <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                      </div>
                                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                  ))}
                                  <div className="flex justify-between items-center pt-2 border-t font-bold">
                                    <div>Total</div>
                                    <div>${order.total.toFixed(2)}</div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="customer" className="space-y-4">
                                <div className="space-y-2">
                                  <div>
                                    <strong>Name:</strong> {order.customer.name}
                                  </div>
                                  <div>
                                    <strong>Email:</strong> {order.customer.email}
                                  </div>
                                  <div>
                                    <strong>Phone:</strong> {order.customer.phone}
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="shipping" className="space-y-4">
                                <div className="space-y-2">
                                  <div>
                                    <strong>Address:</strong> {order.shippingAddress}
                                  </div>
                                  {order.trackingNumber && (
                                    <div>
                                      <strong>Tracking:</strong> {order.trackingNumber}
                                    </div>
                                  )}
                                  <div>
                                    <strong>Status:</strong> {order.status}
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
