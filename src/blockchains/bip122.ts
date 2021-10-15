import { enc, SHA256, RIPEMD160 } from 'crypto-js';

import base58 from 'bs58';

export const publicKeyToAddress = (publicKeyBuffer: Buffer) => {
  const publicKeyHash = RIPEMD160(
    SHA256(enc.Hex.parse(publicKeyBuffer.toString('hex')))
  );
  const step1 = Buffer.from('00' + publicKeyHash.toString(enc.Hex), 'hex');
  const step2 = SHA256(SHA256(enc.Hex.parse(step1.toString('hex'))));
  const checksum = step2.toString(enc.Hex).substring(0, 8);
  const step3 = step1.toString('hex') + checksum;
  return base58.encode(Buffer.from(step3, 'hex'));
};
