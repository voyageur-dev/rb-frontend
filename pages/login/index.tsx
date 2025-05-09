import { signIn, useSession } from "next-auth/react";

import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { addToast, Checkbox, Divider } from "@heroui/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import Cookies from 'js-cookie';
import VerificationForm from "@/components/verification-form";


export default function DocsPage() {
  const {data: session} = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isRemembered, setIsRemembered] = React.useState(Cookies.get("userEmail"));
  const [isLoading, setIsLoading] = React.useState(false);
  const [requiredVerification, setRequiredVerification] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    let data = Object.fromEntries(new FormData(e.currentTarget));

    signIn("credentials", { redirect: false, username: data.email, password: data.password })
      .then((resp) => {

        if (resp && resp.error === "EMAIL_NOT_VERIFIED") {
          setUsername(data.email.toString());
          setRequiredVerification(true);
          formRef.current?.reset();
        }
        else if (resp && resp.status === 401) {
          // reset form
          formRef.current?.reset();

          // add notification
          addToast({
            title: "Login failed",
            description: "Invalid email or password.",
            color: "danger",
            promise: new Promise((resolve) => setTimeout(resolve, 1000))
          })
        }
        else if (resp && resp.ok) {
          if (isRemembered) {
            Cookies.set('userEmail', data.email, { expires: 7 }); // days
          }
          else {
            Cookies.remove('userEmail');
          }
          formRef.current?.reset();
        }

        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  return (
    <DefaultLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
          <div className="flex flex-col items-center pb-6">
            <p className="text-xl font-medium">Welcome Back</p>
            <p className="text-small text-default-500">Log in to your account to continue</p>
          </div>
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            ref={formRef}
            onReset={() => null}
            onSubmit={handleSubmit}
          >
            <Input
              className="py-2"
              isRequired
              errorMessage="Please enter a valid email"
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              radius="none"
              defaultValue={Cookies.get("userEmail")}
            />
            <Input
              className="py-2"
              isRequired
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your username"
              type={isVisible ? "text" : "password"}
              radius="none"
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <RiEyeCloseFill className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <RiEyeFill className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox
                size="sm"
                isSelected={isRemembered}
                onValueChange={(isSelected) => setIsRemembered(isSelected)}
                radius="none"
              >
                Remember me
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button isLoading={isLoading} className="min-w-full py-2" color="primary" type="submit" radius="none">
              Sign In
            </Button>
          </Form>

          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link href={siteConfig.access.register} size="sm">Sign Up</Link>
          </p>
        </div>
      </div>
      {
        requiredVerification ?
          <VerificationForm username={username} />
          : <></>
      }
    </DefaultLayout>
  );
}
