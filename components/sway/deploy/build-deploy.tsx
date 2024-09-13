"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { Title } from "@/components/core/components/title"
import { useSway } from "@/components/sway/sway-provider"
import { ContractInvoke } from "@/components/sway/deploy/contract-invoke"

interface BuildDeployProps extends React.HTMLAttributes<HTMLDivElement> { }

enum Tab {
    OVERVIEW = "overview",
    INTERACT = "interact",
}

export function BuildDeploy({ className }: BuildDeployProps) {
    const sway = useSway()

    const [activeTab, setActiveTab] = useState<Tab>(Tab.INTERACT)
    const isActive = (tab: string) => activeTab === tab

    const tabActive = (tab: string): string =>
        cn("cursor-pointer", {
            "text-grayscale-250": !isActive(tab),
            "bg-grayscale-200 rounded-lg px-3 py-1": isActive(tab),
        })

    return <div className={cn("px-2 pb-4", className)}>
        <Title text="Build & Deploy" />

        {/* {move.errors && move.errors.details && <CompileErrors />} */}

        {/* <div className="mx-2 my-4 flex items-center gap-x-4">
            <div
                className={tabActive(Tab.OVERVIEW)}
                onClick={() => setActiveTab(Tab.OVERVIEW)}
            >
                Overview
            </div>
            <div
                className={tabActive(Tab.INTERACT)}
                onClick={() => setActiveTab(Tab.INTERACT)}
            >
                Contract
            </div>
        </div> */}

        {/* {isActive(Tab.OVERVIEW) &&
        evm.selectedCompiledContract &&
        evm.selectedCompiledContract.abi && <ContractOverview />} */}

        {isActive(Tab.INTERACT) &&
            sway.abi && sway.bytecode && <ContractInvoke />}
    </div>
}