(function () {
  // Get the script tag and extract attributes
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
      // Fetch widget details
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

      // Fetch external reviews
      const externalReviewResponse = await fetch(
        `http://localhost:3000/api/web/external-reviews?${widgetsQueryStr}`,
        requestOptions
      );
      const externalReviews = await externalReviewResponse.json();

      // Inject Swiper and custom styles
      injectStylesAndScripts();

      // Wait for Swiper script to load and initialize the widget
      document.querySelector("script[src='https://unpkg.com/swiper/swiper-bundle.min.js']").onload = () => {
        const container = document.getElementById("testimonial-widget-container");
        container.innerHTML = generateWidgetHTML(widget, externalReviews);

        // Initialize tabs and Swiper
        initializeTabs();
        initializeSwiper();
      };
    } catch (error) {
      console.error("Error fetching widget:", error);
    }
  };

  // Inject Swiper and custom CSS
  const injectStylesAndScripts = () => {
    const swiperStyle = document.createElement("link");
    swiperStyle.rel = "stylesheet";
    swiperStyle.href = "https://unpkg.com/swiper/swiper-bundle.min.css";
    document.head.appendChild(swiperStyle);

    const customStyle = document.createElement("link");
    customStyle.rel = "stylesheet";
    customStyle.href = "http://localhost:3000/js/widget.css";
    document.head.appendChild(customStyle);

    const swiperScript = document.createElement("script");
    swiperScript.src = "https://unpkg.com/swiper/swiper-bundle.min.js";
    document.body.appendChild(swiperScript);
  };

  // Generate widget HTML
  const generateWidgetHTML = (widget, externalReviews) => `
    <div id="testimonial-widget" class="plcboot-widget-mwapper">
      ${widget.show_title ? `<h2 class="plcboot-heading">${widget.widget_title || 'What our guests say'}</h2>` : ''}
      ${widget.show_tabs ? generateTabs(externalReviews) : ''}
      <div class="sliderm-wrapper">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              ${generateSlides(externalReviews)}
            </div>
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
       </div>
      ${widget.show_powered_by ? '<footer class="plcboot-widget-copyright">Powered with ❤️ by Place Booster</footer>' : ''}
    </div>
  `;

  // Generate tabs
  const generateTabs = (externalReviews) => {
    const uniqueChannels = Array.from(
      new Set(externalReviews.map((review) => review.channels.channel_name))
    );

    const channelTabsHTML = uniqueChannels.map((channelName) => {
      const channel = externalReviews.find(
        (review) => review.channels.channel_name === channelName
      );
      return `
        <button class="plcboot-widget-tab" widget-platform="${channelName}">
          <img src="${channel?.channels.channel_logo_url}" alt="${channelName}" class="plcboot-widget-tab-icon">
          ${channelName}
        </button>
      `;
    }).join('');

    return `
      <div class="plcboot-widget-tabs">
        <button class="plcboot-widget-tab active" widget-platform="all">
          All
        </button>
        ${channelTabsHTML}
      </div>
    `;
  };

  // Generate slides
  const generateSlides = (externalReviews) => {
    return externalReviews.map((review) => {
      return `
       <div class="swiper-slide" widget-platform="${review.channels.channel_name}">
          <div class="review-card">
            <div class="review-header">
              <img 
                src="${review.reviewers_avtar}" 
                alt="${review.reviewers_name}" 
                class="avatar" 
              />
              <div class="reviewer-info">
                <h3 class="reviewer-name">${review.reviewers_name}</h3>
                <p class="review-date">${review.review_date}</p>
              </div>
              <img 
                src="${review.channels.channel_logo_url}" 
                alt="${review.channels.channel_name}" 
                class="platform-icon" 
              />
            </div>
            <div class="review-rating">
              ★${'★'.repeat(review.review_count)}
            </div>
            <p class="review-text">${review.review_description}</p>
          </div>
        </div>
      `;
    }).join('');
  };

  // Initialize tabs functionality
  const initializeTabs = () => {
    const tabs = document.querySelectorAll(".plcboot-widget-tab");
    const slides = document.querySelectorAll(".swiper-slide");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const platform = tab.getAttribute("widget-platform");
        slides.forEach((slide) => {
          slide.style.display =
            platform === "all" || slide.getAttribute("widget-platform") === platform
              ? "flex"
              : "none";
        });
      });
    });
  };

  // Initialize Swiper
  const initializeSwiper = () => {
    new Swiper(".swiper-container", {
      loop: true, // Enable loop
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: 2,
      spaceBetween: 20,
      breakpoints: {
        1024: { slidesPerView: 2, spaceBetween: 30 },
        768: { slidesPerView: 1, spaceBetween: 20 },
        480: { slidesPerView: 1, spaceBetween: 15 },
      },
      // Ensure looped slides are duplicated properly
      on: {
        beforeInit(swiper) {
          const slides = swiper.el.querySelectorAll(".swiper-slide");
          if (slides.length < swiper.params.slidesPerView) {
            swiper.params.loop = false; // Disable loop if not enough slides
          }
        },
      },
    });
  };

  // Fetch and render the widget
  fetchAndRenderWidget();
})();
