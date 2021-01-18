# Linked Data Signature for Blockchain 2021

```
npm i @or13/lds-blockchain2021@latest --save
```

## Use with verifiable credentials

```ts
import crypto from 'crypto';
import * as vcjs from '@trasnsmute/vc.js';
import {
  BlockchainVerificationMethod2021,
  BlockchainSignature2021,
} from '@or13/lds-blockchain2021';

const options = {
  id: 'did:example:123#key',
  controller: 'did:example:123',
  chainId: 'eip155:1',
  secureRandom: () => {
    return crypto.randomBytes(32);
  },
};
const keypair = await BlockchainVerificationMethod2021.generate(options);

const suite = new BlockchainSignature2021({
  key: keypair,
});

const verifiableCredential = await vcjs.ld.issue({
  credential: {
    ...credentialTemplate,
  },
  suite,
  documentLoader,
});
```
