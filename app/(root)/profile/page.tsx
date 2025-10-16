
import React from 'react'
import ProfileCard from '@/components/Profile/ProfileCard'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { Accounts } from '@/types/AccountsType'
import SetNewPassword from '@/components/Profile/SetNewPassword'
const Profile = async () => {
    const session = await auth();
    if (!session) {
        redirect('/')
        
    }

    const result = await db.query('SELECT id,email,username,profile_Image,gender,phone_number,firstTime_signin FROM accounts WHERE email = ?', [session.user?.email])
    const user = result[0] as Accounts[]
    return (
        <>
            <ProfileCard user={user[0]} />
            <SetNewPassword firstTimeSignin={user[0].firstTime_signin} />
        </>

    )
}
export default Profile
