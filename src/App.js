import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // ethereum is the object injected as property on the window object by Ethereum-enabled browser extensions like MetaMask.
    if (window.ethereum) {
      // initialize web3
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setError(
        "Non-Ethereum browser detected. Install Metamask on browser and try again."
      );
    }
  }, []);

  const connectWallet = useCallback(async () => {
    // Modern dapp browsers
    if (web3) {
      // Requst account access
      try {
        const accounts = await web3.eth.requestAccounts();
        setAccounts(accounts);
      } catch (e) {
        setError(
          "Error connecting to Metamask. See console output for details. "
        );
        console.error("Error connecting to Metamask ", e);
      }
    } else {
      setError("Web 3 is not initialized");
    }
  }, [web3]);

  const disconnectWallet = useCallback(async () => {
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    setAccounts([]);
  }, []);

  // Get account balance using Web3.js
  const getBalance = useCallback(
    async (account) => {
      try {
        let balance = await web3.eth.getBalance(account); // returns balance in wei
        balance = web3.utils.fromWei(balance, "ether"); // convert to ether
        setBalance(balance);
      } catch (e) {
        setError("Error getting balance. See console output for details");
        console.error("Errong getting balance. Details: ", e);
      }
    },
    [web3]
  );

  return (
    <div className="App">
      <p>{error && <span>{error}</span>}</p>
      {accounts.length > 0 && (
        <>
          <h2>Successfully connected to Metamask Wallet</h2>
          <div className="card">
            <h3>Account Details</h3>
            <h5>Address: {accounts[0]}</h5>
          </div>
          <div className="card">
            <h3>Balance (eth): {balance}</h3>
            <button
              className="button"
              onClick={() => {
                getBalance(accounts[0]);
              }}
            >
              Get balance
            </button>
          </div>
          <br />
          <button className="button" onClick={disconnectWallet}>
            Disconnect Your Metamask Wallet
          </button>
        </>
      )}
      {accounts.length === 0 && (
        <button className="button-large" onClick={connectWallet}>
          Connect Your Metamask Wallet
        </button>
      )}
    </div>
  );
}

export default App;
