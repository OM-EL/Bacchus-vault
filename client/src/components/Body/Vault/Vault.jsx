import "./Vault.css";
import Bottles from "./Bottles";
import { useWeb3React } from "@web3-react/core";

function Vault({ bottles, id, statuses, governanceStatus }) {
  const { active } = useWeb3React();
  return (
    <div className="vault-div">
      {active ?
        <Bottles bottles={bottles} id={id} statuses={statuses} governanceStatus={governanceStatus} />
        :
        <p>Please connect your wallet to see your bottles</p>
      }
    </div>
  )
}

export default Vault;