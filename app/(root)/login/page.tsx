import React from 'react'
import { signIn } from "@/auth"
import { auth } from '@/auth'
import { FcGoogle } from "react-icons/fc";
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
const Login = async () => {
  const session = await auth()
  if (session) {
    redirect('/profile')
  }
  return (
    <div className='w-screen h-[70vh] flex'>
      <div className="flex w-max max-w-sm flex-col gap-3 m-auto">
        <Tabs defaultValue="signin">
          <TabsList >
            <TabsTrigger value="signin">SIGNIN</TabsTrigger>
            <TabsTrigger value="signup">SIGNUP</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <div className="px-4 py-10 rounded-xl bg-black inset-shadow-sm inset-shadow-white/50 w-[300px] flex flex-col gap-3">
              <Label className='text-white text-[18px] text-center w-full  flex justify-center py-1' htmlFor="">SIGNIN</Label>
              <form action="" className="flex flex-col gap-3 text-white">
                <div className="w-full ">
                  <Label htmlFor="">Email</Label>
                  <Input type="email" placeholder="Email" className='bg-[#161616]' />
                </div>
                <div className="w-full">
                  <Label htmlFor="">Password</Label>
                  <Input type="password" placeholder="Password" className='bg-[#161616]' />
                </div>
                <Button variant={'secondary'} className="">Signin</Button>
              </form>
              <Label className='text-white/60 text-[12px] text-center w-full  flex justify-center py-1' htmlFor="">or continue using email</Label>
              <form action={async () => {
                "use server"
                await signIn("google")
              }}>

                <Button variant={'secondary'} type="submit" className="w-full"><FcGoogle /> Signin with Google</Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <div className="px-4 py-10 rounded-xl bg-black inset-shadow-sm inset-shadow-white/50 w-[300px] flex flex-col gap-3">
              <Label className='text-white text-[18px] text-center w-full  flex justify-center py-1' htmlFor="">SIGNUP</Label>
              <form action="" className="flex flex-col gap-3 text-white">
                <div className="w-full ">
                  <Label htmlFor="">Email</Label>
                  <Input type="email" placeholder="Email" className='bg-[#161616]' />
                </div>
                <div className="w-full">
                  <Label htmlFor="">Password</Label>
                  <Input type="password" placeholder="Password" className='bg-[#161616]' />
                </div>
                <Button variant={'secondary'} className="">Signin</Button>
              </form>
              <Label className='text-white/60 text-[12px] text-center w-full  flex justify-center py-1' htmlFor="">or continue using email</Label>
              <form action={async () => {
                "use server"
                await signIn("google")
              }}>

                <Button variant={'secondary'} type="submit" className="w-full"><FcGoogle /> Signin with Google</Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>


  )
}

export default Login
