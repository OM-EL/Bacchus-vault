import { useWeb3React } from "@web3-react/core";
import { useEth } from "../../../../../contexts/EthContext";

function Pause() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const pause = async () => {
    await ERC1155Contract.methods.pause()
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Pause the smart contract</h4>
      <div>
        <button onClick={pause}>Pause</button>
      </div>
    </div>
  )
}

export default Pause;