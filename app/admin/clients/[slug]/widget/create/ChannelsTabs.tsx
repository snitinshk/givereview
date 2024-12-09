import { useState } from "react";
import TestimonialCompo from "../guests-say";
import { Input } from "@/components/ui/input";
import ChannelCard from "@/components/ChannelCard/ChannelCard";
import GLGIMG from "@/app/images/google.svg"

const ChannelsTabs: React.FC = () => {
    const [channels, setChannels] = useState([
        { id: 1, logoSrc: GLGIMG, name: "Google", isActive: false, reviewThreshold: "1" },
        { id: 2, logoSrc: GLGIMG, name: "Facebook", isActive: true, reviewThreshold: "3" },
        { id: 3, logoSrc: GLGIMG, name: "Twitter", isActive: false, reviewThreshold: "2" },
        { id: 4, logoSrc: GLGIMG, name: "Instagram", isActive: true, reviewThreshold: "4" },
        { id: 5, logoSrc: GLGIMG, name: "LinkedIn", isActive: false, reviewThreshold: "2" },
    ]);

    const handleToggle = (id: number) => {
        setChannels((prev) =>
            prev.map((channel) =>
                channel.id === id
                    ? { ...channel, isActive: !channel.isActive }
                    : channel
            )
        );
    };

    const handleReviewChange = (id: number, value: string) => {
        setChannels((prev) =>
            prev.map((channel) =>
                channel.id === id ? { ...channel, reviewThreshold: value } : channel
            )
        );
    };
    return (
        <>
            <div className="border border-gray-200 rounded-3xl p-6 shadow-lg max-w-xl w-full">
                <div className="mb-7">
                    <label className="text-[#637381] uppercase font-bold text-xs mb-2 block">Widget name</label>
                    <Input type="text" placeholder="Name" className="h-12" />
                </div>
                <div>
                    <label className="text-[#637381] uppercase font-bold text-xs mb-2 block">Stream name</label>
                    <Input type="text" placeholder="Name" className="h-12" />
                </div>
            </div>
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {channels.map((channel) => (
                    <ChannelCard
                        key={channel.id}
                        logoSrc={channel.logoSrc}
                        name={channel.name}
                        isActive={channel.isActive}
                        onToggle={() => handleToggle(channel.id)}
                        reviewThreshold={channel.reviewThreshold}
                        onReviewChange={(value) => handleReviewChange(channel.id, value)}
                    />
                ))}
            </div>

            <TestimonialCompo />
        </>
    );
};

export default ChannelsTabs;
