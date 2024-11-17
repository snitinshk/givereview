"use client";

import { Button } from '@/components/ui/button';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CiSettings } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import Image from 'next/image';
import PPIMG from "@/app/images/image_1.png"
import SettingTabs from './settingtabs';
import PositiveTabs from './positivetabs';
import NegativeTabs from './negativetabs';
import ThankYouTabs from './thankyoutabs';


const CreateReviewLink: React.FC = () => {

    return (
        <>
            <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5">
                <Button className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold">Cancel</Button>
                <Button className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold">Save</Button>
            </div>

            <div className='flex flex-wrap gap-8'>
                <Tabs defaultValue="settings" className='flex-grow'>
                    <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
                        <TabsTrigger value="settings"><CiSettings className='text-2xl mr-1' /> Settings</TabsTrigger>
                        <TabsTrigger value="positivepg">Positive page</TabsTrigger>
                        <TabsTrigger value="negativepg">Negative page</TabsTrigger>
                        <TabsTrigger value="thanksyoupg">Thank you</TabsTrigger>
                    </TabsList>
                    <TabsContent value="settings">
                       <SettingTabs />
                    </TabsContent>
                    <TabsContent value="positivepg">
                        <PositiveTabs />
                    </TabsContent>
                    <TabsContent value="negativepg">
                        <NegativeTabs />
                    </TabsContent>
                    <TabsContent value="thanksyoupg">
                        <ThankYouTabs />
                    </TabsContent>
                </Tabs>
                <div className='w-1/2 min-h-[450px] max-h-[750px] bg-[#FFFAFA] border border-[#F2DDDD] rounded-3xl flex items-center justify-center p-11 flex-col gap-10'>
                    <Image
                        src={PPIMG}
                        alt={`Priview Image`}
                        width={145}
                        height={145}
                    />
                    <p>How was your experience with Silvis?</p>
                    <div className='flex gap-3'>
                        <FaRegStar className='text-3xl' />
                        <FaRegStar className='text-3xl' />
                        <FaRegStar className='text-3xl' />
                        <FaRegStar className='text-3xl' />
                        <FaRegStar className='text-3xl' />
                    </div>
                </div>
            </div>
        </>
    )
}


export default CreateReviewLink;
