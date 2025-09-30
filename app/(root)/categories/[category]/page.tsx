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
    const [rows] = await db.query('SELECT * FROM products WHERE category = ? OR parent = ?', [category, category])
    const products = rows as ProductsType[];
    return (
        <div className=' w-full h-[screen]'>
            <div className="flex p-2 text-white gap-2">
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
