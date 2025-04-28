import DefaultLayout from "@/layouts/default";
import {
  Drawer, DrawerBody, DrawerContent, DrawerHeader, Listbox, ListboxItem, Spinner,useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/router";

type Metadata = {
  examId: string;
  count: number;
};

export const columns = [
  {name: "Name", uid: "name"},
  {name: "Count", uid: "count"},
];

export default function DocsPage() {
  const [metadata, setMetadata] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedExam, setSelectedExam] = useState(null);

  const {isOpen, onOpen, onOpenChange} = useDisclosure({defaultOpen: true});

  useEffect(() => {
    if (!session) {
      router.push(siteConfig.access.login);
    }
  }, [session]);

  useEffect(() => {
    if (selectedExam) {
      router.push(`/exams/${selectedExam}`);
    }
  }, [selectedExam]);


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

        setMetadata(data);
      }
      else if (resp.status === 401) {
        console.log(resp)
        signOut();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMetadata();
    }
  }, [session]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Drawer backdrop="blur" isOpen={isOpen} placement="left" onOpenChange={onOpenChange}>
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">Exams</DrawerHeader>
                {
                  metadata && metadata.length > 0 ? (
                    <DrawerBody>
                      <Listbox items={metadata} aria-label="Actions" onAction={(key) => {
                          setSelectedExam(key)
                          onClose()
                        }}
                      >
                        {
                          item => (
                            <ListboxItem
                              key={item.examId}
                            >
                              {item.examId}
                            </ListboxItem>
                          )
                        }
                      </Listbox>
                    </DrawerBody>
                  ) : (
                      <Spinner className="mx-auto" color="warning" size="lg" />
                  )
                }
              </>
            )}
          </DrawerContent>
        </Drawer>
      </section>
    </DefaultLayout>
  );
}