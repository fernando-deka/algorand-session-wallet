import { Transaction, TransactionParams } from "algosdk";
import { PermissionCallback, SignedTxn, Wallet } from "./wallet";
import { AlgorandExtension } from "@magic-ext/algorand";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";
interface MagicLinkSettings {
    apiKey: string;
    email: string;
    rpcURL: string;
}
declare class MagicLink implements Wallet {
    accounts: string[];
    defaultAccount: number;
    network: string;
    connector: InstanceWithExtensions<SDKBase, {
        algorand: AlgorandExtension;
    }>;
    permissionCallback?: PermissionCallback;
    settings?: MagicLinkSettings;
    constructor(network: string);
    connect(settings: MagicLinkSettings): Promise<boolean>;
    reAuthenticate(): Promise<boolean>;
    static displayName(): string;
    displayName(): string;
    static img(inverted: boolean): string;
    img(inverted: boolean): string;
    isConnected(): Promise<boolean>;
    disconnect(): void;
    getDefaultAccount(): Promise<string>;
    getDefaultAccountPkey(): Promise<string>;
    signTxn(txns: Transaction[], forceAuth?: boolean): Promise<SignedTxn[]>;
    signTxnBlock(txns: Transaction[]): Promise<SignedTxn[]>;
    sign(txn: TransactionParams): Promise<SignedTxn>;
    signBytesToTxn(b: Uint8Array): Promise<SignedTxn>;
    signBytes(b: Uint8Array): Promise<Uint8Array>;
    signTeal(teal: Uint8Array): Promise<Uint8Array>;
}
export default MagicLink;
