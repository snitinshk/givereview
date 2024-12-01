"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewTable from "./ReviewTable";
import GLGIMG from "@/app/images/google.svg";

const ReviewCampo: React.FC = () => {
  const reviews = [
    {
      id: "1",
      date: "2024-10-15",
      client: "Silvis",
      stars: 2,
      name: "Mona Berggren",
      review:
        "Riktigt mysigt ställe med bra musik, härlig atmosfär och riktigt bra service. Maten var av hög kvalitet med perfekta portioner i paritet med priserna. Kan varmt rekommendera.",
      image: GLGIMG,
    },
    {
      id: "2",
      date: "2024-10-15",
      client: "Maharani",
      stars: 3,
      name: "James Tay",
      review: "Really good food! Get four mixed grills.",
      image: GLGIMG,
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg mb-5">
        <Tabs defaultValue="Nagativetbs" className="flex-grow">
          {/* Tabs List */}
          <TabsList className="w-full flex-wrap rounded-b-none gap-4 justify-start p-0 pt-3 border-b h-auto border-gray-200 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
            <TabsTrigger value="Nagativetbs">Nagative (internal)</TabsTrigger>
            <TabsTrigger value="Streamtbs">Stream</TabsTrigger>
          </TabsList>

          {/* Nagativetbs Content */}
          <TabsContent value="Nagativetbs">
            <div className="px-6 pt-6 flex items-center mb-4 gap-4">
              <div className="w-1/5">
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                    <SelectItem value="NIGHTCLUB">Nightclub</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/5">
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Review link" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ReviewTable reviews={reviews} />
          </TabsContent>

          <TabsContent value="Streamtbs">
            <div className="px-6 pt-6 flex items-center mb-4 gap-4">
              <div className="w-1/5">
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                    <SelectItem value="NIGHTCLUB">Nightclub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ReviewTable reviews={reviews} showImage showAction />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ReviewCampo;
