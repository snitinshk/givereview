import { MdEdit } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import GLGIMG from "@/app/images/google.svg"

const PositiveTabs: React.FC = () => {
    return (
        <>
            <div className='flex flex-col gap-5 items-start'>
                <div className='flex items-center gap-1 w-4/5 max-w-full'>
                    Leave us a review, it will help us grow and better serve our
                    customers like you. <Button variant="ghost" className='text-green-600 font-semibold'><MdEdit /> Edit</Button>
                </div>
                <div className="w-full">
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
                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold"
                            >
                                <PencilIcon className="h-4 w-4" /> Edit
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold"
                            >
                                <TrashIcon className="h-4 w-4" /> Delete
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    //onClick={() => setIsAdding(true)}
                    className="flex items-center font-bold hover:bg-[#36B37E] hover:text-white py-6"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add new channel</span>
                </Button>
            </div>
        </>
    )
}


export default PositiveTabs;
