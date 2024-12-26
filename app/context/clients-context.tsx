"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useParams } from "next/navigation";
import { Client } from "@/interfaces/clients";
import { fetcher } from "@/lib/utils";
import { mapClients } from "@/mappers/index-mapper";
import { useLoader } from "./loader.context";

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
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const clientsList = await fetcher("/api/admin/clients");
        const mappedClients = mapClients(clientsList);

        setClients(mappedClients);

        const matchingClient = mappedClients.find(
          (client) => client.slug === slug
        );
        if (matchingClient) {
          setSelectedClient(matchingClient);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (clients.length === 0) {
      fetchClients();
    }
  }, [clients.length, slug, setIsLoading]);

  return (
    <ClientsContext.Provider
      value={{ clients, setClients, selectedClient, setSelectedClient }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

// Custom hook for consuming the clients context
export const useClients = (): ClientsContextProps => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};