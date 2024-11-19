'use client'

import React, { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';
interface ClientCountContextProps {
    clientCount: number;
    setClientCount: Dispatch<SetStateAction<number>>;
}

// Create the context
const ClientCountContext = createContext<ClientCountContextProps | undefined>(undefined);

export const ClientCountProvider = ({ children }: { children: ReactNode }) => {
    const [clientCount, setClientCount] = useState<number>(0);

    return (
        <ClientCountContext.Provider value={{ clientCount, setClientCount }}>
            {children}
        </ClientCountContext.Provider>
    );
};

// Custom hook for consuming the alert context
export const useClientCount = (): ClientCountContextProps => {
    const context = useContext(ClientCountContext);
    if (!context) {
        throw new Error('useAlert must be used within an ClientCountProvider');
    }
    return context;
};
