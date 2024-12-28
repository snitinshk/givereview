"use server";

import { createClient } from "@/lib/supabase/supabase-server";

export const createWidget = async (widget: any) => {
  const supabase = await createClient();

  const response = await supabase
    .from("widgets")
    .upsert(
      [
        widget, // Insert data
      ],
      {
        onConflict: "client_id", // Unique columns
        ignoreDuplicates: true, // Ignore if the record already exists
      }
    )
    .select("id");

  return JSON.stringify(response);
};

export const insertWidgetChannels = async (channelData: any) => {
  const supabase = await createClient();

  const response = await supabase.from("widget_channels").insert(channelData);

  return JSON.stringify(response);
};

export const updateWidgetChannels = async (
  updatedInfo: any,
) => {
  const supabase = await createClient();

  const response = await supabase.from("widget_channels").upsert(
    updatedInfo,
    {
      onConflict: `widget_id, channel_id`,
    }
  );

  return JSON.stringify(response);
};
