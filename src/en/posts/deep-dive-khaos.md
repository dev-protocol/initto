---
title: Deep Dive Khaos
author: Aggre
date: 2021-03-20
socialImage: 'https://initto.devprotocol.xyz/images/posts/deep-dive-khaos/ogp.png'
level: EXPERIENCED
tags:
  - Khaos
---

# Khaos

Hi, I'm aggre.

In this article, you'll get an idea about Khaos, which is developed as a side project for Dev Protocol.

Khaos brings information, which doesn't exist on blockchain, into blockchain from the outside of blockchain, and has a function of an "oracle". It is sometimes called Khaos Oracle.

# Necessity of Oracle

We see various types of oracles as well as Khaos on Ethereum. Ethereum is a huge state holding a chain of state transitions based on defined protocols by smart contracts. That means if certain data doesn’t have any input transactions, it can’t exist on Ethereum. If you want to gain data source to be input from HTTP, you have to input HTTP response manually or let reliable bots automatically input it. Oracles are used for the latter case. Let’s say you’ve made a "blockchain game in which winners are those who could accurately predict tomorrow's temperature in Tokyo." In this case, you need "temperature data in Tokyo." Which do you think is more reliable: A) Alice, a temperature-freak girl, who inputs the data manually, or B) A smart contract that is programmed to let a bot input data obtained from the database of the Japan Meteorological Agency? Oracles are a must-have technology if you want to choose B.

# Necessity of Khaos

For a general implementation of oracles, you start by emitting events from smart contracts. Subsequently, a server/node composing oracle protocols detects the events, and finally, the oracle calls up callback functions. By adding information that smart contracts require (such as "temperature" in "Tokyo") into payloads of events to emit, oracle protocols get to know what the smart contract needs.

Khaos is an oracle that enables you to conceal payloads for oracle requests. If you need to obtain the information to oraclize based on a secret token, you need to detoxify such a token by turning its format into a public one.

With Khaos, you can oraclize your requests depending on your secret token on the public blockchain while concealing your secret token.

# Use Khaos

You can use Khaos for your Dapps. If you use SDK for frontends and Starter Kit to implement oracle functions, you can start its development.

_Currently, smart contracts, which can be used for Khaos, are limited to smart contracts composing the core of Dev Protocol or to Market, Policy contracts. In the future, Khaos can be used for all smart contracts._

## Oracle flow of Khaos

Learning about Khaos' oracle flow is a great start for developing Khaos. It comprises several components such as Khaos Core, Khaos Functions, Khaos Registry, etc. The most important thing for developers is the following flow:

1. Call Sign API (RESTful API) of Khaos, and obtain Public Signature after converting data subject to concealment into public.
2. Emit events from smart contracts. At this point, by including Public Signature in event payloads, you can deal with your concealed information for the oracle functions that you defined.
3. Khaos calls callback functions that you defined and closes its flow.

Khaos provides oracles with high flexibility as it entrusts a number of interfaces to users. In order to achieve this, users need to implement various interfaces by themselves. However, you can quickly start your development by using Khaos Starter Kit.

## Public Signature

One of the most significant keywords to handle Khaos is Public Signature.

Public Signature is a string encrypted by Json Web Tokens. Information used for encryption is open, so all of us can generate and decrypt it. In other words, secret information is not included in Public Signature at all, and it can be open to public. With Khaos, you can save your secret information with Public Signature as a key, and make use of it only inside Khaos instance.

Public Signature is the same as encrypted "the following JSON string" by "sender's Ethereum account address."

```json
{
  "i": "...",
  "m": "..."
}
```

You can check the implementation and the tests of it at Khaos Core. [khaos-core/src/sign/publicSignature at main · dev-protocol/khaos-core (github.com)](https://github.com/dev-protocol/khaos-core/tree/main/src/sign/publicSignature)

## Khaos Starter Kit

[dev-protocol/khaos-starter-kit: 🌌Start developing Khaos Functions now (github.com)](https://github.com/dev-protocol/khaos-starter-kit)

We provide templates for users' interfaces to define.

After you fork and clone this repository, you can start development at your local environment. The package management of Khaos Starter Kit is done by yarn, so you have to [install yarn](https://classic.yarnpkg.com/en/docs/install/) in advance.

```text
$ git clone git@github.com:YOUR/khaos-starter-kit.git
$ cd khaos-starter-kit
$ yarn
```

In src directory, templates for interfaces and tests that you need to define are written in TypeScript.

For Khaos Starter Kit, we recommend [eslint-plugin-functional](https://www.npmjs.com/package/eslint-plugin-functional), an ESLint plugin for your security. Though you can change its setting freely, we suggest that you should use it without changing its setting.

### abi.ts

You can define and export `abi` as the ABI of your smart contract as array written in [Human-Readable ABI Format](https://docs.ethers.io/v5/api/utils/abi/formats/#abi-formats--human-readable-abi) on this file.

In the case of an event like `Query` and of smart contracts possessing callback functions that `callback`, you can write as stated below. Only event and callback functions are used for Khaos. Therefore there is no need to define everything if although other interfaces are present in the smart contract.

```typescript
import {Abi} from '@devprotocol/khaos-core'

export const abi: Abi = [
  'event Query(string calldata fooId, string calldata publicSignature, address account, bytes32 queryId)',
  'function callback(bytes32 queryId, bool result) external;'
]
```

### addresses.ts

You can define and export `addresses` as the addresses of your smart contracts where emit oracle requests as the function that returns `Promise<string | undefined>`. The return value of this function is also used for addresses of callback functions.

The function receives the following object as the argument.

```typescript
type Options = {
  readonly network: 'mainnet' | 'ropsten'
}
```

You can switch the addresses by the mainnet of Ethereum, or by Ropsten testnet.

```typescript
import {FunctionAddresses} from '@devprotocol/khaos-core'

export const addresses: FunctionAddresses = async ({network}) =>
  network === 'mainnet'
    ? '0x1510EA12a30E5c40b406660871b335feA32f29A'
    : '0x609Fe85Dbb9487d55B5eF50451e20ba2Edc8F4B7'
```

### authorize.ts

You can define and export `authorize` as your authentication method to be called when Sign API of Khaos is called, on this file. The function should returns `Promise<boolean | undefined>`.

Only in the case where the result of authorize is `true`, Public Signature is generated and secret information encrypted in Khaos server is saved.

Functions receive the following object as the argument. `message` is a string subject to verify. Twitter ID and GitHub repository names are examples that correspond to it. `secret` is information for secret. Since `request` is HttpRequest Type of @azure/functions, various contexts can be used when Sign API is called.

```typescript
type Options = {
  readonly message: string
  readonly secret: string
  readonly request: HttpRequest
}
```

Because bent is installed as HTTP library for Khaos Starter Kit, you can validate whether the `message` is justifiable or not by calling an external API. In addition, ramda is also installed as a functional programing library, so you can use it case by case.

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

You can define and export `event` as the function, which returns the event name of your smart contract on this file. The function returns `Promise<string | undefined>`.

The function receives the following object as the argument.

```typescript
type Options = {
  readonly network: 'mainnet' | 'ropsten'
}
```

You can switch event names by the mainnet of Ethereum or by Ropsten testnet, though we think you would continue to use the same event names in many cases.

```typescript
import {FunctionEvent} from '@devprotocol/khaos-core'
import {always} from 'ramda'

export const event: FunctionEvent = always(Promise.resolve('Query'))
```

### oraclize.ts

You can define and export `oraclize` as the function called by oracle request from smart contracts, on this file. This function plays a vital role. After the return value of this function is formatted by `pack` function as stated below, it is transferred to blockchain through callbacks for smart contracts. The time when oraclize function is called is after events are detected and secret information is obtained through Public Signature as a key.

The function receives the following object as the argument, as stated below. `signatureOptions` is decrypted data of Public Signature. Only in the case where generated Public Signature is included in event payloads when the result of the `authorize` function returns `true`, `signatureOptions` is defined. In other words, if unauthorized Public Signature is included, `undefined` is given back. `query.publicSignature` includes event payloads with Public Signature. `query.transactionhash` includes transaction-hash that emitted the event. `query.allData` includes all event payloads.

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

The return value of the function is Promise that is solved by the following object.

```typescript
type Options = {
  message: string
  status: number
  statusMessage: string
}
```

The function verifies that the signer of Public Signature and the oracle request sender is the same account in the next example.

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

You can define and export `pack` as the function that returns the callback function name and your smart contract's arguments on this file.

The function receives the following object as the argument, as stated below. `results` have the same data as the value gained when Promise, which is returned by oraclize, resolves.

```typescript
type Options = {
  readonly results: {
    readonly message: string
    readonly status: number
    readonly statusMessage: string
  }
}
```

In the next example, function named `callback` are designated to callback by arguments of `[results.message, results.status, results.statusMessage]`.

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

Khaos Starter Kit writing tests by ava as default. You can freely change your testing framework depending on your projects.

Use of Khaos is not essential for the test, however, we strongly suggest that you should prepare as much accurate test case as possible for guaranteeing the specifications and maintainability.

## Deploy

After all of your interfaces and tests are ready, you move on to deploy codes.

In Khaos, you need to bundle the functions defined by you into one file of `index.js`, and deploy to IPFS. With Khaos Starter Kit, you can bundle codes using Rollup as the default bundler and deploy to IPFS nodes on Infura.

This is the only command that you should execute.

```text
yarn deploy
```

For some source codes, you need to update Rollup's setting and install additional Rollup plugins. In such cases, you can rewrite `rollup.config.js`, and install additional Rollup plugins. You can also utilize bundlers except for Rollup.

When you deploy, you can get the following standard output, so you should take a memo of the value of `IPFS_HASH_FOR_DIRECTORY`.

```text
> {"Name":"index.js","Hash":"IPFS_HASH_FOR_FILE","Size":"554"}
> {"Name":"","Hash":"IPFS_HASH_FOR_DIRECTORY","Size":"609"}
```

## Khaos Registry

[dev-protocol/khaos-registry: 🌌Khaos Registry for functions ipfs hash (github.com)](https://github.com/dev-protocol/khaos-registry)

Address maps for deployed functions in IPFS are managed.

Fork this repository, and additionally write the value of `IPFS_HASH_FOR_DIRECTORY`, which you've just taken a note of, for map/functions.json.

```json
[
  {
    "id": "foo-bar",
    "ipfs": "<IPFS_HASH_FOR_DIRECTORY>"
  }
]
```

After you've pushed the changes for the forked repository, create Pull Request for the source repository.

The usage application of Khaos is limited to Dev Protocol related contracts currently. Hence, the team verifies whether `addresses` of deployed functions in IPFS are contracts on Dev Protocol or not.

_In the future, Khaos Registry would be re-composited and decentralized as smart contracts._

## Khaos Kit

[dev-protocol/khaos-kit-js: 🌌Khaos Kit for JavaScript (github.com)](https://github.com/dev-protocol/khaos-kit-js)

Khaos Kit provides API to interact with Khaos from JavaScript(TypeScript).

### sign

`sign` API is a shorthand for HTTP requests that call Sign API of Khaos.

This function takes two arguments. The first argument is Khaos authorization ID, which is the same string designated at `id` property in Khaos Registry. The second one takes `'mainet'` or `'ropsten'` as a network name.

```typescript
// createPublicSignature.ts
import {sign} from '@devprotocol/khaos-kit'

export const createPublicSignature = sign('foo-bar', 'mainnet')
```

`sign` returns a function to take `KhaosSignOptions` as the argument. `message` of `KhaosSignOptions` is the message used for the signature. `signature` is the signature created in the user's Ethereum wallet. `secret` is information that your Dapps want to conceal.

To write a signature with the user's Ethereum wallet, you have to use API for Web3 or Ethers, etc.

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

`emulate` API emulates the result of emitted events for oracle requests with off-chain.

This function takes two arguments. The first argument is Khaos authorization ID, which is the same string designated at `id` property in Khaos Registry. The second one takes `'mainet'` or `'ropsten'` as a network name.

```typescript
// emulator.ts
import {emulate} from '@devprotocol/khaos-kit'

export const emulator = emulate('foo-bar', 'mainnet')
```

`emulate` returns a function to take `KhaosEmulateOptions` as the argument. `KhaosEmulateOptions` takes `event` object that changed the all same information as [`Event` of @ethersproject/contracts](https://github.com/ethers-io/ethers.js/blob/6c43e20e7a68f3f5a141c74527ec63d9fe8458be/packages/contracts/src.ts/index.ts#L60) into optional. `Event.arg` is extend type of `Array` by `{readonly [key: string]: any}`, but `KhaosEmulateOptions.args` is simplified by overridden at `Record<string, string | number | undefined | null>`.

This function's return value is based on additional data called `expectedTransaction` and the return value of `pack`, which you created with Khaos Starter Kit.

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
