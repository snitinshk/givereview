"use client";

import Home from "./home";
import PositiveFeedback from "./positive-feedback/feedback";
import NegativeFeedback from "./negative-feedback/feedback";
import { useState } from "react";

export default function IndexPage({ reviewLink }: any) {

  const [isHomeVisible, setIsHomeVisible] = useState(true);
  const [isPositivePageVisible, setIsPositivePageVisible] = useState(false);
  const [isNegativePageVisible, setIsNegativePageVisible] = useState(false);



  // console.log(reviewLink);

  return (
    <>
      {isHomeVisible && (
        <>
          <Home
            setIsNegativePageVisible={setIsNegativePageVisible}
            setIsPositivePageVisible={setIsPositivePageVisible}
            setIsHomeVisible={setIsHomeVisible}
            reviewLink={reviewLink}
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
          <NegativeFeedback reviewLink={reviewLink} />
        </>
      )}
    </>
  );
}
