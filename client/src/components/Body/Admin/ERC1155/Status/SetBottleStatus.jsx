import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function SetBottleStatus() {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const [tokenIdValue, SetTokenIdValue] = useState("");
  const handleTokenIdChange = (e) => {
    SetTokenIdValue(e.target.value);
  }

  function inputIsValid() {
    if (tokenIdValue === "") {
      alert("Please enter a token id")
      return false;
    }
    return true;
  }

  const setBottleStatusToWhitelistMinting = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.setBottleStatusToWhiteListMinting(tokenIdValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const setBottleStatusToPublicMinting = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.setBottleStatusToPublicMinting(tokenIdValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const setBottleStatusToHold = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.setBottleStatusToHold(tokenIdValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const setBottleStatusToReadyToBeSold = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.setBottleStatusToReadyToBeSold(tokenIdValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const setBottleStatusToSold = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.setBottleStatusToSold(tokenIdValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const setBottleStatusToReadyToBurn = async () => {
    if (inputIsValid()) {
      await ERC1155Contract.methods.setBottleStatusToReadyToBurn(tokenIdValue)
        .send({ from: account })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const functions = [
    setBottleStatusToWhitelistMinting,
    setBottleStatusToPublicMinting,
    setBottleStatusToHold,
    setBottleStatusToReadyToBeSold,
    setBottleStatusToSold,
    setBottleStatusToReadyToBurn
  ]

  const names = [
    "To Whitelist Minting",
    "To Public Minting",
    "To Hold",
    "To Ready To Be Sold",
    "To Sold",
    "To Ready To Burn"
  ]

  return (
    <div>
      <h4>Set bottle status</h4>
      <div>
        <input
          type="number"
          placeholder="token ID"
          value={tokenIdValue}
          onChange={handleTokenIdChange}
        ></input>
        {functions.map((funct, index) => {
          return <button
            key={index}
            onClick={funct}
          >{names[index]}</button>
        })}
      </div>
    </div>
  )
}

export default SetBottleStatus;