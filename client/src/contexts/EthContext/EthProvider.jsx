import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifacts => {
      if (artifacts) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const networkID = await web3.eth.net.getId();
        let contracts = {};
        try {
          for (const [contractName, artifact] of Object.entries(artifacts)) {
            const address = artifact.networks[networkID].address;
            const contract = new web3.eth.Contract(artifact.abi, address);
            contracts[contractName] = contract;
          }
        } catch (err) {
          contracts = null;
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifacts, web3, networkID, contracts }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifacts = {
          ERC1155: require("../../contracts/BacchusVaultERC1155.json"),
          Governor: require("../../contracts/BacchusVaultGovernor.json")
        };
        init(artifacts);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifacts);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifacts]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
