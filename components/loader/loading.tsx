"use client";
import React from 'react'
import { useLoading } from '@/stores/loadingStore';
import {Item,ItemContent,ItemMedia,ItemTitle} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
const Loading = () => {
    const loading = useLoading((state) => state.loading)
    return (
        <>
            {loading !='' && <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/50 z-50'>
                <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem] bg-black rounded-md text-white">
                    <Item variant="muted">
                        <ItemMedia>
                            <Spinner />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="line-clamp-1">{loading}</ItemTitle>
                        </ItemContent>
                    </Item>
                </div>
            </div>}
        </>

    )
}

export default Loading
