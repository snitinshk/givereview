"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import placeholder from "../../images/placeholder.svg";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { TransformedReview } from "@/interfaces/i-reviews";
import { useSelectedReview } from "@/app/context/selected-negative-review-context";
import { capitalizeFirstLetter, getSlug } from "@/lib/utils";
import { useLoader } from "@/app/context/loader.context";

// type Review = {
//   id: string;
//   date: string;
//   client: string;
//   stars: number;
//   name: string;
//   review: string;
//   image?: string;
// };

interface ReviewTableProps {
  filteredClient?: string;
  filteredReviewLink?: string;
  reviews: TransformedReview[];
  reviewType: string;
  showImage?: boolean;
  showAction?: boolean;
}

const ReviewTable: React.FC<ReviewTableProps> = ({
  filteredClient,
  filteredReviewLink,
  reviewType,
  reviews,
  showImage = false,
  showAction = false,
}) => {
  const { setSelectedReview } = useSelectedReview();
  const router = useRouter(); // Initialize the router
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasData, setHasData] = useState<boolean>(false);
  const { setIsLoading } = useLoader();
  const totalPages = Math.ceil(reviews.length / rowsPerPage);

  useEffect(() => {
    if (reviews?.length) {
      setIsLoading(false);
    }
  }, [reviews]);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderStars = (stars: number) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }).map((_, index) => (
      <span key={index}>
        {index < stars ? (
          <FaStar className="text-yellow-500" />
        ) : (
          <FaRegStar className="text-gray-400" />
        )}
      </span>
    ));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleReadMore = (id: string) => {
    // Navigate to the review detail page
    const selectedReview = reviews?.find((review) => review.id === id);
    setSelectedReview(selectedReview as TransformedReview);
    const params: Record<string, string> = {};

    if (filteredClient && filteredClient !== "All") {
      params["filteredclient"] = filteredClient;
    }
    if (filteredReviewLink && filteredReviewLink !== "All") {
      params["filteredrl"] = filteredReviewLink;
    }

    // Properly construct the query string
    const query =
      Object.keys(params).length >= 1
        ? `?${new URLSearchParams(params).toString()}`
        : "";
    // Append the query string to the URL
    router.push(
      `/admin/reviews/${getSlug(selectedReview?.name || "")}${query}`
    );
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center p-10">
  //       <p className="text-gray-500 text-xl">Loading...</p>
  //     </div>
  //   );
  // }

  // if (!hasData) {
  //   return (
  //     <div className="flex items-center justify-center p-10">
  //       <p className="text-gray-500 text-xl">No reviews available</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow className="bg-gray-100 text-[#637381]">
            {showImage && (
              <TableHead className="py-5 px-8 hidden sm:table-cell">
                Image
              </TableHead>
            )}
            <TableHead className={`py-5 ${!showImage ? "px-8" : ""}`}>
              Date
            </TableHead>
            <TableHead>
              {reviewType === "internal" ? "Client" : "Stream"}
            </TableHead>
            <TableHead>Stars</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Review</TableHead>
            {!showAction && <TableHead>&nbsp;</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReviews.map((review, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              {showImage && (
                <TableCell className="py-4 px-8 hidden sm:table-cell">
                  <Image
                    src={review.image || placeholder}
                    alt={`${review.name}'s review`}
                    width={30}
                    height={30}
                    className="rounded-md"
                  />
                </TableCell>
              )}
              <TableCell className={`py-4 ${!showImage ? "px-8" : ""}`}>
                {review.date}
              </TableCell>
              <TableCell className="py-4">
                {capitalizeFirstLetter(review.client)}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex gap-1 text-lg">
                  {renderStars(review.stars)}
                </div>
              </TableCell>
              <TableCell className="py-4">
                {capitalizeFirstLetter(review.name)}
              </TableCell>
              <TableCell className="py-4 max-w-[200px] lg:max-w-[300px] truncate overflow-hidden text-ellipsis">
                {review.review}
              </TableCell>
              {!showAction && (
                <TableCell className="py-4">
                  <Button
                    size="sm"
                    className="bg-gray-200 text-black font-bold hover:text-white"
                    onClick={() => handleReadMore(review.id)}
                  >
                    Read more
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end text-sm gap-3 border-t border-gray-200 items-center p-4">
        <div className="flex items-center gap-4">
          <p>Rows per page:</p>
          <Select
            onValueChange={handleRowsPerPageChange}
            defaultValue={String(rowsPerPage)}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder={`${rowsPerPage}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, reviews.length)} of{" "}
          {reviews.length}
        </p>
      </div>
    </>
  );
};

export default ReviewTable;
