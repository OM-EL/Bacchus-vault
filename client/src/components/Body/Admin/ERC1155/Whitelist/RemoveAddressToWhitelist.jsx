import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function RemoveAddressTowhitelist() {
  const { state: { contracts, web3 } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const [addressValue, setAddressValue] = useState("");
  const handleAddressChange = (e) => {
    setAddressValue(e.target.value);
  }

  const removeAddressFromWhitelist = async () => {
    if (addressValue === "") {
      alert("please enter an address to proceed");
      return;
    }
    if (web3.utils.isAddress(addressValue)) {
      await ERC1155Contract.methods.removeAddressFromWhitelist(addressValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    } else {
      alert("Invalid address");
    }
  }

  return (
    <div>
      <h4>Remove an address from the whitelist</h4>
      <div>
        <input
          type="text"
          placeholder="address"
          value={addressValue}
          onChange={handleAddressChange}
        ></input>
        <button onClick={removeAddressFromWhitelist}>Remove address</button>
      </div>
    </div>
  )
}

export default RemoveAddressTowhitelist;