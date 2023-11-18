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
