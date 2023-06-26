import { useWeb3React } from "@web3-react/core";
import { useEth } from "../../../../../contexts/EthContext";

function ToVoting() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  const SetVotingSessionStatusToVoting = async () => {
    await GovernorContract.methods._onSetVotingSessionStatusToVoting()
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Set the governance contract to voting session</h4>
      <div>
        <button onClick={SetVotingSessionStatusToVoting}>To Voting</button>
      </div>
    </div>
  )
}

export default ToVoting;