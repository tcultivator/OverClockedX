import React from 'react'
import { Label } from '@/components/ui/label'

const Settings = () => {
    return (
        <div className='px-2 py-5 w-full flex flex-col gap-2'>
            <div className='w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] mx-auto flex flex-col gap-2'>
                <div className=' '>
                    <Label className='text-[15px] md:text-[20px] font-orbitron font-normal'>Settings</Label>
                </div>
            </div>
        </div>

    )
}

export default Settings
