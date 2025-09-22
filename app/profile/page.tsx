
import React from 'react'
import ProfileCard from '@/components/Profile/ProfileCard'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { Accounts } from '@/types/AccountsType'

const Profile = async () => {
    const session = await auth();
    if (!session) {
        redirect('/')
    }

    const result = await db.query('SELECT id,email,username,profile_Image,gender,phone_number FROM accounts WHERE email = ?', [session.user?.email])
    const user = result[0] as Accounts[]
    return (
        <ProfileCard user={user[0]} />
    )
}
export default Profile
