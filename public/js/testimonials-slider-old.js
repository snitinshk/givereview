(function () {
  const scriptTag = document.querySelector(
    'script[src="testimonials-slider.js"]'
  );

  const widgetId = scriptTag.getAttribute("widget-id");
  const clientId = scriptTag.getAttribute("client-id");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  // Async function to fetch and render the widget
  const fetchAndRenderWidget = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/widget?widgetId=${widgetId}`,
        requestOptions
      );
      const widget = await response.json();

      const fetchConditions = widget?.widget_channels
        ?.filter((channel) => channel?.is_active)
        ?.map((channel) => ({
          channelId: channel.channel_id,
          ratingThreshold: channel.rating_threshold,
          totalReviewsToDisplay: widget?.total_reviews_to_display,
        }));

      let widgetsQueryStr;

      if (fetchConditions?.length && clientId) {
        const params = {};
        params["conditions"] = JSON.stringify(fetchConditions);
        params["clientId"] = clientId;
        widgetsQueryStr = new URLSearchParams(params).toString();
      }

      const externalReviewResponse = await fetch(
        `http://localhost:3000/api/web/external-reviews?${widgetsQueryStr}`,
        requestOptions
      );
      const externalReviews = await externalReviewResponse.json();

      // Inject Swiper CSS dynamically
      const swiperStyle = document.createElement("link");
      swiperStyle.rel = "stylesheet";
      swiperStyle.href = "https://unpkg.com/swiper/swiper-bundle.min.css";
      document.head.appendChild(swiperStyle);

      // Inject Swiper JS dynamically
      const swiperScript = document.createElement("script");
      swiperScript.src = "https://unpkg.com/swiper/swiper-bundle.min.js";
      document.body.appendChild(swiperScript);

      swiperScript.onload = () => {
        // Create the main container dynamically
        const widgetContainer = document.createElement("div");
        widgetContainer.id = "testimonial-widget";
        widgetContainer.style.fontFamily = "Arial, sans-serif";
        widgetContainer.style.textAlign = "center";
        widgetContainer.style.maxWidth = "900px";
        widgetContainer.style.margin = "auto";

        // Title
        if (widget.show_title) {
          const title = document.createElement("h2");
          title.innerText = widget.widget_title || "What our guests say";
          widgetContainer.appendChild(title);
        }

        // Tabs
        if (widget.show_tabs) {
          const tabs = document.createElement("div");
          tabs.className = "tabs";
          tabs.style.display = "flex";
          tabs.style.justifyContent = "center";
          tabs.style.marginBottom = "20px";

          // All Tab
          const allTab = document.createElement("button");
          allTab.className = "tab active";
          allTab.setAttribute("widget-platform", "all");
          allTab.innerText = "All";
          allTab.style.cursor = "pointer";
          allTab.style.padding = "10px 20px";
          allTab.style.fontSize = "14px";
          allTab.style.border = "none";
          allTab.style.background = "none";
          allTab.addEventListener("click", () => {
            document.querySelector(".tab.active")?.classList.remove("active");
            allTab.classList.add("active");

            document.querySelectorAll(".swiper-slide").forEach((slide) => {
              slide.style.display = "flex";
            });
          });
          tabs.appendChild(allTab);

          // Channel Tabs
          const uniqueChannels = Array.from(
            new Set(externalReviews.map((review) => review.channels.channel_name))
          );

          uniqueChannels.forEach((channelName) => {
            const channelTab = document.createElement("button");
            channelTab.className = "tab";
            channelTab.setAttribute("widget-platform", channelName);
            channelTab.style.cursor = "pointer";
            channelTab.style.padding = "10px 20px";
            channelTab.style.fontSize = "14px";
            channelTab.style.border = "none";
            channelTab.style.background = "none";
            channelTab.style.display = "flex";
            channelTab.style.alignItems = "center";

            // Channel Icon
            const channelIcon = document.createElement("img");
            const channel = externalReviews.find(
              (review) => review.channels.channel_name === channelName
            );
            channelIcon.src = channel?.channels.channel_logo_url;
            channelIcon.alt = channelName;
            channelIcon.style.width = "24px";
            channelIcon.style.marginRight = "8px";

            channelTab.appendChild(channelIcon);
            channelTab.appendChild(document.createTextNode(channelName));

            channelTab.addEventListener("click", () => {
              document.querySelector(".tab.active")?.classList.remove("active");
              channelTab.classList.add("active");

              document.querySelectorAll(".swiper-slide").forEach((slide) => {
                const slidePlatform = slide.getAttribute("widget-platform");
                if (slidePlatform === channelName) {
                  slide.style.display = "flex";
                } else {
                  slide.style.display = "none";
                }
              });
            });

            tabs.appendChild(channelTab);
          });

          widgetContainer.appendChild(tabs);
        }

        // Swiper container
        const swiperContainer = document.createElement("div");
        swiperContainer.className = "swiper-container";
        swiperContainer.style.position = "relative";

        const swiperWrapper = document.createElement("div");
        swiperWrapper.className = "swiper-wrapper";
        swiperWrapper.style.display = "flex";

        // Create slides dynamically from externalReviews
        externalReviews.forEach((review) => {
          const slide = document.createElement("div");
          slide.className = "swiper-slide";
          slide.setAttribute("widget-platform", review.channels.channel_name);
          slide.style.display = "flex";
          slide.style.justifyContent = "center";
          slide.style.maxWidth = "300px";

          const reviewCard = document.createElement("div");
          reviewCard.className = "review-card";
          reviewCard.style.background = "#fff";
          reviewCard.style.borderRadius = "8px";
          reviewCard.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
          reviewCard.style.padding = "20px";
          reviewCard.style.textAlign = "left";

          const reviewHeader = document.createElement("div");
          reviewHeader.className = "review-header";
          reviewHeader.style.display = "flex";
          reviewHeader.style.alignItems = "center";
          reviewHeader.style.marginBottom = "15px";

          const avatar = document.createElement("img");
          avatar.src = review.reviewers_avtar;
          avatar.alt = review.reviewers_name;
          avatar.className = "avatar";
          avatar.style.width = "50px";
          avatar.style.height = "50px";
          avatar.style.borderRadius = "50%";
          avatar.style.marginRight = "10px";
          reviewHeader.appendChild(avatar);

          const userInfo = document.createElement("div");
          const userName = document.createElement("h3");
          userName.innerText = review.reviewers_name;
          userName.style.margin = "0";
          const userDate = document.createElement("p");
          userDate.innerText = review.review_date;
          userDate.style.margin = "0";
          userDate.style.color = "gray";
          userInfo.appendChild(userName);
          userInfo.appendChild(userDate);
          reviewHeader.appendChild(userInfo);

          const platformIcon = document.createElement("img");
          platformIcon.src = review.channels.channel_logo_url;
          platformIcon.alt = review.channels.channel_name;
          platformIcon.className = "platform-icon";
          platformIcon.style.marginLeft = "auto";
          platformIcon.style.width = "24px";
          reviewHeader.appendChild(platformIcon);

          reviewCard.appendChild(reviewHeader);

          const reviewRating = document.createElement("div");
          reviewRating.className = "review-rating";
          reviewRating.style.color = "#f5c518";
          reviewRating.style.fontSize = "20px";
          reviewRating.style.marginBottom = "10px";
          reviewRating.innerText = "⭐".repeat(review.review_count);
          reviewCard.appendChild(reviewRating);

          const reviewText = document.createElement("p");
          reviewText.className = "review-text";
          reviewText.style.color = "gray";
          reviewText.innerText = review.review_description;
          reviewCard.appendChild(reviewText);

          slide.appendChild(reviewCard);
          swiperWrapper.appendChild(slide);
        });

        swiperContainer.appendChild(swiperWrapper);

        // Add navigation buttons
        const prevButton = document.createElement("div");
        prevButton.className = "swiper-button-prev";
        swiperContainer.appendChild(prevButton);

        const nextButton = document.createElement("div");
        nextButton.className = "swiper-button-next";
        swiperContainer.appendChild(nextButton);

        widgetContainer.appendChild(swiperContainer);

        // Footer
        if (widget.show_powered_by) {
          const footer = document.createElement("footer");
          footer.style.marginTop = "20px";
          footer.style.fontSize = "12px";
          footer.style.color = "#888";
          footer.innerHTML =
            widget.powered_by_text || "Powered with ❤️ by Place Booster";
          widgetContainer.appendChild(footer);
        }

        // Append widget to body
        document.body.appendChild(widgetContainer);

        // Initialize Swiper
        const swiper = new Swiper(".swiper-container", {
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          loop: true,
          slidesPerView: 3,
          spaceBetween: 20,
          breakpoints: {
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
          },
        });
      };
    } catch (error) {
      console.error("Error fetching widget:", error);
    }
  };

  // Call the async function
  fetchAndRenderWidget();
})();