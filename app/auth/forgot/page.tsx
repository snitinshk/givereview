"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ic_password from "./ic_password.svg"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import Link from 'next/link'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import InlineAlert from "@/components/alert/inline-alert"
import forgotPasswordAction from "./action"

interface NotifyTextObject {
    isSuccess: boolean;
    alertText: string
}

export default function ForgotPassword() {
    
    const [email, setEmail] = useState<string>('')
    const [notifyText, setNotifyText] = useState<NotifyTextObject>()

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { error } = await forgotPasswordAction(email);

        if (!error) {
            setNotifyText({ isSuccess: true, alertText: 'Please check your email for link to reset your password.' })
        } else {
            setNotifyText({ isSuccess: false, alertText: 'Error sending reset password email.' })
        }
        setEmail('');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full h max-w-md border-none shadow-none">
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-10">
                            <Image
                                src={ic_password}
                                alt="lock icon"
                                priority
                            />
                        </div>
                        <CardTitle className="text-[32px] font-bold text-center mb-3">Forgot your Password ?</CardTitle>
                        <CardDescription className="text-center text-base">
                            Please enter the email address associated with your account, and we&apos;ll email you a link to reset your password.
                        </CardDescription>
                        {notifyText && <InlineAlert alertText={notifyText?.alertText} isSuccess={notifyText?.isSuccess} />}
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="peer h-12 w-full border-gray-300 focus:outline-none focus:border-primary"
                            />
                            <label
                                htmlFor="email"
                                className={`absolute left-2 bg-white px-1 transition-all duration-200 ease-in-out transform
              ${email ? "-top-2 text-sm text-gray-700" : "top-3 text-base text-gray-500"}
              peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-700`}
                            >
                                Email address
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                        <Button type="submit" className="w-full h-12 font-bold font-PUBSAN bg-[#00AB55]">
                            Reset Password
                        </Button>
                        <Link href="/auth/login" className="flex items-center text-sm gap-1 mt-5 font-semibold hover:underline"><MdOutlineKeyboardArrowLeft className="text-lg" /> Return to sign in</Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}