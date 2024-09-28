import { AbiFunction } from "@/lib/sway/fuel"
import { DeployedContracts, SwayContract } from "@/lib/sway/hook"
import { useWallet } from "@fuels/react"
import { Contract, ContractFactory, DeployContractResult, JsonAbi, StorageSlot } from "fuels"
import { useState } from "react"

export const useSwayHook = () => {
    const [contracts, setContracts] = useState<DeployedContracts>({})
    const { wallet } = useWallet();

    const executeCall = async (
        contractAddress: string,
        method: AbiFunction,
        args: any[],
        dryRun: boolean = true,
    ) => {
        if (!contracts.hasOwnProperty(contractAddress)) {
            throw new Error("Contract not loaded")
        }

        return contracts[contractAddress].call({ method: method.name, args, dryRun })
    }

    const doDeploy = async ({
        contractAddress,
        bytecode,
        abi = {} as JsonAbi,
        storageSlot = [],
    }: {
        contractAddress?: string
        bytecode: string,
        abi: JsonAbi
        storageSlot: StorageSlot[],
    }) => {
        if (contractAddress) {
            setContracts({
                ...contracts,
                [contractAddress]: new SwayContract(contractAddress, abi, wallet)
            })
            return { contract: contractAddress, transactionHash: "" }
        }

        // Deploy new contract
        // const bytecodeBytes = new TextEncoder().encode(bytecode)
        const bytecodeBytes = `0x${bytecode}`
        const contractFactory = new ContractFactory(
            bytecodeBytes,
            abi,
            wallet,
        );

        const { waitForResult }: DeployContractResult<Contract> = await contractFactory
            .deploy({
                storageSlots: storageSlot,
            })

        const { contract, transactionResult } = await waitForResult()

        // Here we are initialising the contract again...
        setContracts({
            ...contracts,
            [contract.id.toB256()]: new SwayContract(contract.id.toB256(), abi, wallet)
        })

        return { contract: contract.id.toB256(), transactionHash: transactionResult.id }
    }

    const removeContract = (contractAddress: string) => {
        if (contracts.hasOwnProperty(contractAddress)) {
            delete contracts[contractAddress]
            setContracts({ ...contracts })
        }
    }

    const isMethodReadOnly = (contractAddress: string, method: string) => {
        if (contracts.hasOwnProperty(contractAddress)) {
            return contracts[contractAddress].isReadOnly(method)
        }

        return false
    }

    return {
        contracts,
        executeCall,
        doDeploy,
        removeContract,
        isMethodReadOnly
    }
}