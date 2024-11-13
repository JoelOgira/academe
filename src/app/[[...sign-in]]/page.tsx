"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";

import signInImage from "../../../public/sign-in-image.webp";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && isLoaded) {
      const role = user.publicMetadata.role;
      if (role) {
        router.push(`/${role}`);
      } else {
        console.error("User role is undefined");
      }
    }
  }, [isLoaded, router, user]);

  return (
    <main className="h-screen flex items-center justify-center p-5 bg-lightSkyBlue">
      <div className="flex overflow-hidden h-fit max-h-[40rem] w-full max-w-[64rem] bg-card shadow-2xl rounded-2xl">
        <div className="overflow-y-auto p-5 w-full space-y-5 md:w-1/2 lg:p-10">
          <SignIn.Root>
            <SignIn.Step name="start" className="flex flex-col gap-3">
              <h1 className="flex items-center gap-2">
                <Image src={"/logo.png"} alt="logo" width={32} height={32} />
                <span className="font-bold text-2xl md:text-3xl">academe</span>
              </h1>
              <h2 className="text-muted-foreground">Sign in to your account</h2>

              <Clerk.GlobalError className="text-xs text-red-500" />

              <Clerk.Field className="space-y-1" name="identifier">
                <Clerk.Label className="text-sm">Username</Clerk.Label>
                <Clerk.Input asChild>
                  <Input placeholder="Enter username e.g paddy" required />
                </Clerk.Input>
                <Clerk.FieldError className="text-sm text-red-500" />
              </Clerk.Field>

              <Clerk.Field className="space-y-1" name="password">
                <Clerk.Label className="text-sm">Password</Clerk.Label>
                <Clerk.Input asChild>
                  <PasswordInput placeholder="Enter password" required />
                </Clerk.Input>
                <Clerk.FieldError className="text-sm text-red-500" />
              </Clerk.Field>

              <SignIn.Action submit asChild>
                <Button>Continue</Button>
              </SignIn.Action>
            </SignIn.Step>
          </SignIn.Root>
        </div>
        <Image
          src={signInImage}
          alt="Sign In Image"
          className="hidden italic object-cover w-1/2 md:block"
          placeholder="blur"
        />
      </div>
    </main>
  );
}
