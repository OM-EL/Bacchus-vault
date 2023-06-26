import { useWeb3React } from "@web3-react/core";
import { useEth } from "../../../../../contexts/EthContext";

function ToAuction() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  const setVotingSessionToAuction = async () => {
    await GovernorContract.methods._onSetVotingSessionToAuction()
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Set the governance contract to auction session</h4>
      <div>
        <button onClick={setVotingSessionToAuction}>To Auction</button>
      </div>
    </div>
  )
}

export default ToAuction;