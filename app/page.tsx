import { Button } from "@/components/ui/button"
import CategoryGrid from "@/components/category-grid"
import PromotionalGrid from "@/components/promotional-grid"
import FlashDeals from "@/components/flash-deals"
import TopBrands from "@/components/top-brands"
import CustomerReviews from "@/components/customer-reviews"
import SolarCalculator from "@/components/solar-calculator"
import SolarBenefits from "@/components/solar-benefits"
import RecentlyViewed from "@/components/recently-viewed"
import InstallationServices from "@/components/installation-services"
import BlogPreview from "@/components/blog-preview"
import FinancingOptions from "@/components/financing-options"
import FeaturedBrandProducts from "@/components/featured-brand-products"
import HomePromoGrid from "@/components/home-promo-grid"
import FeaturedPromoCards from "@/components/featured-promo-cards"
import BestSellers from "@/components/best-sellers"
import NewArrivals from "@/components/new-arrivals"
import FeaturedBrands from "@/components/featured-brands-card"
import SolarAd from "@/components/installation-services"
import FeaturedQuickShop from "@/components/featured-quick-shop"

// sanity 
import { client } from "@/lib/sanity"
import MiniTopSolarAd from "@/components/miniTopSolarAd"
import MiniBottomSolarAd from "@/components/miniBottomSolarAd"

export default function Home() {
  return (
<div className="container mx-auto px-4 md:px-14 lg:px-16 pb-12">
      {/* New Banner Grid with Solar Images */}
      <HomePromoGrid />
{/* <HomePromoGridV2/> */}
      <CategoryGrid />


<BestSellers/>


{/* Bottom Banner */}
      <MiniTopSolarAd />


      {/* Featured Promo Cards */}
      <FeaturedPromoCards />

      

      {/* Rest of the content */}
      <FeaturedBrandProducts />

      {/* Quick Shop Section */}
      <FeaturedQuickShop />
      
      {/* Secondary Promotional Grid */}
      {/* <PromotionalGrid /> */}
      <FeaturedBrands />

      {/* Flash Deals Section */}
      <NewArrivals />

      {/* Solar Benefits Section */}
      <SolarBenefits />

      {/* Top Brands Section */}
      <TopBrands />

      {/* Installation Services Section */}
      <SolarAd />  
      
      {/* Flash Deals Section */}
      <FlashDeals />
      
      {/* Solar Calculator Section */}
      {/* <SolarCalculator /> */}

      {/* Customer Reviews Section */}
      {/* <CustomerReviews /> */}

{/* Blog Preview Section */}
      <BlogPreview />

      {/* Financing Options Section */}
      <FinancingOptions />

      

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      {/* Bottom Banner */}
      <MiniBottomSolarAd />
    </div>
  )
}
