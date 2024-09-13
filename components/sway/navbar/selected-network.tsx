"use client"

import Image from "next/image"
import * as React from "react"
import { buttonVariants } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils";
import { useChain } from "@fuels/react"
import { SelectedChainWarning } from "@/components/core/components/selected-chain-warning"
import { getNetworkName } from "@/lib/sway/chain"

interface SelectedNetworkProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SelectedNetwork({ }: SelectedNetworkProps) {
    const { chain } = useChain();

    return <>
        {chain
            ? <HoverCard>
                <HoverCardTrigger>
                    <Image
                        width={50}
                        height={50}
                        alt={chain.name}
                        src={"/icon/fuel.svg"}
                        className={cn(
                            buttonVariants({ size: "icon", variant: "link" }),
                            "h-5 w-5 cursor-pointer sm:h-8 sm:w-8"
                        )}
                    />
                </HoverCardTrigger>
                <HoverCardContent>
                    {getNetworkName(chain?.consensusParameters.chainId.toString() || "")}
                </HoverCardContent>
            </HoverCard>
            : <SelectedChainWarning
                message="Couldn't found a Fuel Wallet Provider. Please install Fuel Wallet or support Fuel extension" />}
    </>
}