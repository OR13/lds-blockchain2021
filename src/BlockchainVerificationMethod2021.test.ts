import crypto from 'crypto';
import { BlockchainVerificationMethod2021 } from './BlockchainVerificationMethod2021';

import k0 from './__fixtures__/keypair.json';

it('generate', async () => {
  const options = {
    id: 'did:example:123#key',
    controller: 'did:example:123',
    chainId: 'eip155:1',
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  const vm = await BlockchainVerificationMethod2021.generate(options);
  expect(vm.blockchainAccountId).toBeDefined();
});

it('toKeyPair', async () => {
  const options = {
    id: 'did:example:123#key',
    controller: 'did:example:123',
    chainId: 'eip155:1',
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  const vm = await BlockchainVerificationMethod2021.generate(options);
  let k = vm.toKeyPair(false);
  expect(k.privateKeyJwk).toBeUndefined();
  k = vm.toKeyPair(true);
  expect(k.privateKeyJwk).toBeDefined();
});

it('from', async () => {
  const k = await BlockchainVerificationMethod2021.from(k0);
  expect(k.privateKeyBuffer).toBeDefined();
  expect(k.blockchainAccountId).toBeDefined();
});

it('signer', async () => {
  const k = await BlockchainVerificationMethod2021.from(k0);
  const signer = await k.signer();
  const message = Buffer.from('hello world');
  const signature = await signer.sign({ data: message });
  expect(signature).toBeDefined();
});

it('verifier', async () => {
  const k = await BlockchainVerificationMethod2021.from(k0);
  const signer = await k.signer();
  const verifier = await k.verifier();
  const message = Buffer.from('hello world');
  const signature = await signer.sign({ data: message });
  expect(signature).toBeDefined();
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});
