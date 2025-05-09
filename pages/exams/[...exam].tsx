import { useRouter } from 'next/router'
import QuestionPanel from "@/components/question-panel";
import DefaultLayout from "@/layouts/default";
import React from "react";

export default function DocPage() {
  const router = useRouter()

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {
          router.query.exam && (
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