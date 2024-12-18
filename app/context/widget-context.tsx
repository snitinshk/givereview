"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useChannels } from "./channels-context";

// Define the structure of a single channel
interface Channel {
  id: number;
  logo: string;
  name: string;
  isActive: boolean;
  reviewThreshold: string;
}

interface Widget {
  name: string;
  streamName: string;
  channels: Channel[];
}

// Define the structure of the widget context
interface WidgetContextProps {
  widget: Widget | null;
  setWidget: Dispatch<SetStateAction<Widget | null>>;
}

// Create the WidgetContext with a default undefined value
const WidgetContext = createContext<WidgetContextProps | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
  const [widget, setWidget] = useState<Widget | null>(null);

  const { widgetChannels } = useChannels();

  // Correct the logic for determining isActive
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const channels: Channel[] =
    widgetChannels?.map((channel) => {
      return {
        ...channel,
        isActive: ["Google", "TripAdvisor", "TheFork"].includes(channel.name),
        reviewThreshold: "3",
      };
    }) || [];

  // Update the widget state when channels change
  useEffect(() => {
    if (!widget && channels?.length) {
      setWidget({
        name: "",
        streamName: "",
        channels: [ ...channels],
      });
    }
  }, [channels, widget]);

  return (
    <WidgetContext.Provider value={{ widget, setWidget }}>
      {children}
    </WidgetContext.Provider>
  );
};

// Custom hook for consuming the WidgetContext
export const useWidget = (): WidgetContextProps => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
