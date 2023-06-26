import Invest from "./Invest/Invest";
import Membership from "./Membership/Membership";
import Project from "./Project/Project";
import Vault from "./Vault/Vault";
import Admin from "./Admin/Admin";
import { useEth } from "../../contexts/EthContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

function Body({ pages, currentPage }) {
  const { state: { contracts } } = useEth();
  const { account } = useWeb3React();
  const {
    ERC1155: ERC1155Contract,
  } = contracts || {};

  const [bottles, setBottles] = useState([]);
  const [id, setId] = useState(0);

  const baseURI = 'ipfs://';

  const statuses = useMemo(() => {
    const statuses = {
      PreRelease: {
        name: 'Pre release',
        index: 0
      },
      WhiteListMinting: {
        name: 'Whitelist Mint',
        index: 1
      },
      PublicMinting: {
        name: 'Public Mint',
        index: 2
      },
      Hold: {
        name: 'Hold',
        index: 3
      },
      ReadyToBeSold: {
        name: 'Ready to be sold',
        index: 4
      },
      Sold: {
        name: 'Sold',
        index: 5
      },
      ReadyToBurn: {
        name: 'Ready to burn',
        index: 6
      }
    }
    return statuses;
  }, [])

  const governanceStatus = useMemo(() => {
    const statuses = {
      Closed: {
        name: 'Closed',
        index: 0
      },
      Voting: {
        name: 'Voting',
        index: 1
      },
      Auction: {
        name: 'Auction',
        index: 2
      }
    }
    return statuses;
  }, [])

  const fetchJson = async (url) => {
    let api_call, data;
    try {
      api_call = await fetch(url);
      data = await api_call.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  const fetchBottles = useCallback(async () => {
    let bottles = [];
    for (let i = 0; i < id; i++) {
      let bottle = await ERC1155Contract.methods.getBottle(i).call({ from: account });
      const totalSupply = await ERC1155Contract.methods.totalSupply(i).call({ from: account });
      bottle = Object.assign([], bottle);
      bottle.push(totalSupply);
      const uri = await ERC1155Contract.methods.uri(i).call({ from: account });
      const url = uri.replace(baseURI, 'https://gateway.pinata.cloud/ipfs/');
      const json = await fetchJson(url);
      if (json) {
        const imageURI = json.image;
        json.image = imageURI.replace(baseURI, 'https://gateway.pinata.cloud/ipfs/');
        bottle.push(json);
      }
      bottles.push(bottle);
    }

    setBottles(bottles);
  }, [id, account, ERC1155Contract]);

  const fetchCurrentId = useCallback(async () => {
    if (ERC1155Contract) {
      const _id = await ERC1155Contract.methods.getCurrentId().call({ from: account });
      setId(_id);
    }
  }, [account, ERC1155Contract]);

  const fetchAll = useCallback(() => {
    if (account) {
      fetchCurrentId();
      fetchBottles();
    }
  }, [account, fetchBottles, fetchCurrentId])

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function getBody(page) {
    switch (page) {
      case pages[0]:
        return <Project />;
      case pages[1]:
        return <Invest bottles={bottles} fetchAll={fetchAll} statuses={statuses} />;
      case pages[2]:
        return <Membership />;
      case pages[3]:
        return <Vault bottles={bottles} id={id} statuses={statuses} governanceStatus={governanceStatus} />;
      case pages[4]:
        return <Admin />;
      default:
        return <Project />;
    }
  }

  return (
    <div>
      {getBody(currentPage)}
    </div>
  )
}

export default Body;