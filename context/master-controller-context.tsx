"use client"

import React, { createContext, useContext, useState } from 'react';
import MasterController from '@/lib/control/master-controller';

// Create a context for the MasterController
const MasterControllerContext = createContext<MasterController | undefined>(undefined);

// Custom hook to access MasterController
export const useMasterController = (): MasterController => {
    const context = useContext(MasterControllerContext);
    if (!context) {
        throw new Error("useMasterController must be used within a MasterControllerProvider");
    }
    return context;
};

// Provider component that provides the MasterController instance
export const MasterControllerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize the MasterController singleton instance
    const [masterController] = useState<MasterController>(new MasterController());

    return (
        <MasterControllerContext.Provider value={masterController}>
            {children}
        </MasterControllerContext.Provider>
    );
};
