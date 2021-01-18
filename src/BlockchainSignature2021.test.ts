// import crypto from 'crypto';
import { BlockchainVerificationMethod2021 } from './BlockchainVerificationMethod2021';
import { BlockchainSignature2021 } from './BlockchainSignature2021';
import k0 from './__fixtures__/keypair.json';
import * as vcjs from '@transmute/vc.js';
import credentialTemplate from './__fixtures__/credential.json';
import { documentLoader } from './__fixtures__/documentLoader';
import vcExample from './__fixtures__/example-verifiable-credential.json';

it('can issue', async () => {
  const keypair = await BlockchainVerificationMethod2021.from(k0);
  const suite = new BlockchainSignature2021({
    key: keypair,
    date: '2019-12-11T03:50:55Z',
  });
  const verifiableCredential = await vcjs.ld.issue({
    credential: {
      ...credentialTemplate,
      issuer: {
        ...credentialTemplate.issuer,
        id: k0.controller,
      },
    },
    suite,
    documentLoader: async (uri: string) => {
      const res = await documentLoader(uri);
      // uncomment to debug
      // console.log(res)
      return res;
    },
  });
  // console.log(JSON.stringify(verifiableCredential, null, 2));
  expect(verifiableCredential.proof.type).toEqual('BlockchainSignature2021');
});

it('can verify', async () => {
  const verification = await vcjs.ld.verifyCredential({
    credential: { ...vcExample },
    suite: new BlockchainSignature2021(),
    documentLoader: async (uri: string) => {
      const res = await documentLoader(uri);
      // uncomment to debug
      // console.log(res)
      return res;
    },
  });
  // uncomment to debug
  // console.log(JSON.stringify(verification, null, 2));
  expect(verification.verified).toBe(true);
});
