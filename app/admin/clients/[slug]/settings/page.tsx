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
import { useEffect, useState } from "react";
import { SelectGroup } from "@radix-ui/react-select";
import { useToast } from "@/hooks/use-toast";
import {
  getSlug,
  handleImageUpload,
  uploadFileToSupabase,
} from "@/lib/utils";
import { updateIndividualAttributes } from "@/app/admin/action";
import { useClients } from "@/app/context/clients-context";
import { TbCameraPlus } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import EditableField from "@/components/editable";
import { useRouter } from "next/navigation";

export default function Page() {
  const { selectedClient, setSelectedClient, clients, setClients } =
    useClients();
  const { toast } = useToast();

  const [editingName, setEditingName] = useState(false);
  const [editingType, setEditingType] = useState(false);
  const [editingLogo, setEditingLogo] = useState(false);


  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { base64, file, error } = await handleImageUpload(event);
    if (!error && file) {
      setSelectedClient((prev: any) => ({
        ...prev,
        logo: base64,
      }));
      setEditingLogo(false);
      const { error, fileUrl } = await uploadFileToSupabase("clients", file);
      if (!error) {
        handleUpdateClient({ client_logo: fileUrl });
        updateClientState("logo", fileUrl);
      } else {
        toast({
          title: `Error in uploading client logo, please try again later`,
        });
      }
    }
  };

  const router = useRouter();

  const handleUpdateClient = async (updateInfo: any) => {
    if (!selectedClient?.id) {
      return;
    }

    const response = await updateIndividualAttributes("clients", updateInfo, {
      col: "id",
      val: selectedClient?.id,
    });
    const { error } = JSON.parse(response);

    if (!error) {
      toast({ description: "Field updated" });
      if("client_slug" in updateInfo){
       setTimeout(() => {
        // window.location.reload();
        router.push(`/admin/clients/${updateInfo['client_slug']}/settings`);
       }, 1000);
      }
    }
  };

  const updateClientState = (field: string, value: string) => {
    setSelectedClient((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === selectedClient?.id
          ? {
            ...selectedClient,
            [field]: value,
          }
          : client
      )
    );
  };


  return (
    <div className="flex-1 space-y-6 p-8 px-0">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Active</span>
          <Switch
            checked={selectedClient?.status === "ACTIVE"}
            onCheckedChange={(checked) => {
              handleUpdateClient({
                client_status: checked ? "ACTIVE" : "INACTIVE",
              });
              updateClientState("status", checked ? "ACTIVE" : "INACTIVE");
            }}
          />
        </div>

        <div className="space-y-6 max-w-[500px]">
          <EditableField
            isEditing={editingName}
            value={selectedClient?.name ?? ""}
            onEdit={() => setEditingName(true)}
            onSave={(newValue) => {
              handleUpdateClient({
                client_name: newValue,
                client_slug: getSlug(newValue),
              });
              setEditingName(false);
              updateClientState("name", newValue);
            }}
            onCancel={() => setEditingName(false)}
            renderValue={<p>{selectedClient?.name}</p>}
          />

          <div className="flex items-center">
            <Select
              disabled={!editingType}
              onValueChange={(newValue) => {
                handleUpdateClient({ client_type: newValue });
                setSelectedClient((prev: any) => ({
                  ...prev,
                  type: newValue,
                }));
                updateClientState("type", newValue);
              }}
              value={selectedClient?.type}
            >
              <SelectTrigger className="h-12 mt-2 w-full sm:w-64">
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
                className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold flex items-center text-sm"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className=" table">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-gray-500">Client logo</span>
                <Button
                  onClick={() => setEditingLogo(!editingLogo)}
                  variant="ghost"
                  size="sm"
                  className="text-[#36B37E] hover:bg-[#36B37E] hover:text-white font-bold flex items-center text-sm"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
              {!editingLogo && (
                <div className="block mt-5">
                  {selectedClient?.logo ? (
                    <Image
                      src={selectedClient.logo}
                      alt="Client Logo"
                      width={100}
                      height={100}
                      className="h-[100px] w-[200px] object-contain"
                    />
                  ) : (
                    <p>No Logo Uploaded</p>
                  )}
                </div>
              )}
              {editingLogo && (
                <div className="flex mt-5 justify-between items-center border border-dashed border-gray-200 rounded-full w-[145px] h-[145px] p-2 relative">
                  <label
                    htmlFor="imageUpload"
                    className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center flex-col text-sm text-gray-500 gap-2 cursor-pointer"
                  >
                    <TbCameraPlus className="text-lg" />{" "}
                    {selectedClient?.logo ? "Change logo" : "Upload logo"}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
