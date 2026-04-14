import {secp256k1} from "ethereum-cryptography/secp256k1";
import {hexToBytes, toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";

export function privateKey() {
  return toHex(secp256k1.utils.randomPrivateKey());
}

export function signMessage(message, privateKey) {
  const signatureData = secp256k1.sign(message, privateKey);
  return {
    signature: signatureData.toCompactHex(),
    recoveryBit: signatureData.recovery,
  };
}

export function publicKey(privateKey) {
  return secp256k1.getPublicKey(privateKey);
}


export function ethereumAddress(publicKey) {
  const publicKeyBytes =
    typeof publicKey === "string" ? hexToBytes(publicKey) : publicKey;
  const address = keccak256(publicKeyBytes.slice(1));
  return address.slice(-20);
}

export function hashMessage(message) {
  return keccak256(utf8ToBytes(JSON.stringify(message)));
}

export function hashMessages(messages) {
  return hashMessage(messages);
}


