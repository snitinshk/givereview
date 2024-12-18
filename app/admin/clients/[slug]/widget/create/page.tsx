
"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CiSettings } from "react-icons/ci";
import ChannelsTabs from "./channels-tab";
import SettingstTabs from "./settings-tab";
import { useWidget } from "@/app/context/widget-context";

const WidgetCreate: React.FC = () => {
    
    return (
        <>
            <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5 max-sm:mt-0">
                <Button className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold">Cancel</Button>
                <Button className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold">Save</Button>
            </div>
            <Tabs defaultValue="Channelstbs" className='flex-grow'>
                <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
                    <TabsTrigger value="Channelstbs">Channels</TabsTrigger>
                    <TabsTrigger value="settingstbs"><CiSettings className='text-2xl mr-1' /> Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="Channelstbs">
                    <ChannelsTabs />
                </TabsContent>
                <TabsContent value="settingstbs">
                    <SettingstTabs />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default WidgetCreate;