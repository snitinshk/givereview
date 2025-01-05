(function () {
  let widget, externalReviews;
  const baseUrl = "https://app.givereview.to",
    scriptTag = document.querySelector(
      'script[data-widget="testimonials-slider"]'
    ),
    uuid = scriptTag.getAttribute("uuid"),
    requestOptions = { method: "GET", redirect: "follow" };

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  const fetchAndRenderWidget = async () => {
    try {
      let e = await fetch(`${baseUrl}/api/widget?uuid=${uuid}`, requestOptions);
      injectStylesAndScripts();
      let t = await e.json();
      if (
        ((widget = t?.widget),
        (externalReviews = t?.externalReviews),
        !widget?.is_active)
      ) {
        displayMessage("The widget is inactive.");
        return;
      }
      if (!externalReviews || 0 === externalReviews.length) {
        displayMessage("No data found.");
        return;
      }
      document.querySelector(
        "script[src='https://unpkg.com/swiper/swiper-bundle.min.js']"
      ).onload = () => {
        let e = document.getElementById("testimonial-widget-container");
        (e.innerHTML = generateWidgetHTML(widget, externalReviews)),
          initializeTabs(externalReviews),
          initializeSwiper("all", externalReviews);
      };
    } catch (i) {
      console.error("Error fetching widget:", i);
    }
  };

  const getFilteredResults = (reviewsArr) => {
    return reviewsArr.slice(0, widget?.total_reviews_to_display || 9);
  };

  function truncateString(str, maxLength = 140) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  const injectStylesAndScripts = () => {
    let e = document.createElement("link");
    (e.rel = "stylesheet"),
      (e.href = "https://unpkg.com/swiper/swiper-bundle.min.css"),
      document.head.appendChild(e);
    let t = document.createElement("link");
    (t.rel = "stylesheet"),
      (t.href = `${baseUrl}/widget.css`),
      document.head.appendChild(t);
    let s = document.createElement("script");
    (s.src = "https://unpkg.com/swiper/swiper-bundle.min.js"),
      document.body.appendChild(s);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  const displayMessage = (e) => {
    let i = document.getElementById("testimonial-widget-container");
    i && (i.innerHTML = `<div class="widget-message">${e}</div>`);
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
      .map((review) => {
        // Format the review date
        const formattedDate = new Intl.DateTimeFormat("sv-SE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(review.review_date));
  
        return `
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
                      ? `<p class="review-date">${formattedDate}</p>`
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
                  ? `<div class="review-rating">${'<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>'.repeat(
                      review.review_count
                    )}</div>`
                  : ""
              }
              <p class="review-text">${truncateString(review.review_description)}</p>
            </div>
          </div>
        `;
      })
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
        ? getFilteredResults(reviews)
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
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1346 22.1669C15.7816 22.1681 15.447 22.0093 15.2246 21.7352L9.58962 14.7352C9.23575 14.3047 9.23575 13.684 9.58962 13.2535L15.423 6.25352C15.8353 5.75738 16.5718 5.68948 17.068 6.10185C17.5641 6.51422 17.632 7.25072 17.2196 7.74685L12.0046 14.0002L17.0446 20.2535C17.3359 20.6032 17.3973 21.0904 17.2018 21.5014C17.0063 21.9124 16.5897 22.1722 16.1346 22.1669Z" fill="#919EAB"/>
          </svg>
        </div>
        <div class="swiper-button-next">
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8654 22.1669C12.2184 22.1681 12.553 22.0093 12.7754 21.7352L18.4104 14.7352C18.7642 14.3047 18.7642 13.684 18.4104 13.2535L12.577 6.25352C12.1647 5.75738 11.4282 5.68948 10.932 6.10185C10.4359 6.51422 10.368 7.25072 10.7804 7.74685L15.9954 14.0002L10.9554 20.2535C10.6641 20.6032 10.6027 21.0904 10.7982 21.5014C10.9937 21.9124 11.4103 22.1722 11.8654 22.1669Z" fill="#919EAB"/>
          </svg>
        </div>
      </div>
    `;

    activeSwiper = new Swiper(`#swiper-container-${sanitizedPlatform}`, {
      loop: false,
      speed: 900,
      autoplay: {
        delay: 5000,
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
