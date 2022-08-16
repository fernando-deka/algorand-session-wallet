import MyAlgoConnectWallet from "./wallets/myalgoconnect";
import WC from "./wallets/walletconnect";
import { PermissionCallback, Wallet, SignedTxn } from "./wallets/wallet";
import { Transaction, TransactionSigner } from "algosdk";
import MagicLink from "./wallets/magiclink";
export { PermissionResult, PermissionCallback, Wallet, SignedTxn, } from "./wallets/wallet";
export declare const allowedWallets: {
    "wallet-connect": typeof WC;
    "my-algo-connect": typeof MyAlgoConnectWallet;
    "magic-link": typeof MagicLink;
};
export declare class SessionWallet {
    wallet: Wallet;
    wname: string;
    network: string;
    apiKey: string;
    permissionCallback?: PermissionCallback;
    rpcURL: string;
    email: string;
    constructor(network: string, permissionCallback?: PermissionCallback, wname?: string, email?: string, apiKey?: string, magiclinkRpcURL?: string);
    connect(): Promise<boolean>;
    connected(): Promise<boolean>;
    getSigner(): TransactionSigner;
    setAccountList(accts: string[]): void;
    accountList(): string[];
    setAccountIndex(idx: number): void;
    accountIndex(): number;
    setWalletPreference(wname: string): void;
    walletPreference(): string;
    setMnemonic(m: string): void;
    mnemonic(): string;
    disconnect(): void;
    getDefaultAccount(): Promise<string>;
    signTxn(txns: Transaction[], forceAuth?: boolean): Promise<SignedTxn[]>;
}
