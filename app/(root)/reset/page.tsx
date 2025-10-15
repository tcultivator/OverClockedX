

import React from 'react'
import ResetPageComponents from '@/components/resetPageComponents/ResetPageComponents';
import { Suspense } from 'react'
const ResetPage = ({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) => {


    return (
        <Suspense fallback={<>waiting...</>}>
            <ResetPageComponents searchParams={searchParams} />
        </Suspense>
    )
}

export default ResetPage
