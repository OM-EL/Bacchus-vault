import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function ResetTokenRoyalty() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  // token id
  const [tokenIdValue, setTokenIdValue] = useState("");
  const handleTokenIdChange = (e) => {
    setTokenIdValue(e.target.value);
  }

  function inputIsValid() {
    if (tokenIdValue === "") {
      alert("Please enter a token ID")
      return false;
    }
    return true;
  }

  const resetTokenRoyalty = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.resetTokenRoyalty(
        tokenIdValue
      )
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  return (
    <div>
      <h4>Reset a token royalty</h4>
      <div>
        <input
          type="number"
          placeholder="token id"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        <button onClick={resetTokenRoyalty}>Reset token royalty</button>
      </div>
    </div>
  )
}

export default ResetTokenRoyalty;