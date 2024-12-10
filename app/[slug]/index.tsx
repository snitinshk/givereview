"use client";

import Home from "./home";
import PositiveFeedback from "./positive-feedback/feedback";
import NegativeFeedback from "./negative-feedback/feedback";
import { useEffect, useState } from "react";

export default function IndexPage({ reviewLink }: any) {
  const [isHomeVisible, setIsHomeVisible] = useState(!reviewLink?.skip_first_page_enabled);
  const [isPositivePageVisible, setIsPositivePageVisible] = useState(reviewLink?.skip_first_page_enabled);
  const [isNegativePageVisible, setIsNegativePageVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  return (
    <>
      {isHomeVisible && (
        <>
          <Home
            setIsNegativePageVisible={setIsNegativePageVisible}
            setIsPositivePageVisible={setIsPositivePageVisible}
            setIsHomeVisible={setIsHomeVisible}
            reviewLink={reviewLink}
            averageRating={averageRating}
            setAverageRating={setAverageRating}
          />
        </>
      )}
      {isPositivePageVisible && (
        <>
          <PositiveFeedback reviewLink={reviewLink} />
        </>
      )}
      {isNegativePageVisible && (
        <>
          <NegativeFeedback averageRating={averageRating} reviewLink={reviewLink} />
        </>
      )}
    </>
  );
}
