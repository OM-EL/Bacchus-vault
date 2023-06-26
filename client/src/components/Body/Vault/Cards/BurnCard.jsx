import "./BurnCard.css";
import defaultLogo from "../../../../assets/logo.png";

function BurnCard({ bottle }) {

  const metadata = bottle.metadata
  const image = metadata ? metadata.image : defaultLogo;
  const name = metadata ? metadata.name : "Metadata are missing";

  const apr = 25;

  return (
    <div className="burn-card">
      <div className="burn-card-picture">
        <img src={image} alt="bacchus logo" />
      </div>
      <div className="burn-card-information">
        <div className="burn-card-title">
          #{bottle.id} {name}
        </div>
        <div className="burn-card-values">
          <div className="burn-card-values-available">
            Owned : {bottle.balance} / {bottle.maxSupply}
          </div>
          <div className="burn-card-values-profits">
            <div>Fraction price : {bottle.currentSuggestedPrice / bottle.maxSupply}$</div>
            <div>Auction profit : {bottle.actualSellingPrice / bottle.maxSupply}$</div>
            <div>APR : {apr}%</div>
          </div>
          <div className="burn-card-values-burn-btn">
            <button>BURN</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BurnCard;