import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
import Body from "./components/Body"
import Footer from "./components/Footer";
import { useState } from "react";
import "./App.css";

function App() {
  
  const [currentPage, setCurrentPage] = useState("Project");
  const pages = [
    "Project",
    "Invest",
    "Membership",
    "Your Vault",
    "Admin"
  ]

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Header
            pages={pages}
            setCurrentPage={setCurrentPage}
          />
          <Body
            pages={pages}
            currentPage={currentPage}
          />
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
