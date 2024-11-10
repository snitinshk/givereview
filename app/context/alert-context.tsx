'use client'

import React, { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface Alert {
    message: string;
    type: AlertType;
    visible: boolean;
    title: string
}

interface AlertContextProps {
    alert: Alert;
    setAlert: Dispatch<SetStateAction<Alert>>;
}

// Create the context
const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<Alert>(
        {
            message: '',
            type: 'info',
            title: '',
            visible: false
        }
    );

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

// Custom hook for consuming the alert context
export const useAlert = (): AlertContextProps => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
