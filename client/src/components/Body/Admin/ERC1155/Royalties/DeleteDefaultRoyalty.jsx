import { useWeb3React } from "@web3-react/core";
import { useEth } from "../../../../../contexts/EthContext";

function DeleteDefaultRoyalty() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const deleteDefaultRoyalty = async () => {
    await ERC1155Contract.methods.deleteDefaultRoyalty()
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Delete the default royalty</h4>
      <div>
        <button onClick={deleteDefaultRoyalty}>Delete default royalty</button>
      </div>
    </div>
  )
}

export default DeleteDefaultRoyalty;