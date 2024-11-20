"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CampLogo from "@/app/images/logo-12.png";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import useSWR from "swr";
import { mapClients } from "@/mappers";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter, fetcher, getSlug } from "@/lib/utils";
import { deleteClient } from "./action";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Client } from "@/interfaces/clients";
import { useClients } from "@/app/context/clients-context";
import { useSelectedClient } from "@/app/context/selected-client-context";

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-[#def4e9] text-[#1a806a]";
    case "INACTIVE":
      return "bg-yellow-100 text-yellow-800";
  }
};

const ClientTable: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  // const [clients, setClients] = useState<Client[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { setSelectedClient } = useSelectedClient();

  const { clients, setClients } = useClients();

  const filteredClients = clients?.filter((client) => {
    const matchesType = typeFilter === "All" || client.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || client.status === statusFilter;
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleSelectClient: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    const clientId = event.currentTarget.getAttribute("data-client-id");
    const [selectedClient] = clients.filter(
      (client) => client?.id === Number(clientId)
    );
    setSelectedClient(selectedClient);
    const slug = getSlug(selectedClient?.name);
    if (slug) {
      router.push(`/admin/clients/${slug}/review-link`);
    }
  };

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    const clientId = event.currentTarget.getAttribute("data-client-id");

    toast({
      title: "Are you sure you want to delete?",
      description: "This action cannot be undone.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Delete"
          onClick={() => confirmDelete(Number(clientId))}
        >
          Delete
        </ToastAction>
      ),
      duration: 5000, // 5 seconds
    });
  };

  const confirmDelete = async (clientId: number) => {
    const response = await deleteClient(clientId);
    const { error } = JSON.parse(response);
    if (!error) {
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
      toast({ description: "Client deleted successfully." });
    } else {
      toast({ description: "Some error occured in deleting the client." });
    }
  };

  return (
    <>
      <Link
        href={"/admin/clients/add"}
        className="bg-[#00AB55] text-white text-sm px-4 rounded-lg hover:bg-gray-800 py-2 ml-auto table font-bold mb-8 -mt-12"
      >
        New Client
      </Link>

      <div className="bg-white rounded-lg shadow-lg mb-5">
        <div className="px-6 pt-6 flex justify-between items-center mb-4 gap-4">
          <div className="w-1/5">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                <SelectItem value="NIGHTCLUB">Nightclub</SelectItem>
                <SelectItem value="SPA">Spa</SelectItem>
                <SelectItem value="SALON">Salon</SelectItem>
                <SelectItem value="MASSAGE">Massage</SelectItem>
                <SelectItem value="CLINIC">Clinic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/5">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow relative">
            <IoSearch className="absolute left-3 top-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-8"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 text-[#637381]">
              <TableHead className="pl-20 py-5">Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Nr of Links</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-52">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients?.slice(0, rowsPerPage)?.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="flex items-center pl-4 gap-3">
                  <div className="w-[52px] h-[52px] bg-gray-100 rounded-sm flex items-center justify-center p-2">
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={40}
                      height={40}
                    />
                  </div>
                  {client.name}
                </TableCell>
                <TableCell>{capitalizeFirstLetter(client.type)}</TableCell>
                <TableCell>{format(client.createdAt, "dd MMM yyyy")}</TableCell>
                <TableCell>{client.nrOfLinks}</TableCell>
                <TableCell>
                  <Badge
                    className={`!bottom-0 !shadow-none pointer-events-none ${getStatusColor(
                      client.status
                    )}`}
                  >
                    {capitalizeFirstLetter(client.status)}
                  </Badge>
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center gap-3">
                    <Button
                      data-client-id={client?.id}
                      onClick={handleSelectClient}
                      variant="ghost"
                      size="sm"
                      className="bg-[#9edcc0] text-[#027b55] px-3 h-6 font-bold !bottom-0 !shadow-none"
                    >
                      Go to client
                    </Button>
                    <Button
                      data-client-id={client?.id}
                      onClick={handleDelete}
                      variant="ghost"
                      size="sm"
                      className="bg-[#ff5631] text-white px-3 h-6 font-bold !bottom-0 !shadow-none"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-3 border-t border-gray-200 items-center p-4">
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <p>
            {`Showing ${Math.min(rowsPerPage, filteredClients?.length)} of ${
              filteredClients?.length
            }`}
          </p>
        </div>
      </div>
    </>
  );
};

export default ClientTable;
