"use client";

import Image from "next/image";
import bgImg from "./content.svg";
import LoginForm from "./form";

import { loginAction } from "./action";
import { SignInData } from "@/interfaces/user";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<boolean>(false);

  const router = useRouter();

  const handleSignInData = async (signInData: SignInData) => {
    const isError = await loginAction(signInData);
    if (!isError) {
      router.push("/admin/clients");
    } else {
      setIsInvalidCredentials(true);
    }
  };

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
        <LoginForm
          invalidCredentials={isInvalidCredentials}
          signInData={handleSignInData}
        />
      </div>
    </div>
  );
}
