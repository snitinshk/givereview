import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FaStar } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Heart, Star, UploadIcon } from "lucide-react";
import { useReviewLinkNegative } from "@/app/context/review-link-negative.context";
import { updateReviewLink } from "../action";
import { useToast } from "@/hooks/use-toast";
import {
  getFileName,
  mediaUrl,
  uploadFile,
  uploadFileToSupabase,
} from "@/lib/utils";
import PlaceholderImage from "@/app/images/placeholder-image.svg";
import { useClients } from "@/app/context/clients-context";
import EditableField from "@/components/editable";
import { updateIndividualAttributes } from "@/app/admin/action";
import { useReviewLinkSettings } from "@/app/context/review-link-settings.context";


const NegativeTabs: React.FC = () => {
  const { reviewLinkNegative, setReviewLinkNegative } = useReviewLinkNegative();
  const { reviewLinkSettings } = useReviewLinkSettings();
  const { selectedClient } = useClients();

  const { toast } = useToast();
  const [ratingCategories, setRatingCategories] = useState(
    reviewLinkNegative?.ratingCategories
  );

  useEffect(() => {
    setDefaultChannel(reviewLinkNegative?.defaultChannel);
    setRatingCategories(reviewLinkNegative?.ratingCategories);
    setInputCategories(reviewLinkNegative?.inputCategories);
    setTextareaCategories(reviewLinkNegative?.textareaCategories);
    settitle(reviewLinkNegative?.title);
    setReviewDesc(reviewLinkNegative?.negativePageDescription);
  }, [reviewLinkNegative]);

  const [inputCategories, setInputCategories] = useState(
    reviewLinkNegative?.inputCategories
  );

  const [textareaCategories, setTextareaCategories] = useState(
    reviewLinkNegative?.textareaCategories
  );

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [reviewDesc, setReviewDesc] = useState(
    reviewLinkNegative?.negativePageDescription
  );

  const [isEditingPageTitle, setIsEditingPageTitle] = useState(false);
  const [title, settitle] = useState(reviewLinkNegative?.title);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [defaultChannel, setDefaultChannel] = useState(
    reviewLinkNegative?.defaultChannel
  );

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode when clicking "Edit"
  };

  const handleNewLogoUpload = async () => {
    if (fileInputRef.current?.files) {
      const uploadedFile = fileInputRef.current.files[0];

      if (uploadedFile) {
        const previewUrl = URL.createObjectURL(uploadedFile);

        setReviewLinkNegative({
          ...reviewLinkNegative,
          uploadedFile,
          previewUrl,
        });

        if (!reviewLinkNegative?.reviewLinkId) {
          return;
        }

        const { error, fileUrl } = await uploadFileToSupabase(
          "reviewlinks",
          uploadedFile
        );

        if (error) {
          toast({
            title: "Error in uploading channel logo, please try again later.",
          });

          return;
        }

        handleUpdateReviewLink({
          channel_logo: {
            ...defaultChannel,
            logo: fileUrl,
          },
        });
      }
    }
  };

  const uploadReviewLinkImage = async (file: File) => {
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

  const renderEditableField = (
    isEditing: boolean,
    value: string,
    onEdit: () => void,
    onSave: (newValue: string) => void,
    onCancel: () => void
  ) => (
    <EditableField
      isEditing={isEditing}
      value={value}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      renderValue={<span>{value}</span>}
    />
  );

  const updateInputCategories = (name: string, enabled: boolean) => {
    setReviewLinkNegative((prevState: any) => ({
      ...prevState,
      inputCategories: prevState.inputCategories.map((input: any) =>
        input.placeholder === name ? { ...input, enabled } : input
      ),
    }));
  };

  const updateTextareaCategories = (name: string, enabled: boolean) => {
    setReviewLinkNegative((prevState: any) => ({
      ...prevState,
      textareaCategories: prevState.textareaCategories.map((input: any) =>
        input.placeholder === name ? { ...input, enabled } : input
      ),
    }));
  };

  const updateRatingCategories = (name: string, enabled: boolean) => {
    setReviewLinkNegative((prevState: any) => ({
      ...prevState,
      ratingCategories: prevState.ratingCategories.map((category: any) =>
        category.name === name ? { ...category, enabled } : category
      ),
    }));
  };

  const handleUpdateReviewLink = async (updateInfo: any) => {
    // do nothing for add case;
    if (!reviewLinkNegative?.negativeRLId) {
      return;
    }

    const condition = {
      col: "id",
      val: reviewLinkNegative?.negativeRLId,
    };

    const response = await updateIndividualAttributes(
      "negative_review_link_details",
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

  const enabledRatingCategories = ratingCategories.filter(
    (category: { enabled: any }) => category.enabled
  );

  const enabledInputCategories = inputCategories.filter(
    (input: { enabled: any }) => input.enabled
  );

  const enabledTextareaCategories = textareaCategories.filter(
    (textarea: { enabled: any }) => textarea.enabled
  );

  return (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col gap-5 w-full md:w-1/2">
        {/* Channel Logo Section */}
        <div className="flex items-center w-full sm:w-80 max-w-full gap-3">
          <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-md p-1">
            <Image
              src={reviewLinkNegative?.previewUrl || defaultChannel?.logo}
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
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              className="text-green-600 font-semibold"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
          <Switch
            checked={defaultChannel?.enabled}
            onCheckedChange={async () => {
              setReviewLinkNegative((prevState: any) => ({
                ...prevState,
                defaultChannel: {
                  ...prevState.defaultChannel,
                  enabled: !defaultChannel.enabled,
                },
              }));
              handleUpdateReviewLink({
                channel_logo: {
                  ...defaultChannel,
                  enabled: !defaultChannel.enabled,
                },
              });
            }}
            id="lgshow"
          />
        </div>

        {/* Title and Description Section */}
        <div className="flex flex-col gap-5 max-w-full sm:max-w-xl">
          <div className="flex items-center w-full gap-2">
            <div
              className={`flex items-center gap-2 ${
                isEditingPageTitle ? "flex-grow" : ""
              }`}
            >
              {renderEditableField(
                isEditingPageTitle,
                title?.title,
                () => setIsEditingPageTitle(true),
                (newValue) => {
                  setReviewLinkNegative((prevState: any) => ({
                    ...prevState,
                    title: {
                      ...prevState.title,
                      title: newValue,
                    },
                  }));
                  handleUpdateReviewLink({
                    negative_page_title: {
                      ...title,
                      title: newValue,
                    },
                  });

                  setIsEditingPageTitle(false);
                },
                () => setIsEditingPageTitle(false)
              )}
            </div>
            <Switch
              id="apshow"
              checked={title?.enabled}
              onCheckedChange={() => {
                setReviewLinkNegative((prevState: any) => ({
                  ...prevState,
                  title: {
                    ...prevState.title,
                    enabled: !title?.enabled,
                  },
                }));

                handleUpdateReviewLink({
                  negative_page_title: {
                    ...title,
                    enabled: !title?.enabled,
                  },
                });
              }}
            />
          </div>

          <div className="flex items-start mb-20">
            {renderEditableField(
              isEditingDesc,
              reviewDesc,
              () => setIsEditingDesc(true),
              (newValue) => {
                setReviewLinkNegative((prevState: any) => ({
                  ...prevState,
                  negativePageDescription: newValue,
                }));
                handleUpdateReviewLink({
                  negative_page_description: newValue,
                });
                setIsEditingDesc(false);
              },
              () => setIsEditingDesc(false)
            )}
          </div>
        </div>

        {/* Rating Categories Section */}
        <div className="flex flex-col gap-5 mb-16">
          {ratingCategories?.map(
            (
              category: { name: string; dbField: string; enabled: boolean },
              index: number
            ) => (
              <div className="flex gap-8 items-center" key={index}>
                <p className="w-28">{category?.name}</p>
                <div className="flex gap-2 text-gray-300">
                  {Array(5)
                    .fill(null)
                    .map((_, starIndex) => (
                      <FaStar
                        className="text-3xl max-md:text-xl"
                        key={starIndex}
                      />
                    ))}
                </div>
                <Switch
                  checked={category?.enabled}
                  onCheckedChange={() => {
                    updateRatingCategories(category?.name, !category?.enabled);
                    handleUpdateReviewLink({
                      [category.dbField]: !category?.enabled,
                    });
                  }}
                  id={`${category?.name?.toLowerCase()}-switch`}
                  className="m-0"
                />
              </div>
            )
          )}
        </div>

        {/* Input Categories Section */}
        {inputCategories?.map(
          (
            input: {
              placeholder: string;
              dbField: string;
              type: string;
              enabled: boolean;
            },
            index: number
          ) => (
            <div className="flex items-center gap-4" key={index}>
              <Input
                disabled={true}
                type={input?.type}
                placeholder={input?.placeholder}
                className="h-12 shadow-none max-w-xs sm:max-w-md"
              />
              <Switch
                checked={input?.enabled}
                onCheckedChange={() => {
                  updateInputCategories(input?.placeholder, !input?.enabled);
                  handleUpdateReviewLink({
                    [input.dbField]: !input?.enabled,
                  });
                }}
                id={`${input?.placeholder
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-switch`}
                className="m-0"
              />
            </div>
          )
        )}

        {/* Textarea Categories Section */}
        {textareaCategories?.map(
          (
            textarea: {
              placeholder: string;
              dbField: string;
              enabled: boolean;
            },
            index: number
          ) => (
            <div className="flex items-center gap-4" key={index}>
              <Textarea
                disabled={true}
                placeholder={textarea.placeholder}
                className="max-w-md h-20 resize-none"
              />
              <Switch
                checked={textarea?.enabled}
                onCheckedChange={() => {
                  updateTextareaCategories(
                    textarea?.placeholder,
                    !textarea?.enabled
                  );
                  handleUpdateReviewLink({
                    [textarea.dbField]: !textarea?.enabled,
                  });
                }}
                id={`${textarea.placeholder
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-switch`}
                className="m-0"
              />
            </div>
          )
        )}
      </div>

      {/* Preview Section */}

      <div className="w-full relative pb-12 md:w-[calc(50%-50px)] min-h-[550px] bg-[#FFFAFA] border border-[#F2DDDD] rounded-3xl flex items-center justify-start p-11 flex-col gap-10 max-md:px-6">
        {selectedClient?.logo && (
          <Image
            src={selectedClient?.logo || PlaceholderImage}
            alt={`Preview Image`}
            width={145}
            height={145}
          />
        )}
        <p className="max-w-[395px] text-center mx-auto font-MOSTR font-light text-gray-700 text-base">
          {reviewDesc}
        </p>

        <div className="flex items-center gap-3 font-MOSTR font-light text-black text-base -ml-40 max-md:-ml-6">
          {defaultChannel?.enabled && (
            <Image
              src={reviewLinkNegative?.previewUrl || defaultChannel?.logo}
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          )}
          {title?.enabled && <span className="text-sm">{title?.title}</span>}
        </div>
        <div className="flex flex-col gap-8 w-96 max-md:w-full">
          <div className="space-y-1 max-w-80 w-full">
            {enabledRatingCategories.map((category: any) => (
              <div
                key={category.name}
                className="flex items-center justify-between py-2 w-full"
              >
                <span className="text-base text-gray-700 font-medium font-MOSTR">
                  {category.name}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`${category.name}-${star}`}
                      className="w-6 h-6 cursor-pointer transition-colors text-gray-700"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 max-w-96 w-full">
            {enabledInputCategories.map((input: any) => (
              <div key={input.placeholder}>
                <Input
                  placeholder={input.placeholder}
                  className="border-gray-300 max-w-80 h-12 bg-white font-MOSTR"
                  aria-invalid="false"
                  disabled={true}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4 max-w-96 w-full">
            {enabledTextareaCategories.map((textarea: any) => (
              <div key={textarea.placeholder}>
                <Textarea
                  placeholder={textarea.placeholder}
                  className="min-h-[100px] border-gray-300 resize-none bg-white font-MOSTR"
                  aria-invalid="false"
                  disabled={true}
                />
              </div>
            ))}
          </div>
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
};

export default NegativeTabs;
