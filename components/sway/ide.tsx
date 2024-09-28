"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ConsoleLogger } from "@/components/core/console"
import { IDE } from "@/components/core/ide"
import { IDEHeader } from "@/components/core/ide-header"
import { useEditor } from "@/components/core/providers/editor-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { useLogger } from "@/components/core/providers/logger-provider"
import {
    CODE_KEY,
    CONSOLE_KEY,
    EDITOR_KEY,
    FILE_KEY,
    useNav,
} from "@/components/core/providers/navbar-provider"
import { BuildDeploy } from "@/components/sway/deploy/build-deploy"
import { SwayNavBar } from "@/components/sway/navbar/navbar"
import { useSway } from "@/components/sway/sway-provider"
// import { OBJECT_KEY } from "@/components/move/navbar/nav-item-object"
// import { LoadObject } from "@/components/move/object/load-object"
import { CompileInput, parseInput } from "@/lib/sway/input"
// import { CompilerOutput } from "@/lib/sway/compiler"
import { CompileError } from "@/lib/sway/error"
import { QueryHelper } from "@/lib/core"
import { CompileOutput } from "@/lib/sway/output"
import path from "path"
import { JsonAbi, StorageSlot } from "fuels"
import { FileTree } from "@/components/core/file/file-tree"
import { UTILITY_KEY } from "./navbar/nav-item-utility"
import { UtiltyTab } from "./utils/utility-tab"

export const hexToDecimal = (hex: string): number => parseInt(hex, 16)

interface SwayIDEProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Entire GitHub URL or an contract address
     */
    url?: string
    /**
     * Chain ID of contract address, should only be used when smart contract is address
     */
    chainId?: string
    title?: string
    content: string
    version?: string
    bytecodeId?: string
}

export function SwayIDE({
    url,
    chainId,
    title,
    content,
    version,
    bytecodeId,
}: SwayIDEProps) {
    const fs = useFileSystem()
    const ide = useEditor()
    const logger = useLogger()
    const sway = useSway()

    const { setNavItemActive, isNavItemActive } = useNav()

    React.useEffect(() => {
        ; (async () => {
            setNavItemActive(EDITOR_KEY, true)
            setNavItemActive(FILE_KEY, true)
            setNavItemActive(CONSOLE_KEY, true)

            let input: CompileInput = parseInput(content)

            const entry = Object.keys(input.settings?.compilationTarget || [])
                .filter(i => i.toLocaleLowerCase().includes("forc.toml"))
                .pop()
            if (entry) {
                sway.setTomlPath(entry)
            }

            const entryFile = await fs.initAndFoundEntry(input.sources, title || "Forc.toml")
            if (entryFile) {
                ide.selectFile(entryFile)
            }

            logger.info("Welcome to Swayide IDE")
        })()
    }, [])

    const [compiling, setCompiling] = React.useState<boolean>(false)
    const handleCompile = async () => {
        const start = performance.now()
        logger.info("Compiling ...")
        setCompiling(true)

        try {
            await doCompile()
        } catch (error: any) {
            logger.error(error)
        }

        const end = performance.now()
        logger.info(`Compiled in ${end - start} ms.`)
        setCompiling(false)

        setNavItemActive(CODE_KEY, true)
    }

    const doCompile = async () => {
        console.log("TODO Compiling ...")

        let queryBuilder = new QueryHelper()
        if (sway.tomlPath) {
            queryBuilder = queryBuilder
                .addParam("toml", sway.tomlPath)
        }

        const sources = fs.generateSources()
        const source: any = { sources }
        const body = { input: source }
        console.log(body)

        const response = await fetch(`/api/compile${queryBuilder.build()}`, {
            method: "POST",
            // body: formData,
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const data = (await response.json()) as CompileError
            console.log(data)
            sway.setErrors(data)
            logger.error(`Compiled with ${data.details.length} errors.`)
            return
        }

        sway.setErrors({} as CompileError)
        const data = await response.json() as CompileOutput
        console.log(data)
        Object.entries(data.output).forEach(([file, content]) => {
            const { base } = path.parse(file)
            if (base.endsWith("-abi.json")) {
                const abi = JSON.parse(content.content) as JsonAbi
                console.log(abi)
                sway.setABI(abi)
            } else if (base.endsWith("-storage_slots.json")) {
                const storageSlot = JSON.parse(content.content) as StorageSlot[]
                console.log(storageSlot)
                sway.setStorageSlot(storageSlot)
            } else if (base.endsWith(".bin")) {
                sway.setBytecode(content.content)
            }
            fs.vfs.touch(file, content.content)
        })
        // sway.setOutput(data.output as CompilerOutput)
    }


    return (
        <div className="min-w-screen max-w-screen flex max-h-screen min-h-screen">
            <div className="py-2 pl-2">
                <SwayNavBar url={""} bytecodeId={bytecodeId} />
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-w-screen max-w-screen max-h-screen min-h-screen"
            >
                <ResizablePanel
                    defaultSize={30}
                    minSize={25}
                    className={cn({
                        hidden: !(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)),
                    })}
                >
                    <div className="flex max-h-screen w-full flex-col gap-y-2 overflow-y-auto p-2">
                        {isNavItemActive(FILE_KEY) && (
                            <FileTree className="rounded-lg bg-grayscale-025 pb-4" />)}
                        {isNavItemActive(CODE_KEY) && (
                            <BuildDeploy className="rounded-lg bg-grayscale-025" />)}
                        {isNavItemActive(UTILITY_KEY) && (
                            <UtiltyTab className="rounded-lg bg-grayscale-025" />)}
                    </div>
                </ResizablePanel>
                {(isNavItemActive(FILE_KEY) || isNavItemActive(CODE_KEY)) && (
                    <ResizableHandle withHandle />
                )}
                <ResizablePanel defaultSize={70} minSize={5}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel
                            defaultSize={75}
                            minSize={5}
                            className={cn("relative", {
                                hidden: !isNavItemActive(EDITOR_KEY),
                            })}
                        >
                            {isNavItemActive(EDITOR_KEY) && (
                                <>
                                    <IDEHeader />
                                    <IDE />
                                    <Button
                                        className="absolute"
                                        style={{ bottom: "16px", right: "16px" }}
                                        size="sm"
                                        onClick={handleCompile}
                                        disabled={compiling}
                                    >
                                        {compiling ? "Compiling ..." : "Compile"}
                                    </Button>
                                </>
                            )}
                        </ResizablePanel>
                        {isNavItemActive(EDITOR_KEY) && isNavItemActive(CONSOLE_KEY) && (
                            <ResizableHandle withHandle />
                        )}
                        <ResizablePanel
                            defaultSize={25}
                            minSize={5}
                            className={cn(
                                "m-2 !overflow-y-auto rounded-lg bg-grayscale-025",
                                { hidden: !isNavItemActive(CONSOLE_KEY) }
                            )}
                        >
                            <ConsoleLogger className="p-3" />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}