import "./Voted.css";
import defaultLogo from "../../../../assets/logo.png";
import { useEth } from "../../../../contexts/EthContext";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

function Voted({ bottle }) {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  const [votedHold, setVotedHold] = useState("");
  const metadata = bottle.metadata
  const image = metadata ? metadata.image : defaultLogo;

  useState(() => {
    const votedFor = async () => {
      let _votedHold = await GovernorContract.methods.getVotedToHold(bottle.id, account).call({ from: account });
      setVotedHold(_votedHold);
    }
    votedFor();
  })

  return (
    <div className="voted-card">
      <div className="voted-card-picture">
        <img src={image} alt="bacchus logo" />
      </div>

      {votedHold === true &&
        <div className="voted-card-hold">
          HOLD
        </div>
      }

      {votedHold === false &&
        <div className="voted-card-sell">
          SELL
        </div>
      }

    </div>
  )
}

export default Voted;