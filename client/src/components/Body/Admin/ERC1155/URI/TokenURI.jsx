import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function TokenURI() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  // Token ID
  const [tokenIdValue, setTokenIdValue] = useState("");
  const handleTokenIdChange = (e) => {
    setTokenIdValue(e.target.value);
  }

  // Token URI
  const [tokenCidValue, setTokenCidValue] = useState("");
  const handleTokenCidChange = (e) => {
    setTokenCidValue(e.target.value);
  }

  const setTokenURI = async () => {
    if (tokenCidValue === "") {
      alert("please enter a token URI to proceed");
      return;
    }
    await ERC1155Contract.methods.setTokenURI(tokenIdValue, tokenCidValue)
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Update token CID (i.e. "QmWDsbZaWS56tMHbphiYhQwg6yrR84CXkGur8mzwSnUREW")</h4>
      <div>
        <input
          type="number"
          placeholder="token id"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        <input
          type="text"
          placeholder="CID"
          value={tokenCidValue}
          onChange={handleTokenCidChange}
        ></input>
        <button onClick={setTokenURI}>Set token URI</button>
      </div>
    </div>
  )
}

export default TokenURI;