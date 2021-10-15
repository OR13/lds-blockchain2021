import crypto from 'crypto';
import { BlockchainVerificationMethod2021 } from './BlockchainVerificationMethod2021';

import k0 from './__fixtures__/keypair.json';

it('generate-bip122', async () => {
  const options = {
    id: 'did:example:123#key',
    controller: 'did:example:123',
    chainId: 'bip122:000000000019d6689c085ae165831e93',
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  const vm = await BlockchainVerificationMethod2021.generate(options);
  expect(vm.blockchainAccountId).toBeDefined();
});

it('generate-cosmos', async () => {
  const options = {
    id: 'did:example:123#key',
    controller: 'did:example:123',
    chainId: 'cosmos:dsrv',
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  const vm = await BlockchainVerificationMethod2021.generate(options);
  expect(vm.blockchainAccountId).toBeDefined();
});

it('generate-eip155', async () => {
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

it('verifier-bip122', async () => {
  const options = {
    id: 'did:example:123#key',
    controller: 'did:example:123',
    chainId: 'bip122:000000000019d6689c085ae165831e93',
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  const k = await BlockchainVerificationMethod2021.generate(options);
  const signer = await k.signer();
  const verifier = await k.verifier();
  const message = Buffer.from('hello world');
  const signature = await signer.sign({ data: message });
  expect(signature).toBeDefined();
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});

it('verifier-cosmos', async () => {
  const options = {
    id: 'did:example:123#key',
    controller: 'did:example:123',
    chainId: 'cosmos:dsrv',
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  };
  const k = await BlockchainVerificationMethod2021.generate(options);
  const signer = await k.signer();
  const verifier = await k.verifier();
  const message = Buffer.from('hello world');
  const signature = await signer.sign({ data: message });
  expect(signature).toBeDefined();
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});

it('verifier-eip155', async () => {
  const k = await BlockchainVerificationMethod2021.from(k0);
  const signer = await k.signer();
  const verifier = await k.verifier();
  const message = Buffer.from('hello world');
  const signature = await signer.sign({ data: message });
  expect(signature).toBeDefined();
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});
