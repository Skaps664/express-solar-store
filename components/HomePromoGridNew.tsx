"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Sun, Home, Percent } from "lucide-react"

export default function HomePromoGridV2() {
  return (
    <div className="my-8 space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1afca4] to-[#16d18a] p-8 md:p-12">
        {/* Solar Panel Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-1 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-white/20 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Sun Rays */}
        <div className="absolute top-4 right-4 w-32 h-32 opacity-20">
          <div className="relative w-full h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-16 h-0.5 origin-left"
                style={{
                  backgroundColor: "#f26522",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                }}
              />
            ))}
            <div
              className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: "#f26522" }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 text-white hover:opacity-90" style={{ backgroundColor: "#f26522" }}>
            <Zap className="mr-1 h-3 w-3" />
            Limited Time Offer
          </Badge>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">Power Your Home with Solar Energy</h1>
          <p className="mb-6 text-lg text-white/80">
            Save up to 90% on electricity bills with our premium solar solutions
          </p>
          <Button size="lg" className="text-white hover:opacity-90" style={{ backgroundColor: "#f26522" }}>
            Get Free Quote
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-6 gap-6">
        {/* Featured Product - Large Card */}
        <Link
          href="/brand/jinko-solar"
          className="col-span-2 row-span-2 group relative overflow-hidden rounded-xl bg-white border shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Solar Panel Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-4 gap-2 h-full p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded border-2"
                  style={{ backgroundColor: "#1afca4", borderColor: "#16d18a" }}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=500&width=400"
              alt="Jinko Solar Panels"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-end p-6">
            <Badge className="mb-3 w-fit text-white" style={{ backgroundColor: "#f26522" }}>
              Premium Brand
            </Badge>
            <h3 className="mb-2 text-2xl font-bold text-white">Jinko Solar Panels</h3>
            <p className="mb-4 text-sm text-gray-200">Industry-leading efficiency and 25-year warranty</p>
            <div className="flex items-center text-white">
              <span className="font-semibold">Shop Now</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Flash Deals */}
        <Link
          href="/flash-deals"
          className="col-span-2 group relative overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ background: `linear-gradient(135deg, #f26522, #e55a1f)` }}
        >
          {/* Lightning/Energy Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M20 10 L30 30 L25 30 L35 50 L25 40 L30 40 L20 60" stroke="white" strokeWidth="2" fill="none" />
              <path d="M60 20 L70 40 L65 40 L75 60 L65 50 L70 50 L60 70" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M80 5 L90 25 L85 25 L95 45 L85 35 L90 35 L80 55" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-white" style={{ color: "#f26522" }}>
                <Percent className="mr-1 h-3 w-3" />
                Up to 50% Off
              </Badge>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">Flash</div>
                <div className="text-lg font-semibold text-white/80">Deals</div>
              </div>
            </div>
            <p className="text-white/80 mb-4">Limited time solar equipment discounts</p>
            <div className="flex items-center text-white">
              <span className="font-semibold">View Deals</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Installation Services */}
        <Link
          href="/services/installation"
          className="col-span-2 group relative overflow-hidden rounded-xl border p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: "#1afca4", borderColor: "#16d18a" }}
        >
          {/* House with Solar Panels Graphic */}
          <div className="absolute top-4 right-4 opacity-15">
            <svg width="80" height="60" viewBox="0 0 80 60">
              {/* House */}
              <path d="M10 50 L10 30 L40 10 L70 30 L70 50 Z" fill="white" stroke="white" strokeWidth="2" />
              {/* Roof Solar Panels */}
              <rect x="20" y="20" width="8" height="6" fill="#f26522" />
              <rect x="30" y="18" width="8" height="6" fill="#f26522" />
              <rect x="40" y="16" width="8" height="6" fill="#f26522" />
              <rect x="50" y="18" width="8" height="6" fill="#f26522" />
            </svg>
          </div>

          <div className="relative z-10">
            <Home className="mb-4 h-8 w-8 text-white" />
            <h3 className="mb-2 text-xl font-bold text-white">Free Installation</h3>
            <p className="text-white/80 mb-4">Professional setup with SolarExpress+</p>
            <div className="flex items-center text-white">
              <span className="font-semibold">Learn More</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Solar Options */}
        <Link
          href="/category/solar-panels"
          className="col-span-2 group relative overflow-hidden rounded-xl bg-white border shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Inverter Graphic Background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Inverter Box */}
              <rect x="50" y="30" width="100" height="40" fill="#1afca4" stroke="#1afca4" strokeWidth="2" />
              {/* Display Screen */}
              <rect x="60" y="40" width="30" height="20" fill="#f26522" />
              {/* Buttons */}
              <circle cx="110" cy="45" r="3" fill="#f26522" />
              <circle cx="120" cy="45" r="3" fill="#f26522" />
              <circle cx="130" cy="45" r="3" fill="#f26522" />
              {/* Wires */}
              <path d="M50 50 L20 50 L20 20" stroke="#1afca4" strokeWidth="2" fill="none" />
              <path d="M150 50 L180 50 L180 20" stroke="#1afca4" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="Solar panel variety"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-end p-6">
            <h3 className="mb-2 text-lg font-bold text-white">1,000+ Solar Options</h3>
            <p className="text-gray-200 text-sm mb-3">Find the perfect solution for your home</p>
            <div className="flex items-center text-white">
              <span className="font-semibold">Browse All</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Summer Savings */}
        <Link
          href="/summer-deals"
          className="col-span-2 group relative overflow-hidden rounded-xl border p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: "#f26522", borderColor: "#e55a1f" }}
        >
          {/* Sun and Solar Panel Graphic */}
          <div className="absolute top-2 right-2 opacity-20">
            <svg width="100" height="80" viewBox="0 0 100 80">
              {/* Sun */}
              <circle cx="20" cy="20" r="12" fill="white" />
              {/* Sun rays */}
              <path
                d="M20 5 L20 0 M35 20 L40 20 M32 8 L36 4 M32 32 L36 36 M8 8 L4 4 M8 32 L4 36 M5 20 L0 20"
                stroke="white"
                strokeWidth="2"
              />
              {/* Solar Panel */}
              <rect x="40" y="40" width="50" height="30" fill="#1afca4" stroke="#1afca4" strokeWidth="2" />
              <line x1="50" y1="40" x2="50" y2="70" stroke="white" strokeWidth="1" />
              <line x1="60" y1="40" x2="60" y2="70" stroke="white" strokeWidth="1" />
              <line x1="70" y1="40" x2="70" y2="70" stroke="white" strokeWidth="1" />
              <line x1="80" y1="40" x2="80" y2="70" stroke="white" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10">
            <Sun className="mb-4 h-8 w-8 text-white" />
            <h3 className="mb-2 text-xl font-bold text-white">Summer Savings</h3>
            <p className="text-white/80 mb-2">Starting from PKR 25,000</p>
            <div className="flex items-center text-white">
              <span className="font-semibold">Save Now</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {/* Mobile Hero Card */}
        <Link
          href="/premium-solutions"
          className="block relative overflow-hidden rounded-xl p-6"
          style={{ background: `linear-gradient(135deg, #1afca4, #16d18a)` }}
        >
          {/* Mobile Solar Panel Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-6 gap-1 h-full">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="bg-white/20 rounded-sm" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <Badge className="mb-3 text-white" style={{ backgroundColor: "#f26522" }}>
              Featured
            </Badge>
            <h2 className="mb-2 text-xl font-bold text-white">Premium Solar Solutions</h2>
            <p className="text-white/80 text-sm mb-4">Complete home energy systems</p>
            <div className="flex items-center text-white">
              <span className="font-semibold">Explore</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Mobile Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/brand/jinko-solar"
            className="relative overflow-hidden rounded-lg bg-white border shadow-md p-4 aspect-square"
          >
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-3 gap-1 h-full p-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded" style={{ backgroundColor: "#1afca4" }} />
                ))}
              </div>
            </div>
            <div className="absolute inset-0">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Jinko Solar"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end">
              <h3 className="text-sm font-bold text-white">Jinko Solar</h3>
              <p className="text-xs text-gray-200">Premium panels</p>
            </div>
          </Link>

          <Link
            href="/flash-deals"
            className="relative overflow-hidden rounded-lg p-4 aspect-square"
            style={{ background: `linear-gradient(135deg, #f26522, #e55a1f)` }}
          >
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path d="M30 20 L40 40 L35 40 L45 60 L35 50 L40 50 L30 70" stroke="white" strokeWidth="3" fill="none" />
                <path d="M60 10 L70 30 L65 30 L75 50 L65 40 L70 40 L60 60" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between">
              <Badge className="w-fit bg-white text-xs" style={{ color: "#f26522" }}>
                50% Off
              </Badge>
              <div>
                <h3 className="text-sm font-bold text-white">Flash Deals</h3>
                <p className="text-xs text-white/80">Limited time</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/services/installation"
            className="relative overflow-hidden rounded-lg border p-4"
            style={{ backgroundColor: "#1afca4", borderColor: "#16d18a" }}
          >
            <div className="absolute top-2 right-2 opacity-15">
              <svg width="40" height="30" viewBox="0 0 40 30">
                <path d="M5 25 L5 15 L20 5 L35 15 L35 25 Z" fill="white" />
                <rect x="10" y="10" width="4" height="3" fill="#f26522" />
                <rect x="15" y="9" width="4" height="3" fill="#f26522" />
                <rect x="20" y="8" width="4" height="3" fill="#f26522" />
                <rect x="25" y="9" width="4" height="3" fill="#f26522" />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Free Installation</h3>
                <p className="text-white/80 text-sm">With SolarExpress+</p>
              </div>
              <Home className="h-8 w-8 text-white" />
            </div>
          </Link>

          <Link
            href="/summer-deals"
            className="relative overflow-hidden rounded-lg border p-4"
            style={{ backgroundColor: "#f26522", borderColor: "#e55a1f" }}
          >
            <div className="absolute top-2 right-2 opacity-20">
              <svg width="50" height="40" viewBox="0 0 50 40">
                <circle cx="10" cy="10" r="6" fill="white" />
                <path
                  d="M10 2 L10 0 M18 10 L20 10 M16 4 L18 2 M16 16 L18 18 M4 4 L2 2 M4 16 L2 18 M2 10 L0 10"
                  stroke="white"
                  strokeWidth="1"
                />
                <rect x="20" y="20" width="25" height="15" fill="#1afca4" />
                <line x1="25" y1="20" x2="25" y2="35" stroke="white" strokeWidth="0.5" />
                <line x1="30" y1="20" x2="30" y2="35" stroke="white" strokeWidth="0.5" />
                <line x1="35" y1="20" x2="35" y2="35" stroke="white" strokeWidth="0.5" />
                <line x1="40" y1="20" x2="40" y2="35" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Summer Savings</h3>
                <p className="text-white/80 text-sm">From PKR 25,000</p>
              </div>
              <Sun className="h-8 w-8 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
