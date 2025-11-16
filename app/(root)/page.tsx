
import Dashboard from "@/components/Dashboard/Dashboard";
import ShopByCategory from "@/components/Dashboard/ShopByCategory";
import TrendingProducts from "@/components/Dashboard/TrendingProducts";
import FloatingChatBot from "@/components/Chat/components/FloatingChatBot";
export default function Home() {

  return (
    <div>
      <Dashboard />
      <ShopByCategory />
      <TrendingProducts />
      <FloatingChatBot />
    </div>
  );
}
