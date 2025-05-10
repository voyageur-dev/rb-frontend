import { Button } from "@heroui/button";
import React, { useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { addToast, InputOtp, useDisclosure } from "@heroui/react";
import { Form } from "@heroui/form";
import { useRouter } from "next/router";
import { confirmCode, resendCode } from "@/lib/api/users";


interface VerificationFormProps {
  username: string;
}

export default function VerificationForm({ username }: VerificationFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, onClose) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code");

    try {
      await confirmCode(username, code);

      addToast({
        title: "Verification Success",
        description: "You can now sign in with your account.",
        color: "success",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });

      onClose(); // close the modal
      router.push("/login");
    } catch (err) {
      addToast({
        title: "Verification Error",
        description: "Please try again.",
        color: "danger",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });

      formRef.current?.reset();
    }
  }

  const handleResend = async () => {
    try {
      await resendCode(username);

      addToast({
        title: "Verification Code Resend",
        description: "Please check your email for the verification code.",
        color: "success",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });
    } catch (err) {
      addToast({
        title: "Error Sending Verification",
        description: "Please try again.",
        color: "danger",
        promise: new Promise((resolve) => setTimeout(resolve, 1000))
      });
    }
  }

  return (
    <Modal backdrop="blur" defaultOpen={true} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Email Verification
            </ModalHeader>
            <Form
              className="flex w-full"
              ref={formRef}
              onSubmit={(e) => handleSubmit(e, onClose)}
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