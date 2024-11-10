'use client'

import { ReactNode } from 'react';
import { AlertProvider } from './alert-context';

export const ContextProvider = ({ children }: { children: ReactNode }) => (
    <AlertProvider>
        {children}
    </AlertProvider>
);
