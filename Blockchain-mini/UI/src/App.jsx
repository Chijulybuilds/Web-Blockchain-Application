import { useState } from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import logo from "./assets/verifund-logo.png";
import "./styles.css";

function App() {
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  function refreshBalance() {
    window.location.reload(); // simple refresh strategy
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="brand">
          <img src={logo} alt="Verifund logo" className="brand-logo" />
          <h1 className="app-title">Verifund</h1>
        </div>
        <h2 className="sub-title">Bridging Trust Raising</h2>
      </header>
      <div className="container">
        <Wallet setAddress={setAddress} setPrivateKey={setPrivateKey} />
        <Transfer
          privateKey={privateKey}
          refreshBalance={refreshBalance}
        />
      </div>
    </div>
  );
}

export default App;
