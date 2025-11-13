import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductsType } from "@/types/ProductTypes";
export async function POST(req: NextRequest) {
    const body = await req.json();
    const query = body.category == 'allProducts' ? 'SELECT * FROM products WHERE id !=0 ' : 'SELECT * FROM products WHERE (category = ? OR parent = ?) ';

    const availability = () => {
        switch (body.Availability) {
            case 'In Stock':
                return ' AND (stocks > 0)'
            case 'Out of Stock':
                return ' AND (stocks <= 0)'
            default:
                return ''
        }
    }
    const availabilityValue = availability()
    console.log('eto ung laman ng availability, ', availabilityValue)
    const SortBy = () => {
        switch (body.SortBy) {
            case 'ASC':
                return ' ORDER BY price ASC'
            case 'DESC':
                return ' ORDER BY price DESC'
            case 'bestselling':
                return ' AND (sales_count > 100) ORDER BY sales_count DESC'
            default:
                return ''
        }
    }

    const SortByValue = SortBy()
    console.log('eto ung laman ng sort by, ', SortByValue)
    const PriceRange = () => {
        if (body.low != '' || body.high != '') {
            console.log('meron ng laman ung high low')
            return ` AND (price >= ${body.low} AND price <= ${body.high})`
        }
        return ''
    }
    const PriceRangeValue = PriceRange()
    console.log('eto ung laman ng price range value, ', PriceRangeValue)
    console.log('eto laman ng body.brands, ', body.brands)  
    const selectedBrands = () => {
        if (body.brands[0] != '' && body.brands != undefined) {
            return ` AND (${body.brands.map((item: string) => `brand = '${item}'`).join(" OR ")})`
        }
        return '';
    };

    const finalSelectedBrands = selectedBrands()
    console.log('eto laman ng selected brands, ', finalSelectedBrands)

    try {
        console.log(query + finalSelectedBrands + availabilityValue + PriceRangeValue + SortByValue + ' LIMIT 15 OFFSET ?')
        const [rows] = body.category == 'allProducts' ? await db.query(query + finalSelectedBrands + availabilityValue + PriceRangeValue + SortByValue + ' LIMIT 15 OFFSET ?', [body.offset]) : await db.query(query + finalSelectedBrands + availabilityValue + PriceRangeValue + SortByValue + ' LIMIT 15 OFFSET ?', [body.category, body.category, body.offset])
        const result = rows as ProductsType[]
        return NextResponse.json({ result })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}

//SELECT * FROM products WHERE (category = 'MotherBoard' OR parent = 'Components') AND (stocks > 0) AND (price > 100 AND price < 5001) ORDER BY sales_count DESC;