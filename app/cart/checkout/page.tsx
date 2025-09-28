"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ShoppingCart, CreditCard, MessageCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import Image from "next/image"

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, cartTotal, loading, clearCart, createOrder } = useCart()
  const router = useRouter()

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer")
  const [orderNotes, setOrderNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [whatsappURL, setWhatsappURL] = useState<string | null>(null)
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user && !loading) {
      router.push('/auth?redirect=/cart/checkout')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Set default address if available
    const addresses = (user as any)?.adress as any[] | undefined
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((addr: any) => addr.isDefault)
      setSelectedAddress(defaultAddress?._id || addresses[0]._id)
    }
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">Please log in to checkout</h1>
        <Button asChild className="mt-4">
          <Link href="/auth?redirect=/cart/checkout">Login</Link>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-4">Loading your cart...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Add some products to your cart to checkout</p>
        <Button asChild className="mt-6">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  // Handle WhatsApp checkout
  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    setIsSubmitting(true)
    try {
  // Find the selected address object
  const addresses = (user as any)?.adress as any[] | undefined
  const shippingAddress = addresses?.find((addr: any) => addr._id === selectedAddress)
      
      if (!shippingAddress) {
        toast.error("Selected address not found")
        setIsSubmitting(false)
        return
      }

      const result = await createOrder({
        shippingAddress,
        paymentMethod,
        orderNotes: orderNotes.trim() || undefined,
      })

      if (result.success) {
        if (result.whatsappURL) {
          setWhatsappURL(result.whatsappURL)
          toast.success("Order created successfully! Click to place via WhatsApp")
        } else {
          toast.success("Order created successfully!")
          router.push('/account/orders')
        }
      } else {
        toast.error("Failed to create order. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("An error occurred during checkout")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {whatsappURL ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="mb-4">
            <div className="bg-green-500 rounded-full p-3 inline-block">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your order is ready!</h2>
          <p className="text-muted-foreground mb-6">
            Click the button below to place your order via WhatsApp. Our team will contact you to confirm your order and provide payment instructions.
          </p>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => window.open(whatsappURL, '_blank')}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Complete Order on WhatsApp
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Select where you want your order delivered</CardDescription>
              </CardHeader>
              <CardContent>
                {((user as any)?.adress && (user as any).adress.length > 0) ? (
                  <RadioGroup 
                    value={selectedAddress || ""} 
                    onValueChange={setSelectedAddress}
                  >
                    {((user as any).adress as any[]).map((address: any) => (
                      <div key={address._id} className="flex items-start space-x-3 p-3 border rounded-md mb-3">
                        <RadioGroupItem value={address._id} id={address._id} />
                        <div className="grid gap-1.5">
                          <Label htmlFor={address._id} className="font-medium">
                            {address.fullName} ({address.label})
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {address.street}, {address.city}, {address.state || ''} {address.postalCode}, {address.country}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Phone: {address.phoneNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">You don't have any saved addresses</p>
                    <Button asChild variant="outline">
                      <Link href="/account/addresses">Add a New Address</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you'll pay for your order</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-start space-x-3 p-3 border rounded-md mb-3">
                    <RadioGroupItem value="Bank Transfer" id="bank-transfer" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bank-transfer" className="font-medium">
                        Bank Transfer
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Transfer the amount to our bank account and send the receipt via WhatsApp
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-md mb-3">
                    <RadioGroupItem value="Easypaisa" id="easypaisa" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="easypaisa" className="font-medium">
                        Easypaisa
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Pay via Easypaisa mobile wallet. We'll confirm once we receive the payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-md mb-3">
                    <RadioGroupItem value="JazzCash" id="jazzcash" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="jazzcash" className="font-medium">
                        JazzCash
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Pay via JazzCash mobile wallet. We'll confirm once we receive the payment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-md mb-3">
                    <RadioGroupItem value="Cash on Delivery" id="cash-on-delivery" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="cash-on-delivery" className="font-medium">
                        Cash on Delivery
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Pay when your order is delivered
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
                <CardDescription>Add any special instructions for your order</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special instructions, delivery preferences, or notes about your order"
                  className="resize-none"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Payment Info Boxes (conditional) */}
            {paymentMethod === "Cash on Delivery" && (
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Important: Partial Advance Required for COD</h3>
                <div className="whitespace-pre-line text-sm text-muted-foreground">
{`Dear Customer,
To secure and confirm your order, we kindly request a partial payment in advance.

RS 500 for order amount below RS 10,000

RS 1000 for order amount below RS 20,000

RS 5000 for order amount below RS 30,000

100% Advance payment above 50,000

==> Full Payment for MPPTs and Inverters

This ensures a smooth processing of your order and guarantees product availability. Thank you for your understanding.
Best regards,
solarexpress.pk

Deposit your amount in the following bank account:
Bank: HBL
Account Title: Solar Express LLP
Account Number: 6-4-54-20311-714-130309
IBAN: PK24MPBL0454027140130309

Note: This Payment is for Order Confirmation. Your Order will be processed after payment.`}
                </div>
              </div>
            )}

            {(paymentMethod === "Bank Transfer" || paymentMethod === "Easypaisa" || paymentMethod === "JazzCash") && (
              <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <p className="text-sm text-muted-foreground mb-2">Please deposit the payment using the details below and send the receipt via WhatsApp.</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Bank:</p>
                    <p className="text-muted-foreground">HBL</p>
                  </div>
                  <div>
                    <p className="font-medium">Account Title:</p>
                    <p className="text-muted-foreground">Solar Express LLP</p>
                  </div>
                  <div>
                    <p className="font-medium">Account Number:</p>
                    <p className="text-muted-foreground">6-4-54-20311-714-130309</p>
                  </div>
                  <div>
                    <p className="font-medium">IBAN:</p>
                    <p className="text-muted-foreground">PK24MPBL0454027140130309</p>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                          {item.image || (item.product?.images && item.product.images[0]) ? (
                            <Image 
                              src={item.image || item.product.images[0]} 
                              alt={item.name || item.product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name || item.product.name}
                          </p>
                          {item.selectedVariant && (
                            <p className="text-xs text-muted-foreground">
                              {item.selectedVariant}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × {formatPrice(item.price || item.product.price)}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice((item.price || item.product.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                
                  <Separator />
                
                  {/* Totals */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <p>Subtotal</p>
                      <p className="font-medium">{formatPrice(cartTotal)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>Shipping</p>
                      <p className="font-medium">Free</p>
                    </div>
                  </div>
                
                  <Separator />
                
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>{formatPrice(cartTotal)}</p>
                  </div>
                
                  <Button 
                    size="lg" 
                    className="w-full mt-4"
                    onClick={handleCheckout}
                    disabled={isSubmitting || !selectedAddress || cart.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
  )
}
