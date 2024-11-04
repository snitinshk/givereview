
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInData } from "@/interfaces/user";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

type LoginFormProps = {
    signInData: (data: SignInData) => void; // or Promise<void>
};

export default function LoginForm({ signInData }: LoginFormProps) {

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        signInData({ email, password })
    }


    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="text-sm text-muted-foreground mt-2">Please enter your details to sign in.</p>
            </div>

            <div className="space-y-6">
                <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value as string)}
                        required
                        className="peer h-12 w-full border-b-2 border-gray-300 focus:outline-none focus:border-primary"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm"
                    >
                        Email
                    </label>
                </div>

                <div className="relative">
                    <Input
                        id="password"
                        onChange={(e) => setPassword(e.target.value as string)}
                        type={showPassword ? "text" : "password"}
                        required
                        className="peer h-12 w-full border-b-2 border-gray-300 focus:outline-none focus:border-primary pr-10"
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm"
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
            <div className="text-right text-sm">
                <a href="#" className="text-primary underline">
                    Forgot password?
                </a>
            </div>
            <Button type="submit" className="w-full">
                Sign In
            </Button>
        </form>
    )
}