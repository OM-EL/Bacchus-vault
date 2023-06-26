import "./VaultCard.css";
import defaultLogo from "../../../../assets/logo.png";

function VaultCard({ bottle }) {

  const metadata = bottle.metadata
  const image = metadata ? metadata.image : defaultLogo;
  const name = metadata ? metadata.name : "Metadata are missing";

  const apr = 25;

  return (
    <div className="vault-card">
      <div className="vault-card-picture">
        <img src={image} alt="bacchus logo" />
      </div>
      <div className="vault-card-information">
        <div className="vault-card-title">
          #{bottle.id} {name}
        </div>
        <div className="vault-card-values">
          <div className="vault-card-minted">
            Owned : {bottle.balance} / {bottle.maxSupply} ({Math.floor(bottle.balance / bottle.maxSupply * 100).toFixed(2)}%)
          </div>
          <div className="vault-card-apr">
            APR : {apr}%
          </div>
          <div className="vault-card-value">
            Value: {bottle.currentSuggestedPrice}$
          </div>
        </div>
      </div>
    </div>
  )
}

export default VaultCard;