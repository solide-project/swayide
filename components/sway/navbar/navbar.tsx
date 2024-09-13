"use client"

import { NavItemCode } from "@/components/core/navbar/nav-item-code"
import { NavItemContent } from "@/components/core/navbar/nav-item-content"
import { NavItemEditor } from "@/components/core/navbar/nav-item-editor"
import { NavItemFile } from "@/components/core/navbar/nav-item-file"
import { NavItemTheme } from "@/components/core/navbar/nav-item-theme"

import { NavItemConsole } from "@/components/core/navbar/nav-item-console"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { SwaySettings } from "@/components/sway/settings/settings"
import { NavItemDownloader } from "@/components/sway/navbar/nav-item-downloader"
import { SelectedNetwork } from "@/components/sway/navbar/selected-network"
import { NavItemUtility } from "./nav-item-utility"

interface SwayNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
    url: string,
    bytecodeId?: string,
}

export function SwayNavBar({
    url,
    bytecodeId
}: SwayNavBarProps) {
    return (
        <div className="flex h-full flex-col gap-y-2 rounded-lg bg-grayscale-025 px-2 py-4">
            <NavTooltipItem tooltip="File Explorer">
                <NavItemFile />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Build & Deploy">
                <NavItemCode />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Utility">
                <NavItemUtility />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Editor">
                <NavItemEditor />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Console">
                <NavItemConsole />
            </NavTooltipItem>
            <NavTooltipItem tooltip="Source">
                <NavItemContent url={url} />
            </NavTooltipItem>

            <div className="mt-auto flex flex-col items-center gap-2">
                {/* {bytecodeId && <NavItemBytecode id={bytecodeId} />} */}
                <SelectedNetwork />
                <NavItemTheme />
                <SwaySettings />
            </div>
        </div>
    )
}


const NavTooltipItem = ({ children, tooltip }: { children: React.ReactNode, tooltip: string }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild={true}>
                <div>
                    {children}
                </div>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
}