// "use client";

// import { Channel } from "@/interfaces/channels";
// import { fetcher } from "@/lib/utils";
// import { mapClients } from "@/mappers";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   SetStateAction,
//   Dispatch,
//   useEffect,
// } from "react";
// import useSWR from "swr";

// interface ClientsContextProps {
//   channels: Channel[];
//   setClients: Dispatch<SetStateAction<Channel[]>>;
// }

// // Create the context
// const ClientsContext = createContext<ClientsContextProps | undefined>(
//   undefined
// );

// export const ClientProvider = ({ children }: { children: ReactNode }) => {
//   const [channels, setClients] = useState<Channel[]>([]);

//   useEffect(() => {
//     (async () => {
      
//       const channelsList = await fetcher("/api/admin/channels");
//       const mappedClients = mapClients(channelsList);
//       setClients(mappedClients);

//     })();
//   }, []);

//   return (
//     <ClientsContext.Provider value={{ channels, setClients }}>
//       {children}
//     </ClientsContext.Provider>
//   );
// };

// // Custom hook for consuming the alert context
// export const useClients = (): ClientsContextProps => {
//   const context = useContext(ClientsContext);
//   if (!context) {
//     throw new Error("useClients must be used within an ClientsProvider");
//   }
//   return context;
// };
