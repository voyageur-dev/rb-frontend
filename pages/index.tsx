import DefaultLayout from "@/layouts/default";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/router";

export default function IndexPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pass Your Certification Exam with Confidence
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your journey to certification success starts here. Practice with our comprehensive question bank and master your exam preparation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">1500+ Questions</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">Extensive question bank covering all exam topics</p>
            </div>
            
            <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <div className="text-4xl mb-6">💎</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">100% Free</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">No payment required - start practicing today</p>
            </div>
            
            <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <div className="text-4xl mb-6">🔖</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Bookmark Feature</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">Save questions for later review</p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
