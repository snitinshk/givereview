import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditableField from "./editable";
import { useReviewLinkThankyou } from "@/app/context/review-link-thankyou.context";
import { updateReviewLink } from "../action";
import { useToast } from "@/hooks/use-toast";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";

const ThankYouTabs: React.FC = () => {
  const { reviewLinkThankyou, setReviewLinkThankyou } = useReviewLinkThankyou();
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(
    reviewLinkThankyou?.bgImage
  );
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewLinkThankyouTitle, setReviewLinkThankyouTitle] = useState(
    reviewLinkThankyou?.title
  );

  useEffect(() => {
    setReviewLinkThankyou({
      ...reviewLinkThankyou,
      title: reviewLinkThankyouTitle,
      bgImage: imagePreview,
    });
  }, [reviewLinkThankyouTitle, imagePreview]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      setReviewLinkThankyou({
        ...reviewLinkThankyou,
        uploadedFile: file,
      });

      if (!reviewLinkThankyou?.ThankyouRLId) {
        return;
      }
      const imageUrl = await uploadBgImage(file);
      handleUpdateReviewLinkThankyou({
        review_thankyou_bg_image: imageUrl,
      });
    }
  };

  const uploadBgImage = async (file: File) => {
    const uploadPath = `reviewlinks/${getFileName(file)}`;
    const { data: uploadData, error: uploadError } = await uploadFile(
      file,
      uploadPath
    );

    if (uploadError) {
      toast({
        description: `Error in uploading image, please try again later`,
      });
    }

    return mediaUrl(uploadData?.fullPath as string);
  };

  const handleUpdateReviewLinkThankyou = async (updateInfo: any) => {
    // do nothing for add case;
    if (!reviewLinkThankyou?.ThankyouRLId) {
      return;
    }

    const response = await updateReviewLink(
      "thankyou_review_link_details",
      updateInfo,
      {
        col: "id",
        val: reviewLinkThankyou?.ThankyouRLId,
      }
    );
    const { error } = JSON.parse(response);

    if (!error) {
      toast({
        description: "Field updated",
      });
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
            handleUpdateReviewLinkThankyou({
              review_thankyou_title: newValue,
            });
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
