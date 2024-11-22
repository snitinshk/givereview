
"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CiSettings } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import GLGIMG from "@/app/images/google.svg"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

const WidgetCreate: React.FC = () => {
    return (
        <>
            <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5">
                <Button className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold">Cancel</Button>
                <Button className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold">Save</Button>
            </div>
            <Tabs defaultValue="Channelstbs" className='flex-grow'>
                <TabsList className="bg-transparent p-0 mb-4 gap-10 [&>button]:px-0 [&>button]:pb-2 [&>button[data-state='active']]:bg-transparent [&>button[data-state='active']]:shadow-none [&>button[data-state='active']]:border-b-2 [&>button[data-state='active']]:border-green-500 [&>button[data-state='active']]:rounded-none">
                    <TabsTrigger value="Channelstbs">Channels</TabsTrigger>
                    <TabsTrigger value="settingstbs"><CiSettings className='text-2xl mr-1' /> Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="Channelstbs">
                    <div className="border border-gray-200 rounded-3xl p-6 shadow-lg max-w-xl">
                        <div className="mb-7">
                            <label className="text-[#637381] uppercase font-bold text-xs mb-2 block">Widget name</label>
                            <Input type="text" placeholder="Name" className="h-12" />
                        </div>
                        <div>
                            <label className="text-[#637381] uppercase font-bold text-xs mb-2 block">Stream name</label>
                            <Input type="text" placeholder="Name" className="h-12" />
                        </div>
                    </div>
                    <div className="mt-14 grid grid-cols-3 gap-10 max-xl:grid-cols-2 max-lg:grid-cols-1">
                        <div>
                            <div className="flex gap-5 items-center">
                                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                                    <Image
                                        src={GLGIMG}
                                        alt={`logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm"
                                    />
                                    <span className="flex-grow text-center font-semibold">Google</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="airplane-mode">Inactive</Label>
                                    <Switch id="airplane-mode" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <span>Show only  reviews bigger than</span>
                                <Select
                                    value=""
                                >
                                    <SelectTrigger className="min-w-14 w-auto">
                                        <SelectValue placeholder="number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>stars</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-5 items-center">
                                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                                    <Image
                                        src={GLGIMG}
                                        alt={`logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm"
                                    />
                                    <span className="flex-grow text-center font-semibold">Google</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="airplane-mode">Inactive</Label>
                                    <Switch id="airplane-mode" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <span>Show only  reviews bigger than</span>
                                <Select
                                    value=""
                                >
                                    <SelectTrigger className="min-w-14 w-auto">
                                        <SelectValue placeholder="number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>stars</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-5 items-center">
                                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                                    <Image
                                        src={GLGIMG}
                                        alt={`logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm"
                                    />
                                    <span className="flex-grow text-center font-semibold">Google</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="airplane-mode">Inactive</Label>
                                    <Switch id="airplane-mode" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <span>Show only  reviews bigger than</span>
                                <Select
                                    value=""
                                >
                                    <SelectTrigger className="min-w-14 w-auto">
                                        <SelectValue placeholder="number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>stars</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-5 items-center">
                                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                                    <Image
                                        src={GLGIMG}
                                        alt={`logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm"
                                    />
                                    <span className="flex-grow text-center font-semibold">Google</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="airplane-mode">Inactive</Label>
                                    <Switch id="airplane-mode" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <span>Show only  reviews bigger than</span>
                                <Select
                                    value=""
                                >
                                    <SelectTrigger className="min-w-14 w-auto">
                                        <SelectValue placeholder="number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>stars</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-5 items-center">
                                <div className="bg-gray-100 w-80 h-14 rounded-lg p-3 flex items-center">
                                    <Image
                                        src={GLGIMG}
                                        alt={`logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-sm"
                                    />
                                    <span className="flex-grow text-center font-semibold">Google</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="airplane-mode">Inactive</Label>
                                    <Switch id="airplane-mode" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <span>Show only  reviews bigger than</span>
                                <Select
                                    value=""
                                >
                                    <SelectTrigger className="min-w-14 w-auto">
                                        <SelectValue placeholder="number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>stars</span>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="settingstbs">
                    sdfdsf
                </TabsContent>
            </Tabs>
        </>
    );
};

export default WidgetCreate;