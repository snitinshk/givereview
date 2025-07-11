import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PlaceholderImage from "@/app/images/placeholder-image.svg";
import { Heart, Star } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DEFAULT_TEXTS } from "@/constant";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";
import { useToast } from "@/hooks/use-toast";
import { handleImageUpload, uploadFileToSupabase } from "@/lib/utils";
import { useClients } from "@/app/context/clients-context";
import EditableField from "@/components/editable";
import { updateIndividualAttributes } from "@/app/admin/action";

export default function SettingTabs() {
  const { reviewLinkSettings, setReviewLinkSettings } = useReviewLinkSettings();

  const { selectedClient } = useClients();
  const [imagePreview, setImagePreview] = useState<string | null>(
    reviewLinkSettings?.desktopBgImage
  );

  if (reviewLinkSettings?.imageFile) {
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(reviewLinkSettings?.imageFile);
  }

  const { toast } = useToast();

  const [editingName, setEditingName] = useState(false);
  const [editingSlug, setEditingSlug] = useState(false);
  const [editingHomeTitle, setEditingHomeTitle] = useState(false);

  const uploadBgImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { base64, file, error } = await handleImageUpload(event);
    if (!error && file) {
      setImagePreview(base64);
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          uploadedFile: file,
        };
      });

      if (!reviewLinkSettings?.reviewLinkId) {
        return;
      }

      const { error, fileUrl } = await uploadFileToSupabase(
        "reviewlinks",
        file
      );
      if (!error) {
        handleUpdateReviewLinkSettings({
          desktop_bg_image: fileUrl,
        });
        setReviewLinkSettings((prevState: any) => {
          return {
            ...prevState,
            uploadedFile: fileUrl,
          };
        });
      } else {
        toast({
          title: `Error in uploading reviewLink background Image, please try again later`,
        });
      }
    } else {
      toast({
        title: `Error in Selecting reviewLink background Image, please try again later`,
      });
    }
  };

  useEffect(() => {

    if (imagePreview) {
      setReviewLinkSettings((prevState: any) => {
        return {
          ...prevState,
          desktopBgImage: imagePreview,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview]);

  const updateReviewLinkSettingsContext = (updateDetail: any) => {
    const { field, newValue } = updateDetail;
    setReviewLinkSettings((prevState: any) => {
      return {
        ...prevState,
        [field]: newValue,
      };
    });
  };

  const handleUpdateReviewLinkSettings = async (updateInfo: any) => {
    // do nothing for add case;
    if (!reviewLinkSettings?.reviewLinkId) {
      return;
    }

    const condition = {
      col: "id",
      val: reviewLinkSettings?.reviewLinkId,
    };

    const response = await updateIndividualAttributes(
      "setting_review_link_details",
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
      {/* Left Section */}
      <div className="flex flex-col gap-5 items-start w-full md:w-1/2">
        {/* Active/Inactive Switch */}
        {reviewLinkSettings?.reviewLinkId && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="active-toggle">
              {reviewLinkSettings?.isActive ? "Active" : "Inactive"}
            </Label>
            <Switch
              id="active-toggle"
              checked={reviewLinkSettings?.isActive}
              onCheckedChange={(checked) => {
                updateReviewLinkSettingsContext({
                  field: "reviewLinkName",
                  newValue: checked,
                });
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
            value={reviewLinkSettings?.reviewLinkName}
            onChange={(e) => {
              updateReviewLinkSettingsContext({
                field: "reviewLinkName",
                newValue: e.target.value,
              });
            }}
            autoFocus
            className="h-12 w-full max-w-80"
          />
        ) : (
          <EditableField
            fieldName="name"
            isEditing={editingName}
            value={reviewLinkSettings?.reviewLinkName}
            onEdit={() => setEditingName(true)}
            onSave={(newValue) => {
              handleUpdateReviewLinkSettings({
                review_link_name: newValue,
              });
              updateReviewLinkSettingsContext({
                field: "reviewLinkName",
                newValue,
              });
              setEditingName(false);
            }}
            onCancel={() => setEditingName(false)}
            renderValue={
              <p className="text-gray-700">
                {reviewLinkSettings?.reviewLinkName}
              </p>
            }
          />
        )}

        {/* Editable URL Field */}
        <EditableField
          isEditing={editingSlug}
          value={reviewLinkSettings?.reviewLinkSlug}
          onEdit={() => setEditingSlug(true)}
          onSave={(newValue) => {
            handleUpdateReviewLinkSettings({
              review_link_slug: newValue,
            });
            updateReviewLinkSettingsContext({
              field: "reviewLinkSlug",
              newValue,
            });
            setEditingSlug(false);
          }}
          onCancel={() => setEditingSlug(false)}
          renderValue={
            <p>
              {DEFAULT_TEXTS.reviewSiteBaseUrl}
              <span className="text-black">
                {reviewLinkSettings?.reviewLinkSlug}
              </span>
            </p>
          }
        />

        {/* Editable Home Title Field */}
        <div className="flex flex-col gap-5 items-start w-full">
          <div className="flex items-center gap-1 w-full">
            <EditableField
              isEditing={editingHomeTitle}
              value={reviewLinkSettings?.title}
              onEdit={() => setEditingHomeTitle(true)}
              onSave={(newValue) => {
                handleUpdateReviewLinkSettings({
                  review_link_home_title: newValue,
                });
                updateReviewLinkSettingsContext({ field: "title", newValue });
                setEditingHomeTitle(false);
              }}
              onCancel={() => setEditingHomeTitle(false)}
              renderValue={<p>{reviewLinkSettings?.title}</p>}
            />
          </div>
        </div>

        {/* Skip First Page Toggle */}
        <div className="flex flex-col gap-5 items-start w-full">
          <div className="flex items-center gap-4 font-semibold">
            <span>Skip first page and go to positive page</span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="skip-page-toggle">
                {reviewLinkSettings?.isSkipFirstPageEnabled
                  ? "Enable"
                  : "Disable"}
              </Label>
              <Switch
                id="skip-page-toggle"
                checked={reviewLinkSettings?.isSkipFirstPageEnabled}
                onCheckedChange={(checked) => {
                  handleUpdateReviewLinkSettings({
                    skip_first_page_enabled: checked,
                  });
                  updateReviewLinkSettingsContext({
                    field: "isSkipFirstPageEnabled",
                    newValue: checked,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <span>If stars bigger than</span>
            <Select
              onValueChange={(newValue) => {
                updateReviewLinkSettingsContext({
                  field: "ratingThresholdCount",
                  newValue: Number(newValue),
                });
                handleUpdateReviewLinkSettings({
                  rating_threshold_count: newValue,
                });
              }}
              value={reviewLinkSettings?.ratingThresholdCount.toString()}
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
                {reviewLinkSettings?.isPoweredByEnabled ? "Enable" : "Disable"}
              </Label>
              <Switch
                id="powered-by-toggle"
                checked={reviewLinkSettings?.isPoweredByEnabled}
                onCheckedChange={(checked) => {
                  handleUpdateReviewLinkSettings({
                    powered_by_enabled: checked,
                  });
                  updateReviewLinkSettingsContext({
                    field: "isPoweredByEnabled",
                    newValue: checked,
                  });
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
                onChange={uploadBgImage}
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
        <p className="max-w-80 text-center mx-auto text-base font-normal text-gray-800">
          {reviewLinkSettings?.title}
        </p>
        <div className="flex gap-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={`w-8 h-8 text-gray-800`} />
          ))}
        </div>
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
}
