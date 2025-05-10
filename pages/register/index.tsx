import React, { useRef } from "react";

import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast, Checkbox, Divider } from "@heroui/react";
import { Link } from "@heroui/link";
import { RiEyeFill } from "react-icons/ri";
import { RiEyeCloseFill } from "react-icons/ri";
import { siteConfig } from "@/config/site";
import { Form } from "@heroui/form";
import VerificationForm from "@/components/verification-form";
import { register, RegisterRequest, UserNotConfirmedError } from "@/lib/api/users";


export default function DocsPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [requiredVerification, setRequiredVerification] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      if (data.password !== data.confirmPassword) {
        addToast({
          title: "Passwords do not match",
          description: "Please try again.",
          color: "danger",
          promise: new Promise((resolve) => setTimeout(resolve, 1000))
        });

        return;
      }

      const { username } = await register({
        email: data.email.toString(),
        password: data.password.toString(),
      });

      setUsername(username);
      setRequiredVerification(true);
    }
    catch (error) {
      if (error instanceof UserNotConfirmedError) {
        setUsername(data.email.toString());
        setRequiredVerification(true);
        return;
      }

      // add notification
      addToast({
        title: "Registration failed",
        description: error.message,
        color: "danger",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      })
    }
    finally {
      // reset form
      formRef.current?.reset();
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
          <div className="flex flex-col items-center pb-6">
            <p className="text-3xl font-medium">Welcome</p>
            <p className="text-small text-default-500">Create an account to get started</p>
          </div>
          <Form
            className="flex flex-col gap-3"
            ref={formRef}
            onSubmit={(e) => handleSubmit(e)}
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
            <Input
              className="py-2"
              isRequired
              label="Confirm Password"
              name="confirmPassword"
              labelPlacement="outside"
              placeholder="Confirm your password"
              type={isConfirmVisible ? "text" : "password"}
              radius="none"
              endContent={
                <button type="button" onClick={toggleConfirmVisibility}>
                  {isConfirmVisible ? (
                    <RiEyeCloseFill className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <RiEyeFill className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
            />
            <Checkbox isRequired className="py-4" size="sm" radius="none">
              I agree with the&nbsp;
              <Link className="relative z-[1]" href="#" size="sm">
                Terms
              </Link>
              &nbsp; and&nbsp;
              <Link className="relative z-[1]" href="#" size="sm">
                Privacy Policy
              </Link>
            </Checkbox>
            <Button isLoading={isLoading} className="min-w-full py-2" color="primary" type="submit" radius="none">
              Sign Up
            </Button>
          </Form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href={siteConfig.access.login} size="sm">
              Login
            </Link>
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
