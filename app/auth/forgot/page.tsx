"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ic_password from "./ic_password.svg"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export default function ForgotPassword() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full h max-w-md border-none shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-center">
                        <Image
                            src={ic_password}
                            alt="lock icon"
                            priority
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Forgot your Password ?</CardTitle>
                    <CardDescription className="text-center">
                        Please enter the email address associated with your account, and we&apos;ll email you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input className="h-14" id="email" type="email" placeholder="Enter address" required />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full h-12 bg-[#00AB55]">
                        Reset Password
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}