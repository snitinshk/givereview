import { useEffect, useState } from "react";
// import TestimonialCompo from "../guests-say";
import { Input } from "@/components/ui/input";
import ChannelCard from "@/components/channel-card/channel-card";
import GLGIMG from "@/app/images/google.svg";
import { useChannels } from "@/app/context/channels-context";
import { Channel } from "@/interfaces/channels";
import { useWidget } from "@/app/context/widget-context";

const ChannelsTabs: React.FC = () => {
  const { widget, setWidget } = useWidget();

  // const [channels, setChannels] = useState(defaultChannels);

  useEffect(()=>{ console.log(widget)},[widget])

  const handleToggle = (id: number) => {
    setWidget((prev: any) => ({
      ...prev, // Corrected typo here
      channels: prev.channels?.map((channel: any) =>
        channel.id === id
          ? { ...channel, disabled: channel.isActive, isActive: !channel.isActive } // Toggle `isActive`
          : channel
      ),
    }));
  };

  const handleReviewChange = (id: number, value: string) => {

    setWidget((prev: any) => ({
      ...prev, // Corrected typo here
      channels: prev.channels?.map((channel: any) =>
        channel.id === id
          ? { ...channel, reviewThreshold: value } // Toggle `isActive`
          : channel
      ),
    }));
  };

  return (
    <>
      {/* <div className="border border-gray-200 rounded-3xl p-6 shadow-lg max-w-xl w-full">
        <div className="mb-7">
          <label className="text-[#637381] uppercase font-bold text-xs mb-2 block">
            Widget name
          </label>
          <Input
            type="text"
            value={widget?.name || ''}
            onChange={(event) => {
              console.log(event.target.value);
              setWidget((prevWidget: any) => {
                return {
                  ...prevWidget, // Preserve the previous widget state
                  name: event.target.value, // Update the 'name' field
                };
              });
            }}
            placeholder="Name"
            className="h-12"
          />
        </div>
        <div>
          <label className="text-[#637381] uppercase font-bold text-xs mb-2 block">
            Stream name
          </label>
          <Input type="text" placeholder="Name" className="h-12" />
        </div>
      </div> */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {widget?.channels?.map((channel) => (
          <ChannelCard
            key={channel.id}
            logoSrc={channel.logo}
            name={channel.name}
            isActive={channel.isActive}
            onToggle={() => handleToggle(channel.id)}
            reviewThreshold={channel.reviewThreshold}
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
