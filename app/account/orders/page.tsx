"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Loader2, ShoppingBag, ExternalLink, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Confirmed':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default: // Pending
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  quantity: number;
  price: number;
  selectedVariant?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push('/auth/login?redirect=/account/orders')
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders`, {
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          throw new Error(data.message || "Failed to fetch orders")
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load your orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  // Generate WhatsApp link for an order
  const generateWhatsappLink = async (orderId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/orders/${orderId}/whatsapp`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      if (data.success) {
        window.open(data.whatsappURL, "_blank")
      } else {
        throw new Error(data.message || "Failed to generate WhatsApp link")
      }
    } catch (err) {
      console.error("Error generating WhatsApp link:", err)
      toast.error("Failed to generate WhatsApp link")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-4">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <p className="text-muted-foreground mt-1">View and track your orders</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No orders yet</p>
              <p className="text-muted-foreground">Items you order will appear here</p>
              <Button asChild className="mt-6">
                <Link href="/store">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                        <Link href={`/account/orders/${order._id}`} className="hover:underline flex items-center">
                          #{order.orderNumber || order._id.substring(0, 8)}...
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell>
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} font-normal`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === "Paid" ? "default" : "outline"}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateWhatsappLink(order._id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
