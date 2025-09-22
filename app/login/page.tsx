import React from 'react'
import { signIn } from "@/auth"
import { signOut } from '@/auth'
import { auth } from '@/auth'
import Image from 'next/image'
import { FcGoogle } from "react-icons/fc";
const Login = async () => {
  const session = await auth()
  if (!session) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-10 rounded w-[400px] flex flex-col gap-3">
        <form action={async () => {
          "use server"
          await signIn("google")
        }}>

          <button type="submit" className="py-2 px-5 bg-black w-full rounded flex items-center gap-5 text-white justify-center cursor-pointer"><FcGoogle /> Signin with Google</button>
        </form>
        <div className="text-center w-full">or continue using email</div>
        <form action="" className="flex flex-col gap-2">
          <div className="w-full ">
            <label htmlFor="">Email</label>
            <input type="email" placeholder="Email" />
          </div>
          <div className="w-full">
            <label htmlFor="">Password</label>
            <input type="password" placeholder="Password" />
          </div>
          <button className="py-2 px-5 bg-green-400 w-full rounded flex items-center gap-5 text-white justify-center ">Signin</button>
        </form>
      </div>

    )
  } else {
    console.log(session.user)
    return (
      <form className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black p-10 rounded w-[400px] flex flex-col gap-3"

        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <div className="flex gap-2 items-center">
          {session.user?.image && (
            <Image
              src={session.user?.image}
              alt="Profile picture"
              width={40}
              height={40}
              className="rounded-[50%] border border-gray-400"
            />
          )}
          <p className="">sigin as {session.user?.email}</p>
        </div>
        <button type="submit" className="py-2 px-5 bg-black w-full rounded flex items-center gap-5 text-white justify-center cursor-pointer">Signout</button>
      </form>

    )
  }
}

export default Login
