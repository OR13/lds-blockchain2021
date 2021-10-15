import { publicKeyToAddress as bip122 } from './bip122';
import { publicKeyToAddress as cosmos } from './cosmos';
import { publicKeyToAddress as eip155 } from './eip155';

export const publicKeyBufferToBlockchainAccountId = (
  publicKeyBuffer: Buffer,
  chainId: string
) => {
  const chain = chainId.split(':');
  let blockchainAccountId = '';
  switch (chain[0]) {
    case 'bip122':
      blockchainAccountId = `${bip122(publicKeyBuffer)}@${chainId}`;
      break;
    case 'cosmos':
      blockchainAccountId = `${cosmos(publicKeyBuffer, chain[1])}@${chainId}`;
      break;
    case 'eip155':
      blockchainAccountId = `${eip155(publicKeyBuffer)}@${chainId}`;
      break;
    default:
      break;
  }
  return blockchainAccountId;
};
