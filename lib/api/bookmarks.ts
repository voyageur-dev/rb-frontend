import { Session } from "node:inspector";

export async function getBookmarks(session: Session, examId?: string) {

  let url = `${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/bookmarks`;

  if (examId) {
    const params = new URLSearchParams({
      examId: examId,
    });
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error("Failed to get bookmarks");
  }

  return res.json();
}


export async function createBookmark(session: Session, examId: string, questionId: number) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/bookmarks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      examId: examId,
      questionId: questionId
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to bookmark');
  }
}


export async function deleteBookmark(session: Session, examId: string, questionId: number) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/bookmarks/${examId}/${questionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.accessToken}`
    },
  });

  if (!res.ok) {
    throw new Error('Failed to unbookmark');
  }
}