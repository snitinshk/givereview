"use client";

import { ReactNode } from "react";
import { ClientProvider } from "./clients-context";
import { SelectedClientProvider } from "./selected-client-context";
import { ReviewLinkProvider } from "./review-link-context";

export const ContextProvider = ({ children }: { children: ReactNode }) => (
  <ClientProvider>
    <SelectedClientProvider>
      <ReviewLinkProvider>{children}</ReviewLinkProvider>
    </SelectedClientProvider>
  </ClientProvider>
);
