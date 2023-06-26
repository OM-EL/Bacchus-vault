import "./Project.css";
import projectbody from "../../../assets/project-body.png";
import roadmap from "../../../assets/roadmap.png";
import team from "../../../assets/team.png";

function Project() {
  return (
    <div className="project-div">
      <h1>What is BACCHUS VAULT ?</h1>
      <p>Investment platform for great wines and spirits</p>
      <p>Using fractional NFT</p>
      <p>International platform made in France</p>

      <img className="project-body" src={projectbody} alt="Project body" />

      <h1>Are rare spirits a good investment ?</h1>
      <p>
        High end spirits as an asset have outperformed Gold and the S&P 500. The investment is completely recession proof. The only risk is damaging the liquid. The number of collectors grew by 582% in the last 10 years and yet there is still no way to prove authenticity or ownership.
      </p>
      <p>* Not financial advice. Past performance is not indicative of future returns.</p>

      <h1>How it works ?</h1>
      <p>
        One of the most unique parts of BV is that the digital F-NFTs are backed by the actual physical bottles. The price of the fraction will also evolue years after years
      </p>

      <h1>Our fee structure is very simple</h1>
      <div className="fee-structure">
        <div>
          <h3>WHEN YOU BUY A F-NFT :</h3>
          <p>Minting Price includes 20% for the project.
            With an average apr at 17%, this part represents the minimum period of staking per bottle. In order to motivate people to invest for more than year (and get a better rentability), this percentage will help the growth of our cave</p>
          <h3>WHEN YOU BURN YOUR F-NFT :</h3>
          <p>Collectors receive 90% of their selling price. The remaining 10% is split between the Founder and the Partner on the project .</p>
        </div>
        <div>
          <h3>Secondary Marketplace :</h3>
          <p>Users can list, bid and purchase bottles on the secondary marketplace. In order to helps us to maintain the Dapp and the quality of our offer, we will charge 10% in Creator Fees</p>
          <h3>Auction Sell :</h3>
          <p>If there is any realized gain during the auction sale, 50% are directly redistributed to the Holder of the F-NFT Bottle, 20% goes to the platform, 15% to the partner and 15% are redistributed to our VIP Member.</p>
          <h3>Membership :</h3>
          <p>The sales of the NFT's Membership is going to help us acquire new exceptionals products and organize private sales for our members.
            differents Level of Membership</p>
        </div>
      </div>
      <img className="project-roadmap" src={roadmap} alt="Roadmap" />
      <img className="project-team" src={team} alt="Team" />
    </div>
  )
}

export default Project;