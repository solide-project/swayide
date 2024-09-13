"use client"

import * as React from "react"
import { EditorProvider } from "@/components/core/providers/editor-provider"
import { FileSystemProvider } from "@/components/core/providers/file-provider"
import { LoggerProvider } from "@/components/core/providers/logger-provider"
import { NavProvider } from "@/components/core/providers/navbar-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    FuelWalletConnector,
    FuelWalletDevelopmentConnector,
    FueletWalletConnector,
} from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';

export interface SwayideProvidersProps {
    nonce?: string;
    children?: React.ReactNode;
}

const queryClient = new QueryClient();

export function SwayideProviders({ children, ...props }: SwayideProvidersProps) {
    return <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <QueryClientProvider client={queryClient}>
            <FuelProvider
                theme="dark"
                fuelConfig={{
                    connectors: [
                        new FuelWalletConnector(),
                        new FuelWalletDevelopmentConnector(),
                        new FueletWalletConnector(),
                    ],
                }}
            >
                <LoggerProvider>
                    <FileSystemProvider>
                        <EditorProvider>
                            <TooltipProvider delayDuration={0}>
                                <NavProvider>{children}</NavProvider>
                            </TooltipProvider>
                        </EditorProvider>
                    </FileSystemProvider>
                </LoggerProvider>
            </FuelProvider>
        </QueryClientProvider>
    </ThemeProvider>
}