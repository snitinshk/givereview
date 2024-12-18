"use client";

import { Client } from "@/interfaces/clients";
import { fetcher } from "@/lib/utils";
import { mapClients } from "@/mappers/index-mapper";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import useSWR from "swr";
import { useLoader } from "./loader.context";
import { useParams } from "next/navigation";

interface ClientsContextProps {
  clients: Client[];
  setClients: Dispatch<SetStateAction<Client[]>>;
  selectedClient: Client | null;
  setSelectedClient: Dispatch<SetStateAction<Client | null>>;
}

// Create the context
const ClientsContext = createContext<ClientsContextProps | undefined>(
  undefined
);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { slug } = useParams();
  const { setIsLoading } = useLoader();
  useEffect(() => {
    if (!clients?.length) {
      fetchClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients?.length]);

  const fetchClients = async () => {
    setIsLoading(true);
    const clientsList = await fetcher("/api/admin/clients");
    setIsLoading(false);
    const mappedClients = mapClients(clientsList);
    const selectedClient = mappedClients?.find(
      (client) => client.slug === slug
    );
    if (selectedClient) setSelectedClient(selectedClient);
    setClients(mappedClients);
  };

  // const { slug } = useParams();
  // const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // const { clients } = useClients();

  // console.log(clients);

  // useEffect(() => {
  //   const selectedClient = clients?.find((client) => client.slug === slug);
  //   if(selectedClient) setSelectedClient(selectedClient);
  // }, [clients]);

  return (
    <ClientsContext.Provider
      value={{ clients, setClients, selectedClient, setSelectedClient }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useClients = (): ClientsContextProps => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within an ClientsProvider");
  }
  return context;
};
