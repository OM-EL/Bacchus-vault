import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useEth } from "../../../contexts/EthContext";
import "./MintButton.css";
import stripe from "../../../assets/stripe.png";

function MintButton({ index, mintPrice, statuses, status, setTotalSupply, totalSupply, maxSupply, fetchAll }) {
  const { state: { web3, contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const [mintAmount, setMintAmount] = useState(1);

  const isRemainingSupply = () => {
    return mintAmount < maxSupply - totalSupply;
  }

  const handleMintValue = (e) => {
    if (parseInt(e.target.value) <= (maxSupply - totalSupply)) setMintAmount(parseInt(e.target.value));
  }

  function increment() {
    if (isRemainingSupply())
      setMintAmount(mintAmount + 1);
  }

  function decrement() {
    if (mintAmount > 1) setMintAmount(mintAmount - 1);
  }

  const mint = async () => {
    let _value = mintAmount * web3.utils.toWei(mintPrice, 'ether');
    if (status === statuses.WhiteListMinting.index) {
      await ERC1155Contract.methods.whiteListMint(index, mintAmount)
        .send({ from: account, value: _value })
    }
    if (status === statuses.PublicMinting.index) {
      await ERC1155Contract.methods.publicMint(index, mintAmount)
        .send({ from: account, value: _value })
    }
    const newTotalSupply = await ERC1155Contract.methods.totalSupply(index).call({ from: account });
    setTotalSupply(parseInt(newTotalSupply));
    fetchAll();
  }

  return (
    <div className="bottle-card-mint-div">
      <div className="bottle-card-mint-input">
        <button onClick={decrement}>-</button>
        <input
          type="number"
          value={mintAmount}
          onChange={handleMintValue}
        />
        <button onClick={increment}>+</button>
      </div>
      <div className="bottle-card-mint-button">
        <button onClick={mint}>Mint</button>
      </div>
      <div className="stripe-btn">
        <img src={stripe} alt="stripe" />
      </div>
    </div>
  )
}

export default MintButton;