"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiSettings } from "react-icons/ci";
import ChannelsTabs from "./channels-tab";
import SettingstTabs from "./settings-tab";
import EmbedTabs from "./embed-tab";
import { Code } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWidget } from "@/app/context/widget-context";
import { createWidget, insertWidgetChannels } from "./action";
import { mapWidgetForDb } from "@/mappers/widgets-mapper";
import { WidgetChannel, WidgetSettings } from "@/interfaces/widget";
import { useClients } from "@/app/context/clients-context";
import { useToast } from "@/hooks/use-toast";
import { updateIndividualAttributes } from "@/app/admin/action";
import Link from "next/link";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

const WidgetCreate: React.FC = () => {
  const { widget, setWidget } = useWidget();

  const { selectedClient } = useClients();

  const { slug } = useParams();

  const { toast } = useToast();

  const handleWidgetToggle = (checked: boolean) => {
    const selectedChannels = widget?.channels?.filter(
      (widget: WidgetChannel) => widget.isActive
    );

    if (!selectedChannels?.length) {
      toast({
        title: "Select atleast one channel",
      });
      return;
    }

    setWidget((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        isActive: checked,
      },
    }));

    if (widget && widget?.id) {
      updateWidgetChannels("is_active", checked);
    }
  };

  useEffect(() => {
    if (widget && widget?.settings?.isActive && !widget?.id) {
      saveWidgetDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget?.settings?.isActive]);

  const updateWidgetChannels = async (
    dbAttribute: string,
    updatedValue: boolean
  ) => {
    try {
      const response = await updateIndividualAttributes(
        "widgets",
        {
          [dbAttribute]: updatedValue,
        },
        {
          col: "id",
          val: widget?.id,
        }
      );
      const { error } = JSON.parse(response);
      if (!error) {
        toast({ title: "Widget settings updated" });
      } else {
        toast({ title: "Failed to update Widget settings" });
      }
    } catch (error) {
      toast({ title: "Failed to update Widget settings" });
    }
  };

  const saveWidgetChannels = async (widgetId: number) => {
    const widgetChannels = widget?.channels
      ?.filter((channel: WidgetChannel) => channel.isActive)
      ?.map((channel) => ({
        widget_id: widgetId,
        channel_id: channel.id,
        rating_threshold: channel.ratingThreshold,
        is_active: true,
      }));

    const response = await insertWidgetChannels(widgetChannels);
    const { error } = JSON.parse(response);

    if (error) {
      toast({ title: "Error in saving channels for widget" });
      return false;
    }

    return true;
  };

  const saveWidgetDetails = async () => {

    const widgetDb = mapWidgetForDb(widget?.settings as WidgetSettings);
    const widgetDataWithClientId = {
      client_id: selectedClient?.id,
      widget_uuid: uuidv4(),
      ...widgetDb,
    };

    const response = await createWidget(widgetDataWithClientId);
    const {
      data: [newWidget],
      error,
    } = JSON.parse(response);

    if (error || !newWidget?.id) {
      toast({ title: "Error in saving widget info" });
      return;
    }

    setWidget((prev: any) => ({ ...prev, id: newWidget.id }));

    const channelsSaved = await saveWidgetChannels(newWidget.id);
    if (channelsSaved) {
      toast({ title: "Widget info saved" });
    }
    
  };

  return (
    <>
      <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5 max-sm:mt-0">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            onCheckedChange={(checked) => handleWidgetToggle(checked)}
            checked={widget?.settings?.isActive}
          />
          <Label htmlFor="isActive" className="font-normal">
            {widget?.settings?.isActive ? "Active" : "Inactive"}
          </Label>
        </div>
        <Link
          target="_blank"
          href={`/admin/clients/${slug}/widget/preview`}
          className="bg-[#919EAB14] text-[#000000] hover:text-white font-bold px-6 py-2 rounded-lg inline-block text-center transition duration-300 hover:bg-[#000000]"
        >
          Preview
        </Link>
      </div>
      <Tabs defaultValue="Channelstbs" className="flex-grow">
        <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
          <TabsTrigger value="Channelstbs">Channels</TabsTrigger>
          <TabsTrigger value="settingstbs">
            <CiSettings className="text-2xl mr-1" /> Settings
          </TabsTrigger>
          <TabsTrigger value="embedtbs">
            <Code className="text-2xl mr-1" /> Embed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Channelstbs">
          <ChannelsTabs />
        </TabsContent>
        <TabsContent value="settingstbs">
          <SettingstTabs />
        </TabsContent>
        <TabsContent value="embedtbs">
          <EmbedTabs />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default WidgetCreate;
