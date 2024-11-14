"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ic_email_sent from "./ic_email_sent.svg";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
// import { InputOTPPattern } from "./input-otp"
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useSearchParams } from "next/navigation";
import resetPasswordAction from "./action";
import InlineAlert from "@/components/alert/inline-alert";
// import { updatePasswordAction } from "./action";

interface NotifyTextObject {
  isSuccess: boolean;
  alertText: string;
}

export default function ResetPassword() {
  const [notifyText, setNotifyText] = useState<NotifyTextObject>();

  const [password, setPassword] = useState("");
  const [cnpassword, setCnpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnPassword, setShowCnPassword] = useState(false);
  const searchParams = useSearchParams();

  const authCode = searchParams.get("code");
  const errorMsg = searchParams.get("error_description");

  useEffect(()=>{
    if (errorMsg) {
      setNotifyText({
        isSuccess: false,
        alertText: errorMsg,
      });
    }
  },[errorMsg])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password != cnpassword) {
      setNotifyText({
        isSuccess: false,
        alertText: "Password and confirm password needs to be same.",
      });
      return false;
    }
    const error = await resetPasswordAction(password, authCode ?? "");

    if (!error) {
      setNotifyText({
        isSuccess: true,
        alertText: "Password reset successfull, please try logging",
      });
    } else {
      setNotifyText({
        isSuccess: false,
        alertText: "Error in reseting password, please try again.",
      });
    }
    setPassword("");
    setCnpassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full h max-w-md border-none shadow-none">
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardHeader>
            <div className="flex items-center justify-center mb-8">
              <Image src={ic_email_sent} alt="lock icon" priority />
            </div>
          </CardHeader>
          <CardContent>
            {notifyText && (
              <InlineAlert
                alertText={notifyText?.alertText}
                isSuccess={notifyText?.isSuccess}
              />
            )}
            <div className="space-y-6">
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
                    ${
                      password
                        ? "-top-2 text-sm text-gray-700"
                        : "top-3 text-base text-gray-500"
                    }
                    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-700`}
                >
                  New Password
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
                    ${
                      cnpassword
                        ? "-top-2 text-sm text-gray-700"
                        : "top-3 text-base text-gray-500"
                    }
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
          </CardContent>

          <CardFooter className="flex flex-col items-center">
            <Button
              type="submit"
              className="w-full h-12 font-bold font-PUBSAN bg-[#00AB55]"
            >
              Update Password
            </Button>
            <div className="flex justify-center text- text-ftClor items-center mt-5"></div>
            <Link
              href="/auth/login"
              className="flex items-center text-sm gap-1 mt-5 font-semibold hover:underline"
            >
              <MdOutlineKeyboardArrowLeft className="text-lg" /> Return to sign
              in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
