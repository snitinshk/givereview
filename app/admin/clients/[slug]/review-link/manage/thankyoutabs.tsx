import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import EditableField from "./editable";

const ThankYouTabs: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewText, setReviewText] = useState("Thank you for your review");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-4 font-semibold text-gray-500">
          {imagePreview && (
            <Button
              variant="ghost"
              className="text-green-600 font-semibold"
              onClick={() => setImagePreview(null)}
            >
              Edit
            </Button>
          )}
        </div>
        {imagePreview ? (
          <div className="relative w-96 h-36">
            <Image
              src={imagePreview}
              alt="Preview"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
        ) : (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="image-upload"
              type="file"
              className="opacity-0 invisible absolute left-0 top-0 w-full h-full"
              onChange={handleImageUpload}
            />
            <Label
              htmlFor="image-upload"
              className="flex flex-col gap-1 rounded-2xl text-gray-500 text-center items-center justify-center border-dashed border border-gray-200 bg-gray-100 w-96 h-28"
            >
              <FaCloudUploadAlt className="text-4xl" />
              Upload file
            </Label>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <EditableField
          isEditing={isEditingReview}
          value={reviewText}
          onEdit={() => setIsEditingReview(true)}
          onSave={(newValue) => {
            setReviewText(newValue);
            setIsEditingReview(false);
          }}
          onCancel={() => setIsEditingReview(false)}
          renderValue={<span>{reviewText}</span>}
        />
      </div>
    </>
  );
};

export default ThankYouTabs;
