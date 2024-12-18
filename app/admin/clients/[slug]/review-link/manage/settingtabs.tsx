import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PlaceholderImage from "@/app/images/placeholder-image.svg";
import { useParams } from "next/navigation";
import PPIMG from "@/app/images/image_1.png";
import { Heart, Star } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DEFAULT_TEXTS } from "@/constant";
import EditableField from "../editable";
import { useReviewLink } from "@/app/context/review-link-context";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";
import { updateReviewLink } from "../action";
import { useToast } from "@/hooks/use-toast";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";
import { useClients } from "@/app/context/clients-context";

interface Settings {
  reviewLinkName: string;
  reviewLinkSlug: string;
  homeReviewTitle: string;
  isSkipFirstPageEnabled: boolean;
  ratingThresholdCount: number;
  isPoweredByEnabled: boolean;
  desktopBgImage: string;
}

export default function SettingTabs() {
  const { reviewLinkSettings, setReviewLinkSettings } = useReviewLinkSettings();
  const { selectedClient } = useClients();
  const [imagePreview, setImagePreview] = useState<string | null>(
    reviewLinkSettings?.desktopBgImage
  );
  // const [desktopBgImage, setDesktopBgImage] = useState<File>();

  if (reviewLinkSettings?.imageFile) {
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(reviewLinkSettings?.imageFile);
  }

  const { toast } = useToast();

  const [isActive, setIsActive] = useState<boolean>(
    reviewLinkSettings?.isActive
  );

  const [editingName, setEditingName] = useState(false);
  const [reviewLinkName, setReviewLinkName] = useState<string>(
    reviewLinkSettings?.reviewLinkName
  );

  const [editingSlug, setEditingSlug] = useState(false);
  const [reviewLinkSlug, setReviewLinkSlug] = useState<string>(
    reviewLinkSettings?.reviewLinkSlug
  );

  const [editingHomeTitle, setEditingHomeTitle] = useState(false);
  const [title, setTitle] = useState<string>(reviewLinkSettings?.title);

  const [isSkipFirstPageEnabled, setIsSkipFirstPageEnabled] = useState(
    reviewLinkSettings?.isSkipFirstPageEnabled
  );
  const [isPoweredByEnabled, setIsPoweredByEnabled] = useState(
    !reviewLinkSettings?.isPoweredByEnabled
  );

  const [ratingThresholdCount, setRatingThresholdCount] = useState<number>(
    reviewLinkSettings?.ratingThresholdCount
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          uploadedFile: file,
        };
      });

      if (!reviewLinkSettings?.reviewLinkId) {
        return;
      }
      const imageUrl = await uploadBgImage(file);
      handleUpdateReviewLinkSettings({
        desktop_bg_image: imageUrl,
      });
    }
  };

  useEffect(() => {
    if (reviewLinkName !== reviewLinkSettings?.reviewLinkName) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          reviewLinkName,
        };
      });
    }

    if (reviewLinkSlug !== reviewLinkSettings?.reviewLinkSlug) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          reviewLinkSlug,
        };
      });
    }

    if (title !== reviewLinkSettings?.title) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          title,
        };
      });
    }

    if (isPoweredByEnabled !== reviewLinkSettings?.isPoweredByEnabled) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          isPoweredByEnabled,
        };
      });
    }

    if (isSkipFirstPageEnabled !== reviewLinkSettings?.isSkipFirstPageEnabled) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          isSkipFirstPageEnabled,
        };
      });
    }

    if (ratingThresholdCount !== reviewLinkSettings?.ratingThresholdCount) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          ratingThresholdCount,
        };
      });
    }

    if (isActive !== reviewLinkSettings?.isActive) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          isActive,
        };
      });
    }

    if (imagePreview) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          desktopBgImage: imagePreview,
        };
      });
    }

    //Image upload check

    // if (reviewLinkSettings?.imageFile) {
    //   const reader = new FileReader();
    //   reader.onload = () => setImagePreview(reader.result as string);
    //   reader.readAsDataURL(reviewLinkSettings?.imageFile);
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reviewLinkName,
    reviewLinkSlug,
    title,
    isPoweredByEnabled,
    isSkipFirstPageEnabled,
    ratingThresholdCount,
    isActive,
    imagePreview,
  ]);

  // useEffect(() => {
  //   setReviewLinkSettings({
  //     ...reviewLinkSettings,
  //     reviewLinkName,
  //     reviewLinkSlug,
  //     ratingThresholdCount,
  //     title,
  //     isSkipFirstPageEnabled,
  //     desktopBgImage,
  //     isPoweredByEnabled,
  //     isActive,
  //   });
  // }, [
  //   reviewLinkName,
  //   reviewLinkSlug,
  //   title,
  //   isSkipFirstPageEnabled,
  //   desktopBgImage,
  //   ratingThresholdCount,
  //   isPoweredByEnabled,
  //   isActive,
  //   reviewLinkSettings
  // ]);

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

  const handleUpdateReviewLinkSettings = async (updateInfo: any) => {
    // do nothing for add case;
    if (!reviewLinkSettings?.reviewLinkId) {
      return;
    }

    const response = await updateReviewLink(
      "setting_review_link_details",
      updateInfo,
      {
        col: "id",
        val: reviewLinkSettings?.reviewLinkId,
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
    <div className="flex flex-wrap gap-8">
      {/* Left Section */}
      <div className="flex flex-col gap-5 items-start w-full md:w-1/2">
        {/* Active/Inactive Switch */}
        {reviewLinkSettings?.reviewLinkId && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="active-toggle">
              {isActive ? "Active" : "Inactive"}
            </Label>
            <Switch
              id="active-toggle"
              checked={isActive}
              onCheckedChange={(checked) => {
                setIsActive(!isActive);
                handleUpdateReviewLinkSettings({
                  is_active: checked,
                });
              }}
            />
          </div>
        )}

        {/* Editable Name Field */}
        {!reviewLinkSettings?.reviewLinkId ? (
          <Input
            value={reviewLinkName}
            onChange={(e) => setReviewLinkName(e.target.value)}
            autoFocus
            className="h-12 w-full max-w-80"
          />
        ) : (
          <EditableField
            fieldName="name"
            isEditing={editingName}
            value={reviewLinkName}
            onEdit={() => setEditingName(true)}
            onSave={(newValue) => {
              handleUpdateReviewLinkSettings({
                review_link_name: newValue,
              });
              setReviewLinkName(newValue);
              setEditingName(false);
            }}
            onCancel={() => setEditingName(false)}
            renderValue={<p className="text-gray-700">{reviewLinkName}</p>}
          />
        )}

        {/* Editable URL Field */}
        <EditableField
          isEditing={editingSlug}
          value={reviewLinkSlug}
          onEdit={() => setEditingSlug(true)}
          onSave={(newValue) => {
            handleUpdateReviewLinkSettings({
              review_link_slug: newValue,
            });
            setReviewLinkSlug(newValue);
            setEditingSlug(false);
          }}
          onCancel={() => setEditingSlug(false)}
          renderValue={
            <p>
              {DEFAULT_TEXTS.reviewSiteBaseUrl}
              <span className="text-black">{reviewLinkSlug}</span>
            </p>
          }
        />

        {/* Editable Home Title Field */}
        <div className="flex flex-col gap-5 items-start w-full">
          <div className="flex items-center gap-1 w-full">
            <EditableField
              isEditing={editingHomeTitle}
              value={title}
              onEdit={() => setEditingHomeTitle(true)}
              onSave={(newValue) => {
                handleUpdateReviewLinkSettings({
                  review_link_home_title: newValue,
                });
                setTitle(newValue);
                setEditingHomeTitle(false);
              }}
              onCancel={() => setEditingHomeTitle(false)}
              renderValue={<p>{title}</p>}
            />
          </div>
        </div>

        {/* Skip First Page Toggle */}
        <div className="flex flex-col gap-5 items-start w-full">
          <div className="flex items-center gap-4 font-semibold">
            <span>Skip first page and go to positive page</span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="skip-page-toggle">
                {isSkipFirstPageEnabled ? "Enable" : "Disable"}
              </Label>
              <Switch
                id="skip-page-toggle"
                checked={isSkipFirstPageEnabled}
                onCheckedChange={(checked) => {
                  handleUpdateReviewLinkSettings({
                    skip_first_page_enabled: checked,
                  });
                  setIsSkipFirstPageEnabled(checked);
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <span>If stars bigger than</span>
            <Select
              onValueChange={(newValue) => {
                setRatingThresholdCount(Number(newValue));
                handleUpdateReviewLinkSettings({
                  rating_threshold_count: newValue,
                });
              }}
              value={ratingThresholdCount.toString()}
            >
              <SelectTrigger className="min-w-14 w-auto">
                <SelectValue placeholder="number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            <span>go to positive page else go to negative page</span>
          </div>

          {/* Powered By Section */}
          <div className="flex items-center gap-4">
            <span>
              <strong>Show</strong> Powered with love by place booster
            </span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="powered-by-toggle">
                {isPoweredByEnabled ? "Enable" : "Disable"}
              </Label>
              <Switch
                id="powered-by-toggle"
                checked={isPoweredByEnabled}
                onCheckedChange={(checked) => {
                  handleUpdateReviewLinkSettings({
                    powered_by_enabled: checked,
                  });
                  setIsPoweredByEnabled(checked);
                }}
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 font-semibold text-gray-500">
            Desktop background image
            {imagePreview ? (
              <Button
                variant="ghost"
                className="text-green-600 font-semibold"
                onClick={() => setImagePreview(null)}
              >
                <MdEdit /> Edit
              </Button>
            ) : (
              ""
            )}
          </div>
          {imagePreview ? (
            <div className="relative w-full max-w-xs h-36 max-sm:h-auto">
              <Image
                src={imagePreview}
                alt="Preview"
                width={150}
                height={150}
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          ) : (
            <div className="grid w-96 max-w-full items-center gap-1.5">
              <Input
                id="image-upload"
                type="file"
                className="opacity-0 invisible absolute left-0 top-0 w-full h-full"
                onChange={handleImageUpload}
              />
              <Label
                htmlFor="image-upload"
                className="flex flex-col gap-1 rounded-2xl text-gray-500 text-center items-center justify-center border-dashed border border-gray-200 bg-gray-100 w-full max-w-xs h-28"
              >
                <FaCloudUploadAlt className="text-4xl" />
                Upload file
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className=" relative w-full md:w-[calc(50%-50px)] min-h-[550px] max-h-[750px] bg-[#FFFAFA] border border-[#F2DDDD] rounded-3xl flex items-center justify-center p-11 flex-col gap-10">
        {selectedClient?.logo && (
          <Image
            src={selectedClient?.logo || PlaceholderImage}
            alt={`Preview Image`}
            width={145}
            height={145}
          />
        )}
        <p className="max-w-80 text-center mx-auto text-2xl font-semibold text-gray-800 font-MOSTR">
          {title}
        </p>
        <div className="flex gap-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={`w-12 h-12 text-gray-300`} />
          ))}
        </div>
        {isPoweredByEnabled && (
          <div className="font-MOSTR text-sm text-gray-600 flex items-center gap-1 absolute left-1/2 bottom-3 -translate-x-1/2">
            <span className="font-medium">Powered</span> with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by place
            booster
          </div>
        )}
      </div>
    </div>
  );
}
