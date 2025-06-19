"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"


interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

type FormField = keyof FormData

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get("redirect") || "/"
  const { setUser } = useAuth()

  const handleInputChange = (field: FormField, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? "/api/user/login" : "/api/user/register"
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            mobile: formData.phone,
          }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.")
        setLoading(false)
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        let msg = "Something went wrong"
        if (data.message?.toLowerCase().includes("password")) {
          msg = "Incorrect password. Please try again."
        } else if (data.message?.toLowerCase().includes("user not found")) {
          msg = "No account found with this email."
        } else if (data.message?.toLowerCase().includes("already exists")) {
          msg = "An account with this email already exists."
        } else if (data.message) {
          msg = data.message
        }
        toast.error(msg)
        setLoading(false)
        return
      }
      // For login, backend returns user info as top-level fields
      if (isLogin) {
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      } else {
        setUser(data.data)
      }
      router.push(redirect)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Solar panel pattern - left side */}
        <div className="absolute -left-20 top-20 w-40 h-40 bg-gradient-to-br from-[#1a5ca4]/10 to-[#0e4a8a]/5 rounded-lg transform rotate-12"></div>
        <div className="absolute -left-10 top-60 w-32 h-32 bg-gradient-to-br from-[#f26522]/10 to-[#e55511]/5 rounded-lg transform -rotate-12"></div>
        <div className="absolute left-10 top-96 w-24 h-24 bg-gradient-to-br from-[#1a5ca4]/10 to-[#0e4a8a]/5 rounded-lg transform rotate-45"></div>

        {/* Solar panel pattern - right side */}
        <div className="absolute -right-20 top-32 w-40 h-40 bg-gradient-to-bl from-[#1a5ca4]/10 to-[#0e4a8a]/5 rounded-lg transform -rotate-12"></div>
        <div className="absolute -right-10 top-72 w-32 h-32 bg-gradient-to-bl from-[#f26522]/10 to-[#e55511]/5 rounded-lg transform rotate-12"></div>
        <div className="absolute right-10 bottom-32 w-28 h-28 bg-gradient-to-bl from-[#1a5ca4]/10 to-[#0e4a8a]/5 rounded-lg transform -rotate-45"></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1a5ca4 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Auth card with subtle shadow and border */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header tabs */}
            <div className="flex bg-gray-50 rounded-t-2xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all rounded-tl-2xl ${
                  isLogin
                    ? "bg-white text-[#1a5ca4] border-b-2 border-[#f26522] shadow-sm"
                    : "text-gray-600 hover:text-[#1a5ca4] hover:bg-gray-100"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all rounded-tr-2xl ${
                  !isLogin
                    ? "bg-white text-[#1a5ca4] border-b-2 border-[#f26522] shadow-sm"
                    : "text-gray-600 hover:text-[#1a5ca4] hover:bg-gray-100"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? "Welcome Back!" : "Join Solar Express"}
                </h2>
                <p className="text-gray-600">
                  {isLogin
                    ? "Sign in to access your account and continue shopping"
                    : "Create your account to start your solar journey"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name fields for signup */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10 h-12 border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                        required={!isLogin}
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="pl-10 h-12 border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                    required
                  />
                </div>

                {/* Phone field for signup */}
                {!isLogin && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required={!isLogin}
                    />
                  </div>
                )}

                {/* Password field */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Confirm password for signup */}
                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                )}

                {/* Remember me / Forgot password for login */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="border-gray-300 data-[state=checked]:bg-[#1a5ca4] data-[state=checked]:border-[#1a5ca4]"
                      />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-[#f26522] hover:text-[#e55511] font-medium">
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {/* Terms and newsletter for signup */}
                {!isLogin && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className="border-gray-300 data-[state=checked]:bg-[#1a5ca4] data-[state=checked]:border-[#1a5ca4] mt-0.5"
                        required={!isLogin}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[#f26522] hover:text-[#e55511] font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#f26522] hover:text-[#e55511] font-medium">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                        className="border-gray-300 data-[state=checked]:bg-[#1a5ca4] data-[state=checked]:border-[#1a5ca4]"
                      />
                      <label htmlFor="newsletter" className="text-sm text-gray-600">
                        Subscribe to our newsletter for solar deals and updates
                      </label>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#f26522] hover:bg-[#e55511] text-white font-medium text-lg rounded-lg transition-colors shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (isLogin ? "Signing In..." : "Creating Account...") : isLogin ? "Sign In" : "Create Account"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social login buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-gray-300 hover:bg-gray-50 hover:border-[#1a5ca4] transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-gray-300 hover:bg-gray-50 hover:border-[#1a5ca4] transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional info with clean card design */}
          <div className="mt-6 text-center bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <p className="text-gray-700 text-sm">
              {isLogin ? "New to Solar Express?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#f26522] hover:text-[#e55511] font-medium underline transition-colors"
              >
                {isLogin ? "Create an account" : "Sign in here"}
              </button>
            </p>
          </div>

          {/* Trust indicators with clean design */}
          <div className="mt-4 bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-center gap-6 text-gray-700 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-[#f26522] rounded-full p-1.5">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <span>Pakistan Wide Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#1a5ca4] rounded-full p-1.5">
                  <Lock className="h-3 w-3 text-white" />
                </div>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Solar Express branding */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs mt-2">Your trusted solar energy partner</p>
          </div>
        </div>
      </div>
    </div>
  )
}
