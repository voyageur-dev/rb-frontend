import { Session } from "node:inspector";

export async function getMetadata(session: Session) {

  const resp = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_BASEURL}/rb/metadata`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to get metadata");
  }

  return resp.json();
}
