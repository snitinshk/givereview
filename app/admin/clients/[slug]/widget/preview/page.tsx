'use client'

import { useEffect } from "react";

const TestimonialWidget = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement("script");
    script.src = "https://app.givereview.to/testimonials-slider.js";
    script.dataset.widget = "testimonials-slider";
    script.setAttribute("uuid", "d0d564ce-ede6-41f6-9366-0b2b88ba898e");
    script.async = true;

    // Append the script to the container div
    const container = document.getElementById("testimonial-widget-container");
    container?.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      container?.removeChild(script);
    };
  }, []);

  return <div className="mt-20 priview-slider-wrap" id="testimonial-widget-container"></div>;
};

export default TestimonialWidget;
