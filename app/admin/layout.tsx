"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Menu,
  Home,
  ImageIcon,
  Tag,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Offers", href: "/admin/offers", icon: Tag },
  { name: "Brands", href: "/admin/brands", icon: Tag },
  { name: "Brand Page Settings", href: "/admin/brand-page-settings", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "CMS", href: "/admin/cms", icon: FileText },
  { name: "User Management", href: "/admin/user-management", icon: Users },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Role Management", href: "/admin/roles", icon: Users },
  { name: "Website Settings", href: "/admin/website-settings", icon: Settings },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

type AdminUser = {
  isAdmin: boolean
  role: string
  // add other user properties if needed
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return // Wait until loading is false

    if (!user) {
      router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`) // Not logged in
    } else if (!user.isAdmin && user.role !== 'admin') {
      router.replace("/") // Not admin
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }
  if (!user || (!user.isAdmin && user.role !== 'admin')) return null

  const Sidebar = ({ mobile = false }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex flex-1 flex-col px-6 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                    )}
                    onClick={() => mobile && setSidebarOpen(false)}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Content */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background">
            <Sidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="lg:pl-8 flex flex-col flex-1">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
          </div>
          <main className="flex-1">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
      {/* Optional: Add a footer here if you want */}
    </div>
  )
}
