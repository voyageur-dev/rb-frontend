import { useRouter } from 'next/router'
import QuestionPanel from "@/components/question-panel";
import DefaultLayout from "@/layouts/default";
import React from "react";
import { useSession } from "next-auth/react";

export default function DocPage() {
  const router = useRouter()
  const {data: session}  = useSession();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {
          router.query.exam && session && (
            <QuestionPanel
              examId={router.query.exam[0]}
              questionId={router.query.exam[1]}
            />
          )
        }
      </section>
    </DefaultLayout>
  )
}