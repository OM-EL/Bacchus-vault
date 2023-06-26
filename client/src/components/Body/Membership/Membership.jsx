import "./Membership.css";
import OpenSeaButton from "../Invest/OpenseaButton";
import membersOnly from "../../../assets/membership/members-only.png";
import membersBronze from "../../../assets/membership/members-bronze.png";
import membersSilver from "../../../assets/membership/members-silver.png";
import membersPlatinum from "../../../assets/membership/members-platinum.png";
import membersPremium from "../../../assets/membership/members-premium.png";
import membershipOpp from "../../../assets/membership/membership.png";

function Membership() {
  return (
    <div className="membership-div">
      <div className="membership-desc">
        <div className="membership-desc-text">
          <h1>BECOME ONE OF OUR VIP MEMBER :</h1>
          <h1>WHAT'S THE BENEFITS ?</h1>
          <ul>
            <li>Early access to Bottle sell</li>
            <li>Rewards from Auction sell</li>
            <li>Private event</li>
            <li>Discount with partner</li>
            <li>Gift</li>
          </ul>
        </div>
        <div className="membership-desc-logo">
          <img src={membersOnly} alt="members only" />
        </div>
      </div>
      <div className="membership-logos">
        <img src={membersBronze} alt="members bronze" />
        <img src={membersSilver} alt="members silver" />
        <img src={membersPlatinum} alt="members platinum" />
        <img src={membersPremium} alt="members premium" />
      </div>
      <div className="membership-opportunities">
        <img src={membershipOpp} alt="membership opportunities" />
      </div>
      <OpenSeaButton />
    </div>
  )
}

export default Membership;