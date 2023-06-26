import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../../../contexts/EthContext";

function Deposit() {
  const { state: { contracts, web3 } } = useEth();
  const { account } = useWeb3React();
  const {
    Governor: GovernorContract
  } = contracts || {};

  // token ID
  const [value, setValue] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const handleValueChange = (e) => {
    setValue(e.target.value);
  }

  function inputsAreValid() {
    if (value === "") {
      alert("Please enter a value to send")
      return false;
    }

    if (parseInt(value) === 0) {
      alert("Can't send 0");
      return false;
    }
    return true;
  }

  const sendToContract = async () => {
    if (inputsAreValid()) {
      let _value = web3.utils.toWei(value, 'ether');
      await GovernorContract.methods.deposit()
        .send({ from: account, value: _value })
        .catch(revert => {
          alert(revert.message);
        });
    }
  }

  const getBalanceOfContract = async () => {
    let balance = await web3.eth.getBalance(GovernorContract.options.address);
    setContractBalance(web3.utils.fromWei(balance, 'ether'));
  }

  return (
    <div>
      <h4>Send MATIC to governance contract</h4>
      <div>
        <input
          type="number"
          placeholder="value"
          value={value}
          onChange={handleValueChange}
        ></input>
        <button onClick={sendToContract}>Send</button>
      </div>
      <br />
      <div>
        <button onClick={getBalanceOfContract}>Get Balance</button>
        {contractBalance &&
          <p>{contractBalance} MATIC</p>
        }
      </div>
    </div>
  )
}

export default Deposit;