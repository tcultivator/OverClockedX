import db from "@/lib/db";
import { NextResponse } from "next/server";
import { ProductsType } from "@/types/ProductTypes";
export async function POST() {

  // this query will join to table
  // using left join to join the tables
  // this will get 8 products that has most sales,
  // then it will get the value of promotion value and promotion type of that product
  // using left join, it will also get the product that dont have promotion, if it meets the creteria of being in a most sales product
    const query = `SELECT p.*,
      promo.value,
      promo.promotion_type 
    FROM products p
    LEFT JOIN product_promotion_list promo
      ON promo.product_id = p.product_id 
      AND promo.isActive = 1
      AND promo.end_date > NOW() ORDER BY p.sales_count DESC LIMIT 8`
    try {
        const [rows] = await db.query(query)
        const result = rows as ProductsType[]
        return NextResponse.json(result)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }

}