(function () {
  const baseUrl = `https://app.givereview.to`;

  const scriptTag = document.querySelector('script[data-widget="testimonials-slider"]');
  const widgetId = scriptTag.getAttribute("widget-id");
  const clientId = scriptTag.getAttribute("client-id");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchAndRenderWidget = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/widget?widgetId=${widgetId}`,
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
        `${baseUrl}/api/web/external-reviews?${widgetsQueryStr}`,
        requestOptions
      );
      const externalReviews = await externalReviewResponse.json();

      injectStylesAndScripts();

      document.querySelector("script[src='https://unpkg.com/swiper/swiper-bundle.min.js']").onload = () => {
        const container = document.getElementById("testimonial-widget-container");
        container.innerHTML = generateWidgetHTML(widget, externalReviews);

        initializeTabs(externalReviews);
        initializeSwiper("all", externalReviews); // Default to "all" platform
      };
    } catch (error) {
      console.error("Error fetching widget:", error);
    }
  };

  const injectStylesAndScripts = () => {
    const swiperStyle = document.createElement("link");
    swiperStyle.rel = "stylesheet";
    swiperStyle.href = `https://unpkg.com/swiper/swiper-bundle.min.css`;
    document.head.appendChild(swiperStyle);

    const customStyle = document.createElement("link");
    customStyle.rel = "stylesheet";
    customStyle.href = `${baseUrl}/js/widget.css`;
    document.head.appendChild(customStyle);

    const swiperScript = document.createElement("script");
    swiperScript.src = `https://unpkg.com/swiper/swiper-bundle.min.js`;
    document.body.appendChild(swiperScript);
  };

  const generateWidgetHTML = (widget, externalReviews) => `
    <div id="testimonial-widget" class="plcboot-widget-mwapper">
      ${widget.show_title ? `<h2 class="plcboot-heading">${widget.widget_title || 'What our guests say'}</h2>` : ''}
      ${widget.show_tabs ? generateTabs(externalReviews) : ''}
      <div class="tab-content-wrapper">
        <div class="swiper-container" id="swiper-container-all" widget-platform="all">
          <div class="swiper-wrapper">
            ${generateSlides(externalReviews)}
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
      ${widget.show_powered_by ? '<footer class="plcboot-widget-copyright">Powered with ❤️ by Place Booster</footer>' : ''}
    </div>
  `;

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

  const generateSlides = (reviews) => {
    return reviews.map((review) => `
      <div class="swiper-slide">
        <div class="review-card">
          <div class="review-header">
            <img src="${review.reviewers_avtar}" alt="${review.reviewers_name}" class="avatar" />
            <div class="reviewer-info">
              <h3 class="reviewer-name">${review.reviewers_name}</h3>
              <p class="review-date">${review.review_date}</p>
            </div>
            <img src="${review.channels.channel_logo_url}" alt="${review.channels.channel_name}" class="platform-icon" />
          </div>
          <div class="review-rating">★${'★'.repeat(review.review_count-1)}</div>
          <p class="review-text">${review.review_description}</p>
        </div>
      </div>
    `).join('');
  };

  let activeSwiper = null;

  const initializeTabs = (externalReviews) => {
    const tabs = document.querySelectorAll(".plcboot-widget-tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const platform = tab.getAttribute("widget-platform");

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        initializeSwiper(platform, externalReviews);
      });
    });
  };

  const initializeSwiper = (platform, reviews) => {

    const filteredReviews =
      platform === "all"
        ? reviews
        : reviews.filter((review) => review.channels.channel_name === platform);

    const swiperContainer = document.querySelector(".tab-content-wrapper");
    swiperContainer.innerHTML = `
      <div class="swiper-container" id="swiper-container-${platform}" widget-platform="${platform}">
        <div class="swiper-wrapper">
          ${generateSlides(filteredReviews)}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;

    activeSwiper = new Swiper(`#swiper-container-${platform}`, {
      loop: true,
      speed: 900,

      autoplay: {
        delay: 2500,
      },
      navigation: {
        nextEl: `.swiper-button-next`,
        prevEl: `.swiper-button-prev`,
      },
      slidesPerView: 3,
      spaceBetween: 20,
      breakpoints: {
        1024: { slidesPerView: 2, spaceBetween: 30 },
        768: { slidesPerView: 1, spaceBetween: 20 },
        480: { slidesPerView: 1, spaceBetween: 15 },
      },
    });
  };

  fetchAndRenderWidget();
})();
