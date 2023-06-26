import "./PendingVote.css";
import defaultLogo from "../../../../assets/logo.png";
import { useEth } from "../../../../contexts/EthContext";
import { useWeb3React } from "@web3-react/core";

function PendingVote({ bottle, fetchUserBottles }) {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  const metadata = bottle.metadata
  const image = metadata ? metadata.image : defaultLogo;
  const name = metadata ? metadata.name : "Metadata are missing";

  const vote = async (hold) => {
    await GovernorContract.methods.Vote(bottle.id, hold)
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
    fetchUserBottles();
  }

  return (
    <div className="pending-card">
      <div className="pending-card-picture">
        <img src={image} alt="bacchus logo" />
      </div>

      <div className="pending-card-information">
        <div className="pending-card-title">
          #{bottle.id} {name}
        </div>
        <div className="pending-card-values">
          <div className="pending-card-values-available">
            {bottle.balance} / {bottle.maxSupply}
          </div>
          <div className="pending-card-values-profit">
            Profit : {bottle.actualSellingPrice / bottle.maxSupply}%
          </div>
        </div>
      </div>

      <div className="pending-card-btn">
        <div className="pending-card-btn-sell">
          <button onClick={() => vote(false)}>SELL</button>
        </div>
        <div className="pending-card-btn-hold">
          <button onClick={() => vote(true)}>HOLD</button>
        </div>
      </div>

    </div>
  )
}

export default PendingVote;