"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbCameraPlus } from "react-icons/tb";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import {
  fetcher,
  getFileName,
  getSlug,
  mediaUrl,
  uploadFile,
  uploadFileToSupabase,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addClient } from "../action";
import { useRouter } from "next/navigation";
import { mapClients } from "@/mappers/index-mapper";
import { useClients } from "@/app/context/clients-context";
import { useLoader } from "@/app/context/loader.context";
// import { IoMdInformationCircle } from "react-icons/io";

const CreateClient: React.FC = () => {
  const { setIsLoading } = useLoader();
  const [preview, setPreview] = useState<string | null>(null);
  const { setClients } = useClients();
  const router = useRouter();

  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>("");
  const [clientLogo, setClientLogo] = useState<File>();
  const [clientType, setClienType] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setClientLogo(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    
    event.preventDefault();

    if (!clientName || !clientType) {
      toast({
        description: `Fill all client detail and then submit form`,
      });
      return;
    }

    setIsLoading(true);

    let clientLogoUrl;

    if(clientLogo){
      const { error: uploadError, fileUrl } = await uploadFileToSupabase("clients", clientLogo);
      clientLogoUrl = fileUrl;
      if (uploadError) {
        toast({
          description: `Error in uploading client logo, please try again later`,
        });
      }
    }

    const newClientData = {
      client_name: clientName,
      client_logo: clientLogoUrl || '',
      client_type: clientType,
      client_slug: getSlug(clientName),
    };

    const response = await addClient(newClientData);

    const { error } = JSON.parse(response);

    if (error) {
      toast({
        title: "Error!",
        description: `Error in adding a new client, please try again later`,
      });
    } else {
      const clientsList = await fetcher("/api/admin/clients");

      setIsLoading(false);
      const mappedClients = mapClients(clientsList);
      setClients(mappedClients);

      toast({
        title: "Success!",
        description: `New client with name ${clientName} created successfully`,
      });

      router.push("/admin/clients");
    }
  };

  return (
    <>
      <div className="mb-8 -mt-12 ml-auto flex justify-end gap-5 max-sm:mt-0">
        <Button
          onClick={() => {
            router.back();
          }}
          className="bg-[#ffe4de] text-[#b71e17] hover:text-white font-bold"
        >
          Cancel
        </Button>
        <Button
          disabled={!clientName || !clientType}
          form="add-client"
          type="submit"
          className="bg-[#d6f2e4] text-[#027b55] hover:text-white font-bold"
        >
          Save
        </Button>
      </div>
      <div className="mb-5 p-5 px-0">
        <div className="max-w-80 space-y-4 flex flex-col">
          {/* <div className="flex items-center gap-3 bg-red-100 py-3 px-4 rounded-lg text-red-900 mb-4"><IoMdInformationCircle className="text-2xl text-red-500" /> Invalid email or password.</div> */}
          <form id="add-client" onSubmit={handleSubmit} className="space-y-8 flex flex-col">
            <Input
              value={clientName as string}
              onChange={(e) => setClientName(e.target.value)}
              type="text"
              placeholder="Client name"
              className="h-12"
            />

            <Select onValueChange={setClienType}>
              <SelectTrigger className="w-full h-12 mt-2">
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
            <div>
              <label className="text-sm text-gray-500 font-semibold">
                Logo
              </label>
              <div className="flex justify-between items-center border border-dashed border-gray-200 rounded-full w-[145px] h-[145px] p-2 relative">
                {preview ? (
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                    <Image
                      src={preview}
                      alt="Image Preview"
                      width={500}
                      height={500}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="imageUpload"
                    className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center flex-col text-sm text-gray-500 gap-2 cursor-pointer"
                  >
                    <TbCameraPlus className="text-lg" />{" "}
                    {preview ? "Change photo" : "Upload photo"}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                {preview && (
                  <Button
                    variant="ghost"
                    onClick={handleRemoveImage}
                    className="absolute -right-2 bottom-5 bg-red-400 h-auto p-1 text-white"
                  >
                    <IoMdClose />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateClient;