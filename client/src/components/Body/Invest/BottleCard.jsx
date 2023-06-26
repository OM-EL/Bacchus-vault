import "./BottleCard.css";
import { useEth } from "../../../contexts/EthContext";
import defaultLogo from "../../../assets/logo.png";
import { useState, useEffect, useCallback } from "react";
import MintButton from "./MintButton";
import { useWeb3React } from "@web3-react/core";

function BottleCard({ index, bottle, statuses, fetchAll }) {
  const { state: { web3, contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const [mintable, setMintable] = useState(false);
  const [totalSupply, setTotalSupply] = useState(parseInt(bottle[5]));
  const [statusName, setStatusName] = useState("");

  const mintPrice = web3.utils.fromWei(bottle.mintPrice, 'ether');

  const status = parseInt(bottle.bottleStatus);

  const maxSupply = parseInt(bottle.maxSupply);
  const json = bottle[6];
  const image = json ? json.image : defaultLogo;
  const name = json ? json.name : "Metadata are missing";
  const description = json ? json.description : "description is missing";

  const fetchStatusName = useCallback(() => {
    const name = Object.values(statuses)
      .filter(({ index }) => index === status)
      .reduce((sum, name) => sum + name)
      .name
    setStatusName(name);
  }, [status, statuses]);

  useEffect(() => {

    const isAddressInwhitelist = async () => {
      const result = await ERC1155Contract.methods.isAddressInwhitelist(account).call({ from: account });
      return result;
    }

    const CheckIfMintable = async () => {
      if (parseInt(totalSupply) >= parseInt(maxSupply)) {
        setMintable(false);
        return;
      }

      const isPublicMinting = status === statuses.PublicMinting.index;

      const isWhitelisted = await isAddressInwhitelist();
      const isWhitelistMintingAndWhitelisted = (status === statuses.WhiteListMinting.index) && isWhitelisted;

      const result = isPublicMinting || isWhitelistMintingAndWhitelisted;
      setMintable(result);
    }
    fetchStatusName();
    CheckIfMintable();
  }, [ERC1155Contract, account, status, statuses.PublicMinting, statuses.WhiteListMinting, maxSupply, totalSupply, statuses, fetchStatusName])

  return (
    <div className="bottle-card">
      <div className="bottle-card-title">
        <h2>#{index} {name}</h2>
      </div>
      <div className="bottle-card-details">
        <div className="bottle-card-picture">
          <img src={image} alt="favorite" />

          {mintable &&
            <MintButton
              index={index}
              mintPrice={mintPrice}
              statuses={statuses}
              status={status}
              setTotalSupply={setTotalSupply}
              totalSupply={totalSupply}
              maxSupply={maxSupply}
              fetchAll={fetchAll}
            />
          }

        </div>
        <div className="bottle-card-infos">
          <div className="bottle-card-stats">
            <div className="bottle-card-stats-left">
              Mint price : {mintPrice} MATIC
              <br />
              Nbr of F-NFT : {bottle.maxSupply}
              <br />
              {maxSupply === totalSupply ? <strong>SOLDOUT</strong> : 'Available : ' + (maxSupply - totalSupply).toString()}
              <br />
              Price : {bottle.currentSuggestedPrice}$
            </div>
            <div className="bottle-card-stats-right">
              Status : {statusName}
              <br />
              Average APR (%) : 25%
              <br />
              Min. staking time : 3 years
              <br />
              Max. staking time : 10 years
            </div>
          </div>
          <div className="bottle-card-description">
            <h3>DESCRIPTION</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottleCard;