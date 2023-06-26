import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function BaseURI() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const [baseUriValue, setBaseUriValue] = useState("");
  const handleBaseUriChange = (e) => {
    setBaseUriValue(e.target.value);
  }

  const setBaseURI = async () => {
    if (baseUriValue === "") {
      alert("please enter a base URI to proceed");
      return;
    }
    await ERC1155Contract.methods.setBaseURI(baseUriValue)
      .send({ from: account })
      .catch(revert => {
        alert(revert.message);
      });
  }

  return (
    <div>
      <h4>Update base URI (i.e. "ipfs://")</h4>
      <div>
        <input
          type="text"
          placeholder="base URI"
          value={baseUriValue}
          onChange={handleBaseUriChange}
        ></input>
        <button onClick={setBaseURI}>Set base URI</button>
      </div>
    </div>
  )
}

export default BaseURI;