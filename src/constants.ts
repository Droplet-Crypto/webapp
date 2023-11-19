import { polygonMumbai } from "viem/chains";
import {
  AccountData,
  ChainsSettingsType,
  GlobalState,
} from "./types";

export let ServerUrl: string;
if (
  !process.env.NODE_ENV ||
  process.env.NODE_ENV === "development"
) {
  ServerUrl = "http://localhost:8000";
} else {
  ServerUrl = ""; //TODO: to be defined;
}

export const DummyAccountData: AccountData = {
  balance: 0,
  history: [],
};

export const DummyGlobalState: GlobalState = {
  accountAddress: undefined,
  setAccountAddress(address) {},
  accountData: DummyAccountData,
  setAccountData(accountData) {},
};

export const SupportedChains = [polygonMumbai];

export const ProductionChains =
  SupportedChains.filter(
    (chain) => !(chain as any).testnet
  );

export const TestnetChains =
  SupportedChains.filter(
    (chain) => (chain as any).testnet
  );

export const SupportedChainIds =
  SupportedChains.map((chain) => chain.id);

export const ProductionChainIds =
  ProductionChains.map((chain) => chain.id);

export const ChainsSettings: ChainsSettingsType =
  {
    [polygonMumbai.id]: {
      chain: polygonMumbai,
      etherscanBaseUrl:
        "https://mumbai.polygonscan.com",
      rpc: "https://mumbai.polygonscan.com",
      tokens: [
        {
          address:
            "0x1558c6FadDe1bEaf0f6628BDd1DFf3461185eA24",
          decimals: 18,
          symbol: "AAVE",
        },
        {
          address:
            "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2",
          decimals: 6,
          symbol: "USDT",
        },
      ],
    },
  };
