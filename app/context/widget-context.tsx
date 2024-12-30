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
import { Widget, WidgetSettings } from "@/interfaces/widget";
import { fetcher } from "@/lib/utils";
import { useClients } from "./clients-context";
import { mapDbSettingsToWidgetSettings } from "@/mappers/widgets-mapper";
import { defaultSettings } from "@/constant";

interface WidgetContextProps {
  widget: Widget | null;
  setWidget: Dispatch<SetStateAction<Widget | null>>;
}

const WidgetContext = createContext<WidgetContextProps | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [existingWidget, setExistingWidget] = useState<any>(null);
  const { selectedClient } = useClients();
  const { widgetChannels } = useChannels();

  useEffect(() => {
    if (selectedClient?.id) {
      fetchWidget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  useEffect(() => {
    if (widgetChannels?.length) {
      const updatedChannels = widgetChannels.map((channel) => {
        const dbChannel = existingWidget?.widget_channels?.find(
          (dbCh: any) => dbCh.channel_id === channel.id
        );

        return {
          ...channel,
          isActive: dbChannel?.is_active || false,
          disabled: !dbChannel?.is_active, // Disable if not active in DB
          ratingThreshold: dbChannel?.rating_threshold.toString() || "3", // Default threshold if not found in DB
        };
      });

      const updatedWidget: Widget = {
        id: existingWidget?.id ?? null,
        uuid: existingWidget?.widget_uuid ?? null,
        settings: {
          ...defaultSettings,
          ...(existingWidget
            ? mapDbSettingsToWidgetSettings(existingWidget)
            : {}),
        },
        channels: updatedChannels,
      };

      setWidget(updatedWidget);
    }
  }, [widgetChannels, existingWidget]);

  const fetchWidget = async () => {
    try {
      const data = await fetcher(
        `/api/web/widget?client=${selectedClient?.id}`
      );
      setExistingWidget(data);
    } catch (error) {
      console.error("Error fetching widget:", error);
    }
  };
  return (
    <WidgetContext.Provider value={{ widget, setWidget }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = (): WidgetContextProps => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
