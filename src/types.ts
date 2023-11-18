import { Hex } from "viem";
import {
  SupportedChainIds,
  SupportedChains,
} from "./constants";

export type SupportedChain =
  (typeof SupportedChains)[0];

export type SupportedChainIdsType =
  (typeof SupportedChainIds)[0];

export interface HistoryActionType {
  actionType: "receive" | "send";
  usdAmount: number;
  comment: string | null;
  link: string | null;
}

export interface AccountData {
  balance: number;
  history: HistoryActionType[];
}

export interface GlobalState {
  accountAddress: Hex | undefined;
  setAccountAddress: (address: Hex) => void;
}

export interface GlobalStateStorage {
  accountAddress: Hex | undefined;
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
    jiffyscanBaseUrl: string;
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
