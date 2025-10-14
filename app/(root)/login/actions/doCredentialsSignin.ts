"use server"

import { signIn } from "@/auth"

export async function doCredentialsSignin(formdata: FormData) {
    try {
        const response = await signIn('credentials', {
            email: formdata.get('email'),
            password: formdata.get('password'),
            redirect: false
        })
        return response
    }
    catch (error) {
        console.error("Signin error:", error)
        throw new Error("Failed to sign in with credentials.")
    }

}