
import React from 'react';
import { Suspense } from 'react'
import NewsLetterSubscriberConfirmationComponents from '@/components/NewsLetterSubscriberConfirmationComponents/NewsLetterSubscriberConfirmationComponents';
const NewsLetterSubscriberConfirmation = () => {
    return (
        <Suspense fallback={<>waiting...</>}>
            <NewsLetterSubscriberConfirmationComponents />
        </Suspense>
    )
}

export default NewsLetterSubscriberConfirmation
