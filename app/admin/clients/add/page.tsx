"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TbCameraPlus } from "react-icons/tb";
import Image from 'next/image';
import { IoMdClose } from "react-icons/io";
import { IoMdInformationCircle } from "react-icons/io";

const CreateClient: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
    };

    return (
        <>
            <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5">
                <Button className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold">Cancel</Button>
                <Button className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold">Save</Button>
            </div>
            <div className="bg-white rounded-lg shadow-lg mb-5 p-5">

                <div className="max-w-lg space-y-4 flex flex-col">
                    <div className="flex items-center gap-3 bg-red-100 py-3 px-4 rounded-lg text-red-900 mb-4"><IoMdInformationCircle className="text-2xl text-red-500" /> Invalid email or password.</div>

                    <Input type="text" placeholder="Client name" className="h-12" />

                    <Select>
                        <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div>
                        <label className="text-sm text-gray-700 font-semibold">Logo</label>
                        <div className="flex justify-between items-center border border-dashed border-gray-200 rounded-full w-[145px] h-[145px] p-2 relative">
                            {preview ? (
                                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                                    <Image
                                        src={preview}
                                        alt="Image Preview"
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <label htmlFor="imageUpload" className='bg-gray-200 h-full w-full rounded-full flex items-center justify-center flex-col text-sm text-gray-500 gap-2 cursor-pointer'>
                                    <TbCameraPlus className='text-lg' /> {preview ? "Change photo" : "Upload photo"}
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {preview && (
                                <Button variant="ghost" onClick={handleRemoveImage} className='absolute -right-2 bottom-5 bg-red-400 h-auto p-1 text-white'><IoMdClose /></Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateClient;
