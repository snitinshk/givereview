"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CiSettings } from "react-icons/ci";
import ChannelsTabs from "./channels-tab";
import SettingstTabs from "./settings-tab";
import EmbedTabs from "./embed-tab";
import { Code } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const WidgetCreate: React.FC = () => {
    
    return (
        <>
            <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5 max-sm:mt-0">
                <div  className="flex items-center space-x-2">
                    <Switch id="isActive" />
                    <Label htmlFor="isActive" className="font-normal">
                      Active
                    </Label>
                  </div>
                <Button className="bg-[#919EAB14] text-[#000000] hover:text-white font-bold">Preview</Button>
            </div>
            <Tabs defaultValue="Channelstbs" className='flex-grow'>
                <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
                    <TabsTrigger value="Channelstbs">Channels</TabsTrigger>
                    <TabsTrigger value="settingstbs"><CiSettings className='text-2xl mr-1' /> Settings</TabsTrigger>
                    <TabsTrigger value="embedtbs"><Code className='text-2xl mr-1' /> Embed</TabsTrigger>
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