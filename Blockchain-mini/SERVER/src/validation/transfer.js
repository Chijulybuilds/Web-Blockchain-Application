import { httpError } from "../utils/errors.js";
import { normalizeAddress } from "../state/store.js";

const HASH_REGEX = /^[0-9a-fA-F]{64}$/;
const SIGNATURE_REGEX = /^[0-9a-fA-F]{128}$/;

function parsePositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw httpError(400, `${fieldName} must be a positive integer`);
  }
  return parsed;
}

export function validateTransferPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw httpError(400, "Request body must be a JSON object");
  }

  const { message, hash, signature, recoveryBit } = payload;

  if (!message || typeof message !== "object") {
    throw httpError(400, "message is required");
  }

  if (typeof signature !== "string" || !SIGNATURE_REGEX.test(signature)) {
    throw httpError(400, "signature must be a 128-char hex string");
  }

  const normalizedRecoveryBit = Number(recoveryBit);
  if (!Number.isInteger(normalizedRecoveryBit) || normalizedRecoveryBit < 0 || normalizedRecoveryBit > 3) {
    throw httpError(400, "recoveryBit must be an integer between 0 and 3");
  }

  const normalizedHash = hash == null ? null : String(hash).toLowerCase();
  if (normalizedHash && !HASH_REGEX.test(normalizedHash)) {
    throw httpError(400, "hash must be a 64-char hex string");
  }

  const normalizedMessage = {
    recipient: normalizeAddress(message.recipient),
    amount: parsePositiveInt(message.amount, "amount"),
    nonce: parsePositiveInt(message.nonce, "nonce"),
  };

  return {
    message: normalizedMessage,
    hash: normalizedHash,
    signature: signature.toLowerCase(),
    recoveryBit: normalizedRecoveryBit,
  };
}
