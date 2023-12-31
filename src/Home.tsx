import { useEffect, useState } from "react";
import {
  executeBasicUserop,
  getKernelAddress,
  magic,
} from "./blockchain";
import {
  AccountData,
  HistoryAction,
} from "./types";
import { DummyAccountData } from "./constants";
import { getAccountData } from "./api";
import { useNavigate } from "react-router-dom";
import { CoreFrame } from "./CoreFrame";
import { useGlobalContext } from "./GlobalState";

function HistoryActionComponent(props: {
  action: HistoryAction;
}) {
  return (
    <div>
      <p>
        {props.action.actionType} $
        {props.action.usdAmount}
      </p>
      {props.action.comment && (
        <p>{props.action.comment}</p>
      )}
      {props.action.link && (
        <a href={props.action.link}>More info</a>
      )}
    </div>
  );
}

function History(props: {
  history: HistoryAction[];
}) {
  return (
    <div className="history">
      <p>History:</p>
      {props.history.map((action, index) => (
        <HistoryActionComponent
          key={index}
          action={action}
        />
      ))}
    </div>
  );
}

function Dashboard(props: {
  balance: number;
  onTopUp: () => void;
  onSend: () => void;
}) {
  return (
    <div className="dashboard">
      <p>Balance: ${props.balance}</p>
      <div className="dashboardButtons">
        <button
          onClick={props.onTopUp}
          className="bigButton"
        >
          Top up
        </button>
        <button
          onClick={props.onSend}
          className="bigButton"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function Login(props: {
  onLoggedIn: () => void;
}) {
  const [loggingIn, setLoggingIn] =
    useState(false);

  const onLogin = async () => {
    if (loggingIn) return;

    setLoggingIn(true);
    console.log("Opening magic login popup");
    try {
      await magic.wallet.connectWithUI();
      console.log("Successfully logged in!");
      props.onLoggedIn();
    } catch (e: any) {
      console.error(
        "Got error during login. Probably user canceled the login.",
        e
      );
    }
    setLoggingIn(false);
  };

  if (loggingIn) return <p>Logging you in...</p>;

  return (
    <div className="loginBar">
      <button onClick={onLogin}>
        Log in / Register
      </button>{" "}
      please.
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const {
    accountAddress,
    setAccountAddress,
    accountData,
    setAccountData,
  } = useGlobalContext();

  const isLoggedIn = accountAddress !== undefined;

  useEffect(() => {
    const refreshAccountData = async () => {
      if (!accountAddress) return;

      const accountData = await getAccountData(
        accountAddress
      );
      setAccountData(accountData);
    };

    refreshAccountData();
  }, [accountAddress]);

  const onLoggedIn = async () => {
    const accountAddress =
      await getKernelAddress();

    setAccountAddress(accountAddress);
  };

  const onTopUp = () => {
    navigate("/topup");
  };

  const onSend = () => {
    navigate("/sendOnChain");
  };

  if (!isLoggedIn)
    return (
      <CoreFrame title="Droplet Finance">
        <Login onLoggedIn={onLoggedIn} />
      </CoreFrame>
    );

  return (
    <div>
      <Dashboard
        balance={accountData.balance}
        onTopUp={onTopUp}
        onSend={onSend}
      />
      <History history={accountData.history} />
    </div>
  );
}
