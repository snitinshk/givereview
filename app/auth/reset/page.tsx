"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ic_email_sent from "./ic_email_sent.svg"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { InputOTPPattern } from "./input-otp"

export default function ResetPassword() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full h max-w-md border-none shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-center">
                        <Image
                            src={ic_email_sent}
                            alt="lock icon"
                            priority
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Request sent successfully!</CardTitle>
                    <CardDescription className="text-center">
                        We&apos;ve sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div className="space-y-6">
                            <div className="relative" >
                                <Label htmlFor="email">Email</Label>
                                <Input className="h-14" id="email" type="email" placeholder="Enter address" required />
                            </div>
                            <div className="relative">
                                <InputOTPPattern />
                            </div>
                            <div className="relative" >
                                <Label htmlFor="password">Password</Label>
                                <Input className="h-14" id="password" type="text" placeholder="Password" required />
                            </div>
                            <div className="relative" >
                                <Label htmlFor="cnf-password">Confirm Password</Label>
                                <Input className="h-14" id="cnf-password" type="text" placeholder="Confirm New Password" required />
                            </div>
                        </div>

                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full h-12 bg-[#00AB55]">
                        Update Password
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}