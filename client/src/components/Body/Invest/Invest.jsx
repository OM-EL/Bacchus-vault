import "./Invest.css";
import BottleCard from "./BottleCard";
import OpenseaButton from "./OpenseaButton";

import { useEth } from "../../../contexts/EthContext";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

function Invest({ bottles, fetchAll, statuses }) {
  const { state: { contracts } } = useEth();
  const { active } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const ercAddress = () => {
    if (ERC1155Contract) return ERC1155Contract.options.address;
  }

  const hasBottles = () => {
    return bottles.length > 0 ?
      bottles.map((bottle, index) => {
        return <BottleCard key={index} index={index} bottle={bottle} statuses={statuses} fetchAll={fetchAll} />
      })
      :
      <p>No bottles listed yet</p>
  }

  useState(() => {
    fetchAll();
  })

  return (
    <>
      <div className="invest-div">
        <h1>CHOOSE YOUR INVESTMENT</h1>
      </div>
      <div className="bottle-card-div">
        {active ?
          hasBottles()
          :
          <p>Please connect your wallet to see listed bottles</p>
        }
      </div>
      <div className="opensea-div">
        <OpenseaButton ercAddress={ercAddress} />
      </div>
    </>

  )
}

export default Invest;