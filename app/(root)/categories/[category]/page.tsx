export const dynamic = "force-dynamic";
import React from 'react';

import CategoriesFilter from '@/components/Categories/CategoriesFilter';
import db from '@/lib/db';
// products types
// the expected types data get from database
import { ProductsType } from '@/types/ProductTypes';

import ProductList from '@/app/(root)/categories/[category]/components/ProductList';

// types of data from props 
type PageProps = {
    params: Promise<{
        category: string;
    }>;
};


const CategoryPage = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const { category } = resolvedParams;
    const [rows] = category == 'allProducts' ? await db.query('SELECT * FROM products LIMIT 10 OFFSET 0') : await db.query('SELECT * FROM products WHERE category = ? OR parent = ? LIMIT 10 OFFSET 0', [category, category])
    const products = rows as ProductsType[];
    return (
        <div className=' w-full h-[screen] '>
            <div className="flex px-[2px] md:px-2  text-white md:gap-2">
                <CategoriesFilter />
                <ProductList
                    products={products}
                    category={category}
                />
            </div>
        </div>
    );
};

export default CategoryPage;
