import { useState, useCallback, useEffect } from "react";
import "./App.css";
import Web3 from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);

  // ethereum is the object injected as property on the window object by Ethereum-enabled browser extensions like MetaMask.
  const MetaMask = window.ethereum;

  useEffect(() => {
    if (MetaMask) {
      const web3Instance = new Web3(MetaMask);
      setWeb3(web3Instance);
    }
  }, [MetaMask]);

  const connectWallet = useCallback(async () => {
    // Modern dapp browsers
    if (MetaMask) {
      // Requst account access
      try {
        // https://docs.metamask.io/wallet/reference/eth_accounts/
        const accounts = await MetaMask.request({
          method: "eth_requestAccounts",
          params: [],
        });
        setAccounts(accounts);
      } catch (e) {
        setError(
          "Error connecting to Metamask. See console output for details. "
        );
        console.error("Error connecting to Metamask ", e);
      }
    } else {
      setError(
        "Non-Ethereum browser detected. Install Metamask on browser and try again."
      );
    }
  }, [MetaMask]);

  const disconnectWallet = useCallback(async () => {
    await MetaMask.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    setAccounts([]);
  }, [MetaMask]);

  // Get account balance
  async function getBalance(account) {
    try {
      let balance = await web3.eth.getBalance(account); // returns balance in wei
      balance = web3.utils.fromWei(balance, "ether"); // convert to ether
      setBalance(balance);
    } catch (e) {
      setError("Error getting balance. See console output for details");
      console.error("Errong getting balance. Details: ", e);
    }
  }

  return (
    <div className="App">
      <main>
        <p>{error && <span>{error}</span>}</p>
        {accounts.length > 0 && (
          <>
            <h2>Successfully connected to Metamask Wallet</h2>
            <h3>Connected to account: {accounts[0]}</h3>
            <h3>Balance: {balance}eth</h3>
            <button
              className="button"
              onClick={() => {
                getBalance(accounts[0]);
              }}
            >
              Get balance
            </button>
            <br />
            <button className="button" onClick={disconnectWallet}>
              Disconnect Your Metamask Wallet
            </button>
          </>
        )}
        {accounts.length === 0 && (
          <button className="button" onClick={connectWallet}>
            Connect Your Metamask Wallet
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
