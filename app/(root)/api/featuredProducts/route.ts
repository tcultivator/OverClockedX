import db from "@/lib/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ProductsType } from "@/types/ProductTypes";
export async function POST(req: NextRequest) {
    const query = 'SELECT * FROM products ORDER BY sales_count DESC LIMIT 5'
    try {
        const [rows] = await db.query(query)
        const result = rows as ProductsType[]
        return NextResponse.json(result)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }

}