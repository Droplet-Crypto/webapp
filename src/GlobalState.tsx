import React, {
  createContext,
  useContext,
  useState,
} from "react";
import {
  AccountData,
  GlobalState,
  GlobalStateStorage,
} from "./types";
import {
  DummyAccountData,
  DummyGlobalState,
} from "./constants";
import { Hex } from "viem";

export const GlobalContext =
  createContext<GlobalState>(DummyGlobalState);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

// Create a provider
export const GlobalProvider = ({
  children,
}: any) => {
  const stateInStorage: GlobalStateStorage =
    JSON.parse(
      localStorage.getItem(
        "Droplet:GlobalContext"
      ) || "{}"
    );

  const [accountAddress, setAccountAddress] =
    useState<Hex | undefined>(
      stateInStorage.accountAddress
    );

  const [accountData, setAccountData] = useState<
    AccountData | undefined
  >(stateInStorage.accountData);

  const saveState = () => {
    const stateToStorage: GlobalStateStorage = {
      accountAddress,
      accountData,
    };
    console.log("Saving state", stateToStorage);
    window.localStorage.setItem(
      "Droplet:GlobalContext",
      JSON.stringify(stateToStorage)
    );
  };

  const state: GlobalState = {
    accountAddress,
    setAccountAddress,
    accountData: accountData || DummyAccountData,
    setAccountData,
  };

  saveState();
  return (
    <GlobalContext.Provider value={state}>
      {children}
    </GlobalContext.Provider>
  );
};
