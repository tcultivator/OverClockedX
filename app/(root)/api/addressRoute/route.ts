import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { UserAddress } from "@/types/UserAddressTypes";

// this is the route for updating/inserting address of user in profile
export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const [rows] = await db.query('SELECT * FROM user_address WHERE email = ?', [body.email])
        const addressData = rows as UserAddress[];
        if (addressData.length == 0) {

            await db.query('INSERT INTO user_address (email,rname,country,cityMunicipality,barangay,province,trademark)VALUES(?,?,?,?,?,?,?)', [body.email, body.rName, body.country, body.cityMunicipality, body.barangay, body.province, body.trademark])
            return NextResponse.json({ status: 200 })
        }
        
        await db.query('UPDATE user_address SET email = ?, rname = ?, country=?, cityMunicipality=?,barangay=?,province=?,trademark=? WHERE email = ?', [body.email, body.rName, body.country, body.cityMunicipality, body.barangay, body.province, body.trademark, body.email])
        return NextResponse.json({ status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}
