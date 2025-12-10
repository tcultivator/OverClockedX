
import React from 'react'
import ProfileCard from '@/components/Profile/ProfileCard'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { Accounts } from '@/types/AccountsType'
import SetNewPassword from '@/components/Profile/SetNewPassword'
import { UserAddress } from '@/types/UserAddressTypes'
import AddressCard from '@/components/Profile/AddressCard'
const Profile = async () => {
    const session = await auth();
    if (!session) {
        redirect('/')

    }

    const resultProfile = await db.query('SELECT id,email,username,profile_Image,firstTime_signin FROM accounts WHERE email = ?', [session.user?.email])
    const user = resultProfile[0] as Accounts[]

    const resultAddress = await db.query('SELECT * FROM user_address WHERE email = ?', [session.user?.email])
    const address = resultAddress[0] as UserAddress[]
    return (
        <div className='px-2 py-5 w-full flex flex-col gap-2'>
            <ProfileCard user={user[0]} />
            <SetNewPassword firstTimeSignin={user[0].firstTime_signin} />
            <AddressCard
                email={session.user?.email}
                address={address[0]} />
        </div>

    )
}
export default Profile
