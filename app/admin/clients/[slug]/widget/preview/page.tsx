'use client';

import { useLoader } from "@/app/context/loader.context";
import { useWidget } from "@/app/context/widget-context";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const TestimonialWidget = () => {
  const { widget } = useWidget();
  const { setIsLoading } = useLoader();

  useEffect(() => {
    if (!widget?.uuid) {
      setIsLoading(true)
      return;
    }else{
      setIsLoading(false)
    }

    // Create the script element
    const script = document.createElement("script");
    script.src = `${process.env.NEXT_PUBLIC_ADMIN_URL}/testimonials-slider.js`;
    script.dataset.widget = "testimonials-slider";
    script.setAttribute("uuid", widget.uuid);
    script.async = true;

    // Append the script to the container div
    const container = document.getElementById("testimonial-widget-container");
    if (container) {
      container.appendChild(script);
    } else {
      console.error("Testimonial widget container not found");
    }

    // Cleanup script on component unmount
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [widget]);

  return <div id="testimonial-widget-container"></div>;
};

export default TestimonialWidget;
