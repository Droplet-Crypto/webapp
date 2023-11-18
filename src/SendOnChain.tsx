import { useEffect, useState } from "react";
import { CoreFrame } from "./CoreFrame";
import {
  ChainsSettings,
  SupportedChains,
} from "./constants";
import {
  ActionExecutionStatus,
  SupportedChain,
  Token,
} from "./types";
import { useNavigate } from "react-router-dom";
import {
  getTokenHumanBalance,
  sendTokens,
} from "./blockchain";
import { useGlobalContext } from "./GlobalState";
import {
  Hex,
  checksumAddress,
  isAddress,
} from "viem";

function ChainOption(props: {
  name: string;
  onSelect: () => void;
}) {
  return (
    <div onClick={props.onSelect}>
      <p>{props.name}</p>
    </div>
  );
}

function ChainSelect(props: {
  onSelectChain: (chain: SupportedChain) => void;
}) {
  return (
    <div className="chainSelect">
      {SupportedChains.map((chain) => (
        <ChainOption
          key={chain.id}
          name={chain.name}
          onSelect={() =>
            props.onSelectChain(chain)
          }
        />
      ))}
    </div>
  );
}

function TokenOption(props: {
  symbol: string;
  onSelect: () => void;
}) {
  return (
    <div onClick={props.onSelect}>
      <p>{props.symbol}</p>
    </div>
  );
}

function TokenSelect(props: {
  chain: SupportedChain;
  onSelectToken: (token: Token) => void;
}) {
  const tokens =
    ChainsSettings[props.chain.id].tokens;

  return (
    <div className="tokenSelect">
      {tokens.map((token) => (
        <TokenOption
          key={token.address}
          symbol={token.symbol}
          onSelect={() =>
            props.onSelectToken(token)
          }
        />
      ))}
    </div>
  );
}

function SendTokensForm(props: {
  chain: SupportedChain;
  balance: number;
  token: Token;
}) {
  const [recipient, setRecipient] = useState("");
  const [stringAmount, setStringAmount] =
    useState("");
  const [message, setMessage] = useState("");
  const [userOpHash, setUserOpHash] =
    useState<Hex>();

  const chainSettings =
    ChainsSettings[props.chain.id];

  const updateExecutionState = (
    status: ActionExecutionStatus,
    content: string
  ) => {
    if (
      status === ActionExecutionStatus.SUBMITED
    ) {
      setUserOpHash(content as Hex);
      setMessage(
        "Waiting for operation execution..."
      );
    } else if (
      status === ActionExecutionStatus.EXECUTED
    ) {
      setMessage("Tokens have been transferred!");
    }
  };

  const sendIt = async () => {
    const humanAmount = parseFloat(
      stringAmount || "0"
    );
    if (!isAddress(recipient)) {
      setMessage(
        "Entered recipient is not a valid blockchain address."
      );
      return;
    }

    const checksumedRecipient =
      checksumAddress(recipient);

    setMessage(
      "Preparing tokens to be transferred..."
    );
    await sendTokens(
      props.token,
      checksumedRecipient,
      humanAmount,
      updateExecutionState
    );
  };

  return (
    <div className="sendTokensForm">
      <p>
        You have {props.balance}{" "}
        {props.token.symbol}
      </p>
      <p>Whom to send to:</p>
      <input
        type="text"
        placeholder="0x4bBa290826C253BD854121346c370a9886d1bC26"
        value={recipient}
        onChange={(event) =>
          setRecipient(event.target.value)
        }
      />
      <p>How much to send</p>
      <input
        type="number"
        placeholder={props.balance.toString()}
        value={stringAmount}
        onChange={(event) =>
          setStringAmount(event.target.value)
        }
      />
      {message && <p>{message}</p>}
      {userOpHash && (
        <a
          href={`${chainSettings.jiffyscanBaseUrl}/userOpHash/${userOpHash}`}
        >
          Details of the operation
        </a>
      )}
      <button onClick={sendIt}>Send it!</button>
    </div>
  );
}

// Steps:
// 1. Choose chain
// 2. Choose token
// 3. Enter amount and recepient
// 4. Send it!
export function SendOnChain() {
  const navigate = useNavigate();
  const { accountAddress } = useGlobalContext();

  const [chain, setChain] =
    useState<SupportedChain>();
  const [token, setToken] = useState<Token>();
  const [balance, setBalance] =
    useState<number>();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!chain || !token) return;

      const balance = await getTokenHumanBalance(
        chain,
        accountAddress!,
        token
      );
      setBalance(balance);
    };

    fetchBalance();
  }, [chain, token, accountAddress]);

  const onSelectChain = (
    chain: SupportedChain
  ) => {
    setChain(chain);
  };

  const onSelectToken = (token: Token) => {
    setToken(token);
  };

  if (!chain) {
    return (
      <CoreFrame
        title="Send tokens"
        goBack={() => navigate(-1)}
      >
        <ChainSelect
          onSelectChain={onSelectChain}
        />
      </CoreFrame>
    );
  }

  if (!token) {
    return (
      <CoreFrame
        title="Send tokens"
        goBack={() => setChain(undefined)}
      >
        <TokenSelect
          chain={chain}
          onSelectToken={onSelectToken}
        />
      </CoreFrame>
    );
  }

  if (balance === undefined) {
    return (
      <CoreFrame
        title="Send tokens"
        goBack={() => setToken(undefined)}
      >
        <p>Loading...</p>
      </CoreFrame>
    );
  }

  if (balance === 0) {
    return (
      <CoreFrame
        title="Send tokens"
        goBack={() => setToken(undefined)}
      >
        <p>You don't have any {token.symbol}.</p>
      </CoreFrame>
    );
  }

  return (
    <CoreFrame
      title="Send tokens"
      goBack={() => setToken(undefined)}
    >
      <SendTokensForm
        chain={chain}
        balance={balance}
        token={token}
      />
    </CoreFrame>
  );
}
