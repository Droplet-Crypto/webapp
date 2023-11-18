import { Hex } from "viem";
import { ServerUrl } from "./constants";
import { AccountData } from "./types";

export async function getAccountData(
  accountAddress: Hex
): Promise<AccountData> {
  const result = await fetch(
    `${ServerUrl}/accountData/${accountAddress}`
  );
  const json = await result.json();
  return {
    balance: parseFloat(json.balance),
    history: json.history.map(
      (jsonAction: any) => ({
        actionType: jsonAction.actionType,
        usdAmount: parseFloat(
          jsonAction.usdAmount
        ),
        message: jsonAction.message,
        link: jsonAction.link,
      })
    ),
  };
}
