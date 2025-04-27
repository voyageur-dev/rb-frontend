import { Button } from "@heroui/button";
import React, { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { addToast, InputOtp, useDisclosure } from "@heroui/react";
import { Form } from "@heroui/form";
import { useRouter } from "next/router";


interface VerificationFormProps {
  username: String;
}

export default function VerificationForm({ username }: VerificationFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code");
    console.log(formData);

    const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users/code`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        code: code,
      }),
    });

    if (resp.ok) {
      addToast({
        title: "Verification Success",
        description: "You can now sign in with your account.",
        color: "success",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });
      setIsOpen(false);

      router.push("/login");
    }
    else {
      addToast({
        title: "Verification Error",
        description: "Please try again.",
        color: "danger",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });
    }
  }

  const handleResend = async () => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/users/resend`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    if (resp.ok) {
      addToast({
        title: "Verification Code Resend",
        description: "Please check your email for the verification code.",
        color: "success",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });
    }
    else {
      addToast({
        title: "Error Sending Verification",
        description: "Please try again.",
        color: "danger",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });
    }
  }

  return (
    <Modal isOpen={isOpen} size="lg" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Email Verifcation
            </ModalHeader>
            <Form
              className="flex w-full"
              onSubmit={(e) => handleSubmit(e)}
            >
              <ModalBody className="space-y-4">
                <p>
                  A verification code has been send to your email.
                  Please verifiy your email address before continue.
                </p>
                  <InputOtp
                    isRequired
                    aria-label="OTP input field"
                    length={6}
                    name="code"
                    placeholder="Enter code"
                    size="lg"
                  />
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-4">
                  <Button color="primary" radius="none" type="submit">
                    Submit
                  </Button>
                  <Button color="warning" radius="none" onPress={handleResend}>
                    Resend
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}