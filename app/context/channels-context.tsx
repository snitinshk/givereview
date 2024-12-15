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
}

// Create the context
const ChannelsContext = createContext<ChannelsContextProps | undefined>(
  undefined
);

export const ChannelsProvider = ({ children }: { children: ReactNode }) => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    (async () => {
      const channelsList = await fetcher(API_ROUTES.channels);
      setChannels(mapChannels(channelsList));
    })();
  }, []);

  return (
    <ChannelsContext.Provider value={{ channels, setChannels }}>
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