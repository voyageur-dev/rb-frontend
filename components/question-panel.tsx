import QuestionCard from "@/components/question-card";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Pagination, Spinner } from "@heroui/react";

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

  const fetchMetadata = async () => {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/metadata`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      if (resp.ok) {
        const { data } = await resp.json();

        for (const metadata of data) {
          if (metadata.examId === examId) {
            setCount(metadata.count);
          }
        }
      }
      else if (resp.status === 401) {
        signOut();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookmarks = async () => {
    try {

      const params = new URLSearchParams({
        examId: examId,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/bookmarks?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newBookmarks = new Set();
        for (const id of data.bookmarks[examId]) {
          newBookmarks.add(id);
        }
        setBookmarks(newBookmarks);
      } else if (response.status === 401) {
        signOut();
      }
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

      console.log(params.toString());

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

        setIndex(questions[0].questionId);
        setLastEvaluatedKey(questions[questions.length - 1].questionId);
      } else if (response.status === 401) {
        signOut();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMetadata();
      fetchBookmarks();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      if (!loadedQuestions.has(index)) {
        if (index === 0) {
          fetchQuestions(-1);
        }
        else {
          console.log("here")
          console.log(index - 1);
          fetchQuestions(index - 1);
        }
      }
    }
  }, [index]);

  if (isLoading) {
    return <Spinner color="warning" size="lg" />;
  }

  return (
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
                }
                else {
                  bookmarks.add(index);
                }
            }}
            />
              <Pagination
                className="flex flex-row item-center justify-center"
                initialPage={index + 1}
                total={count}
                onChange={page => setIndex(page - 1)} />
          </>
        )
      }
    </div>
  );
}