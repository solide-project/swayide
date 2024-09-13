/**
 * These are all Fuel reated not exposed as library
 */

export interface AbiFunction {
    readonly name: string;
    readonly inputs: readonly AbiFunctionInput[];
    readonly output: string;
    readonly attributes: readonly AbiFunctionAttribute[] | null;
}
export interface AbiFunctionInput {
    readonly name: string;
    readonly concreteTypeId: string;
}
export type AbiFunctionAttribute = {
    readonly name: string;
    readonly arguments?: string[];
};