import DefaultLayout from "@/layouts/default";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Card, CardBody } from "@heroui/card";

const features = [
  {
    icon: "🎯",
    title: "1500+ Questions",
    description: "Extensive question bank covering all exam topics",
  },
  {
    icon: "💎",
    title: "100% Free",
    description: "No payment required - start practicing today",
  },
  {
    icon: "🔖",
    title: "Bookmark Feature",
    description: "Save questions for later review",
  },
];

export default function IndexPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    if (features.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000); // Switch every 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount or when index changes
  }, [currentFeatureIndex, features.length]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pass Your Certification Exam with Confidence
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
            Your journey to certification success starts here. Practice with our comprehensive question bank and master your exam preparation.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
            <Button
              as={NextLink}
              href={"/browse"}
              color="primary"
              size="lg"
              radius="md"
              className="font-semibold shadow-lg hover:shadow-primary/50 transition-shadow"
            >
              Browse Questions
            </Button>
            {!session && (
              <Button
                as={NextLink}
                href={siteConfig.access.register}
                variant="ghost"
                color="primary"
                size="lg"
                radius="md"
                className="font-semibold"
              >
                Sign Up Now
              </Button>
            )}
          </div>

          {/* Mobile View: Auto-switching single feature with animation */}
          <div className="md:hidden mt-8 flex justify-center items-start pb-4 min-h-[340px] overflow-hidden"> {/* Adjusted min-height */}
            {features.length > 0 && (
              <Card
                key={currentFeatureIndex}
                className={`
                  flex-none w-72 sm:w-80
                  text-center
                  shadow-xl
                `}
              >
                <CardBody className="p-8">
                  <div className="text-5xl mb-6">{features[currentFeatureIndex].icon}</div>
                  <h3 className="text-2xl mb-3">
                    {features[currentFeatureIndex].title}
                  </h3>
                  <p>
                    {features[currentFeatureIndex].description}
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Desktop View: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8 mt-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center shadow-xl"
              >
                <CardBody className="p-6">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl mb-3">
                    {feature.title}
                  </h3>
                  <p>
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
