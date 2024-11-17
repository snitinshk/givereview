import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ThankYouTabs: React.FC = () => {

    return (
        <>
            <div className='flex flex-col gap-3 mb-5'>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input id="picturePP" type="file" className=' opacity-0 invisible absolute left-0 top-0 w-full h-full' />
                    <Label htmlFor="picturePP" className='flex cursor-pointer flex-col gap-1 rounded-2xl text-gray-500 text-center items-center justify-center border-dashed border border-gray-200 bg-gray-100 w-96 h-28'>
                        <FaCloudUploadAlt className='text-4xl' />
                        Upload file
                    </Label>
                </div>
            </div>
            <div className='flex items-center gap-4'>Thank you for your review <Button variant="ghost" className='text-green-600 font-semibold'><MdEdit /> Edit</Button></div>
        </>
    )
}


export default ThankYouTabs;
