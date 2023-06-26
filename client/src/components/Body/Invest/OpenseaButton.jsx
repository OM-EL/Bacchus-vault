import opensea from "../../../assets/opensea.jpg";
import "./OpenseaButton.css";

function OpenseaButton() {
  const collectionUrl = "https://testnets.opensea.io/fr/collection/bacchus-vault-v3";
  return (
    <a href={collectionUrl} target="_blank" rel="noopener noreferrer">
      <img className="opensea" src={opensea} alt="OpenSea" />
    </a>

  )
}

export default OpenseaButton;