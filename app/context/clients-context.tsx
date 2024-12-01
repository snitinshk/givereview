"use client";

import { Client, ClientDB } from "@/interfaces/clients";
import { fetcher } from "@/lib/utils";
import { mapClients } from "@/mappers";
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
  useEffect(() => {
    if(!clients?.length){
      fetchClients();
    }
  }, [clients?.length]);

  const fetchClients = async()=>{
    const clientsList = await fetcher("/api/admin/clients");
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
