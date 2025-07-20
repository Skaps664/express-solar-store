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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Eye, Mail, Phone } from "lucide-react"
import WarningBanner from "@/components/warning-banner"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with your API calls
  const customers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      totalOrders: 12,
      totalSpent: 1250.5,
      status: "active",
      joinDate: "2023-06-15",
      lastOrder: "2024-01-15",
      address: "123 Main St, City, State 12345",
      orders: [
        { id: "ORD-001", date: "2024-01-15", total: 259.97, status: "completed" },
        { id: "ORD-005", date: "2024-01-10", total: 89.99, status: "completed" },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234 567 8901",
      totalOrders: 8,
      totalSpent: 890.25,
      status: "active",
      joinDate: "2023-08-22",
      lastOrder: "2024-01-12",
      address: "456 Oak Ave, City, State 12345",
      orders: [
        { id: "ORD-002", date: "2024-01-12", total: 150.0, status: "pending" },
        { id: "ORD-006", date: "2024-01-08", total: 75.5, status: "completed" },
      ],
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 234 567 8902",
      totalOrders: 3,
      totalSpent: 245.75,
      status: "inactive",
      joinDate: "2023-12-01",
      lastOrder: "2024-01-05",
      address: "789 Pine St, City, State 12345",
      orders: [{ id: "ORD-003", date: "2024-01-05", total: 72.96, status: "processing" }],
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <WarningBanner/>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Manage your customer relationships and view their order history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>View and manage all your customers and their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder-user.jpg`} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
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
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Customer Profile - {customer.name}</DialogTitle>
                              <DialogDescription>Complete customer information and order history.</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="profile" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                              </TabsList>
                              <TabsContent value="profile" className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src="/placeholder-user.jpg" />
                                    <AvatarFallback>
                                      {customer.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                                    <p className="text-muted-foreground">Customer since {customer.joinDate}</p>
                                  </div>
                                </div>
                                <div className="grid gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{customer.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{customer.phone}</span>
                                  </div>
                                  <div>
                                    <strong>Address:</strong> {customer.address}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong>Total Orders:</strong> {customer.totalOrders}
                                    </div>
                                    <div>
                                      <strong>Total Spent:</strong> ${customer.totalSpent.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="orders" className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Order History</h4>
                                  {customer.orders.map((order) => (
                                    <div
                                      key={order.id}
                                      className="flex justify-between items-center p-3 border rounded"
                                    >
                                      <div>
                                        <div className="font-medium">{order.id}</div>
                                        <div className="text-sm text-muted-foreground">{order.date}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium">${order.total.toFixed(2)}</div>
                                        <Badge variant={order.status === "completed" ? "default" : "outline"}>
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
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
