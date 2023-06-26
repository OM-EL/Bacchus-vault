import "./ConnectButton.css";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import mm from "../../assets/mm.png";

function ConnectButton() {
  const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 1337, 80001]
  });

  const { activate, deactivate, active, account } = useWeb3React();

  const disconnect = () => {
    if (window.confirm('Disconnect ?')) deactivate();
  }

  const connect = () => {
    activate(Injected);
  }

  return (
    <>
      {
        active ?
          <button onClick={disconnect} className="connect-btn">Connected with wallet {account}</button>
          :
          <button onClick={connect} className="connect-btn scaled">
            <img src={mm} alt="mm" /> Connect wallet
          </button>
      }
    </>
  )
}

export default ConnectButton;