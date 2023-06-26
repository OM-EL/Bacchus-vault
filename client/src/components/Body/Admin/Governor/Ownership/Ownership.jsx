import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function Ownership() {
  const { state: { contracts, web3 } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  const [addressValue, setAddressValue] = useState("");
  const handleAddressChange = (e) => {
    setAddressValue(e.target.value);
  }

  const transferOwnership = async () => {
    if (addressValue === "") {
      alert("please enter an address to proceed");
      return;
    }
    if (web3.utils.isAddress(addressValue)) {
      await GovernorContract.methods.transferOwnership(addressValue)
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
      <h4>Transfer ownership</h4>
      <div>
        <input
          type="text"
          placeholder="address"
          value={addressValue}
          onChange={handleAddressChange}
        ></input>
        <button onClick={transferOwnership}>Add address</button>
      </div>
    </div>
  )
}

export default Ownership;