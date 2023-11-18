import React, {
  createContext,
  useContext,
  useState,
} from "react";
import {
  GlobalState,
  GlobalStateStorage,
} from "./types";
import { DummyGlobalState } from "./constants";
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

  const [accountAddress, setAccountAddressState] =
    useState<Hex | undefined>(
      stateInStorage.accountAddress
    );

  const saveState = () => {
    const stateToStorage: GlobalStateStorage = {
      accountAddress: accountAddress,
    };
    console.log("Saving state", stateToStorage);
    window.localStorage.setItem(
      "Droplet:GlobalContext",
      JSON.stringify(stateToStorage)
    );
  };

  const setAccountAddress = (address: Hex) => {
    setAccountAddressState(address);
  };

  const state: GlobalState = {
    accountAddress,
    setAccountAddress,
  };

  saveState();
  return (
    <GlobalContext.Provider value={state}>
      {children}
    </GlobalContext.Provider>
  );
};
