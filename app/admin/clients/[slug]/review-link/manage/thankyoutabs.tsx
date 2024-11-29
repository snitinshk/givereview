import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditableField from "./editable";
import { useReviewLinkThankyou } from "@/app/context/review-link-thankyou.context";

const ThankYouTabs: React.FC = () => {
  const { reviewLinkThankyou, setReviewLinkThankyou } = useReviewLinkThankyou();

  const [imagePreview, setImagePreview] = useState<string | null>(reviewLinkThankyou?.imagePreview);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewLinkThankyouTitle, setReviewLinkThankyouTitle] = useState(
    reviewLinkThankyou?.title
  );

  useEffect(() => {
    setReviewLinkThankyou({
      ...reviewLinkThankyou,
      reviewLinkThankyouTitle,
    });
  }, [reviewLinkThankyouTitle]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      setReviewLinkThankyou({
        ...reviewLinkThankyou,
        uploadedFile: file,
        imagePreview,
      });

    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-4 font-semibold text-gray-500">
          {reviewLinkThankyou?.bgImage || imagePreview && (
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
              src={reviewLinkThankyou?.bgImage || imagePreview}
              alt="Preview"
              width={100}
              height={100}
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
          value={reviewLinkThankyouTitle}
          onEdit={() => setIsEditingReview(true)}
          onSave={(newValue) => {
            setReviewLinkThankyouTitle(newValue);
            setIsEditingReview(false);
          }}
          onCancel={() => setIsEditingReview(false)}
          renderValue={<span>{reviewLinkThankyouTitle}</span>}
        />
      </div>
    </>
  );
};

export default ThankYouTabs;
