import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CheckIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_TEXTS } from "@/constant";
import EditableField from "./editable";
import { useReviewLink } from "@/app/context/review-link-context";

interface Settings {
  reviewLinkName: string;
  reviewLinkSlug: string;
  homeReviewTitle: string;
  skipFirstPageEnabled: boolean;
  ratingThresholdCount: number;
  poweredByEnabled: boolean;
  desktopBgImage: string;
}

export default function SettingTabs({ disableSaveBtn }: any) {
  const { slug } = useParams();

  const { reviewLinkDetail, setReviewLinkDetail } = useReviewLink();

  const defaultSetting = {
    reviewLinkName: "",
    reviewLinkSlug: slug as string,
    homeReviewTitle: "",
    skipFirstPageEnabled: false,
    ratingThresholdCount: 4,
    poweredByEnabled: true,
    desktopBgImage: "",
  };

  const [settingData, setSettingData] = useState<Settings>(defaultSetting);

  // const [isActive, setIsActive] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File>();

  const [editingName, setEditingName] = useState(false);
  const [reviewLinkName, setReviewLinkName] = useState<string>(
    defaultSetting?.reviewLinkName
  );

  const [editingSlug, setEditingSlug] = useState(false);
  const [reviewLinkSlug, setReviewLinkSlug] = useState<string>(
    defaultSetting?.reviewLinkSlug
  );

  const [editingHomeTitle, setEditingHomeTitle] = useState(false);
  const [reviewLinkHomeTitle, setReviewLinkHomeTitle] = useState<string>(
    DEFAULT_TEXTS.homeReviewTitle + "" + settingData?.reviewLinkSlug
  );

  const [isSkipFirstPageEnabled, setIsSkipFirstPageEnabled] = useState(
    defaultSetting?.skipFirstPageEnabled
  );
  const [isPoweredByEnabled, setIsPoweredByEnabled] = useState(
    defaultSetting?.poweredByEnabled
  );

  const [starsThreshold, setStarsThreshold] = useState<number>(
    settingData?.ratingThresholdCount
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (reviewLinkName && imageFile) {
      disableSaveBtn(false);
    }

    if (
      !reviewLinkName ||
      !imageFile ||
      !reviewLinkSlug ||
      !reviewLinkHomeTitle
    ) {
      disableSaveBtn(true);
    }

    setReviewLinkDetail({
      ...reviewLinkDetail,
      reviewLinkName,
      reviewLinkSlug,
      starsThreshold,
      reviewLinkHomeTitle,
      isSkipFirstPageEnabled,
      imageFile,
      isPoweredByEnabled,
    });
  }, [
    reviewLinkName,
    reviewLinkSlug,
    reviewLinkHomeTitle,
    isSkipFirstPageEnabled,
    imageFile,
    starsThreshold,
    isPoweredByEnabled,
  ]);

  // const [isEditingExperience, setIsEditingExperience] = useState(false);
  // const [homeReviewTitle, setHomeReviewTitle] = useState(
  //   DEFAULT_TEXTS.homeReviewTitle
  // );
  // const [tempExperienceText, setTempExperienceText] = useState(
  //   DEFAULT_TEXTS.homeReviewTitle
  // );

  // const handleSaveExperience = () => {
  //   // setExperienceText(tempExperienceText);
  //   setIsEditingExperience(false);
  // };

  // const handleCancelExperience = () => {
  //   setTempExperienceText("experienceText");
  //   setIsEditingExperience(false);
  // };

  const editMode = false;

  return (
    <div className="flex flex-col gap-5 items-start">
      {/* Active/Inactive Switch */}
      {/* <div className="flex items-center space-x-2">
        <Label htmlFor="active-toggle">{isActive ? "Active" : "Inactive"}</Label>
        <Switch
          id="active-toggle"
          checked={isActive}
          onCheckedChange={() => setIsActive(!isActive)}
        />
      </div> */}

      {/* Editable Name Field */}

      {!editMode ? (
        <Input
          value={reviewLinkName}
          onChange={(e) => setReviewLinkName(e.target.value)}
          placeholder="name"
          className="w-50"
        />
      ) : (
        <EditableField
          isEditing={editingName}
          value=""
          onEdit={() => setEditingName(true)}
          onSave={(newValue) => {
            setReviewLinkName(newValue);
            // setEditingName(false);
          }}
          onCancel={() => setEditingName(false)}
          renderValue={
            <p className="text-gray-700">{settingData?.reviewLinkName}</p>
          }
        />
      )}

      {/* Editable URL Field */}
      <EditableField
        isEditing={editingSlug}
        value={reviewLinkSlug}
        onEdit={() => setEditingSlug(true)}
        onSave={(newValue) => {
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
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-1">
          <EditableField
            isEditing={editingHomeTitle}
            value={reviewLinkHomeTitle}
            onEdit={() => setEditingHomeTitle(true)}
            onSave={(newValue) => {
              setReviewLinkHomeTitle(newValue);
              setEditingHomeTitle(false);
            }}
            onCancel={() => setEditingHomeTitle(false)}
            renderValue={<p>{reviewLinkHomeTitle}</p>}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 items-start">
        {/* Skip First Page Toggle */}
        <div className="flex items-center gap-4 font-semibold">
          <span>Skip first page and go to positive page</span>
          <div className="flex items-center space-x-2">
            <Label htmlFor="skip-page-toggle">
              {isSkipFirstPageEnabled ? "Enable" : "Disable"}
            </Label>
            <Switch
              id="skip-page-toggle"
              checked={isSkipFirstPageEnabled}
              onCheckedChange={(checked) => setIsSkipFirstPageEnabled(checked)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 font-semibold">
          <span>If stars bigger than</span>
          <Select
            onValueChange={(value) => setStarsThreshold(Number(value))}
            value={starsThreshold.toString()}
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
        <div className="flex items-center gap-4">
          <span>
            <strong>Show</strong> Powered with love by place booster
          </span>
          <div className="flex items-center space-x-2">
            <Label htmlFor="skip-page-toggle">
              {isPoweredByEnabled ? "Enable" : "Disable"}
            </Label>
            <Switch
              id="skip-page-toggle"
              checked={isPoweredByEnabled}
              onCheckedChange={(checked) => setIsPoweredByEnabled(checked)}
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
          <div className="relative w-96 h-36">
            <Image
              src={imagePreview}
              alt="Preview"
              layout="fill"
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
    </div>
  );
}
