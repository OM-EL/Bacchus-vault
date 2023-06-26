import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function SetTokenRoyalty() {
  const { state: { contracts, web3 } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  // token id
  const [tokenIdValue, setTokenIdValue] = useState("");
  const handleTokenIdChange = (e) => {
    setTokenIdValue(e.target.value);
  }

  // receiver address
  const [receiverAddressValue, setReceiverAddressValue] = useState("");
  const handleReceiverAddressChange = (e) => {
    setReceiverAddressValue(e.target.value);
  }

  // percentage
  const [percentageValue, setPercentageValue] = useState("");
  const handlePercentageChange = (e) => {
    setPercentageValue(e.target.value);
  }

  function inputsAreValid() {
    if (tokenIdValue === "") {
      alert("Please enter a token ID")
      return false;
    }
    if (receiverAddressValue === "") {
      alert("Please enter a receiver address")
      return false;
    }
    if (percentageValue === "") {
      alert("Please enter a percentage of royalties");
      return false;
    }
    if (!web3.utils.isAddress(receiverAddressValue)) {
      alert("Invalid address");
      return false;
    }

    return true;
  }

  const setTokenRoyalty = async () => {
    if (inputsAreValid()) {
      await ERC1155Contract.methods.setTokenRoyalty(
        tokenIdValue,
        receiverAddressValue,
        percentageValue,
      )
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  return (
    <div>
      <h4>Set token royalty</h4>
      <div>
        <input
          type="number"
          placeholder="token id"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        <input
          type="text"
          placeholder="receiver address"
          value={receiverAddressValue}
          onChange={handleReceiverAddressChange}
        ></input>
        <input
          type="number"
          placeholder="percentage"
          value={percentageValue}
          onChange={handlePercentageChange}
        ></input>
        <button onClick={setTokenRoyalty}>Set token royalty</button>
      </div>
    </div>
  )
}

export default SetTokenRoyalty;