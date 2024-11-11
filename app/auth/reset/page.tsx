"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ic_email_sent from "./ic_email_sent.svg"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { InputOTPPattern } from "./input-otp"
import { useState } from "react"
import Link from "next/link"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Timmer from "@/components/timmer"
import { IoMdInformationCircle } from "react-icons/io";

export default function ResetPassword() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState("");
    const [cnpassword, setCnpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCnPassword, setShowCnPassword] = useState(false);
    const [timmer, setTimmer] = useState({ minute: 0, second: 45 });
    const [isResendOtp, setIsResendOtp] = useState(true);



    const resendOtp = async () => {
        setTimmer({ minute: 0, second: 45 });
        setIsResendOtp(false);
    };

    const resendOtpHandle = () => {
        resendOtp();
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full h max-w-md border-none shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-center mb-8">
                        <Image
                            src={ic_email_sent}
                            alt="lock icon"
                            priority
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center max-w-48 mx-auto">Request sent successfully!</CardTitle>
                    <CardDescription className="text-center">
                        We&apos;ve sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 bg-red-100 py-3 px-4 rounded-lg text-red-900 mb-4"><IoMdInformationCircle className="text-2xl text-red-500" /> Invalid email or password.</div>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div className="space-y-6">
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
                            <div className="relative flex justify-center">
                                <InputOTPPattern />
                            </div>
                            <div className="relative mb-4">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    className="peer h-12 w-full border-gray-300 focus:outline-none focus:border-primary pr-10"
                                />
                                <label
                                    htmlFor="password"
                                    className={`absolute left-2 bg-white px-1 transition-all duration-200 ease-in-out transform
                    ${password ? "-top-2 text-sm text-gray-700" : "top-3 text-base text-gray-500"}
                    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-700`}
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Confirm New Password Field */}
                            <div className="relative mb-4">
                                <Input
                                    id="cnpassword"
                                    type={showCnPassword ? "text" : "password"}
                                    onChange={(e) => setCnpassword(e.target.value)}
                                    value={cnpassword}
                                    required
                                    className="peer h-12 w-full border-gray-300 focus:outline-none focus:border-primary pr-10"
                                />
                                <label
                                    htmlFor="cnpassword"
                                    className={`absolute left-2 bg-white px-1 transition-all duration-200 ease-in-out transform
                    ${cnpassword ? "-top-2 text-sm text-gray-700" : "top-3 text-base text-gray-500"}
                    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-700`}
                                >
                                    Confirm New Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowCnPassword(!showCnPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showCnPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                    </form>
                </CardContent>

                <CardFooter className="flex flex-col items-center">
                    <Button type="submit" className="w-full h-12 font-bold font-PUBSAN bg-[#00AB55]">
                        Update Password
                    </Button>
                    <div className="flex justify-center text- text-ftClor items-center mt-5">
                        <div className="mr-2">
                            {" "}
                            {!(timmer.minute || timmer.second) ? (
                                <>
                                    Don’t have a code?{" "}
                                    <span
                                        onClick={resendOtpHandle}
                                        className="text-[#00AB55] font-bold cursor-pointer underline hover:text-txtcol hover:no-underline"
                                    >
                                        Resend Code
                                    </span>
                                </>
                            ) : (
                                <>Resend Code in</>
                            )}
                        </div>

                        <Timmer
                            isResendOtp={isResendOtp}
                            setIsResendOtp={setIsResendOtp}
                            setTimmer={setTimmer}
                            initialMinute={timmer.minute}
                            initialSeconds={timmer.second}
                            onTimmerClose={() => setIsResendOtp(true)}
                        />
                    </div>
                    <Link href="/auth/login" className="flex items-center text-sm gap-1 mt-5 font-semibold hover:underline"><MdOutlineKeyboardArrowLeft className="text-lg" /> Return to sign in</Link>
                </CardFooter>
            </Card>
        </div>
    )
}