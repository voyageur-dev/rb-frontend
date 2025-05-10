import QuestionCard from "@/components/question-card";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Pagination, Spinner } from "@heroui/react";
import Cookies from "js-cookie";
import { getBookmarks } from "@/lib/api/bookmarks";
import { getMetadata } from "@/lib/api/metadata";


export interface Question {
  examId: string;
  questionId: number;
  options: {
    isCorrect: boolean;
    text: string;
    s3ImageUrls: string[];
  }[];
  question: string;
  s3ImageUrls: string[];
  sourceUrl: string;
}

interface QuestionsResponse {
  questions: Question[];
}

export default function QuestionPanel({ examId, questionId }) {
  const [index, setIndex] = useState(questionId - 1);
  const [loadedQuestions, setQuestions] = useState(new Map<number, Question>());
  const [count, setCount] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(new Set());

  const { data: session } = useSession();

  useEffect(() => {
    let lastView = Cookies.get("lastView") ? JSON.parse(Cookies.get("lastView")) : undefined;

    if (lastView) {
      lastView[examId] = index + 1;
    }
    else {
      lastView = {};
      lastView[examId] = index + 1;
    }
    Cookies.set("lastView", JSON.stringify(lastView));
  }, [index]);


  const fetchMetadata = async () => {
    try {
      const { data } = await getMetadata(session);

      for (const metadata of data) {
        if (metadata.examId === examId) {
          setCount(metadata.count);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const data = await getBookmarks(session, examId);
      setBookmarks(new Set(data.bookmarks?.[examId] ?? []));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestions = async (lastKey?: number) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        examId: examId,
        pageSize: '20'
      });

      if (lastKey !== undefined && lastKey >= 0) {
        params.append('lastEvaluatedKey', String(lastKey));
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/questions?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      if (response.ok) {
        const { questions }: QuestionsResponse = await response.json();

        for (const question of questions) {
          loadedQuestions.set(question.questionId, question);
        }

        setQuestions(loadedQuestions);
        setIndex(questions[0].questionId);
        setLastEvaluatedKey(questions[questions.length - 1].questionId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loadedQuestions.has(index)) {
      fetchQuestions(index - 1);
    }
    fetchMetadata();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (!loadedQuestions.has(index)) {
      fetchQuestions(index - 1);
    }
  }, [index]);

  return (
    <>
    {
      isLoading ? <Spinner color="warning" size="lg" /> :
      <div className="flex flex-col gap-3">
        {
          bookmarks && count > 0 && loadedQuestions.get(index) && (
            <>
              <QuestionCard
                key={index}
                questionData={loadedQuestions.get(index)}
                isBookmarked={bookmarks.has(index)}
                onBookmarkEvent={() => {
                  if (bookmarks.has(index)) {
                    bookmarks.delete(index);
                  } else {
                    bookmarks.add(index);
                  }
                }}
              />
              <Pagination
                className="flex flex-row item-center justify-center"
                initialPage={index + 1}
                total={count}
                onChange={page => setIndex(page - 1)}
              />
            </>
          )
        }
      </div>
    }
    </>
  );
}