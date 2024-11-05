"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import MasterController from '@/lib/control/master-controller';
import AuthUserEntity from '@/lib/entities/auth-user-entity';


interface MasterControllerArgs {
    masterController: MasterController;
    currentUser: AuthUserEntity | null;
}

// Create a context for the MasterController
const MasterControllerContext = createContext<MasterControllerArgs | undefined>(undefined);

// Custom hook to access MasterController
export const useMasterController = (): MasterControllerArgs => {
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
    const authController = masterController.getAuthController();
    const [currentUser, setCurrentUser] = useState<AuthUserEntity | null>(null);

    useEffect(() => {
        const unsubscribe = authController.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, [authController]);


    return (
        <MasterControllerContext.Provider value={{ masterController, currentUser }}>
            {children}
        </MasterControllerContext.Provider>
    );
};
