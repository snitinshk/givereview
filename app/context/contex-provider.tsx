"use client";

import { ReactNode } from "react";
import { ClientProvider } from "./clients-context";
import { SelectedClientProvider } from "./selected-client-context";
import { ReviewLinkProvider } from "./review-link-context";
import { ReviewLinkSettingsProvider } from "./review-link-settings.context";
import { ReviewLinkPositiveProvider } from "./review-link-positive.context";
import { ReviewLinkNegativeProvider } from "./review-link-negative.context";

export const ContextProvider = ({ children }: { children: ReactNode }) => (
  <ClientProvider>
    <SelectedClientProvider>
      <ReviewLinkProvider>
        <ReviewLinkPositiveProvider>
          <ReviewLinkSettingsProvider>
            <ReviewLinkNegativeProvider>{children}</ReviewLinkNegativeProvider>
          </ReviewLinkSettingsProvider>
        </ReviewLinkPositiveProvider>
      </ReviewLinkProvider>
    </SelectedClientProvider>
  </ClientProvider>
);