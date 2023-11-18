import { useNavigate } from "react-router-dom";
import { CoreFrame } from "./CoreFrame";
import { useGlobalContext } from "./GlobalState";

export function Topup() {
  const navigate = useNavigate();
  const { accountAddress } = useGlobalContext();
  return (
    <CoreFrame
      title="Top up"
      goBack={() => navigate(-1)}
    >
      <p>
        In order to top up please send crypto
        tokens to {accountAddress} on Polygon
        blockchain.
      </p>
    </CoreFrame>
  );
}
