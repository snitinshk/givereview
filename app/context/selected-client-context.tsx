"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

interface Client {
  clientId: number;
  clientName: string;
  clientType: string;
  clientLogo: string;
}

interface ClientContextProps {
  client: Client;
  setClient: Dispatch<SetStateAction<Client>>;
}

// Create the context
const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const ClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [client, setClient] = useState<Client | any>();

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
};

// Custom hook for consuming the alert context
export const useClient = (): ClientContextProps => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within an ClientProvider");
  }
  return context;
};
