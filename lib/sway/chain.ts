enum ChainId {
    TESTNET = "0"
}
const explorer: { [key: string]: string } = {
    [ChainId.TESTNET]: "https://app.fuel.network"
}

export const getExplorer = (chainId: string) => explorer[chainId] || "https://app.fuel.network"
export const getTxExplorer = (chainId: string, tx: string) => `${getExplorer(chainId)}/tx/${tx}`

const name: { [key: string]: string } = {
    [ChainId.TESTNET]: "Fuel Sepolia Testnet"
}
export const getNetworkName = (chainId: string) => name[chainId] || "Unknown Network"
