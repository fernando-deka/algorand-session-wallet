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
const magic_sdk_1 = require("magic-sdk");
const algorand_1 = require("@magic-ext/algorand");
const buffer_1 = require("buffer");
const logo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yMDAgMEMyMTguMjYyIDIxLjIwMTQgMjM4LjQwNCA0MC44OTA2IDI2MC4xODUgNTguODM5MUMyNDUuNjcyIDEwMy40NTkgMjM3Ljg1OCAxNTAuODY1IDIzNy44NTggMjAwQzIzNy44NTggMjQ5LjEzNSAyNDUuNjcyIDI5Ni41NDEgMjYwLjE4NSAzNDEuMTYxQzIzOC40MDQgMzU5LjEwOSAyMTguMjYyIDM3OC43OTkgMjAwIDQwMEMxODEuNzM4IDM3OC43OTkgMTYxLjU5NiAzNTkuMTA5IDEzOS44MTUgMzQxLjE2MUMxNTQuMzI4IDI5Ni41NDEgMTYyLjE0MiAyNDkuMTM1IDE2Mi4xNDIgMjAwQzE2Mi4xNDIgMTUwLjg2NSAxNTQuMzI4IDEwMy40NTkgMTM5LjgxNSA1OC44MzkyQzE2MS41OTYgNDAuODkwNyAxODEuNzM4IDIxLjIwMTUgMjAwIDBaIiBmaWxsPSIjNjg1MUZGIi8+CjxwYXRoIGQ9Ik05OC4xODMgMzEwLjMxMkM3NS4xMjc2IDI5NC45OTQgNTAuNjU5MiAyODEuNDU3IDI1IDI2OS45MTFDMzIuMTE3NyAyNDcuNzk3IDM1Ljk0NjcgMjI0LjMyMiAzNS45NDY3IDIwMEMzNS45NDY3IDE3NS42NzggMzIuMTE3NyAxNTIuMjA0IDI1IDEzMC4wODlDNTAuNjU5MSAxMTguNTQzIDc1LjEyNzUgMTA1LjAwNiA5OC4xODMgODkuNjg4NUMxMDYuOTk5IDEyNS4xMDIgMTExLjY2NCAxNjIuMDM0IDExMS42NjQgMjAwQzExMS42NjQgMjM3Ljk2NiAxMDYuOTk5IDI3NC44OTggOTguMTgzIDMxMC4zMTJaIiBmaWxsPSIjNjg1MUZGIi8+CjxwYXRoIGQ9Ik0yODguMzM2IDIwMEMyODguMzM2IDIzNy45NjYgMjkzLjAwMSAyNzQuODk4IDMwMS44MTcgMzEwLjMxMkMzMjQuODcyIDI5NC45OTQgMzQ5LjM0MSAyODEuNDU3IDM3NSAyNjkuOTExQzM2Ny44ODIgMjQ3Ljc5NyAzNjQuMDUzIDIyNC4zMjIgMzY0LjA1MyAyMDBDMzY0LjA1MyAxNzUuNjc4IDM2Ny44ODIgMTUyLjIwNCAzNzUgMTMwLjA4OUMzNDkuMzQxIDExOC41NDMgMzI0Ljg3MiAxMDUuMDA2IDMwMS44MTcgODkuNjg4NEMyOTMuMDAxIDEyNS4xMDIgMjg4LjMzNiAxNjIuMDM0IDI4OC4zMzYgMjAwWiIgZmlsbD0iIzY4NTFGRiIvPgo8L3N2Zz4K";
class MagicLink {
    constructor(network) {
        this.accounts = [];
        this.defaultAccount = 0;
        this.network = network;
    }
    connect(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = settings;
            this.connector = new magic_sdk_1.Magic(settings.apiKey, {
                extensions: {
                    algorand: new algorand_1.AlgorandExtension({ rpcUrl: settings.rpcURL }),
                },
            });
            yield this.connector.auth.loginWithEmailOTP({ email: settings.email });
            const md = yield this.connector.user.getMetadata();
            this.accounts = [md.publicAddress];
            return true;
        });
    }
    reAuthenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connector.user.logout();
            yield this.connector.auth.loginWithEmailOTP({ email: this.settings.email });
            const md = yield this.connector.user.getMetadata();
            if (this.accounts[0] !== md.publicAddress)
                throw Error("User changed wallet");
            this.accounts = [md.publicAddress];
            return true;
        });
    }
    static displayName() {
        return "Magic Link";
    }
    displayName() {
        return MagicLink.displayName();
    }
    static img(inverted) {
        return logo;
    }
    img(inverted) {
        return MagicLink.img(inverted);
    }
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connector || !this.connector.user)
                return false;
            return this.connector.user.isLoggedIn();
        });
    }
    disconnect() {
        if (this.connector && this.connector.user)
            this.connector.user.logout();
    }
    getDefaultAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isConnected()))
                return "";
            return this.accounts[this.defaultAccount];
        });
    }
    getDefaultAccountPkey() {
        return __awaiter(this, void 0, void 0, function* () {
            return buffer_1.Buffer.from(algosdk_1.default.decodeAddress(yield this.getDefaultAccount()).publicKey).toString("base64");
        });
    }
    signTxn(txns, forceAuth = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (forceAuth)
                yield this.reAuthenticate();
            const defaultAddressPK = yield this.getDefaultAccountPkey();
            const result = [];
            for (const txnid in txns) {
                if (!txns[txnid])
                    continue;
                const txn = txns[txnid];
                if (buffer_1.Buffer.from(txn.from.publicKey).toString("base64") !== defaultAddressPK)
                    result.push({ txID: txn.txID(), blob: txn.toByte() });
                else
                    result.push({
                        txID: txn.txID(),
                        blob: yield this.signBytes(txn.toByte()),
                    });
            }
            return result;
        });
    }
    sign(txn) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    signBytes(b) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connector.algorand.signTransaction(b);
        });
    }
    signTeal(teal) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.default = MagicLink;
