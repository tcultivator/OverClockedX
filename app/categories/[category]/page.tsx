import React from 'react';
import CategoriesHeader from '@/components/Categories/CategoriesHeader';
import CategoriesFilter from '@/components/Categories/CategoriesFilter';
import db from '@/lib/db';
// products types
// the expected types data get from database
import { ProductsType } from '@/types/ProductTypes';

import ProductCard from '@/components/products/ProductCard';

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
        <div className='mt-40 w-full h-[screen]'>
            <CategoriesHeader />

            <div className="flex justify-center p-5 text-white">
                <CategoriesFilter />

                <div id="right" className='w-[80%] grid grid-cols-2 justify-center p-5 overflow-y-auto gap-4 items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                    {
                        products && products.map((data, index) => (
                            <ProductCard key={index}
                                data={data}
                            />
                        ))
                    }
                </div>

            </div>
        </div>
    );
};

export default CategoryPage;
