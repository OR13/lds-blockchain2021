import { publicKeyConvert } from 'secp256k1';
import keccak from 'keccak';

export const publicKeyToAddress = (publicKeyBuffer: Buffer) => {
  const publicKey = Buffer.from(publicKeyConvert(publicKeyBuffer, false)).slice(
    1
  );
  const stripAddress = keccak('keccak256')
    .update(publicKey)
    .digest()
    .slice(-20)
    .toString('hex');
  const keccakHash = keccak('keccak256')
    .update(stripAddress)
    .digest('hex');
  let checksumAddress = '0x';
  for (let i = 0; i < stripAddress.length; i++) {
    checksumAddress +=
      parseInt(keccakHash[i], 16) >= 8
        ? stripAddress[i].toUpperCase()
        : stripAddress[i];
  }
  return checksumAddress;
};
