"use client";

import { ReactNode } from "react";
import { ClientProvider } from "./selected-client-context";
import { ClientCountProvider } from "./client-count-context";

export const ContextProvider = ({ children }: { children: ReactNode }) => (
  <ClientProvider>
    <ClientCountProvider>{children}</ClientCountProvider>
  </ClientProvider>
);