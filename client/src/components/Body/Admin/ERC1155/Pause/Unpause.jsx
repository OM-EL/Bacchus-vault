import { useWeb3React } from "@web3-react/core";
import { useEth } from "../../../../../contexts/EthContext";

function Unpause() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const unpause = async () => {
    await ERC1155Contract.methods.unpause()
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Unpause the smart contract</h4>
      <div>
        <button onClick={unpause}>Unpause</button>
      </div>
    </div>
  )
}

export default Unpause;