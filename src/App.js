import { useState, useCallback } from "react";
import "./App.css";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const connectAccount = useCallback(async () => {
    // Modern dapp browsers
    // ethereum is the object injected as property on the window object by Ethereum-enabled browser extensions like MetaMask.
    if (window.ethereum) {
      // Requst account access
      try {
        // https://docs.metamask.io/wallet/reference/eth_accounts/
        const accounts = await window.ethereum.request({
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
  }, []);

  const disconnectAccount = useCallback(async () => {
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

  return (
    <div className="App">
      <main>
        <p>{error && <span>{error}</span>}</p>
        {accounts.length > 0 && (
          <>
            <h2>Successfully connected to Metamask Wallet</h2>
            <h3>Connected to account: {accounts[0]}</h3>
            <button className="button" onClick={disconnectAccount}>
              Disconnect Your Metamask Wallet
            </button>
          </>
        )}
        {accounts.length === 0 && (
          <button className="button" onClick={connectAccount}>
            Connect Your Metamask Wallet
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
