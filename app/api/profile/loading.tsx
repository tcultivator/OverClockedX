import React from 'react'
import { FadeLoader } from 'react-spinners'
const loading = () => {
    console.log('kapag nag loloading')
    return (
        <div className='z-10 absolute top-0 left-0 w-screen h-screen bg-black/60 flex items-center justify-center text-center'>
            <FadeLoader
                height={50}
                width={50}
                color='white'
                loading={true} />
        </div>
    )
}

export default loading
