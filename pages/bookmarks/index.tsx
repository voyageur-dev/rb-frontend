import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/router";
import { Spinner } from "@heroui/react";
import { Chip } from "@heroui/chip";
import { getBookmarks } from "@/lib/api/bookmarks";

interface BookmarkData {
  [examId: string]: number[];
}

export default function BookmarksPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkData | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { bookmarks } = await getBookmarks(session);
      setBookmarks(bookmarks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!session) {
      router.push(siteConfig.access.login);
      return;
    }

    fetchBookmarks();
  }, [session, router]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="h-12 w-12" color="warning" />
        </div>
      </DefaultLayout>
    );
  }

  // Check if there are any bookmarks
  const hasBookmarks = bookmarks && Object.keys(bookmarks).length > 0;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <h1 className={title({ size: "lg" })}>Your Bookmarked Questions</h1>
          
          {hasBookmarks ? (
            <div className="grid gap-4 mt-8">
              {Object.entries(bookmarks || {}).map(([examId, questionIds]) => (
                <div key={examId} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{examId}</h2>
                  <div className="grid gap-4">
                    {
                      questionIds.map((questionId) => (
                          <Chip key={questionId + 1} className="min-h-sm min-w-sm" radius="none" color="success" variant="flat">
                            <button key={questionId + 1 + "-btn"} onClick={() => router.push(`/exams/${examId}/${questionId + 1}`)}>
                            #{questionId + 1}
                            </button>
                          </Chip>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                You have not bookmarked any questions yet.
              </p>
              <button 
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => router.push('/')}
              >
                Browse Questions
              </button>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}