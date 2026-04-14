import { useState, useEffect } from "react";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils"
import {
  publicKey as derivePublicKey,
  ethereumAddress as deriveAddress
} from "./utils/crypto";

export default function Wallet({ setAddress, setPrivateKey: setParentKey }) {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKeyHex, setPublicKeyHex] = useState("");
  const [address, setLocalAddress] = useState("");
  const [balance, setBalance] = useState(0);

  // 🔑 Generate wallet
  function generateWallet() {
    const privateKeyBytes = toHex(secp256k1.utils.randomPrivateKey());

    setPrivateKey(privateKeyBytes);
    setParentKey(privateKeyBytes);
  }

  // 🔁 Derive public key + address
  useEffect(() => {
    if (/^[0-9a-fA-F]{64}$/.test(privateKey)) {
      try {
        const pubKeyBytes = derivePublicKey(privateKey);
        const pubKey = toHex(pubKeyBytes);
        const addr = toHex(deriveAddress(pubKeyBytes));

        setPublicKeyHex(pubKey);
        setLocalAddress(addr);
        setAddress(addr);
      } catch (err) {
        console.error("Private Key appears to be invalid", err);
      }
    }
  }, [privateKey]);

  // Fetch balance
  async function fetchBalance() {
    if (!privateKey) {
        setBalance(0);
        return;
    }

    try {
      const res = await fetch(`http://localhost:3042/balance/${privateKey}`);
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [privateKey]);

  return (
    <div className="panel">
      <div className="card">
        <h2>Wallet</h2>

        <button onClick={generateWallet}>
          Generate New Wallet
        </button>

        <input
          placeholder="Private Key (hex)"
          value={privateKey}
          onChange={(e) => {
            setPrivateKey(e.target.value);
            setParentKey(e.target.value);
          }}
        />

        <p><strong>Public Key:</strong> {publicKeyHex.slice(0, 40)}...</p>
        <p><strong>ETH Address:</strong> {address}</p>
        <p><strong>Balance:</strong> {balance}</p>
      </div>
    </div>
  );
}
