import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@radix-ui/react-icons";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { MdEdit } from "react-icons/md";

export default function EditableField ({
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
  }) {
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
  