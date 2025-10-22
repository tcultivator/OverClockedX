import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ProductsType } from "@/types/ProductTypes";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log('eto ung nasa route na ng search',body.searchValue)
        const query = 'SELECT * FROM products WHERE category LIKE ? OR product_name LIKE ?'
        const [rows] = await db.query(query, [`%${body.searchValue}%`, `%${body.searchValue}%`])
        const result = rows as ProductsType[]
        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json({ message: 'Something went wrong' })
    }
}