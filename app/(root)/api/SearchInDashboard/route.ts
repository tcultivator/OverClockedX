import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ProductsType } from "@/types/ProductTypes";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const searchValue = `%${body.searchValue}%`;
    try {
        const [rows] = await db.query(`SELECT * FROM products WHERE product_name LIKE ? OR parent LIKE ? OR category LIKE ? OR description LIKE ? OR brand LIKE ?`, [searchValue, searchValue, searchValue, searchValue, searchValue])
        const searchProductsData = rows as ProductsType[]
        return NextResponse.json(searchProductsData)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ status: 500 })
    }
}