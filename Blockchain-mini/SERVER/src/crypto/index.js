import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export function hashMessage(message) {
  return keccak256(utf8ToBytes(JSON.stringify(message)));
}

export function deriveAddress(publicKeyBytes) {
  return toHex(keccak256(publicKeyBytes.slice(1)).slice(-20)).toLowerCase();
}

export function recoverPublicKey(signatureHex, recoveryBit, messageHashBytes) {
  const signature = secp256k1.Signature.fromCompact(signatureHex).addRecoveryBit(
    recoveryBit
  );
  return signature.recoverPublicKey(messageHashBytes).toRawBytes();
}

export function verifySignature(signatureHex, messageHashBytes, publicKeyBytes) {
  return secp256k1.verify(signatureHex, messageHashBytes, publicKeyBytes, {
    format: "compact",
  });
}
