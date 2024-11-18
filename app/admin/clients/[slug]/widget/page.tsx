"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GGLIMG from "@/app/images/google.svg";
import TRIPIMG from "@/app/images/tripadvisor.svg";
import { BiLinkExternal } from "react-icons/bi";
import { useParams } from "next/navigation";

export type Client = {
  id: string;
  images: string[];
  description: string;
  status: "Active" | "Inactive" | "Disabled" | "Pending";
};

export const getStatusColor = (status: Client["status"]) => {
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

export const clients: Client[] = [
  {
    id: "1",
    images: [GGLIMG, TRIPIMG],
    description: "Client A is a leading provider of tech solutions.",
    status: "Active",
  },
  {
    id: "2",
    images: [GGLIMG],
    description: "Client B specializes in financial services and consulting.",
    status: "Inactive",
  },
  {
    id: "3",
    images: [GGLIMG, TRIPIMG],
    description: "Client C focuses on innovative healthcare solutions.",
    status: "Disabled",
  },
  {
    id: "4",
    images: [TRIPIMG],
    description: "Client D is known for its educational and training programs.",
    status: "Pending",
  },
];

const widget: React.FC = (params) => {
    
  const { slug } = useParams();

  return (
    <>
      <Link
        href={`/admin/clients/${slug}/widget/create`}
        className="bg-[#00AB55] text-white text-sm px-4 rounded-lg hover:bg-gray-800 py-2 ml-auto table font-bold mb-8 -mt-12"
      >
        Create widget
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

export default widget;
