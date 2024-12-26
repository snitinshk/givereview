// import TestimonialCompo from "../guests-say";
import ChannelCard from "@/components/channel-card/channel-card";
import { useWidget } from "@/app/context/widget-context";
import { WidgetChannel } from "@/interfaces/widget";
import { updateWidgetChannels } from "./action";
import { useToast } from "@/hooks/use-toast";

const ChannelsTabs: React.FC = () => {

  const { widget, setWidget } = useWidget();
  const { toast } = useToast();

  const handleToggle = async (channelId: number, newStatus: boolean) => {
    setWidget((prev: any) => {
      const updatedChannels = prev.channels?.map((channel: WidgetChannel) =>
        channel.id === channelId
          ? { ...channel, disabled: !newStatus, isActive: newStatus }
          : channel
      );
      return { ...prev, channels: updatedChannels };
    });

    if (widget && widget?.id) {
      try {
        const response = await updateWidgetChannels(
          { is_active: newStatus },
          { widget_id: widget.id, channel_id: channelId }
        );
        const { error } = JSON.parse(response);
        if (!error) {
          toast({ title: "Channel info updated" });
        }
        {
          toast({ title: "Failed to update channel info" });
        }
      } catch (err) {
        toast({ title: "Failed to update channel info" });
        console.error("Failed to update channel info:", err);
      }
    }
  };

  const handleReviewChange = async (channelId: number, value: string) => {
    setWidget((prev: any) => {
      const updatedChannels = prev.channels?.map((channel: any) =>
        channel.id === channelId
          ? { ...channel, ratingThreshold: value }
          : channel
      );
      return { ...prev, channels: updatedChannels };
    });

    if (widget && widget?.id) {
      try {
        const response = await updateWidgetChannels(
          { rating_threshold: value },
          { widget_id: widget.id, channel_id: channelId }
        );
        const { error } = JSON.parse(response);
        if (!error) {
          toast({ title: "Channel info updated" });
        } else {
          toast({ title: "Failed to update channel info" });
        }
      } catch (err) {
        console.error("Failed to update channel info:", err);
      }
    }
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-[80%] max-xl:max-w-[100%]">
        {widget?.channels?.map((channel) => (
          <ChannelCard
            key={channel.id}
            logoSrc={channel.logo}
            name={channel.name}
            isActive={channel.isActive}
            onToggle={() => handleToggle(channel.id, !channel.isActive)}
            ratingThreshold={channel.ratingThreshold}
            onReviewChange={(value) => handleReviewChange(channel.id, value)}
            disabled={channel.disabled}
          />
        ))}
      </div>
      {/* <TestimonialCompo /> */}
    </>
  );
};

export default ChannelsTabs;
