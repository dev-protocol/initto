---
title: Deep Dive Khaos
author: Aggre
date: 2021-03-20
socialImage: 'https://initto.devprotocol.xyz/images/posts/deep-dive-khaos/ogp.png'
level: EXPERIENCED
tags:
  - Khaos
  - fundamentals
---

# Khaos

Hi, I'm aggre.

In this article, I'll introduce Khaos, a side project developed for Dev Protocol.

Khaos acts as an "oracle," bridging off-chain information to the blockchain. It is sometimes referred to as the Khaos Oracle.

# Why Oracles are Necessary

There are various types of oracles on Ethereum, including Khaos. Ethereum is a massive state machine that maintains a chain of state transitions based on protocols defined by smart contracts. This means that data cannot exist on Ethereum unless it is introduced via an input transaction. If you want to use data from an HTTP source, you must either input the HTTP response manually or use a reliable bot to input it automatically. Oracles are used for the latter.

Let’s say you’ve created a blockchain game where winners are those who accurately predict tomorrow's temperature in Tokyo. In this case, you need "temperature data in Tokyo." Which do you consider more reliable:
A) Alice, a weather enthusiast who inputs the data manually.
B) A smart contract programmed to have a bot input data fetched from the Japan Meteorological Agency's database.

Oracles are essential if you choose option B.

# Why Khaos is Necessary

Generally, implementing an oracle starts with emitting events from a smart contract. Subsequently, a server or node running the oracle protocol detects these events, and finally, the oracle executes a callback function. By including the required information (such as "temperature" in "Tokyo") in the event payload, the oracle protocol understands what the smart contract needs.

Khaos is an oracle that allows you to conceal the payloads of oracle requests. If you need to obtain information based on a secret token, you typically need to expose that token by converting it into a public format.

With Khaos, you can make oracle requests based on a secret token on a public blockchain while keeping that token hidden.

# Using Khaos

You can integrate Khaos into your Dapps. By using the frontend SDK and the Starter Kit to implement oracle functions, you can quickly start development.

## Khaos Oracle Flow

Understanding the Khaos oracle flow is a great place to start development. It consists of several components, such as Khaos Core, Khaos Functions, and Khaos Registry. The most important flow for developers is as follows:

1. Call the Khaos Sign API (RESTful API) to obtain a Public Signature, which converts the concealed data into a public format.
2. Emit events from smart contracts. By including the Public Signature in the event payload, you can handle your concealed information within the oracle functions you defined.
3. Khaos calls the defined callback functions and completes the flow.

Khaos offers highly flexible oracles by entrusting many interfaces to the users. To achieve this, users must implement various interfaces themselves. However, you can jumpstart your development using the Khaos Starter Kit.

## Public Signature

A key concept in Khaos is the Public Signature.

A Public Signature is a string encrypted using JSON Web Tokens (JWT). The information used for encryption is public, so anyone can generate and decrypt it. In other words, the Public Signature contains no secret information and can be safely exposed to the public. With Khaos, you can store your secret information using the Public Signature as a key, and access it only within the Khaos instance.

The Public Signature is essentially the following JSON string encrypted by the sender's Ethereum account address.

```json
{
  "i": "...",
  "m": "..."
}
```

You can check the implementation and the tests of it at Khaos Core. [khaos-core/src/sign/publicSignature at main · dev-protocol/khaos-core (github.com)](https://github.com/dev-protocol/khaos-core/tree/main/src/sign/publicSignature)

## Khaos Starter Kit

[dev-protocol/khaos-starter-kit: 🌌Start developing Khaos Functions now (github.com)](https://github.com/dev-protocol/khaos-starter-kit)

We provide templates for the interfaces users need to define.

After forking and cloning this repository, you can start development in your local environment. Package management in the Khaos Starter Kit is handled by Yarn, so you must install Yarn beforehand.

```text
$ git clone git@github.com:YOUR/khaos-starter-kit.git
$ cd khaos-starter-kit
$ yarn
```

In the `src` directory, the templates for the interfaces and tests you need to define are written in TypeScript.

For the Khaos Starter Kit, we recommend `eslint-plugin-functional`, an ESLint plugin for enhanced security. Although you can freely change its settings, we suggest using the defaults.

### abi.ts

In this file, you can define and export `abi` as your smart contract's ABI, using an array in Human-Readable ABI Format.

For example, if you have an event like `Query` and a smart contract with a callback function named `callback`, you can write it as follows. Only events and callback functions are used by Khaos. Therefore, you do not need to define other interfaces present in the smart contract.

```typescript
import {Abi} from '@devprotocol/khaos-core'

export const abi: Abi = [
  'event Query(string calldata fooId, string calldata publicSignature, address account, bytes32 queryId)',
  'function callback(bytes32 queryId, bool result) external;'
]
```

### addresses.ts

In this file, you can define and export `addresses` as a function that returns the addresses of your smart contracts that emit oracle requests. The return type is `Promise<string | undefined>`. The return value of this function is also used for the addresses of callback functions.

The function receives the following object as an argument:

```typescript
type Options = {
  readonly network: 'mainnet' | 'ropsten'
}
```

You can switch addresses based on whether you are using the Ethereum mainnet or the Ropsten testnet.

```typescript
import {FunctionAddresses} from '@devprotocol/khaos-core'

export const addresses: FunctionAddresses = async ({network}) =>
  network === 'mainnet'
    ? '0x1510EA12a30E5c40b406660871b335feA32f29A'
    : '0x609Fe85Dbb9487d55B5eF50451e20ba2Edc8F4B7'
```

### authorize.ts

In this file, you can define and export `authorize` as your authentication method, which is invoked when the Khaos Sign API is called. The function should return `Promise<boolean | undefined>`.

A Public Signature is generated and the secret information is encrypted and saved on the Khaos server only if the result of `authorize` is `true`.

The function receives the following object as an argument. `message` is the string to be verified; examples include a Twitter ID or a GitHub repository name. `secret` is the confidential information. Since `request` is of the `HttpRequest` type from `@azure/functions`, various contexts can be used when the Sign API is called.

```typescript
type Options = {
  readonly message: string
  readonly secret: string
  readonly request: HttpRequest
}
```

Since `bent` is installed as the HTTP library for the Khaos Starter Kit, you can validate whether the `message` is valid by calling an external API. Additionally, `ramda` is installed as a functional programming library, so you can use it as needed.

```typescript
import bent from 'bent'
import {always} from 'ramda'
import {FunctionAuthorizer} from '@devprotocol/khaos-core'

const fetcher = bent('https://api.foo.bar', 'json', 'POST')

export const authorize: FunctionAuthorizer = async ({
  message: user_id,
  secret,
  request
}) => {
  const authorization = `bearer ${token}`
  const {headers} = request
  const results = await fetcher<{verified: boolean}>(
    '/verify',
    {
      user_id
    },
    {
      Authorization: authorization,
      'User-Agent': headers['User-Agent']
    }
  ).catch(always(undefined))
  return results?.verified
}
```

### event.ts

In this file, you can define and export `event` as a function that returns the event name of your smart contract. The function returns `Promise<string | undefined>`.

The function receives the following object as an argument:

```typescript
type Options = {
  readonly network: 'mainnet' | 'ropsten'
}
```

You can switch event names based on the Ethereum mainnet or Ropsten testnet, although in many cases you will likely use the same event names.

```typescript
import {FunctionEvent} from '@devprotocol/khaos-core'
import {always} from 'ramda'

export const event: FunctionEvent = always(Promise.resolve('Query'))
```

### oraclize.ts

In this file, you can define and export `oraclize` as the function called by oracle requests from smart contracts. This function plays a vital role. The return value of this function is formatted by the `pack` function (described below) and then transferred to the blockchain via callbacks to smart contracts. The `oraclize` function is called after events are detected and secret information is retrieved using the Public Signature as a key.

The function receives the following object as an argument:
`signatureOptions` contains the decrypted data of the Public Signature. `signatureOptions` is defined only if the event payload includes a Public Signature generated when the `authorize` function returned `true`. If an unauthorized Public Signature is included, it will be `undefined`.
`query.publicSignature` contains the Public Signature from the event payload.
`query.transactionhash` contains the hash of the transaction that emitted the event.
`query.allData` contains all event payloads.

```typescript
type Options = {
  readonly signatureOptions?: {
    readonly message: string
    readonly id: string
    readonly address: string
  }
  readonly query: {
    readonly publicSignature?: string
    readonly allData: Record<string, any>
    readonly transactionhash: string
  }
  readonly network: 'mainnet' | 'ropsten'
}
```

The return value of the function is a Promise that resolves to the following object:

```typescript
type Options = {
  message: string
  status: number
  statusMessage: string
}
```

The following example verifies that the signer of the Public Signature and the sender of the oracle request are the same account.

```typescript
import {FunctionOraclizer} from '@devprotocol/khaos-core'

export const oraclize: FunctionOraclizer = async ({signatureOptions, query}) => {
  const {queryId, fooId, account} = query.allData
  const isSameId = fooId === signatureOptions?.message
  const isSameUser = account === signatureOptions?.address
  return isSameId && isSameUser
    ? {
        message: queryId,
        status: 200,
        statusMessage: 'success'
      }
    : {
        message: queryId,
        status: 400,
        statusMessage: 'fail'
      }
}
```

### pack.ts

In this file, you can define and export `pack` as a function that returns the callback function name and the arguments for your smart contract.

The function receives the following object as an argument:
`results` contains the same data as the value resolved by the Promise returned from `oraclize`.

```typescript
type Options = {
  readonly results: {
    readonly message: string
    readonly status: number
    readonly statusMessage: string
  }
}
```

In the following example, a function named `callback` is designated as the callback, with arguments `[results.message, results.status, results.statusMessage]`.

```typescript
import {FunctionPack} from '@devprotocol/khaos-core'

export const pack: FunctionPack = async ({results}) => {
  return {
    name: 'callback',
    args: [results.message, results.status, results.statusMessage]
  }
}
```

## Test

The Khaos Starter Kit uses `ava` for testing by default. You are free to change the testing framework to suit your project.

While using Khaos is not strictly necessary for testing, we strongly recommend preparing as many accurate test cases as possible to guarantee specifications and maintainability.

## Deploy

Once all your interfaces and tests are ready, you can proceed to deploy your code.

In Khaos, you need to bundle the functions you've defined into a single `index.js` file and deploy it to IPFS. The Khaos Starter Kit allows you to bundle your code using Rollup (the default bundler) and deploy it to IPFS nodes on Infura.

You only need to execute the following command:

```text
yarn deploy
```

Depending on your source code, you may need to update Rollup's settings and install additional Rollup plugins. In such cases, you can modify `rollup.config.js` and install the necessary plugins. You can also use bundlers other than Rollup.

Upon deployment, you will see the following standard output. Make sure to note the value of `IPFS_HASH_FOR_FILE`.

```text
> {"Name":"index.js","Hash":"IPFS_HASH_FOR_FILE","Size":"871"}
```

## Khaos Registry

[dev-protocol/khaos-registry: 🌌Khaos Registry for functions ipfs hash (github.com)](https://github.com/dev-protocol/khaos-registry)

This registry manages address maps for functions deployed to IPFS.

Fork this repository and add the `IPFS_HASH_FOR_FILE` value you noted earlier to `map/functions.json`.

```json
[
  {
    "id": "foo-bar",
    "ipfs": "<IPFS_HASH_FOR_FILE>"
  }
]
```

After pushing the changes to your forked repository, create a Pull Request to the source repository.

_In the future, the Khaos Registry will be re-architected and decentralized as smart contracts._

## Khaos Kit

[dev-protocol/khaos-kit-js: 🌌Khaos Kit for JavaScript (github.com)](https://github.com/dev-protocol/khaos-kit-js)

The Khaos Kit provides an API to interact with Khaos from JavaScript (TypeScript).

### sign

The `sign` API is a shorthand for HTTP requests that call the Khaos Sign API.

This function takes two arguments. The first argument is the Khaos authorization ID, which matches the string designated in the `id` property in the Khaos Registry. The second argument is the network name, either `'mainnet'` or `'ropsten'`.

```typescript
// createPublicSignature.ts
import {sign} from '@devprotocol/khaos-kit'

export const createPublicSignature = sign('foo-bar', 'mainnet')
```

`sign` returns a function that takes `KhaosSignOptions` as an argument. In `KhaosSignOptions`, `message` is the message used for the signature, `signature` is the signature created in the user's Ethereum wallet, and `secret` is the information your Dapp wants to conceal.

To generate a signature with the user's Ethereum wallet, you must use an API such as Web3 or Ethers.

- Web3: [web3.eth.personal — web3.js 1.0.0 documentation (web3js.readthedocs.io)](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-personal.html#sign)
- Ethers: [Signers (ethers.io)](https://docs.ethers.io/v5/api/signer/#Signer-signMessage)

```typescript
import {KhaosSignOptions} from '@devprotocol/khaos-kit'
import {createPublicSignature} from './createPublicSignature'

const getPublicSignature = async ({message, signature, secret}: KhaosSignOptions) => {
  const results = await createPublicSignature({
    message,
    signature,
    secret
  })
  console.log(results) // {publicSignature: 'eyJ...', address: '0x...'}
  return results.publicSignature
}
```

### emulate

The `emulate` API emulates the result of emitted events for oracle requests off-chain.

This function takes two arguments. The first argument is the Khaos authorization ID, which matches the string designated in the `id` property in the Khaos Registry. The second argument is the network name, either `'mainnet'` or `'ropsten'`.

```typescript
// emulator.ts
import {emulate} from '@devprotocol/khaos-kit'

export const emulator = emulate('foo-bar', 'mainnet')
```

`emulate` returns a function that takes `KhaosEmulateOptions` as an argument. `KhaosEmulateOptions` accepts an `event` object where all properties are optional versions of those in [`Event` of @ethersproject/contracts](https://github.com/ethers-io/ethers.js/blob/6c43e20e7a68f3f5a141c74527ec63d9fe8458be/packages/contracts/src.ts/index.ts#L60). While `Event.args` extends `Array` with `{readonly [key: string]: any}`, `KhaosEmulateOptions.args` is simplified and overridden as `Record<string, string | number | undefined | null>`.

The return value of this function is based on the return value of `pack` (which you created with the Khaos Starter Kit) and includes additional data called `expectedTransaction`.

```typescript
import {KhaosEmulateOptions} from '@devprotocol/khaos-kit'
import {emulator} from './emulator'

const predictCallbackStatus =  async ({args}}: KhaosSignOptions) => {
    const results= await emulator({
    args,
})
    console.log(results)
    /**
     * {
     *     data: {
     *         name: 'callback',
     *         args: ['0x...', 200, 'success'],
     *         expectedTransaction: {
     *             gasLimit: '122004',
     *             success: true
     *         }
     *     }
     * }
     */
    return results.data?.args[1]
}
```
