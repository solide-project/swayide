"use client"

import { CompileError } from "@/lib/sway/error"
import { JsonAbi, StorageSlot } from "fuels"
import React, { createContext, useContext, useEffect, useState } from "react"

export const SwayProvider = ({ children }: SwayProviderProps) => {
    const [errors, setErrors] = useState<CompileError>({} as CompileError)
    const [abi, setABI] = useState<JsonAbi>({} as JsonAbi)
    const [storageSlot, setStorageSlot] = useState<StorageSlot[]>([])
    const [bytecode, setBytecode] = useState<string>("")

    const [tomlPath, setTomlPath] = useState<string>("")

    useEffect(() => {
    }, [])

    return (
        <SwayContext.Provider
            value={{
                errors,
                setErrors,
                tomlPath,
                setTomlPath,
                abi,
                setABI,
                storageSlot,
                setStorageSlot,
                bytecode,
                setBytecode
            }}
        >
            {children}
        </SwayContext.Provider>
    )
}

interface SwayProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
}

export const SwayContext = createContext({
    errors: {} as CompileError,
    setErrors: (errors: CompileError) => { },
    tomlPath: "",
    setTomlPath: (tomlPath: string) => { },
    abi: {} as JsonAbi,
    setABI: (abi: JsonAbi) => { },
    storageSlot: {} as StorageSlot[],
    setStorageSlot: (storageSlot: StorageSlot[]) => { },
    bytecode: "",
    setBytecode: (bytecode: string) => { },
})

export const useSway = () => useContext(SwayContext)