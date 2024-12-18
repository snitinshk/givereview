"use client";

import { API_ROUTES } from "@/constant";
import { Channel } from "@/interfaces/channels";
import { fetcher } from "@/lib/utils";
import { mapChannels } from "@/mappers/index-mapper";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
interface ChannelsContextProps {
  channels: Channel[];
  setChannels: Dispatch<SetStateAction<Channel[]>>;
  widgetChannels: Channel[];
  setWidgetChannels: Dispatch<SetStateAction<Channel[]>>;
}

// Create the context
const ChannelsContext = createContext<ChannelsContextProps | undefined>(
  undefined
);

export const ChannelsProvider = ({ children }: { children: ReactNode }) => {
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [widgetChannels, setWidgetChannels] = useState<Channel[]>([]);
  
  // Function to fetch and process channels
  const fetchAndProcessChannels = async () => {
    try {
      const channelsList = await fetcher(API_ROUTES.channels);
      const mappedChannels = mapChannels(channelsList);
  
      setChannels(mappedChannels);
  
      const filteredWidgetChannels = mappedChannels
        .filter((channel) => channel?.channelType === "WIDGET")
        .sort((a, b) => (a.orderPriority || 0) - (b.orderPriority || 0));
  
      setWidgetChannels(filteredWidgetChannels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };
  
  useEffect(() => {
    fetchAndProcessChannels();
  }, []);
  

  return (
    <ChannelsContext.Provider
      value={{ channels, setChannels, widgetChannels, setWidgetChannels }}
    >
      {children}
    </ChannelsContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useChannels = (): ChannelsContextProps => {
  const context = useContext(ChannelsContext);
  if (!context) {
    throw new Error("useChannels must be used within an ChannelsProvider");
  }
  return context;
};
