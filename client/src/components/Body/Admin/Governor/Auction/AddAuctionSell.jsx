import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function AddAuctionSell() {
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

// selling price
const [auctionPriceValue, setAuctionPriceValue] = useState("");
const handleAuctionPriceChange = (e) => {
  setAuctionPriceValue(e.target.value);
}

function inputsAreValid() {
  if (tokenIdValue === "") {
    alert("Please enter a token id")
    return false;
  }
  if (auctionPriceValue === "") {
    alert("Please enter an auction price");
    return false;
  }
  return true;
}

const addAuctionSell = async () => {
  if (inputsAreValid()) {
    await GovernorContract.methods.addAuctionSell(
      tokenIdValue,
      auctionPriceValue,
    )
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }
}

  return (
    <div>
      <h4>Add auction sell price of a bottle</h4>
      <div>
        <input
          type="number"
          placeholder="token id"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        <input
          type="number"
          placeholder="auction selling price"
          value={auctionPriceValue}
          onChange={handleAuctionPriceChange}
        ></input>
        <button onClick={addAuctionSell}>Add auction selling price</button>
      </div>
    </div>
  )
}

export default AddAuctionSell;