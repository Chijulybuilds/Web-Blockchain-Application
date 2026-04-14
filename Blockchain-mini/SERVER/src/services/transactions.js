import { toHex } from "ethereum-cryptography/utils";
import {
  hashMessage,
  recoverPublicKey,
  verifySignature,
  deriveAddress,
} from "../crypto/index.js";
import {
  ensureAccount,
  getLastNonce,
  setLastNonce,
  debit,
  credit,
  getBalance,
} from "../state/store.js";
import { httpError } from "../utils/errors.js";

export function applySignedTransfer({ message, hash, signature, recoveryBit }) {
  const messageHashBytes = hashMessage(message);
  const messageHashHex = toHex(messageHashBytes);

  if (hash && hash !== messageHashHex) {
    throw httpError(400, "Hash mismatch: message payload was altered");
  }

  let publicKeyBytes;
  let signatureIsValid;

  try {
    publicKeyBytes = recoverPublicKey(signature, recoveryBit, messageHashBytes);
    signatureIsValid = verifySignature(signature, messageHashBytes, publicKeyBytes);
  } catch {
    throw httpError(400, "Invalid signature");
  }

  if (!signatureIsValid) {
    throw httpError(400, "Invalid signature");
  }

  const sender = deriveAddress(publicKeyBytes);
  const { recipient, amount, nonce } = message;
  const lastNonce = getLastNonce(sender);

  if (nonce <= lastNonce) {
    throw httpError(
      409,
      `Invalid nonce. Expected a nonce greater than ${lastNonce}`
    );
  }

  ensureAccount(sender);
  ensureAccount(recipient);

  debit(sender, amount);
  credit(recipient, amount);
  setLastNonce(sender, nonce);

  return {
    sender,
    recipient,
    amount,
    nonce,
    hash: messageHashHex,
    balance: getBalance(sender),
  };
}
