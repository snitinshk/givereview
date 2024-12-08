"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Pencil } from "lucide-react";
import Image from "next/image";
import EditableField from "../review-link/editable";
import { useEffect, useState } from "react";
import { SelectGroup } from "@radix-ui/react-select";
import { useSelectedClient } from "@/app/context/selected-client-context";
import { updateClient } from "../../action";
import { useToast } from "@/hooks/use-toast";
import { getFileName, mediaUrl, uploadFile } from "@/lib/utils";

export default function Page() {
  const { selectedClient, setSelectedClient } = useSelectedClient();
  const { toast } = useToast();
  const [clientName, setClientName] = useState(selectedClient?.name);
  const [clientType, setClientType] = useState(selectedClient?.type);
  const [clientLogo, setClientLogo] = useState(selectedClient?.logo);
  const [isActive, setIsActive] = useState(selectedClient?.status === "ACTIVE");
  const [editingName, setEditingName] = useState(false);
  const [editingType, setEditingType] = useState(false);
  const [editingLogo, setEditingLogo] = useState(false);

  useEffect(() => {
    console.log(selectedClient);

    setClientName(selectedClient?.name);
    setClientType(selectedClient?.type);
    setClientLogo(selectedClient?.logo);
    setIsActive(selectedClient?.status === "ACTIVE");
  }, [selectedClient]);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setClientLogo(base64);
      };
      reader.readAsDataURL(file);

      const uploadPath = `clients/${getFileName(file as File)}`;
      const { data: uploadData, error: uploadError } = await uploadFile(
        file as File,
        uploadPath
      );
  
      if (uploadError) {
        toast({
          description: `Error in uploading client logo, please try again later`,
        });
      }
      const clientLogoUrl = mediaUrl(uploadData?.fullPath as string);
      handleUpdateClient({
        client_logo: clientLogoUrl
      })
    }
  };

  const handleUpdateClient = async (updateInfo: any) => {
    if (!selectedClient?.id) {
      return;
    }

    const response = await updateClient(updateInfo, {
      col: "id",
      val: selectedClient?.id,
    });
    const { error } = JSON.parse(response);

    if (!error) {
      toast({
        description: "Field updated",
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">Active</span>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => {
              setIsActive(!isActive);
              handleUpdateClient({
                client_status: checked ? "ACTIVE" : "INACTIVE",
              });
            }}
          />
        </div>

        <div className="space-y-2">
          <EditableField
            isEditing={editingName}
            value={clientName ?? ""}
            onEdit={() => setEditingName(true)}
            onSave={(newValue) => {
              setClientName(newValue);
              setEditingName(false);
              handleUpdateClient({
                client_name: newValue,
              });
            }}
            onCancel={() => setEditingName(false)}
            renderValue={<p>{clientName}</p>}
          />

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <span>Restaurant</span>
            </div>
            <Select
              disabled={!editingType}
              onValueChange={(newValue) => {
                setClientType(newValue);
                handleUpdateClient({
                  client_type: newValue,
                });
              }}
              value={clientType}
            >
              <SelectTrigger className="h-12 ml-2 mt-2 w-full sm:w-64">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                  <SelectItem value="NIGHTCLUB">Nightclub</SelectItem>
                  <SelectItem value="SPA">Spa</SelectItem>
                  <SelectItem value="SALON">Salon</SelectItem>
                  <SelectItem value="MASSAGE">Massage</SelectItem>
                  <SelectItem value="CLINIC">Clinic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {!editingType && (
              <Button
                onClick={() => setEditingType(true)}
                variant="ghost"
                size="sm"
                className="text-green-500"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Client logo</span>
              <Button
                onClick={() => setEditingLogo(!editingLogo)}
                variant="ghost"
                size="sm"
                className="text-green-500"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="flex justify-center rounded-lg border-2 border-dashed p-8">
              {clientLogo ? (
                <Image
                  src={clientLogo}
                  alt="Client Logo"
                  width={100}
                  height={100}
                  className="h-[100px] w-[200px] object-contain"
                />
              ) : (
                <p>No Logo Uploaded</p>
              )}
            </div>
            {editingLogo && (
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}