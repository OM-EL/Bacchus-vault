import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function DeleteAuctionSell() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

// token ID
const [tokenIdValue, setTokenIdValue] = useState("");
const handleTokenIdChange = (e) => {
  setTokenIdValue(e.target.value);
}

function inputsAreValid() {
  if (tokenIdValue === "") {
    alert("Please enter a token id")
    return false;
  }
  return true;
}

const deleteAuctionSell = async () => {
  if (inputsAreValid()) {
    await GovernorContract.methods.deleteAuctionSell(
      tokenIdValue,
    )
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }
}

  return (
    <div>
      <h4>Delete the auction sell price of a bottle</h4>
      <div>
        <input
          type="number"
          placeholder="token id"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        <button onClick={deleteAuctionSell}>Delete auction selling price</button>
      </div>
    </div>
  )
}

export default DeleteAuctionSell;