import { useState } from 'react';
import { MdEdit } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CheckIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditableField = ({
  isEditing,
  value,
  onEdit,
  onSave,
  onCancel,
  renderValue,
}: {
  isEditing: boolean;
  value: string;
  onEdit: () => void;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  renderValue: JSX.Element;
}) => {
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
  };

  return (
    <>
      {!isEditing ? (
        <div className='flex items-center'>
          {renderValue}
          <Button
            variant="ghost"
            className="text-green-600 font-semibold flex items-center"
            onClick={onEdit}
          >
            <MdEdit className="mr-1" /> Edit
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <Button
            variant="ghost"
            className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold flex items-center"
            onClick={handleSave}
          >
            <CheckIcon className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button
            variant="ghost"
            className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold flex items-center"
            onClick={onCancel}
          >
            <XIcon className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SettingTabs: React.FC = (params) => {
  const { slug } = useParams();

  const [isActive, setIsActive] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("For website");

  const [editingUrl, setEditingUrl] = useState(false);
  const [baseUrl] = useState("https://placereview.se/");
  const [urlSegment, setUrlSegment] = useState(slug);


  const [isSkipPageEnabled, setIsSkipPageEnabled] = useState(false);
  const [starsThreshold, setStarsThreshold] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [experienceText, setExperienceText] = useState(slug);
  const [tempExperienceText, setTempExperienceText] = useState(experienceText);

  const handleSaveExperience = () => {
    setExperienceText(tempExperienceText);
    setIsEditingExperience(false);
  };

  const handleCancelExperience = () => {
    setTempExperienceText(experienceText);
    setIsEditingExperience(false);
  };


  return (
    <div className="flex flex-col gap-5 items-start">
      {/* Active/Inactive Switch */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="active-toggle">{isActive ? "Active" : "Inactive"}</Label>
        <Switch
          id="active-toggle"
          checked={isActive}
          onCheckedChange={() => setIsActive(!isActive)}
        />
      </div>

      {/* Editable Name Field */}
      <EditableField
        isEditing={editingName}
        value={name}
        onEdit={() => setEditingName(true)}
        onSave={(newValue) => {
          setName(newValue);
          setEditingName(false);
        }}
        onCancel={() => setEditingName(false)}
        renderValue={<p className="text-gray-700">{name}</p>}
      />

      {/* Editable URL Field */}
      <EditableField
        isEditing={editingUrl}
        value={urlSegment}
        onEdit={() => setEditingUrl(true)}
        onSave={(newValue) => {
          setUrlSegment(newValue);
          setEditingUrl(false);
        }}
        onCancel={() => setEditingUrl(false)}
        renderValue={
          <p>
            {baseUrl}
            <span className="text-black">{urlSegment}</span>
          </p>
        }
      />
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-1">
          {!isEditingExperience ? (
            <>
              <p>How was your experience with {experienceText}?</p>
              <Button
                variant="ghost"
                className="text-green-600 font-semibold flex items-center"
                onClick={() => setIsEditingExperience(true)}
              >
                <MdEdit className="mr-1" /> Edit
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                value={tempExperienceText}
                onChange={(e) => setTempExperienceText(e.target.value)}
                className="w-40"
                autoFocus
              />
              <Button
                variant="ghost"
                className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold flex items-center"
                onClick={handleSaveExperience}
              >
                <CheckIcon className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button
                variant="ghost"
                className="text-[#FF5630] hover:bg-[#FF5630] hover:text-white font-bold flex items-center"
                onClick={handleCancelExperience}
              >
                <XIcon className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 items-start">
        {/* Skip First Page Toggle */}
        <div className="flex items-center gap-4 font-semibold">
          <span>Skip first page and go to positive page</span>
          <div className="flex items-center space-x-2">
            <Label htmlFor="skip-page-toggle">{isSkipPageEnabled ? "Enable" : "Disable"}</Label>
            <Switch
              id="skip-page-toggle"
              checked={isSkipPageEnabled}
              onCheckedChange={(checked) => setIsSkipPageEnabled(checked)}
            />
          </div>
        </div>

        {isSkipPageEnabled && (
          <div className="flex items-center gap-4 font-semibold">
            <span>If stars bigger than</span>
            <Select
              onValueChange={(value) => setStarsThreshold(value)}
              value={starsThreshold}
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
        )}
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
            </Button>) : ('')}
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
};

export default SettingTabs;
