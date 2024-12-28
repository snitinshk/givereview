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
        // Create the main container using HTML strings
        const widgetContainerHTML = `
          <div id="testimonial-widget" style="font-family: Arial, sans-serif; text-align: center; max-width: 900px; margin: auto;">
            ${widget.show_title ? `<h2>${widget.widget_title || 'What our guests say'}</h2>` : ''}
            ${widget.show_tabs ? generateTabs(externalReviews) : ''}
            <div class="swiper-container" style="position: relative;">
              <div class="swiper-wrapper" style="display: flex;">
                ${generateSlides(externalReviews)}
              </div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
            ${widget.show_powered_by ? '<footer style="margin-top: 20px; font-size: 12px; color: #888;">Powered with ❤️ by Place Booster</footer>' : ''}
          </div>
        `;

        // Append the widget to the specified container
        const container = document.getElementById("testimonial-widget-container");
        container.innerHTML = widgetContainerHTML;

        // Initialize Swiper
        const swiper = new Swiper(".swiper-container", {
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          loop: true,
          slidesPerView: 2,
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

  // Function to generate Tabs HTML string
  const generateTabs = (externalReviews) => {
    const uniqueChannels = Array.from(
      new Set(externalReviews.map((review) => review.channels.channel_name))
    );

    const channelTabsHTML = uniqueChannels.map((channelName) => {
      const channel = externalReviews.find(
        (review) => review.channels.channel_name === channelName
      );
      return `
        <button class="tab" widget-platform="${channelName}" style="cursor: pointer; padding: 10px 20px; font-size: 14px; border: none; background: none; display: flex; align-items: center;">
          <img src="${channel?.channels.channel_logo_url}" alt="${channelName}" style="width: 24px; margin-right: 8px;">
          ${channelName}
        </button>
      `;
    }).join('');

    return `
      <div class="tabs" style="display: flex; justify-content: center; margin-bottom: 20px;">
        <button class="tab active" widget-platform="all" style="cursor: pointer; padding: 10px 20px; font-size: 14px; border: none; background: none;">
          All
        </button>
        ${channelTabsHTML}
      </div>
    `;
  };

  // Function to generate Slides HTML string
  const generateSlides = (externalReviews) => {
    return externalReviews.map((review) => {
      return `
        <div class="swiper-slide" widget-platform="${review.channels.channel_name}" style="display: flex; justify-content: center; max-width: 300px;">
          <div class="review-card" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); padding: 20px; text-align: left;">
            <div class="review-header" style="display: flex; align-items: center; margin-bottom: 15px;">
              <img src="${review.reviewers_avtar}" alt="${review.reviewers_name}" class="avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
              <div>
                <h3 style="margin: 0;">${review.reviewers_name}</h3>
                <p style="margin: 0; color: gray;">${review.review_date}</p>
              </div>
              <img src="${review.channels.channel_logo_url}" alt="${review.channels.channel_name}" class="platform-icon" style="margin-left: auto; width: 24px;">
            </div>
            <div class="review-rating" style="color: #f5c518; font-size: 20px; margin-bottom: 10px;">
              ⭐${'⭐'.repeat(review.review_count)}
            </div>
            <p class="review-text" style="color: gray;">${review.review_description}</p>
          </div>
        </div>
      `;
    }).join('');
  };

  // Call the async function
  fetchAndRenderWidget();
})();
