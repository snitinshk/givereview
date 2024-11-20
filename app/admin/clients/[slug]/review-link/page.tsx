"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GGLIMG from "@/app/images/google.svg";
import TRIPIMG from "@/app/images/tripadvisor.svg";
import { BiLinkExternal } from "react-icons/bi";
import { useParams } from "next/navigation";
import { useSelectedClient } from "@/app/context/selected-client-context";
import { useToast } from "@/hooks/use-toast";
import { useReviewLink } from "@/app/context/review-link-context";

export type Client = {
  id: string;
  images: string[];
  description: string;
  link: string;
  status: "Active" | "Inactive" | "Disabled" | "Pending";
};
const ReviewLink: React.FC = (params) => {

  const clients: Client[] = [
    {
      id: "1",
      images: [GGLIMG, TRIPIMG],
      description: "Client A is a leading provider of tech solutions.",
      link: "https://clienta.com",
      status: "Active",
    },
    {
      id: "2",
      images: [GGLIMG],
      description: "Client B specializes in financial services and consulting.",
      link: "https://clientb.com",
      status: "Inactive",
    },
    {
      id: "3",
      images: [GGLIMG, TRIPIMG],
      description: "Client C focuses on innovative healthcare solutions.",
      link: "https://clientc.com",
      status: "Disabled",
    },
    {
      id: "4",
      images: [TRIPIMG],
      description: "Client D is known for its educational and training programs.",
      link: "https://clientd.com",
      status: "Pending",
    },
  ];

  
  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#def4e9] text-[#1a806a]";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800";
      case "Disabled":
        return "bg-[#fff3d6] text-[#b76e00]";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { selectedClient } = useSelectedClient();
  const { reviewLinkDetail, setReviewLinkDetail } = useReviewLink();
  const { slug } = useParams();

  const { toast } = useToast();

  useEffect(() => {
    if (selectedClient) {
      const fetchReviewLink = async () => {
        const response = await fetch(
          `/api/admin/review-link?clientId=${selectedClient?.id}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          toast({
            description: errorData.error || `HTTP Error: ${response.status}`,
          });
        }
        const reviewLink = await response.json();
        console.log(reviewLink);
        setReviewLinkDetail(reviewLink);
      };

      fetchReviewLink();
    }
  }, [selectedClient]);

  return (
    <>
      <Link
        href={`/admin/clients/${slug}/review-link/add`}
        className="bg-[#00AB55] text-white text-sm px-4 rounded-lg hover:bg-gray-800 py-2 ml-auto table font-bold mb-8 -mt-12"
      >
        Create Link
      </Link>

      <div className="space-y-5">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between border border-gray-50 p-6 rounded-lg shadow-md"
          >
            <div className="flex space-x-4">
              {client.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${client.description} image ${index + 1}`}
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              ))}
              <p className="text-ftClor text-sm font-semibold mt-2">
                {client.description}
              </p>
            </div>
            <div className="flex items-center space-x-6 mt-2">
              <Link
                href={client.link}
                className="bg-[#dde6ff] text-[#1939b7] hover:bg-gray-200 flex gap-1 items-center text-sm font-semibold px-3 py-1 rounded-md "
              >
                <BiLinkExternal /> Link
              </Link>
              <Badge
                className={`${getStatusColor(
                  client.status
                )} !bottom-0 !shadow-none pointer-events-none px-4  h-7`}
              >
                {client.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="bg-[#9edcc0] text-[#027b55] px-4 h-7 font-bold !shadow-none"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-[#ff5631] text-white px-4 h-7 font-bold !shadow-none"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewLink;
