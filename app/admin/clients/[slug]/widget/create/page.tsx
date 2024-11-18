
"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CiSettings } from "react-icons/ci";


const WidgetCreate: React.FC = () => {
    return (
        <>
            <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5">
                <Button className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold">Cancel</Button>
                <Button className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold">Save</Button>
            </div>
            <Tabs defaultValue="settings" className='flex-grow'>
                <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
                    <TabsTrigger value="settings"><CiSettings className='text-2xl mr-1' /> Settings</TabsTrigger>
                <TabsTrigger value="positivepg">Positive page</TabsTrigger>``
                </TabsList>
                <TabsContent value="settings">
                    sdfdsf
                </TabsContent>
                <TabsContent value="positivepg">
                    sdfdsf
                </TabsContent>
            </Tabs>
        </>
    );
};

export default WidgetCreate;