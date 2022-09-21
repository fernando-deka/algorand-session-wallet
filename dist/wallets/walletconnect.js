"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const algosdk_1 = __importDefault(require("algosdk"));
const buffer_1 = require("buffer");
const client_1 = __importDefault(require("@walletconnect/client"));
const algorand_walletconnect_qrcode_modal_1 = __importDefault(require("algorand-walletconnect-qrcode-modal"));
const utils_1 = require("@json-rpc-tools/utils");
const logo = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIHdpZHRoPSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZD0ibTAgMGg0MDB2NDAwaC00MDB6Ii8+PC9jbGlwUGF0aD48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgZmlsbD0iIzMzOTZmZiIgcj0iMTk5LjUiIHN0cm9rZT0iIzY2YjFmZiIvPjxwYXRoIGQ9Im0xMjIuNTE5IDE0OC45NjVjNDIuNzkxLTQxLjcyOSAxMTIuMTcxLTQxLjcyOSAxNTQuOTYyIDBsNS4xNSA1LjAyMmMyLjE0IDIuMDg2IDIuMTQgNS40NjkgMCA3LjU1NWwtMTcuNjE3IDE3LjE4Yy0xLjA3IDEuMDQzLTIuODA0IDEuMDQzLTMuODc0IDBsLTcuMDg3LTYuOTExYy0yOS44NTMtMjkuMTExLTc4LjI1My0yOS4xMTEtMTA4LjEwNiAwbC03LjU5IDcuNDAxYy0xLjA3IDEuMDQzLTIuODA0IDEuMDQzLTMuODc0IDBsLTE3LjYxNy0xNy4xOGMtMi4xNC0yLjA4Ni0yLjE0LTUuNDY5IDAtNy41NTV6bTE5MS4zOTcgMzUuNTI5IDE1LjY3OSAxNS4yOWMyLjE0IDIuMDg2IDIuMTQgNS40NjkgMCA3LjU1NWwtNzAuNyA2OC45NDRjLTIuMTM5IDIuMDg3LTUuNjA4IDIuMDg3LTcuNzQ4IDBsLTUwLjE3OC00OC45MzFjLS41MzUtLjUyMi0xLjQwMi0uNTIyLTEuOTM3IDBsLTUwLjE3OCA0OC45MzFjLTIuMTM5IDIuMDg3LTUuNjA4IDIuMDg3LTcuNzQ4IDBsLTcwLjcwMTUtNjguOTQ1Yy0yLjEzOTYtMi4wODYtMi4xMzk2LTUuNDY5IDAtNy41NTVsMTUuNjc5NS0xNS4yOWMyLjEzOTYtMi4wODYgNS42MDg1LTIuMDg2IDcuNzQ4MSAwbDUwLjE3ODkgNDguOTMyYy41MzUuNTIyIDEuNDAyLjUyMiAxLjkzNyAwbDUwLjE3Ny00OC45MzJjMi4xMzktMi4wODcgNS42MDgtMi4wODcgNy43NDggMGw1MC4xNzkgNDguOTMyYy41MzUuNTIyIDEuNDAyLjUyMiAxLjkzNyAwbDUwLjE3OS00OC45MzFjMi4xMzktMi4wODcgNS42MDgtMi4wODcgNy43NDggMHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+";
class WC {
    constructor(network) {
        this.accounts = [];
        this.defaultAccount = 0;
        this.network = network;
        const bridge = "https://bridge.walletconnect.org";
        this.connector = new client_1.default({
            bridge,
            qrcodeModal: algorand_walletconnect_qrcode_modal_1.default,
        });
    }
    connect(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if connection is already established
            if (this.connector.connected)
                return true;
            yield this.connector.createSession();
            this.connector.on("connect", (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts } = payload.params[0];
                cb(accounts);
                this.accounts = accounts;
            });
            this.connector.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts } = payload.params[0];
                cb(accounts);
                this.accounts = accounts;
            });
            this.connector.on("disconnect", (error, payload) => {
                if (error)
                    throw error;
            });
            return new Promise((resolve) => {
                const reconn = setInterval(() => {
                    if (this.connector.connected) {
                        clearInterval(reconn);
                        resolve(true);
                        return;
                    }
                    this.connector.connect();
                }, 100);
            });
        });
    }
    static displayName() {
        return "Wallet Connect";
    }
    displayName() {
        return WC.displayName();
    }
    static img(inverted) {
        return logo;
    }
    img(inverted) {
        return WC.img(inverted);
    }
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connector.connected;
        });
    }
    disconnect() {
        this.connector.killSession();
    }
    getDefaultAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isConnected()))
                return "";
            return this.accounts[this.defaultAccount];
        });
    }
    signTxn(txns) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultAddress = yield this.getDefaultAccount();
            yield this.connect(() => null);
            const txnsToSign = txns.map((txn) => {
                const encodedTxn = buffer_1.Buffer.from(algosdk_1.default.encodeUnsignedTransaction(txn)).toString("base64");
                if (algosdk_1.default.encodeAddress(txn.from.publicKey) !== defaultAddress)
                    return { txn: encodedTxn, signers: [] };
                return { txn: encodedTxn };
            });
            const request = (0, utils_1.formatJsonRpcRequest)("algo_signTxn", [txnsToSign]);
            const result = yield this.connector.sendCustomRequest(request);
            return result.map((element, idx) => {
                return element
                    ? {
                        txID: txns[idx].txID(),
                        blob: new Uint8Array(buffer_1.Buffer.from(element, "base64")),
                    }
                    : {
                        txID: txns[idx].txID(),
                        blob: txns[idx].toByte(),
                    };
            });
        });
    }
    sign(txn) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    signBytes(b) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    signTeal(teal) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.default = WC;
