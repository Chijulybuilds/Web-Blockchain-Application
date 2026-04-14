import { httpError } from "../utils/errors.js";

const balances = new Map();
const lastNonces = new Map();

const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;

export function normalizeAddress(address) {
  if (typeof address !== "string" || !ADDRESS_REGEX.test(address)) {
    throw httpError(
      400,
      "Address must be a 40-character hexadecimal string (optionally prefixed with 0x)"
    );
  }

  return address.replace(/^0x/i, "").toLowerCase();
}

export function getBalance(address) {
  return balances.get(address) ?? 0;
}

export function getLastNonce(address) {
  return lastNonces.get(address) ?? 0;
}

export function setLastNonce(address, nonce) {
  lastNonces.set(address, nonce);
}

export function ensureAccount(address) {
  if (!balances.has(address)) {
    balances.set(address, 0);
  }
}

export function debit(address, amount) {
  const currentBalance = getBalance(address);
  if (currentBalance < amount) {
    throw httpError(400, "Not enough funds");
  }

  balances.set(address, currentBalance - amount);
}

export function credit(address, amount) {
  balances.set(address, getBalance(address) + amount);
}

export function loadSeedBalancesFromEnv() {
  const raw = process.env.INITIAL_BALANCES;
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("INITIAL_BALANCES must be a JSON object");
    }

    for (const [address, balance] of Object.entries(parsed)) {
      const normalized = normalizeAddress(address);
      const numericBalance = Number(balance);

      if (!Number.isFinite(numericBalance) || numericBalance < 0) {
        throw new Error(`Invalid balance for ${address}`);
      }

      balances.set(normalized, Math.floor(numericBalance));
    }
  } catch (error) {
    console.warn(
      `Failed to parse INITIAL_BALANCES. Starting with empty ledger. Reason: ${error.message}`
    );
  }
}
