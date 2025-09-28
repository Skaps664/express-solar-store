"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Loader2, ShoppingCart, ArrowLeft, Package2, Truck, Phone, MapPin, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface CheckoutData {
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    whatsappNumber: string;
    shippingAddress: string;
    email?: string;
    specialNotes?: string;
  };
  paymentMethod: string;
  orderNotes?: string;
}

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { cart, loading: cartLoading, createOrder, cartTotal } = useCart();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CheckoutData>({
    customerInfo: {
      fullName: "",
      phoneNumber: "",
      whatsappNumber: "",
      shippingAddress: "",
      email: "",
      specialNotes: "",
    },
    paymentMethod: "Bank Transfer",
    orderNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  // Calculate totals from cart context
  const subtotal = cartTotal || cart?.reduce((total: number, item: any) => {
    // Get price from product or item itself
    const itemPrice = item.product?.price || item.price || 0;
    return total + (itemPrice * item.quantity);
  }, 0) || 0;

  const shippingCost = subtotal > 5000 ? 0 : 200; // Free shipping over 5000 PKR
  const total = subtotal + shippingCost;

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutData) => {
      return await createOrder({
        customerInfo: data.customerInfo,
        paymentMethod: data.paymentMethod,
        orderNotes: data.orderNotes
      });
    },
    onSuccess: (data: any) => {
      toast.success("Order created successfully! Opening WhatsApp...");
      
      // Invalidate cart to update the UI
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      // Open WhatsApp
      if (data.whatsappURL) {
        window.open(data.whatsappURL, '_blank');
      }
      
      // Redirect to orders page after a delay
      setTimeout(() => {
        router.push("/account/orders");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });

  const handleInputChange = (field: string, value: string, section?: string) => {
    if (section === "customerInfo") {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const { customerInfo } = formData;
    if (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.whatsappNumber || !customerInfo.shippingAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    createOrderMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please log in to access checkout.</p>
        </div>
      </div>
    )
  }

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Add some products to your cart before checking out.
            </p>
            <Button asChild>
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package2 className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.customerInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value, "customerInfo")}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customerInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value, "customerInfo")}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.customerInfo.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value, "customerInfo")}
                        placeholder="+92 300 1234567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                      <Input
                        id="whatsappNumber"
                        value={formData.customerInfo.whatsappNumber}
                        onChange={(e) => handleInputChange("whatsappNumber", e.target.value, "customerInfo")}
                        placeholder="+92 300 1234567"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>
                    Where should we deliver your order?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Complete Address *</Label>
                    <Textarea
                      id="shippingAddress"
                      value={formData.customerInfo.shippingAddress}
                      onChange={(e) => handleInputChange("shippingAddress", e.target.value, "customerInfo")}
                      placeholder="House/Flat number, Street, Area, City, Province"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    How would you like to complete your payment?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                      <SelectItem value="JazzCash">JazzCash</SelectItem>
                      <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Payment Info Boxes (conditional) */}
              {formData.paymentMethod === "Cash on Delivery" && (
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

  Note: This Payment is for Order Conformation. Your Order will be processed after payment.`}
                  </div>
                </div>
              )}

              {(formData.paymentMethod === "Bank Transfer" || formData.paymentMethod === "JazzCash" || formData.paymentMethod === "EasyPaisa") && (
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Payment Details</h3>
                  <p className="text-sm text-muted-foreground mb-2">Please deposit the payment using the details below and send the receipt via WhatsApp.</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Bank: HBL</p>
                      <p className="text-muted-foreground">&nbsp;</p>
                    </div>
                    <div>
                      <p className="font-medium">Account Title: Solar Express LLP</p>
                      <p className="text-muted-foreground">&nbsp;</p>
                    </div>
                    <div>
                      <p className="font-medium">Account Number: 6-4-54-20311-714-130309</p>
                      <p className="text-muted-foreground">&nbsp;</p>
                    </div>
                    <div>
                      <p className="font-medium">IBAN: PK24MPBL0454027140130309</p>
                      <p className="text-muted-foreground">&nbsp;</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                  <CardDescription>
                    Enter any special requests or Payment transfer Details here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.customerInfo.specialNotes}
                    onChange={(e) => handleInputChange("specialNotes", e.target.value, "customerInfo")}
                    placeholder="Any special instructions, delivery preferences, or notes..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package2 className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name || item.product?.name || "Product"}</p>
                        {item.selectedVariant && (
                          <p className="text-xs text-muted-foreground">{item.selectedVariant}</p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-medium">PKR {((item.product?.price || item.price || 0) * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <Badge variant="secondary" className="text-xs">Free</Badge>
                      ) : (
                        `PKR ${shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {subtotal >= 5000 && (
                    <div className="text-xs text-green-600">
                      🎉 You qualify for free shipping!
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || createOrderMutation.isPending}
                  onClick={handleSubmit}
                >
                  {isSubmitting || createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our terms and conditions.
                  You will be redirected to Orders page and to complete your order we will contact via Whatsapp.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
