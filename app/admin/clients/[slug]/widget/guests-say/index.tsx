"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testimonials } from "@/components/data/testimonialsData";
import Slider from "@/components/slider";
import Image from "next/image";

const TestimonialCompo: React.FC = () => {
  const platforms = Array.from(
    new Map(
      testimonials.map((testimonial) => [
        testimonial.platform,
        testimonial.platformImage,
      ])
    )
  ); // Deduplicates platforms with associated images

  const tabs = [
    {
      value: "all",
      label: "All",
      platformImage: null, // No specific image for 'All'
      testimonials,
    },
    ...platforms.map(([platform, platformImage]) => ({
      value: platform.toLowerCase(),
      label: platform,
      platformImage,
      testimonials: testimonials.filter(
        (testimonial) => testimonial.platform === platform
      ),
    })),
  ];

  return (
    <section className="w-full px-4 py-8">
      <h2 className="text-3xl font-bold text-center mt-4 mb-6">
        What our guests say
      </h2>
      <Tabs defaultValue="all">
        <TabsList className="w-full flex-wrap rounded-b-none gap-4 justify-start p-0 pt-3 border-b h-auto border-gray-200 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 hover:bg-gray-100"
            >
              {tab.platformImage && (
                <Image
                  src={tab.platformImage}
                  alt={`${tab.label} Logo`}
                  width={16}
                  height={16}
                />
              )}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="flex flex-col px-4 sm:px-6 lg:px-20 w-full"
          >
            <Slider testimonials={tab.testimonials} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default TestimonialCompo;
