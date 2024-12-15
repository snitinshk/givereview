"use client";

import { ReactNode } from "react";
import { ClientProvider } from "./clients-context";
import { SelectedClientProvider } from "./selected-client-context";
import { ReviewLinkProvider } from "./review-link-context";
import { ReviewLinkSettingsProvider } from "./review-link-settings.context";
import { ReviewLinkPositiveProvider } from "./review-link-positive.context";
import { ReviewLinkNegativeProvider } from "./review-link-negative.context";
import { ReviewLinkThankyouProvider } from "./review-link-thankyou.context";
import { SelectedReviewProvider } from "./selected-negative-review-context";
import { LoaderProvider } from "./loader.context";
import { ChannelsProvider } from "./channels-context";

export const ContextProvider = ({ children }: { children: ReactNode }) => (
  <LoaderProvider>
    <ChannelsProvider>
      <ClientProvider>
        <SelectedClientProvider>
          <SelectedReviewProvider>
            <ReviewLinkProvider>
              <ReviewLinkPositiveProvider>
                <ReviewLinkSettingsProvider>
                  <ReviewLinkNegativeProvider>
                    <ReviewLinkThankyouProvider>
                      {children}
                    </ReviewLinkThankyouProvider>
                  </ReviewLinkNegativeProvider>
                </ReviewLinkSettingsProvider>
              </ReviewLinkPositiveProvider>
            </ReviewLinkProvider>
          </SelectedReviewProvider>
        </SelectedClientProvider>
      </ClientProvider>
    </ChannelsProvider>
  </LoaderProvider>
);
