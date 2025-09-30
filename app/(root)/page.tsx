
import Dashboard from "@/components/Dashboard/Dashboard";
import ShopByCategory from "@/components/Dashboard/ShopByCategory";
import TrendingProducts from "@/components/Dashboard/TrendingProducts";
export default function Home() {

  return (
    <div>
      <Dashboard />
      <ShopByCategory />
      <TrendingProducts/>
    </div>
  );
}
