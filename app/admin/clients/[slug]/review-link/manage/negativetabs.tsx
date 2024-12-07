import Image from "next/image";
import GLGIMG from "@/app/images/google.svg";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { FaStar } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditableField from "./editable";
import { useEffect, useRef, useState } from "react";
import { UploadIcon } from "lucide-react";
import { useReviewLinkNegative } from "@/app/context/review-link-negative.context";
import { updateReviewLink } from "../action";
import { useToast } from "@/hooks/use-toast";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";

const NegativeTabs: React.FC = () => {
  const { reviewLinkNegative, setReviewLinkNegative } = useReviewLinkNegative();
  
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

        const imageUrl = await uploadReviewLinkImage(uploadedFile);

        handleUpdateReviewLink({
          channel_logo: {
            ...defaultChannel,
            logo: imageUrl,
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
    console.log(updateInfo);
    const response = await updateReviewLink(
      "negative_review_link_details",
      updateInfo,
      {
        col: "id",
        val: reviewLinkNegative?.negativeRLId,
      }
    );
    const { error } = JSON.parse(response);
    console.log(error);
    if (!error) {
      toast({
        description: "Field updated",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center w-80 max-w-full gap-3">
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

      <div className="flex flex-col gap-5 max-w-xl">
        <div className="flex items-center max-w-full gap-2">
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
                reviewDesc: newValue,
              });
              setIsEditingDesc(false);
            },
            () => setIsEditingDesc(false)
          )}
        </div>
      </div>

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
                    <FaStar className="text-3xl" key={starIndex} />
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
              className="h-12 shadow-none max-w-80"
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

      {textareaCategories?.map(
        (
          textarea: { placeholder: string; dbField: string; enabled: boolean },
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
  );
};

export default NegativeTabs;
