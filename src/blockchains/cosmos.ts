import { enc, SHA256, RIPEMD160 } from 'crypto-js';
import { bech32 } from 'bech32';

export const publicKeyToAddress = (publicKeyBuffer: Buffer, prefix: string) => {
  const hash = RIPEMD160(
    SHA256(enc.Hex.parse(publicKeyBuffer.toString('hex')))
  );
  const words = bech32.toWords(Buffer.from(hash.toString(), 'hex'));
  return bech32.encode(prefix, words).replace(prefix, '');
};
