import React from 'react'
import { signIn } from "@/auth"
import { auth } from '@/auth'
import { FcGoogle } from "react-icons/fc";
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button';
import SignupForm from './components/signupForm';
import { Label } from '@/components/ui/label'
import CredentialsForm from './components/credentialsForm/credentialsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const Login = async () => {
  const session = await auth()
  if (session) {
    redirect('/profile')
  }
  return (
    <div className='w-screen h-[70vh] flex'>
      <div className="flex w-max max-w-sm flex-col gap-3 m-auto">
        <Tabs defaultValue="signin" className='gap-2'>
          <TabsList >
            <TabsTrigger value="signin">SIGNIN</TabsTrigger>
            <TabsTrigger value="signup">SIGNUP</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <div className="px-4 py-10 bg-white w-[300px] border border-black/20 flex flex-col gap-3">
              <Label className='text-black text-[18px] text-center w-full  flex justify-center py-1 font-orbitron' htmlFor="">SIGN IN</Label>
              <CredentialsForm />
              <Label className='text-black/60 text-[12px] text-center w-full  flex justify-center py-1' htmlFor="">or continue using google</Label>
              <form action={async () => {
                "use server"
                await signIn("google")
              }}>

                <Button variant={'secondary'} type="submit" className="w-full border border-black/10 shadow-sm shadow-black/20"><FcGoogle /> Signin with Google</Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <div className="px-4 py-10 bg-white border border-black/20 w-[300px] flex flex-col gap-3">
              <Label className='text-black text-[18px] text-center w-full  flex justify-center py-1 font-orbitron' htmlFor="">SIGN UP</Label>
              <SignupForm />
              <Label className='text-black/60 text-[12px] text-center w-full  flex justify-center py-1' htmlFor="">or continue using google</Label>
              <form action={async () => {
                "use server"
                await signIn("google")
              }}>

                <Button variant={'secondary'} type="submit" className="w-full border border-black/10 shadow-sm shadow-black/20"><FcGoogle /> Signin with Google</Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>


  )
}

export default Login
