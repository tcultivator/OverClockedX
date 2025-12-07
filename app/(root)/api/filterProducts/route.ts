import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductsType } from "@/types/ProductTypes";
export async function POST(req: NextRequest) {
    const body = await req.json();
    const query = body.category == 'allProducts' ? `
    SELECT 
      p.*,
      promo.value
    FROM products p
    LEFT JOIN product_promotion_list promo
      ON promo.product_id = p.product_id
      AND promo.isActive = 1
      AND promo.end_date > NOW()
    WHERE 1=1
    ` : `
    SELECT 
      p.*,
      promo.value
    FROM products p
    LEFT JOIN product_promotion_list promo
      ON promo.product_id = p.product_id
      AND promo.isActive = 1
      AND promo.end_date > NOW()
    WHERE (p.category = ? OR p.parent = ?) 
    `;


    //this query is seperated because its a search query meaning its independent
    const searchQuery = `
     SELECT 
      p.*,
      promo.value
    FROM products p
    LEFT JOIN product_promotion_list promo
      ON promo.product_id = p.product_id
      AND promo.isActive = 1
      AND promo.end_date > NOW()
    WHERE p.category LIKE ? OR p.parent LIKE ? OR p.product_name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? LIMIT 18 OFFSET ?
    
    `

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
        if (body.search != '') {
            const [rows] = await db.query(searchQuery, [body.search, body.search, body.search, body.search, body.search, body.offset])
            const result = rows as ProductsType[]
            return NextResponse.json({ result })
        } else {
            const [rows] = body.category == 'allProducts' ? await db.query(query + finalSelectedBrands + availabilityValue + PriceRangeValue + SortByValue + ' LIMIT 18 OFFSET ?', [body.offset]) : await db.query(query + finalSelectedBrands + availabilityValue + PriceRangeValue + SortByValue + ' LIMIT 18 OFFSET ?', [body.category, body.category, body.offset])
            const result = rows as ProductsType[]
            return NextResponse.json({ result })
        }

    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}

//SELECT * FROM products WHERE (category = 'MotherBoard' OR parent = 'Components') AND (stocks > 0) AND (price > 100 AND price < 5001) ORDER BY sales_count DESC;