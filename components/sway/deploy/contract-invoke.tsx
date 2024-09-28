import { useState } from "react";
import { useLogger } from "@/components/core/providers/logger-provider";
import { useSway } from "../sway-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/sway/connect-wallet"
import { CHAIN_IDS, Contract } from "fuels";
import { useChain, useIsConnected, useWallet } from "@fuels/react";
import { useSwayHook } from "./hook-sway";
import { CollapsibleChevron } from "@/components/core/components/collapsible-chevron";
import { AbiFunction, AbiFunctionInput } from "@/lib/sway/fuel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch";
import { getTxExplorer } from "@/lib/sway/chain";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ContractInvokeProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ContractInvoke({ className }: ContractInvokeProps) {
    const { wallet, isLoading: walletIsLoading } = useWallet();
    const { abi, storageSlot, bytecode } = useSway();
    const swayHook = useSwayHook()
    const logger = useLogger();
    const { chain } = useChain();

    const [deploying, setDeploying] = useState<boolean>(false);

    const [contract, setContract] = useState<Contract>({} as Contract);
    const [contractAddress, setContractAddress] = useState<string>("");

    const handleDeploy = async () => {
        try {
            setDeploying(true)
            await doDeploy();
        } catch (e: any) {
            if (e.message === "Invalid Sui address") {
                e.message === "Invalid Sui address, Please connect to a valid Sui network"
            }
            logger.error(e.message || "Error deploying contract")

            console.error(e)
        } finally {
            setDeploying(false)
        }
    }

    const doDeploy = async () => {
        if (!!wallet) {
            logger.error("Wallet is not connected")
        }

        logger.info("Deploying contract...")

        const result = await swayHook.doDeploy({ contractAddress, bytecode, abi, storageSlot })

        if (result.transactionHash) {
            logger.info(<div className="flex">
                Transaction {" "} <a className="underline" href={getTxExplorer(
                    chain?.consensusParameters.chainId.toString() || CHAIN_IDS.fuel.testnet.toString(),
                    result.transactionHash)} target="_blank">
                    {result.transactionHash}
                </a>
            </div>)
        }

        logger.success(`Contract deployed at ${result.contract}`)
    }

    //#region Params State
    /**
     * Note we are storing constructor arguments in here as method name "constructor"
     */
    const [contractArguments, setContractArguments] = useState<{
        [contractAddress: string]: {
            [method: string]: { [parameter: string]: any }
        }
    }>({})
    const handleArgumentChange = (
        contractAddress: string,
        method: string,
        name: string,
        value: string
    ) => {
        setContractArguments((prevArgs) => ({
            ...prevArgs,
            [contractAddress]: {
                ...prevArgs[contractAddress],
                [method]: {
                    ...prevArgs[contractAddress]?.[method],
                    [name]: value,
                },
            },
        }))
    }

    const formatParameters = (entry: AbiFunction): any[] => {
        if (!entry) return []

        const methodArgs = contractArguments[selectedContractAddress]?.[entry.name]
        if (!methodArgs) return []

        return entry.inputs.map((input: AbiFunctionInput, index: number) =>
            toNative(methodArgs[input.name || index.toString()], input)
        )
    }

    const toNative = (value: any, input: AbiFunctionInput) => {
        return value.toString()
    }

    // const areContractMethodsFilled = (
    //     method: string,
    //     expectedInputLength: number = 0
    // ): boolean =>
    //     Object.keys(contractArguments[method] || {}).length ===
    //     expectedInputLength &&
    //     Object.values(contractArguments[method] || {}).every((x: string) => x)
    //#endregion

    const [isInvoking, setIsInvoking] = useState(false)
    const handleRemoveContract = (contractAddress: string) => {
        swayHook.removeContract(contractAddress)
    }

    const [selectedContractAddress, setSelectedContractAddress] =
        useState<string>("")
    const [selectedAbiParameter, setSelectedAbiParameter] =
        useState<AbiFunction | null>(null)
    const [dryRun, setDryRun] =
        useState(false)

    const invokeCall = async () => {
        try {
            if (!selectedAbiParameter) {
                throw new Error("Invalid method")
            }

            if (!wallet) {
                throw new Error("No wallet connected")
            }

            setIsInvoking(true)
            logger.info(
                <div className="flex items-center gap-2">
                    <ArrowRight size={18} /> <div>{selectedAbiParameter.name}()</div>
                </div>)

            const args = formatParameters(selectedAbiParameter)

            if (dryRun || swayHook.isMethodReadOnly(selectedContractAddress, selectedAbiParameter.name)) {
                const result = await swayHook.contracts[selectedContractAddress].call({
                    method: selectedAbiParameter.name,
                    args: args,
                })

                logger.info(
                    <div className="flex items-center gap-2">
                        <ArrowLeft size={18} /> <div>{result.value.toString()}</div>
                    </div>)
            } else {
                const result = await swayHook.contracts[selectedContractAddress].send({
                    method: selectedAbiParameter.name,
                    args: args,
                })

                const data = await result.waitForResult()
                logger.success(<div className="flex">
                    Transaction: <a className="underline" href={getTxExplorer(
                        chain?.consensusParameters.chainId.toString() || CHAIN_IDS.fuel.testnet.toString(),
                        result.transactionId)} target="_blank">
                        {" "} {result.transactionId}
                    </a>
                </div>)
            }

        } catch (e: any) {
            logger.error(e.message || "Error")
        } finally {
            setSelectedAbiParameter(null)
            setIsInvoking(false)
        }
    }
    return <div>
        <div className="flex items-center justify-center my-2">
            <ConnectWallet />
        </div>

        <div className="flex">
            <Button
                size="sm"
                onClick={handleDeploy}
                variant="default"
                disabled={(!abi && !bytecode) || deploying}
            >
                {deploying ? "Deploying ..." : "Deploy"}
            </Button>
            <Input
                className="h-9 rounded-md px-3"
                placeholder="Contract Address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
            />
        </div>

        {Object.entries(swayHook.contracts)
            .map(([key, val], index) => {
                return (
                    <CollapsibleChevron
                        key={index}
                        name={key}
                        onClosed={() => handleRemoveContract(key)}
                    >
                        <div className="flex flex-wrap gap-2">
                            {(val.abi.functions)
                                .map((abi, methodsIndex: number) => {
                                    return (
                                        <Button
                                            key={methodsIndex}
                                            onClick={() => {
                                                setSelectedContractAddress(key)
                                                setSelectedAbiParameter(abi)
                                            }}
                                            size="sm"
                                        >
                                            {abi.name}
                                        </Button>
                                    )
                                })}
                        </div>
                    </CollapsibleChevron>
                )
            })}

        <Dialog
            open={!!selectedAbiParameter}
            onOpenChange={() => {
                setSelectedContractAddress("")
                setSelectedAbiParameter(null)
            }}
        >
            <DialogContent className="max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedAbiParameter?.name || "Unknown"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {/* {selectedAbiParameter && JSON.stringify(selectedAbiParameter)} */}
                {selectedAbiParameter && (
                    <>
                        {selectedAbiParameter.inputs.map(
                            (input: AbiFunctionInput, abiIndex: number) => {
                                return (
                                    <div
                                        key={abiIndex}
                                        className="flex items-center space-x-2 py-1"
                                    >
                                        <div>{input.name}</div>

                                        <Input
                                            value={
                                                contractArguments[selectedContractAddress]?.[
                                                selectedAbiParameter.name
                                                ]?.[input.name || abiIndex.toString()]
                                            }
                                            placeholder={input.concreteTypeId}
                                            onChange={(e) =>
                                                handleArgumentChange(
                                                    selectedContractAddress,
                                                    selectedAbiParameter.name,
                                                    input.name || abiIndex.toString(),
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )
                            }
                        )}

                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                <div>Dry Run</div>
                                <Switch
                                    checked={dryRun}
                                    onCheckedChange={() => setDryRun(!dryRun)}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={invokeCall}
                                disabled={isInvoking}
                            >
                                {isInvoking
                                    ? "Invoking..."
                                    : "Call"}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>

        {/* <div>
            {abi.functions.map((abi) => <div key={abi.name}>
                <div className="flex space-x-1">
                    <Button size="sm" disabled={false}
                        onClick={() => handleInvoke(abi)}
                    >
                        {`${abi.name} ( ${abi.inputs && abi.inputs.length > 0 ? "..." : ""} )`}
                    </Button>
                    <Button
                        className="cursor-pointer border-0 hover:bg-grayscale-100"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleInvoke(abi, true)}
                    >
                        <Send />
                    </Button>
                </div>

                {abi.inputs && abi.inputs.map((param, index) => {
                    return <div key={index} className="my-2">
                        <Input placeholder={param.name}
                            onChange={(e) => handleArgumentChange(
                                abi.name, param.name, e.target.value
                            )}
                        />
                    </div>
                })}
            </div>)}
        </div> */}
    </div >
}