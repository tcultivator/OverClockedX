export const dynamic = "force-dynamic";
import React from 'react'
import db from '@/lib/db';
import { ProductsType } from '@/types/ProductTypes';
import CheckoutProduct from '@/components/products/CheckoutProduct';
import SuggestedProducts from '@/components/products/SuggestedProducts';
type PageProps = {
    params: Promise<{
        productId: string;
    }>;
};

const ProductOverview = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const { productId } = resolvedParams;
    const [rows] = await db.query(`
    SELECT 
      p.*,
      promo.value
    FROM products p
    LEFT JOIN product_promotion_list promo
      ON promo.product_id = p.product_id
      AND promo.isActive = 1
      AND promo.end_date > NOW()
    WHERE p.product_id = ?
    `, [productId])
    const productResult = rows as ProductsType[];
    const result = await db.query(`
    SELECT 
      p.*,
      promo.value
    FROM products p
    LEFT JOIN product_promotion_list promo
      ON promo.product_id = p.product_id
      AND promo.isActive = 1
      AND promo.end_date > NOW()
    WHERE p.category = ? AND p.product_id != ? LIMIT 5
    `, [productResult[0].category, productResult[0].product_id])
    const relatedProducts = result[0] as ProductsType[];

    return (
        <div className=''>
            <CheckoutProduct
                id={productResult[0].id}
                product_id={productResult[0].product_id}
                product_image={productResult[0].product_image}
                description={productResult[0].description}
                brand={productResult[0].brand}
                product_name={productResult[0].product_name}
                price={productResult[0].price}
                stocks={productResult[0].stocks}
                value={productResult[0].value}

            />
            <SuggestedProducts
                relatedProducts={relatedProducts}

            />

        </div>

    )
}

export default ProductOverview
