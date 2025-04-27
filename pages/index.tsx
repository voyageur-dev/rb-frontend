import DefaultLayout from "@/layouts/default";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/router";

export default function IndexPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push(siteConfig.access.login);
    }
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

      </section>
    </DefaultLayout>
  );
}
