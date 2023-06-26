import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useCallback } from "react";
import { useEth } from "../../../contexts/EthContext";
import "./Bottles.css";
import VaultCard from "./Cards/VaultCard";
import BurnCard from "./Cards/BurnCard";
import PendingVote from "./Cards/PendingVote";
import Voted from "./Cards/Voted";

function Bottles({ bottles, id, statuses, governanceStatus }) {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
    Governor: GovernorContract
  } = contracts || {};

  const [userBottles, setUserBottles] = useState([]);
  const [bottlesToBurn, setBottlesToBurn] = useState([]);
  const [bottlesToVote, setBottlesToVote] = useState([]);
  const [bottlesVoted, setBottlesVoted] = useState([]);

  const fetchUserBottles = useCallback(async () => {
    let _userBottles = [];
    for (let i = 0; i <= id; i++) {
      let balance = await ERC1155Contract.methods.balanceOf(account, i).call({ from: account });
      if (parseInt(balance) > 0) {
        let bottleObject = {
          id: i,
          actualSellingPrice: bottles[i].actualSellingPrice,
          bottleStatus: bottles[i].bottleStatus,
          currentSuggestedPrice: bottles[i].currentSuggestedPrice,
          maxSupply: bottles[i].maxSupply,
          mintPrice: bottles[i].mintPrice,
          balance: balance,
          metadata: bottles[i][6],
        }
        _userBottles.push(bottleObject);
      }
    }

    if (_userBottles.length > 0) {
      let _bottlesToBurn = [];
      let _bottlesToVote = [];
      let _bottlesVoted = [];
      let actualGovernanceStatus = await GovernorContract.methods.getSellingSessionStatus().call({ from: account });
      for (const bottle of _userBottles) {
        if (parseInt(bottle.bottleStatus) === statuses.ReadyToBurn.index) {
          _bottlesToBurn.push(bottle);
        }
        if (parseInt(actualGovernanceStatus) === governanceStatus.Voting.index && parseInt(bottle.bottleStatus) === statuses.Hold.index) {
          let voted = await GovernorContract.methods.getVoted(bottle.id, account).call({ from: account });
          if (voted) _bottlesVoted.push(bottle);
          else _bottlesToVote.push(bottle);
        }
      }

      setBottlesToBurn(_bottlesToBurn);
      setBottlesToVote(_bottlesToVote);
      setBottlesVoted(_bottlesVoted);
      setUserBottles(_userBottles);
    }
  }, [ERC1155Contract, GovernorContract, account, bottles, id, statuses, governanceStatus]);

  useEffect(() => {
    
    fetchUserBottles();
    // TODO : update method when governance is implemented
  }, [fetchUserBottles]);

  return (
    <>
      {userBottles.length > 0 ?
        <>
          <div className="vault-left">
            <div className="your-vault-div">
              <h1>Your Vault</h1>
              {userBottles.map((bottle, index) => {
                return <VaultCard key={index} bottle={bottle} />
              })}
            </div>
            {bottlesToBurn.length > 0 &&
              <div className="burn-profit-div">
                <h1>Burn & Profits</h1>
                {bottlesToBurn.map((bottle, index) => {
                  return <BurnCard key={index} bottle={bottle} />
                })}
              </div>
            }

          </div>
          <div className="vault-right">
            {bottlesToVote.length > 0 &&
              <div className="pending-vote-div">
                <h1>Pending Vote</h1>
                {bottlesToVote.map((bottle, index) => {
                  return <PendingVote key={index} bottle={bottle} fetchUserBottles={fetchUserBottles} />
                })}
              </div>
            }
            {bottlesVoted.length > 0 &&
              <div className="voted-div">
                <h1>Voted</h1>
                {bottlesVoted.map((bottle, index) => {
                  return <Voted key={index} bottle={bottle} />
                })}
              </div>
            }
          </div>
        </>
        :
        <p>You wallet is empty :-(</p>
      }
    </>)
}

export default Bottles;