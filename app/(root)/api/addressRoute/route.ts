import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { AddressType } from "@/types/AddressDataTypes";
export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const [rows] = await db.query('SELECT * FROM user_address WHERE email = ?', [body.email])
        const addressData = rows as AddressType[];
        console.log('eto laman ng result ', addressData.length)
        if (addressData.length == 0) {

            await db.query('INSERT INTO user_address (email,rname,address,postal,description)VALUES(?,?,?,?,?)', [body.email, body.rName, body.address, body.postal, body.description])
            return NextResponse.json({ status: 200 })
        }
        console.log('ere kapag di gumana unag query')
        await db.query('UPDATE user_address SET email = ?, rname = ?, address=?, postal=?, description=? WHERE email = ?', [body.email, body.rName, body.address, body.postal, body.description, body.email])
        return NextResponse.json({ status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}
