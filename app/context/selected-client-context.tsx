"use client";

import { Client } from "@/interfaces/clients";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useClients } from "./clients-context";
import { useParams } from "next/navigation";

interface ClientContextProps {
  selectedClient: Client | null;
  setSelectedClient: Dispatch<SetStateAction<Client | null>>;
}

const SelectedClientContext = createContext<ClientContextProps | undefined>(
  undefined
);

export const SelectedClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { slug } = useParams();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { clients } = useClients();

  console.log(clients);

  useEffect(() => {
    const selectedClient = clients?.find((client) => client.slug === slug);
    if(selectedClient) setSelectedClient(selectedClient);
  }, [clients]);

  return (
    <SelectedClientContext.Provider
      value={{ selectedClient, setSelectedClient }}
    >
      {children}
    </SelectedClientContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useSelectedClient = (): ClientContextProps => {
  const context = useContext(SelectedClientContext);
  if (!context) {
    throw new Error("useSelectedClient must be used within an ClientProvider");
  }
  return context;
};
