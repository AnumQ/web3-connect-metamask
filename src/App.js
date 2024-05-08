import { useState } from "react";
import "./App.css";
import Web3 from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const initWeb3 = async () => {
    // Modern dapp browsers
    // ethereum is the object injected as property on the window object by Ethereum-enabled browser extensions like MetaMask.
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Requst account access
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
      } catch (e) {
        setError(
          "Error connecting to Metamask. See console output for details. "
        );
        console.error("Error connecting to Metamask ", e);
      }
    }
    // legacy dapp browsers
    else if (window.web3) {
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setAccounts(accounts);
    }
    // Non-dapp browsers
    else {
      setError(
        "Non-Ethereum browser detected. Install Metamask on browser and try again."
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <p>{error && <span>{error}</span>}</p>
        {web3 && accounts.length > 0 && (
          <>
            <h2>Successfully connected to Metamask Wallet</h2>
            <h3>Connected to account: {accounts[0]}</h3>
          </>
        )}
        {accounts.length === 0 && (
          <button className="button" onClick={initWeb3}>
            Connect Your Metamask Wallet
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
