import { createContext, ReactNode, useState } from 'react';

interface ChallengesContextData {
    // totalUsers: number;
    totalAdmin: number;
    // totalChallenges: number;
    // totalRank: number;
}

interface DashboardProviderProps {
    children: ReactNode;
    totalAdmin: number;
    totalChallenges: number;
    totalUsers: number;
    totalRank: number;
}

export const DashboardContext = createContext({} as ChallengesContextData);

export function DashboardProvider({ children, ...rest }: DashboardProviderProps) {
    const [totalAdmin] = useState(rest.totalAdmin ?? 0);


    return (
        <DashboardContext.Provider value={
            {
                totalAdmin
            }}>
            {children}
        </DashboardContext.Provider>
    );
}

