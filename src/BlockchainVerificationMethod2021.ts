import {
  Secp256k1KeyPair,
  ES256KR,
  keyUtils,
} from '@transmute/did-key-secp256k1';

import publicKeyToAddress from 'ethereum-public-key-to-address';

export interface GenerateOptions {
  id: string;
  controller: string;
  secureRandom: () => Buffer;
  chainId: string;
}

export interface KeyPair {
  id: string;
  type: string;
  controller: string;
  blockchainAccountId: string;
  privateKeyJwk: any;
}

const publicKeyBufferToBlockchainAccountId = (
  publicKeyBuffer: Buffer,
  chainId: string
) => {
  const address = publicKeyToAddress(publicKeyBuffer);
  const blockchainAccountId = `${address}@${chainId}`;
  return blockchainAccountId;
};

export class BlockchainVerificationMethod2021 {
  public id: string;
  public type = 'BlockchainVerificationMethod2021';
  public controller: string;
  public blockchainAccountId: string;
  public privateKeyBuffer: Buffer;

  public static async generate(options: GenerateOptions) {
    const keypair = await Secp256k1KeyPair.generate(options);

    return new BlockchainVerificationMethod2021({
      id: options.id,
      controller: options.controller,
      blockchainAccountId: publicKeyBufferToBlockchainAccountId(
        keypair.publicKeyBuffer,
        options.chainId
      ),
      privateKeyBuffer: keypair.privateKeyBuffer,
    });
  }

  public static async from(options: KeyPair) {
    let args: any = {
      id: options.id,
      controller: options.controller,
      blockchainAccountId: options.blockchainAccountId,
    };
    if (options.privateKeyJwk) {
      args.privateKeyBuffer = keyUtils.privateKeyUInt8ArrayFromJwk(
        options.privateKeyJwk
      );
    }
    return new BlockchainVerificationMethod2021(args);
  }

  constructor(options: any) {
    this.id = options.id;
    this.controller = options.controller;
    this.blockchainAccountId = options.blockchainAccountId;
    this.privateKeyBuffer = options.privateKeyBuffer;
  }

  public toKeyPair(exportPrivateKey = false) {
    let vm: any = {
      id: this.id,
      type: this.type,
      controller: this.controller,
      blockchainAccountId: this.blockchainAccountId,
    };
    if (exportPrivateKey) {
      vm.privateKeyJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
        this.privateKeyBuffer.toString('hex')
      );
    }
    return vm;
  }

  public signer() {
    let privateKey = this.privateKeyBuffer;
    const privateKeyJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
      privateKey.toString('hex')
    );

    return {
      async sign({ data }: any) {
        return ES256KR.signDetached(data, privateKeyJwk);
      },
    };
  }

  public verifier() {
    const chainId = this.blockchainAccountId.split('@').pop() as string;
    const expectedBlockchainAccountId = this.blockchainAccountId;
    return {
      async verify({ data, signature }: any) {
        const recovered = await ES256KR.recoverPublicKey(signature, data);
        return (
          publicKeyBufferToBlockchainAccountId(
            Buffer.from(recovered),
            chainId
          ) === expectedBlockchainAccountId
        );
      },
    };
  }
}
