import { useState } from "react";
import { hashMessage, signMessage } from "./utils/crypto";
import {toHex} from "ethereum-cryptography/utils"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3042";

export default function Transfer({ privateKey, refreshBalance }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSimpleMode, setUseSimpleMode] = useState(false);

  function normalizePrivateKey(value) {
    return value.trim().replace(/^0x/i, "").toLowerCase();
  }

  async function sendTransaction() {
    if (!recipient || !amount) {
      return setStatus("Fill all fields!");
    }

    const amountValue = parseInt(amount, 10);
    if (!Number.isSafeInteger(amountValue) || amountValue <= 0) {
      return setStatus("Amount must be a positive number");
    }

    if (useSimpleMode && !privateKey) {
      return setStatus("Generate wallet first so sender private key is available");
    }

    if (!useSimpleMode && !privateKey) {
      return setStatus("Private key is required for signed mode");
    }

    if (useSimpleMode && !/^[0-9a-fA-F]{64}$/.test(privateKey.trim().replace(/^0x/i, ""))) {
      return setStatus("Sender must be a valid 64-char private key");
    }

    setLoading(true);
    setStatus("");

    try {
      let body;

      if (useSimpleMode) {
        const senderKey = normalizePrivateKey(privateKey);
        const recipientKey = normalizePrivateKey(recipient);
        if (!/^[0-9a-f]{64}$/.test(recipientKey)) {
          setLoading(false);
          return setStatus("Recipient must be a valid 64-char private key");
        }

        body = {
          sender: senderKey,
          recipient: recipientKey,
          amount: amountValue,
        };
      } else {
        const nonce = Date.now();
        const message = {
          recipient,
          amount: amountValue,
          nonce,
        };
        const hash = hashMessage(message);
        const { signature, recoveryBit } = await signMessage(hash, privateKey);

        body = {
          message,
          hash: toHex(hash),
          signature,
          recoveryBit,
        };
      }

      const res = await fetch(`${API_BASE_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let data = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text };
      }

      if (res.ok) {
        setStatus("Transaction successful");
        refreshBalance();
      } else {
        setStatus(data.message || `Transaction failed (HTTP ${res.status})`);
      }
    } catch (err) {
      setStatus(`Error sending transaction: ${err.message}`);
    }

    setLoading(false);
  }

  return (
    <div className="panel">
      <div className="card">
        <h2>Send Transaction</h2>

        <label className="mode-toggle">
          <input
            type="checkbox"
            checked={useSimpleMode}
            onChange={(e) => setUseSimpleMode(e.target.checked)}
          />
          <span>Simple Server Mode</span>
        </label>

        <p className="mode-hint">
          {useSimpleMode
            ? "Simple mode uses private keys as account keys."
            : "Sends signed payload (message, hash, signature, recoveryBit)."}
        </p>

        <input
          placeholder={
            useSimpleMode ? "Recipient Private Key" : "Recipient Address"
          }
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={sendTransaction} disabled={loading}>
          {loading ? "Sending..." : "Send Transaction"}
        </button>

        <p className="status">{status}</p>
      </div>
    </div>
  );
}
