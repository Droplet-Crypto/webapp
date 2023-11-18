import { AccountData } from "./types";

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
