import { Contract, JsonAbi } from "fuels"

export interface DeployedContracts {
    [key: string]: ISmartContract
}

export interface InvokeParam {
    method: string
    args: any[],
    dryRun?: boolean,
    value?: string
    gas?: string
}

export interface ISmartContract {
    contractAddress: string
    contract: Contract,
    abi: JsonAbi
    call(args: InvokeParam): Promise<any>
    send(args: InvokeParam): Promise<any>

    isReadOnly(method: string): boolean
}

export class SwayContract implements ISmartContract {
    contractAddress: string
    contract: Contract
    abi: JsonAbi

    constructor(contractAddress: string, abi: JsonAbi, wallet: any) {
        this.contractAddress = contractAddress
        this.abi = abi
        this.contract = new Contract(contractAddress, abi, wallet);
    }

    async call(args: InvokeParam): Promise<any> {
        const func = this.contract.buildFunction(this.contract.interface.functions[args.method])
        const result = func(...args.args)
        func.isReadOnly()
        const data = await result.dryRun()
        return data
    }

    isReadOnly(method: string) {
        return this.contract.buildFunction(this.contract.interface.functions[method]).isReadOnly()
    }

    async send(args: InvokeParam) {
        const func = this.contract.buildFunction(this.contract.interface.functions[args.method])
        const result = func(...args.args)
        return result.call()
    }

}