"use client"

import * as React from "react"
import {
    useAccount,
    useAccounts,
    useConnectUI,
    useDisconnect,
    useFuel,
    useIsConnected,
    useConnect,
    useWallet,
} from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";

export interface ConnectWalletProps {
    children?: React.ReactNode;
}

export function ConnectWallet({ children, ...props }: ConnectWalletProps) {
    const {
        // connect,
        isPending: isConnecting, error: errorConnecting } = useConnect();
    const { connect } = useConnectUI()

    const { fuel } = useFuel();
    const { disconnect } = useDisconnect();
    const { isConnected } = useIsConnected();

    return <Button
        type="button"
        disabled={isConnecting}
        onClick={() => isConnected ? disconnect() : connect()}
    >
        {isConnected ?
            'Disconnect' :
            <>{isConnecting ? 'Connecting...' : 'Connect'}</>}
    </Button>

}