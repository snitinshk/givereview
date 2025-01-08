import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useReviewLinkThankyou } from "@/app/context/review-link-thankyou.context";
import { updateReviewLink } from "../action";
import { useToast } from "@/hooks/use-toast";
import {
  getFileName,
  handleImageUpload,
  mediaUrl,
  uploadFile,
  uploadFileToSupabase,
} from "@/lib/utils";
import { Heart } from "lucide-react";
import EditableField from "@/components/editable";
import { updateIndividualAttributes } from "@/app/admin/action";
import { ReviewLinkThankYouUI } from "@/interfaces/reviewlink";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";

const ThankYouTabs: React.FC = () => {
  const { reviewLinkThankyou, setReviewLinkThankyou } = useReviewLinkThankyou();
  const { reviewLinkSettings } = useReviewLinkSettings();
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(
    reviewLinkThankyou?.bgImage
  );
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewLinkThankyouTitle, setReviewLinkThankyouTitle] = useState(
    reviewLinkThankyou?.title
  );

  useEffect(() => {
    setReviewLinkThankyou((prevState: ReviewLinkThankYouUI) => {
      if (
        prevState.title !== reviewLinkThankyouTitle ||
        prevState.bgImage !== imagePreview
      ) {
        return {
          ...prevState,
          title: reviewLinkThankyouTitle,
          bgImage: imagePreview,
        };
      }
      return prevState; // No changes needed
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewLinkThankyouTitle, imagePreview]);

  const handleThankyouImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const { base64, file, error } = await handleImageUpload(event);
      if (error || !file) {
        throw new Error(
          "Error in selecting Thank You Image, please try again later"
        );
      }

      setImagePreview(base64);

      setReviewLinkThankyou((prevState: ReviewLinkThankYouUI) => ({
        ...prevState,
        uploadedFile: file,
      }));

      if (!reviewLinkThankyou?.thankyouRLId) return;

      const { error: uploadError, fileUrl } = await uploadFileToSupabase(
        "reviewlinks",
        file
      );

      if (uploadError || !fileUrl) {
        throw new Error(
          "Error in uploading Thank You Image, please try again later"
        );
      }

      handleUpdateReviewLinkThankyou({
        review_thankyou_bg_image: fileUrl,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({
        title: errorMessage,
      });
    }
  };

  const handleUpdateReviewLinkThankyou = async (
    updateInfo: Record<string, string>
  ) => {
    // do nothing for add case;
    if (!reviewLinkThankyou?.thankyouRLId) {
      return;
    }

    const condition = {
      col: "id",
      val: reviewLinkThankyou?.thankyouRLId,
    };

    const response = await updateIndividualAttributes(
      "thankyou_review_link_details",
      updateInfo,
      condition
    );

    const { error } = JSON.parse(response);

    if (!error) {
      toast({
        description: "Field updated",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full md:w-1/2">
        <div className="flex flex-col gap-3 mb-4 w-full">
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
            <div className="relative w-full sm:w-96 h-36 max-w-full">
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
            <div className="grid w-full sm:w-96 max-w-sm items-center gap-1.5">
              <Input
                id="image-upload"
                type="file"
                className="opacity-0 invisible absolute left-0 top-0 w-full h-full"
                onChange={handleThankyouImageUpload}
              />
              <Label
                htmlFor="image-upload"
                className="flex flex-col gap-1 rounded-2xl text-gray-500 text-center items-center justify-center border-dashed border border-gray-200 bg-gray-100 w-full sm:w-96 h-28 max-w-full"
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
      </div>
      {/* Preview Section */}
      <div className="w-full relative pb-12 md:w-[calc(50%-50px)] min-h-[450px] max-h-[750px] bg-[#FFFAFA] border border-[#F2DDDD] rounded-3xl flex items-center justify-center p-11 flex-col gap-10">
        {imagePreview && (
          <Image
            src={imagePreview}
            alt={`Preview Image`}
            width={145}
            height={145}
          />
        )}
        <p className="max-w-96 text-center mx-auto text-2xl font-medium text-gray-800 font-MOSTR">
          {reviewLinkThankyouTitle}
        </p>
        {reviewLinkSettings?.isPoweredByEnabled && (
          <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2">
            <span className="font-medium">Powered</span> with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by place
            booster
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYouTabs;
