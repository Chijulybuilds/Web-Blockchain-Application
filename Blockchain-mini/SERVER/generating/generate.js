import {secp256k1} from "ethereum-cryptography/secp256k1"
import {toHex} from "ethereum-cryptography/utils"
import {keccak256} from "ethereum-cryptography/keccak"

const privateKey = toHex(secp256k1.utils.randomPrivateKey());

const publicKey = secp256k1.getPublicKey(privateKey); 

const publicKeymain = toHex(publicKey);

const eth = toHex(keccak256(publicKey.slice(1)).slice(-20));

console.log(`\nPrivate Key: ${privateKey}`)

console.log(`\nPublic Key: ${publicKeymain}`)

console.log(`\nEthereum Address: ${eth}`)