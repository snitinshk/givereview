import Image from "next/image";
import GLGIMG from "@/app/images/google.svg"
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { FaStar } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NegativeTabs: React.FC = () => {


    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between w-80 max-w-full">
                <div className="flex items-center gap-2">
                    <Image
                        src={GLGIMG}
                        alt={`logo`}
                        width={24}
                        height={24}
                        className="rounded-sm"
                    />
                    <Button variant="ghost" className='text-green-600 font-semibold'><MdEdit /> Edit</Button>
                </div>
                <div className="flex">
                    <Switch id="lgshow" />
                </div>
            </div>
            <div className="flex items-center">
                <div className="flex items-center gap-2">
                    <p>Appears publicly on Google</p>
                    <Button variant="ghost" className='text-green-600 font-semibold'><MdEdit /> Edit</Button>
                </div>
                <div className="flex">
                    <Switch id="apshow" />
                </div>
            </div>
            <div className="flex items-start mb-20">
                <p className="w-80">We want our customers to be 100% satisfied. Please let us know why you had a bad experience, so we can improve our service. Leave your email to be contacted.</p>
                <Button variant="ghost" className='text-green-600 font-semibold'><MdEdit /> Edit</Button>
            </div>


            <div className="flex flex-col gap-5 mb-16">
                <div className="flex gap-8 items-center">
                    <p className="w-28">Food</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
                <div className="flex gap-8 items-center">
                    <p className="w-28">Service</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
                <div className="flex gap-8 items-center">
                    <p className="w-28">Atomsphere</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
                <div className="flex gap-8 items-center">
                    <p className="w-28">Noise level</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
                <div className="flex gap-8 items-center">
                    <p className="w-28">Price</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
                <div className="flex gap-8 items-center">
                    <p className="w-28">Cleanliness</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
                <div className="flex gap-8 items-center">
                    <p className="w-28">Waiting time</p>
                    <div className="flex gap-2 text-gray-300">
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                        <FaStar className="text-3xl" />
                    </div>
                    <Switch id="fdrt" className="m-0" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Input type="email" placeholder="Name" className='h-12 shadow-none max-w-80' />
                <Switch id="fdrt" className="m-0" />
            </div>
            <div className="flex items-center gap-4">
                <Input type="email" placeholder="Phone nr" className='h-12 shadow-none max-w-80' />
                <Switch id="fdrt" className="m-0" />
            </div>
            <div className="flex items-center gap-4">
                <Input type="email" placeholder="Email" className='h-12 shadow-none max-w-80' />
                <Switch id="fdrt" className="m-0" />
            </div>
            <div className="flex items-center gap-4">
                <Textarea placeholder="Share information about how you experienced the place" className="max-w-md h-20 resize-none" />
                <Switch id="fdrt" className="m-0" />
            </div>
            <div className="flex items-center gap-4">
                <Textarea placeholder="What was good about your visit?" className="max-w-md h-20 resize-none" />
                <Switch id="fdrt" className="m-0" />
            </div>
            <div className="flex items-center gap-4">
                <Textarea placeholder="What was bad about your visit?" className="max-w-md h-20 resize-none" />
                <Switch id="fdrt" className="m-0" />
            </div>
            <div className="flex items-center gap-4">
                <Textarea placeholder="Other comments" className="max-w-md h-20 resize-none" />
                <Switch id="fdrt" className="m-0" />
            </div>
        </div>
    )
}


export default NegativeTabs;
