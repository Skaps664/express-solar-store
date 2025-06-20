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
import HomePromoGridV2 from "@/components/HomePromoGridNew"

export default function Home() {
  return (
<div className="container mx-auto px-4 md:px-14 lg:px-16 pb-12">
      {/* New Banner Grid with Solar Images */}
      <HomePromoGrid />
{/* <HomePromoGridV2/> */}
      <CategoryGrid />

{/* Bottom Banner */}
      <div className="bg-[#1a5ca4] rounded-lg p-6 md:p-8 my-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Go Solar?</h2>
            <p className="mb-4 md:mb-0">Schedule a free consultation with our solar experts today</p>
          </div>
          <Button className="bg-white text-[#1a5ca4] hover:bg-gray-100">Book Consultation</Button>
        </div>
      </div>

<BestSellers/>

      {/* Featured Promo Cards */}
      <FeaturedPromoCards />

      

      {/* Rest of the content */}
      <FeaturedBrandProducts />

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
      <div className="bg-[#1a5ca4] rounded-lg p-6 md:p-8 my-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Go Solar?</h2>
            <p className="mb-4 md:mb-0">Schedule a free consultation with our solar experts today</p>
          </div>
          <Button className="bg-white text-[#1a5ca4] hover:bg-gray-100">Book Consultation</Button>
        </div>
      </div>
    </div>
  )
}
