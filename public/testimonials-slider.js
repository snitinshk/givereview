(function () {

  let widget, externalReviews;
  // const baseUrl = `http://localhost:3000`;
  const baseUrl = `https://app.givereview.to`;
  const scriptTag = document.querySelector(
    'script[data-widget="testimonials-slider"]'
  );
  const uuid = scriptTag.getAttribute("uuid");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchAndRenderWidget = async () => {
    try {

      const responseJson = await fetch(
        `${baseUrl}/api/widget?uuid=${uuid}`,
        requestOptions
      );

      injectStylesAndScripts();
      
      const rawResponse = await responseJson.json();

      widget = rawResponse?.widget;
      externalReviews = rawResponse?.externalReviews;

      

      // Check if widget is inactive
      if (!widget?.is_active) {
        displayMessage("The widget is inactive.");
        return;
      }

      // Check if there are no external reviews
      if (!externalReviews || externalReviews.length === 0) {
        displayMessage("No data found.");
        return;
      }

      document.querySelector(
        "script[src='https://unpkg.com/swiper/swiper-bundle.min.js']"
      ).onload = () => {
        const container = document.getElementById(
          "testimonial-widget-container"
        );
        container.innerHTML = generateWidgetHTML(widget, externalReviews);

        initializeTabs(externalReviews);
        initializeSwiper("all", externalReviews); // Default to "all" platform
      };
    } catch (error) {
      console.error("Error fetching widget:", error);
    }
  };

  const getRandomResults = (reviewsArr) => {
    const shuffledArray = [...reviewsArr].sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, widget?.total_reviews_to_display || 9);
  }

  const injectStylesAndScripts = () => {
    const swiperStyle = document.createElement("link");
    swiperStyle.rel = "stylesheet";
    swiperStyle.href = `https://unpkg.com/swiper/swiper-bundle.min.css`;
    document.head.appendChild(swiperStyle);

    const customStyle = document.createElement("link");
    customStyle.rel = "stylesheet";
    customStyle.href = `${baseUrl}/widget.css`;
    document.head.appendChild(customStyle);

    const swiperScript = document.createElement("script");
    swiperScript.src = `https://unpkg.com/swiper/swiper-bundle.min.js`;
    document.body.appendChild(swiperScript);
  };

  const displayMessage = (message) => {
    const container = document.getElementById("testimonial-widget-container");
    if (container) {
      container.innerHTML = `<div class="widget-message">${message}</div>`;
    }
  };

  const generateWidgetHTML = (widget, externalReviews) => `
    <div id="testimonial-widget" class="plcboot-widget-mwapper">
      ${
        widget.show_title
          ? `<h2 class="plcboot-heading">${widget.widget_title}</h2>`
          : ""
      }
      ${widget.show_tabs ? generateTabs(externalReviews) : ""}
      <div class="tab-content-wrapper">
        <div class="swiper-container" id="swiper-container-all" widget-platform="all">
          <div class="swiper-wrapper">
            ${generateSlides(externalReviews)}
          </div>
        </div>
      </div>
      ${
        widget.show_powered_by
          ? '<footer class="plcboot-widget-copyright">Powered with ❤️ by Place Booster</footer>'
          : ""
      }
    </div>
  `;

  const generateTabs = (externalReviews) => {
    const uniqueChannels = Array.from(
      new Set(externalReviews.map((review) => review.channels.channel_name))
    );

    const channelTabsHTML = uniqueChannels
      .map((channelName) => {
        const sanitizedChannelName = channelName.replace(/\s+/g, "-");
        const channel = externalReviews.find(
          (review) => review.channels.channel_name === channelName
        );
        return `
          <button class="plcboot-widget-tab" widget-platform="${sanitizedChannelName}">
            <img src="${channel?.channels.channel_logo_url}" alt="${channelName}" class="plcboot-widget-tab-icon">
            ${channelName}
          </button>
        `;
      })
      .join("");

    return `
      <div class="plcboot-widget-tabs">
        <button class="plcboot-widget-tab active" widget-platform="all">
          All
        </button>
        ${channelTabsHTML}
      </div>
    `;
  };

  const generateSlides = (reviews) => {
    return reviews
      .map(
        (review) => `
      <div class="swiper-slide">
        <div class="review-card">
          <div class="review-header">
            ${
              widget?.show_customer_avatar
                ? `<img src="${review.reviewers_avtar}" alt="${review.reviewers_name}" class="avatar" />`
                : ""
            }
            <div class="reviewer-info">
              ${
                widget?.show_customer_name
                  ? `<h3 class="reviewer-name">${review.reviewers_name}</h3>`
                  : ""
              }
              ${
                widget?.show_review_date
                  ? `<p class="review-date">${review.review_date}</p>`
                  : ""
              }
            </div>
            ${
              widget?.show_channel_logo
                ? `<img src="${review.channels.channel_logo_url}" alt="${review.channels.channel_name}" class="platform-icon" />`
                : ""
            }
          </div>
          ${
            widget?.show_rating
              ? `<div class="review-rating">★${"★".repeat(
                  review.review_count - 1
                )}</div>`
              : ""
          }
          <p class="review-text">${review.review_description}</p>
        </div>
      </div>
    `
      )
      .join("");
  };

  const initializeTabs = (externalReviews) => {
    const tabs = document.querySelectorAll(".plcboot-widget-tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const platform = tab.getAttribute("widget-platform");

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        initializeSwiper(platform.replace(/-/g, " "), externalReviews);
      });
    });
  };

  const initializeSwiper = (platform, reviews) => {
    const sanitizedPlatform = platform.replace(/\s+/g, "-"); // Sanitize platform name
    const filteredReviews =
      platform === "all"
        ? getRandomResults(reviews)
        : reviews.filter((review) => review.channels.channel_name === platform);

    const swiperContainer = document.querySelector(".tab-content-wrapper");
    swiperContainer.innerHTML = `
      <div class="sliderM_container">
        <div class="swiper-container" id="swiper-container-${sanitizedPlatform}" widget-platform="${sanitizedPlatform}" css-mode="true">
          <div class="swiper-wrapper">
            ${generateSlides(filteredReviews)}
          </div>
        </div>
        <div class="swiper-button-prev">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </div>
        <div class="swiper-button-next">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </div>
      </div>
    `;

    activeSwiper = new Swiper(`#swiper-container-${sanitizedPlatform}`, {
      loop: false,
      speed: 900,
      autoplay: {
        delay: 2500,
      },
      navigation: {
        nextEl: `.swiper-button-next`,
        prevEl: `.swiper-button-prev`,
      },
      breakpoints: {
        1024: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        480: { slidesPerView: 1, spaceBetween: 15 },
      },
    });
  };

  fetchAndRenderWidget();
})();
