'use client'

import Image from "next/image"
import bgImg from "./content.svg"
import LoginForm from "./form"

import { useRouter } from 'next/navigation'
import { API_ROUTES } from "@/constant"
import { postData } from "@/lib/api-helper"
import { loginAction } from "./action"
import { SignInData } from "@/interfaces/user"


export default function LoginPage() {

    const router = useRouter()

    const handleSignInData = async (signInData: SignInData) => {

        const response = await loginAction(signInData);
        console.log(response);
        // loginAction(auth)
        // const postObject = {
        //     path: API_ROUTES.login,
        //     postData: auth
        // }
        // const responseData = await postData(postObject)
        // console.log('Response from API:', responseData);
        // window.location.href = '/admin/clients';
        // router.push('/admin/users')
    }

    return (
        <div className="flex h-screen">
            <div className="hidden md:block md:w-2/3 relative bg-primary">
                <Image
                    src={bgImg}
                    alt="Decorative background"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>

            <div className="w-full md:w-1/3 flex items-center justify-center p-8 bg-background">
                <LoginForm signInData={handleSignInData} />
            </div>
        </div>
    )
}
