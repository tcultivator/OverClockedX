
import Dashboard from "@/components/Dashboard/Dashboard";
import ShopByCategory from "@/components/Dashboard/ShopByCategory";
import TrendingProducts from "@/components/Dashboard/TrendingProducts";
import FloatingChatBot from "@/components/Chat/components/FloatingChatBot";
import FeaturedProducts from "@/components/Dashboard/FeaturedProducts";
import DiscountedProducts from "@/components/Dashboard/DiscountedProducts";
import InfiniteBrandSlider from "@/components/Dashboard/InfiniteBrandSlider";
export default function Home() {

  return (
    <div>
      <ShopByCategory />
      <InfiniteBrandSlider />
      {/* <FeaturedProducts /> */}
      <DiscountedProducts />
      {/* <Dashboard /> */}
      {/* <TrendingProducts /> */}
      <Dashboard />
      <FloatingChatBot />
    </div>
  );
}
