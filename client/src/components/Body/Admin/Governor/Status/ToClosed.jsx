import { useWeb3React } from "@web3-react/core";
import { useEth } from "../../../../../contexts/EthContext";

function ToClosed() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  const setVotingSessionToClosed = async () => {
    await GovernorContract.methods._onSetVotingSessionToClosed()
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Set the governance contract to closed</h4>
      <div>
        <button onClick={setVotingSessionToClosed}>To Closed</button>
      </div>
    </div>
  )
}

export default ToClosed;