import { useWallet } from "@fuels/react";
import { useQuery } from "@tanstack/react-query";
import { Contract, Interface, JsonAbi } from "fuels";

export function useContract(contractId: string, abi: JsonAbi) {
    const { wallet, isLoading, isError } = useWallet();

    const {
        data: contract,
        isLoading: isContractLoading,
        isError: isContractError,
    } = useQuery({
        enabled: !isLoading && !isError && !!wallet && !!contractId.length,
        queryKey: ["contract"],
        queryFn: async () => {
            if (!!wallet && !!contractId.length) {
                return new Contract(contractId, abi, wallet);
            }
        },
    });

    return { contract, isLoading: isContractLoading, isError: isContractError };
}