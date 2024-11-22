import Image from "next/image";
import GLGIMG from "@/app/images/google.svg";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { FaStar } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditableField from "./editable";
import { useRef, useState } from "react";
import placeholder from "../../../../../images/placeholder.svg";
import { UploadIcon } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";

const ratingCategories = [
    "Food",
    "Service",
    "Atmosphere",
    "Noise level",
    "Price",
    "Cleanliness",
    "Waiting time",
];

const inputs = [
    { placeholder: "Name", type: "text" },
    { placeholder: "Phone number", type: "tel" },
    { placeholder: "Email", type: "email" },
];

const textareas = [
    { placeholder: "Share information about how you experienced the place" },
    { placeholder: "What was good about your visit?" },
    { placeholder: "What was bad about your visit?" },
    { placeholder: "Other comments" },
];

const NegativeTabs: React.FC = () => {
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [reviewText, setReviewText] = useState("We want our customers to be 100% satisfied. Please let us know why you had a bad experience, so we can improve our service. Leave your email to be contacted.");
    const [isPublic, setIsPublic] = useState(false);
    const [isEditingPublicText, setIsEditingPublicText] = useState(false);
    const [publicText, setPublicText] = useState("Appears publicly on Google");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isImageChanged, setIsImageChanged] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true); // Enable editing mode when clicking "Edit"
    };

    const handleNewLogoUpload = () => {
        if (fileInputRef.current?.files) {
            const uploadedFile = fileInputRef.current.files[0];
            if (uploadedFile) {
                const previewUrl = URL.createObjectURL(uploadedFile);
                setImagePreview(previewUrl);
                setIsImageChanged(true);
            }
        }
    };

    const handleConfirmImage = () => {
        console.log("Image confirmed:", imageFile);
        setIsEditing(false);
        setIsImageChanged(false);
    };

    const handleCancelImage = () => {
        setImagePreview(null);
        setIsImageChanged(false);
        setImageFile(null);
    };

    const renderEditableField = (isEditing: boolean, value: string, onEdit: () => void, onSave: (newValue: string) => void, onCancel: () => void) => (
        <EditableField
            isEditing={isEditing}
            value={value}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            renderValue={<span>{value}</span>}
        />
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center w-80 max-w-full gap-3">
                <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-md p-1">
                    <Image
                        src={imagePreview || placeholder}
                        alt="New channel logo"
                        width={40}
                        height={40}
                        className="rounded-sm"
                    />
                </div>
                <div className="flex gap-3 items-center">
                    {isEditing && (
                        <Button
                            variant="outline"
                            className="bg-gray-100 w-14 h-14 border border-dashed border-gray-300"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon className="h-4 w-4" />
                            <span className="sr-only">Upload logo</span>
                        </Button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleNewLogoUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    {isImageChanged && (
                        <div className="flex gap-4 items-center">
                            <Button variant="ghost" onClick={handleConfirmImage} className="px-1 h-auto text-green-700">
                                <FaCheck />
                            </Button>
                            <Button variant="ghost" onClick={handleCancelImage} className="px-1 h-auto text-red-700">
                                <RxCross2 />
                            </Button>
                        </div>
                    )}
                </div>
                <Button variant="ghost" className="text-green-600 font-semibold" onClick={handleEditClick}>
                    Edit
                </Button>
                <Switch id="lgshow" />
            </div>

            <div className="flex flex-col gap-5 max-w-xl">
                <div className="flex items-center max-w-full gap-2">
                    <div className={`flex items-center gap-2 ${isEditingPublicText ? 'flex-grow' : ''}`}>
                        {renderEditableField(isEditingPublicText, publicText, () => setIsEditingPublicText(true), (newValue) => {
                            setPublicText(newValue);
                            setIsEditingPublicText(false);
                        }, () => setIsEditingPublicText(false))}
                    </div>
                    <Switch id="apshow" checked={isPublic} onCheckedChange={() => setIsPublic(!isPublic)} />
                </div>

                <div className="flex items-start mb-20">
                    {renderEditableField(isEditingReview, reviewText, () => setIsEditingReview(true), (newValue) => {
                        setReviewText(newValue);
                        setIsEditingReview(false);
                    }, () => setIsEditingReview(false))}
                </div>
            </div>

            <div className="flex flex-col gap-5 mb-16">
                {ratingCategories.map((category, index) => (
                    <div className="flex gap-8 items-center" key={index}>
                        <p className="w-28">{category}</p>
                        <div className="flex gap-2 text-gray-300">
                            {Array(5).fill(null).map((_, starIndex) => (
                                <FaStar className="text-3xl" key={starIndex} />
                            ))}
                        </div>
                        <Switch id={`${category.toLowerCase()}-switch`} className="m-0" />
                    </div>
                ))}
            </div>

            {inputs.map((input, index) => (
                <div className="flex items-center gap-4" key={index}>
                    <Input type={input.type} placeholder={input.placeholder} className="h-12 shadow-none max-w-80" />
                    <Switch id={`${input.placeholder.toLowerCase().replace(/\s+/g, "-")}-switch`} className="m-0" />
                </div>
            ))}

            {textareas.map((textarea, index) => (
                <div className="flex items-center gap-4" key={index}>
                    <Textarea placeholder={textarea.placeholder} className="max-w-md h-20 resize-none" />
                    <Switch id={`${textarea.placeholder.toLowerCase().replace(/\s+/g, "-")}-switch`} className="m-0" />
                </div>
            ))}
        </div>
    );
};

export default NegativeTabs;
