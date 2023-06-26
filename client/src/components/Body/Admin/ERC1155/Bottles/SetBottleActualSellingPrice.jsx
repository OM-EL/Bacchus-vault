import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function SetBottleActualSellingPrice() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  // token ID
  const [tokenIdValue, setTokenIdValue] = useState("");
  const handleTokenIdChange = (e) => {
    setTokenIdValue(e.target.value);
  }

  // selling price
  const [sellingPriceValue, setSellingPriceValue] = useState("");
  const handleSellingPriceChange = (e) => {
    setSellingPriceValue(e.target.value);
  }

  function inputsAreValid() {
    if (tokenIdValue === "") {
      alert("Please enter a token id")
      return false;
    }
    if (sellingPriceValue === "") {
      alert("Please enter a selling price");
      return false;
    }
    return true;
  }

  const setBottleActualSellingPrice = async () => {
    if (inputsAreValid()) {
      await ERC1155Contract.methods.setBottleActualSellingPrice(
        tokenIdValue,
        sellingPriceValue,
      )
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  return (
    <div>
      <h4>Set the selling price of a bottle</h4>
      <div>
        <input
          type="number"
          placeholder="token id"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        <input
          type="number"
          placeholder="selling price"
          value={sellingPriceValue}
          onChange={handleSellingPriceChange}
        ></input>
        <button onClick={setBottleActualSellingPrice}>Set selling price</button>
      </div>
    </div>
  )
}

export default SetBottleActualSellingPrice;