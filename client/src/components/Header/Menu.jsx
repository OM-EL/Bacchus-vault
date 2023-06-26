import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import "./Menu.css";

function Menu({ pages, setCurrentPage }) {
  const { state: { web3, contracts } } = useEth();
  const { account } = useWeb3React();
  const [ercOwner, setErcOwner] = useState("");
  const [governorOwner, setGovernorOwner] = useState("");
  const {
    ERC1155: ERC1155Contract,
    Governor: GovernorContract
  } = contracts || {};

  const isErcOwner = () => {
    if (account && ercOwner) {
      let user = web3.utils.toChecksumAddress(account);
      let _ercOwner = web3.utils.toChecksumAddress(ercOwner);
      return user === _ercOwner;
    }
    return false;
  }

  const isGovernorOwner = () => {
    if (account && governorOwner) {
      let user = web3.utils.toChecksumAddress(account);
      let _governorOwner = web3.utils.toChecksumAddress(governorOwner);
      return user === _governorOwner;
    }
    return false;
  }

  const visiblePages = () => {
    let visible = pages.map((object) => { return object });
    if (!isErcOwner() && !isGovernorOwner()) {
      visible.pop();
    }
    return visible;
  }

  useEffect(() => {
    const fetchErcOwner = async () => {
      try {
        const currentOwner = await ERC1155Contract.methods.owner().call();
        setErcOwner(currentOwner)
      } catch (err) {
        setErcOwner("");
      }
    }

    const fetchGovernorOwner = async () => {
      try {
        const currentOwner = await GovernorContract.methods.owner().call();
        setGovernorOwner(currentOwner)
      } catch (err) {
        setGovernorOwner("");
      }
    }

    fetchErcOwner();
    fetchGovernorOwner();
  })

  return (
    <>
      {visiblePages().map((page, index) => {
        return (
          <button
            className="menu-btn"
            key={index}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      })}
    </>
  )
}

export default Menu;