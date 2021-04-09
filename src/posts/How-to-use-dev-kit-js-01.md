---
title: How to use dev-kit-js#1
author: Kawakami
date: 2021-04-09
socialImage: 'https://initto.devprotocol.xyz/images/posts/How-to-use-dev-kit-js-01/ogp_en.png'
level: BEGINNER
tags:
- dev-kit-js
---
# How to use dev-kit-js #1 

## Introduction

We’ll write a series of articles on the way to use `dev-kit-js`, a library equipped in Dev Protocol. This time, we’re going to touch on how to use it in relation with Dev token.

## What’s dev-kit-js?

[dev-kit](https://www.npmjs.com/package/@devprotocol/dev-kit) is a library to utilize functions of Dev Protocol from JavaScript (TypeScript).

## Installing

```text
npm i -D @devprotocol/dev-kit
```

## How to use

Create a client of `dev-kit-js`
In order to make use of `dev-kit-js` , you need to implement contractFactory and create a client. You also need Provider for contractFactory. Provider can be obtained from web3js.


```javascript
import Web3 from "web3/dist/web3.min"

const provider  = new Web3(window.ethereum)
const clientDev = contractFactory(provider.currentProvider)
```

> Tips
If you use web3 at `pure js`, you have to import it from `dist/web3.min.js`.

After you’ve created a client, you can use it as stated below.

```javascript
const balanceOfDEV = await clientDev.dev(addressDEV).balanceOf(addressWallet)
```

## Equipped functions

The following 12 types are categorized as equipped functions.

- allocator
- dev
- lockup
- market
- metrics
- policy
- policyFactory
- policyGroup
- property
- propertyFactory
- registry
- withdraw

## How to use Dev token related functions

### Before you start

There are several functions related to DEV token in `dev` as equipped functions.

You need to pass Address of DEV token as an argument to use `dev` at first.

You can obtain Address of DEV token as stated below.

```javascript
import {addresses, contractFactory} from "@devprotocol/dev-kit"

const registryContract = clientDev.registry(addresses.eth.main.registry)
const addressDEV       = await registryContract.token()
```

If you need Address of Ropsten environment, check the following example.

```javascript
const registryContract = clientDev.registry(addresses.eth.ropsten.registry)
const addressDEV       = await registryContract.token()
```

### name

*You can obtain the name of DEV token.*

- Argument
    - N/A
- Return value
    - Token name<string>
- How to use

```javascript
const name = await clientDev.dev(addressDev).name() // Dev
```

### symbol

*You can obtain Symbol of DEV token.*

- Argument
    - N/A
- Return value
    - Token Symbol<string>
- How to use

```javascript
const symbol = await clientDev.dev(addressDev).symbol() // DEV
```

### decimals

*You can return the digit numbers after the decimal point that Dev token uses.*

- Argument
    - N/A
- Return value
    - Digit numbers after the decimal point that the token uses<string>
- How to use

```javascript
const decimals = await clientDev.dev(addressDev).decimals() // 18
```

### totalSupply

*You can return the number of issued DEV token.*

- Argument
    - N/A
- Return value
    - The number of issued DEV token<string>
- How to use

```javascript
const totalSupply = await clientDev.dev(addressDev).totalSupply()
```

### balanceOf

*You can obtain the balance of DEV token for designated address*

- Argument
    - Wallet address
- Return value
    - DEV token balance<string>
- How to use

```javascript
const balanceOfDEV = await clientDev.dev(addressDev).balanceOf(walletAddress)
```

> Tips
> For DEV token gained through such functions as balanceOf (ERC20), 18 digits are defined as after the decimal point. Therefore, the value of DEV token is the value that is carried down by 18 digits from the value obtained. Dealing with the number having 18 digits on JavaScript leads to an overflow, so you have to use it with a library.

```javascript
import {BigNumber} from "@ethersproject/bignumber"

const decimalNumber = Math.pow(10, decimals).toString() // 1000000000000000000
const dev = BigNumber.from(balanceOf).div(decimalNumber).toString()
```

### transfer

*You can transfer Dev token to A.*

- Argument
    - Wallet address you’ll transfer to
    - The number of DEV token to transfer
- Return value
    - Success or failure<boolean>
- How to use

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const transferDev   = BigNumber.from(転送するDEVトークン数).mul(decimalNumber).toString()
const transfer      = await clientDev.dev(address).transfer(転送先のアドレス, transferDev)
```

### approve

*You can approve the transfer of DEV token from a designated address.*

- Argument
    - Wallet address to approve transfer
    - The number of DEV token to transfer
- Return value
    - Success or failure<boolean>
- How to use

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const approveDev    = BigNumber.from(TheNumberOfDEVTokenToTransfer).mul(decimalNumber).toString()
const approve       = await clientDev.dev(addressDev).approve(AddressToApproveTransfer, approveDev)
```

### allowance

*You can return the approved amount of DEV token that can be withdrawn.*

- Argument
    - Wallet address that you approved transfer
    - Wallet address that is approved for transfer
- Return value
    - Transferable Dev token<string>
- How to use

```javascript
const allowance = await clientDev.dev(addressDev).allowance(転送を許可したウォレットアドレス, 転送を許可されたウォレットアドレス)
```

### transferFrom

*You can withdraw approved DEV token.*

- Argument
    - Wallet address that you approved transfer
    - Wallet address that is approved for transfer
    - The amount to transfer
- Return value
    - Success or failure<boolean>
- How to use

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const transferDev   = BigNumber.from(TheAmountToTransfer).mul(decimalNumber).toString()
const transferFrom  = await clientDev.dev(address).transferFrom(WalletAddressThatYouApprovedTransfer, WalletAddressThatIsApprovedForTransfer, transferDev)
```

### deposit

*You can stake Dev token for property.*

- Argument
    - Address of property to stake
    - The number of Dev to stake
- Return value
    - Success or failure<boolean>
- How to use

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const stakingDev    = BigNumber.from(TheNumberOfDevToStake).mul(decimalNumber).toString()
const staking       = await clientDev.dev(address).deposit(AddressOfPropertyToStake, stakingDev)
```

### contract

*You can return the instance of Contact in web3js.*

- Argument
    - N/A
- Return value
    - Contract in web3js
- How to use

```javascript
const contract = await clientDev.dev(address).contract()

// You can use Contract in web3js. 
// https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
contract.defaultBlock()
```

## Conclusion
For `dev` functions of `dev-kit-js`, functions defined at ERC20 are equipped. deposit function is equipped for `dev-kit-js` as well. If you make use of deposit functions, you can start staking Dev by using a program, and you’ll be able to create a Dapp like Stakes.Social. We also have `Lockup.withdraw`, a function to terminate staking, and `withdraw.withdraw`, a function to withdraw creator reward. We’ll introduce them to you in our next article.
