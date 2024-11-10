import Image from "next/image"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInData } from "@/interfaces/user";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import Logo from "../../images/logo.svg"
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'

type LoginFormProps = {
    signInData: (data: SignInData) => void; // or Promise<void>
};

export default function LoginForm({ signInData }: LoginFormProps) {

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            await signInData({ email, password });
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 font-PUBSAN">
            <div className="flex justify-center mb-20">
                <Image src={Logo} alt="Logo" priority />
            </div>
            <h2 className="text-2xl font-bold font-PUBSAN">Sign in</h2>

            <div className="space-y-6">
                <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        className="peer h-12 w-full border-gray-300 focus:outline-none focus:border-primary"
                    />
                    <label
                        htmlFor="email"
                        className={`absolute left-2 bg-white px-1 transition-all duration-200 ease-in-out transform
              ${email ? "-top-2 text-sm text-gray-700" : "top-3 text-base text-gray-500"}
              peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-700`}
                    >
                        Email
                    </label>
                </div>

                <div className="relative">
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
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2"><Checkbox id="rembMe" /> <label htmlFor="rembMe">Remember me</label></div>
            <div className="flex items-center justify-end">
                <Link href="/auth/forgot" className="text-primary underline text-ftClor text-sm hover:no-underline">Forgot password?</Link>
            </div>
            <Button
                type="submit"
                className="w-full bg-ftClor py-6 rounded-lg"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <span className="loader mr-2"></span> 
                        Loading...
                    </span>
                ) : (
                    "Login"
                )}
            </Button>
        </form>
    )
}