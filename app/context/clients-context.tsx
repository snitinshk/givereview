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

interface ClientsContextProps {
  clients: Client[];
  setClients: Dispatch<SetStateAction<Client[]>>;
}

// Create the context
const ClientsContext = createContext<ClientsContextProps | undefined>(
  undefined
);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { setIsLoading } = useLoader();
  useEffect(() => {
    if(!clients?.length){
      fetchClients();
    }
  }, [clients?.length]);

  const fetchClients = async()=>{
    setIsLoading(true)
    const clientsList = await fetcher("/api/admin/clients");
    setIsLoading(false)
    const mappedClients = mapClients(clientsList);
    setClients(mappedClients);
  }

  return (
    <ClientsContext.Provider value={{ clients, setClients }}>
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
