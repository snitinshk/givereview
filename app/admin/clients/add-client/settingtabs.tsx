import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MdEdit, MdCancel } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckIcon, XIcon } from 'lucide-react';

const SettingTabs: React.FC = () => {
    const [isActive, setIsActive] = useState<boolean>(true);
    const [skipPage, setSkipPage] = useState<boolean>(false);
    const [poweredBy, setPoweredBy] = useState<boolean>(true);
    const [editableField, setEditableField] = useState<{ [key: string]: boolean }>({});
    const [url, setUrl] = useState<string>("silvis");
    const [stars, setStars] = useState<string | undefined>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const toggleEditField = (field: string) => {
        setEditableField((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleEditSave = (field: string, newValue: string) => {
        if (field === "url") setUrl(newValue);
        toggleEditField(field);
    };

    return (
        <div className='flex flex-col gap-5 items-start'>
            {/* Active/Inactive Switch */}
            <div className="flex items-center space-x-2">
                <Label htmlFor="actmd">{isActive ? "Active" : "Inactive"}</Label>
                <Switch id="actmd" checked={isActive} onCheckedChange={() => setIsActive(!isActive)} />
            </div>

            {/* Editable Text */}
            {["website", "message"].map((field) => (
                <div className='flex items-center gap-1' key={field}>
                    {editableField[field] ? (
                        <>
                            <Input
                                defaultValue={field === "website" ? url : "How was your experience with Silvis?"}
                                onChange={(e) => {
                                    if (field === "website") setUrl(e.target.value); // Update URL state dynamically
                                }}
                                autoFocus
                            />
                            <Button
                                variant="ghost"
                                className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold"
                                onClick={() => toggleEditField(field)}
                            >
                                <CheckIcon className="h-4 w-4" /> Save
                                <span className="sr-only">Save changes for {field}</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"
                                onClick={() => toggleEditField(field)}
                            >
                                <XIcon className="h-4 w-4" /> Cancel
                                <span className="sr-only">Cancel editing {field}</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <p>{field === "website" ? url : "How was your experience with Silvis?"}</p>
                            <Button
                                variant="ghost"
                                className="text-green-600 font-semibold"
                                onClick={() => toggleEditField(field)}
                            >
                                <MdEdit /> Edit
                            </Button>
                        </>
                    )}
                </div>
            ))}


            {/* Editable URL */}
            <div className='flex items-center gap-1 text-gray-500'>
                {editableField["url"] ? (
                    <>
                        <Input
                            defaultValue={url}
                            onBlur={(e) => handleEditSave("url", e.target.value)}
                            autoFocus
                        />
                        <Button variant="ghost" onClick={() => toggleEditField("url")}><MdCancel /> Cancel</Button>
                    </>
                ) : (
                    <>
                        https://placereview.se/{url}
                        <Button variant="ghost" className='text-green-600 font-semibold' onClick={() => toggleEditField("url")}>
                            <MdEdit /> Edit
                        </Button>
                    </>
                )}
            </div>

            {/* Conditional Skip Page */}
            <div className='flex items-center gap-4 font-semibold'>
                Skip first page and go to positive page
                <div className="flex items-center space-x-2">
                    <Label htmlFor="skpfr-data">{skipPage ? "Enable" : "Disable"}</Label>
                    <Switch id="skpfr-data" checked={skipPage} onCheckedChange={() => setSkipPage(!skipPage)} />
                </div>
            </div>

            {/* Stars Selection */}
            <div className='flex items-center gap-4 font-semibold'>
                If stars bigger than
                <Select onValueChange={setStars}>
                    <SelectTrigger className="min-w-14 w-auto">
                        <SelectValue placeholder="number" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4].map((value) => (
                            <SelectItem key={value} value={value.toString()}>
                                {value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                go to positive page else go to negative page
            </div>

            {/* Powered by Place Booster */}
            <div className='flex items-center gap-4'>
                <span className='font-semibold'>Show</span>
                Powered with love by place booster
                <div className="flex items-center space-x-2">
                    <Label htmlFor="pwrd-data">{poweredBy ? "Disable" : "Enable"}</Label>
                    <Switch id="pwrd-data" checked={poweredBy} onCheckedChange={() => setPoweredBy(!poweredBy)} />
                </div>
            </div>

            {/* Image Upload */}
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-4 font-semibold text-gray-500'>
                    Desktop background image
                    {imagePreview ? (
                        <Button variant="ghost" className='text-green-600 font-semibold' onClick={() => setImagePreview(null)} >
                            <MdEdit /> Edit
                        </Button>
                    ) : (''
                    )}
                </div>
                {imagePreview ? (
                    <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-96 h-28 object-cover rounded-2xl" />
                    </div>
                ) : (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                            id="picturePP"
                            type="file"
                            className="opacity-0 invisible absolute left-0 top-0 w-full h-full"
                            onChange={handleImageUpload}
                        />
                        <Label htmlFor="picturePP" className="flex flex-col gap-1 rounded-2xl text-gray-500 text-center items-center justify-center border-dashed border border-gray-200 bg-gray-100 w-96 h-28">
                            <FaCloudUploadAlt className="text-4xl" />
                            Upload file
                        </Label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingTabs;
