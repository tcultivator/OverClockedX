import db from "@/lib/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
interface UserAddress {
    id: number;
    email: string;
    rname: string;
    phone_number: number;
    country: string;
    cityMunicipality: string;
    barangay: string;
    province: string;
    description: string;
}
export async function POST(req: NextRequest) {
    const body = await req.json()
    const query = `SELECT user_address.email, user_address.rname,user_address.country,
    user_address.cityMunicipality,
    user_address.barangay,
    user_address.province,
    user_address.trademark 
    FROM user_address 
    JOIN accounts ON accounts.email = user_address.email 
    WHERE user_address.email = ?
`
    try {
        const [rows] = await db.query(query, [body.email])
        const result = rows as UserAddress[]
        return NextResponse.json(result)
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }
}