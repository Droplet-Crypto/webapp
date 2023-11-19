import { Hex } from "viem";
import {
  SupportedChainIds,
  SupportedChains,
} from "./constants";

export type SupportedChain =
  (typeof SupportedChains)[0];

export type SupportedChainIdsType =
  (typeof SupportedChainIds)[0];

export interface HistoryAction {
  actionType: "receive" | "send";
  usdAmount: number;
  comment: string | null;
  link: string | null;
}

export interface AccountData {
  balance: number;
  history: HistoryAction[];
}

export interface GlobalState {
  accountAddress: Hex | undefined;
  setAccountAddress: (address: Hex) => void;
  accountData: AccountData;
  setAccountData: (
    accountData: AccountData
  ) => void;
}

export interface GlobalStateStorage {
  accountAddress: Hex | undefined;
  accountData: AccountData | undefined;
}

export interface Token {
  address: Hex;
  decimals: number;
  symbol: string;
}

export type ChainsSettingsType = Record<
  SupportedChainIdsType,
  {
    chain: SupportedChain;
    etherscanBaseUrl: string;
    rpc: string;
    tokens: Token[];
  }
>;

export enum ActionExecutionStatus {
  NOT_STARTED,
  SUBMITED,
  EXECUTED,
  REVERTED,
}
