import cors from "cors";
import express from "express";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0aabc05bfca6734422d1936fef5370a1cca3a745b906106083c570d5f9d0a9fe": 500,
  "a41a2e52805ae0df8b996431a3f779826bd38af630d5401f9b68630f14281ba6": 400,
  "b810472f1814a5d5fce9cce05b93dae5f6ccda3efe82dd10c4c40bbf8f546280": 700,
  "36a8ee78c3ff4362cb3b68c512c2205271d0c47b360341cc69bde80e44858505": 1000,
  "54133f247b836d898d45cdb95f0e337a50b6ea64be6f532d2ee5a589823be353": 1500,

};

function normalizeAccountKey(rawKey) {
  if (typeof rawKey !== "string") return "";
  return rawKey.trim().replace(/^0x/i, "").toLowerCase();
}

function isValidPrivateKey(accountKey) {
  return /^[0-9a-f]{64}$/.test(accountKey);
}

app.get("/balance/:accountKey", (req, res) => {
  const accountKey = normalizeAccountKey(req.params.accountKey);
  if (!isValidPrivateKey(accountKey)) {
    return res.status(400).send({ message: "accountKey must be a 64-char hex private key" });
  }

  const balance = balances[accountKey] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const sender = normalizeAccountKey(req.body?.sender);
  const recipient = normalizeAccountKey(req.body?.recipient);
  const { amount } = req.body ?? {};
  const transferAmount = Number(amount);

  if (!sender || !recipient) {
    return res.status(400).send({ message: "sender and recipient are required" });
  }

  if (!isValidPrivateKey(sender) || !isValidPrivateKey(recipient)) {
    return res.status(400).send({ message: "sender and recipient must be 64-char hex private keys" });
  }

  if (!Number.isSafeInteger(transferAmount) || transferAmount <= 0) {
    return res.status(400).send({ message: "amount must be a positive integer" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < transferAmount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= transferAmount;
    balances[recipient] += transferAmount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(accountKey) {
  if (!(accountKey in balances)) {
    balances[accountKey] = 0;
  }
}
