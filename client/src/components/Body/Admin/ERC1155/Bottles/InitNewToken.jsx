import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function InitNewToken() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  // max supply
  const [maxSupplyValue, setMaxSupplyValue] = useState("");
  const handleMaxSupplyChange = (e) => {
    setMaxSupplyValue(e.target.value);
  }

  // mint price
  const [mintPriceValue, setMintPrice] = useState("");
  const handleMintPriceChange = (e) => {
    setMintPrice(e.target.value);
  }

  // CID
  const [cidValue, setCid] = useState("");
  const handleCidChange = (e) => {
    setCid(e.target.value);
  }

  // init new token
  const initNewToken = async () => {
    if (maxSupplyValue === "") {
      alert("Please enter a max supply")
      return;
    }
    if (mintPriceValue === "") {
      alert("Please enter a mint price");
      return;
    }
    if (cidValue === "") {
      alert("Please enter a CID for this token");
      return;
    }
    await ERC1155Contract.methods.initNewToken(
      maxSupplyValue,
      mintPriceValue,
      cidValue
    )
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      })
  }

  return (
    <div>
      <h4>Init new bottle</h4>
      <div>
        <input
          type="number"
          placeholder="max supply"
          value={maxSupplyValue}
          onChange={handleMaxSupplyChange}
        ></input>
        <input
          type="number"
          placeholder="mint price"
          value={mintPriceValue}
          onChange={handleMintPriceChange}
        ></input>
        <input
          type="text"
          placeholder="CID"
          value={cidValue}
          onChange={handleCidChange}
        ></input>
        <button onClick={initNewToken}>Init new bottle</button>
      </div>
    </div>
  )
}

export default InitNewToken;