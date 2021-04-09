---
title: dev-kit-jsの使い方#1
author: Kawakami
date: 2021-04-09
socialImage: 'https://initto.devprotocol.xyz/images/posts/How-to-use-dev-kit-js-01/ogp.png'
level: 初級
tags:
- dev-kit-js
---
# dev-kit-jsの使い方 #1 

## はじめに

今回から数回にわたり、Dev Protocolで用意されているライブラリ `dev-kit-js` の使い方を紹介していきます。今回はDevトークンまわりの使い方を紹介します

## dev-kit-jsとは

[dev-kit](https://www.npmjs.com/package/@devprotocol/dev-kit)は、Dev Protocolの機能をJavaScript（TypeScript）から利用するためのライブラリになります

## インストール

```text
npm i -D @devprotocol/dev-kit
```

## 使い方

`dev-kit-js` のクライアントの作成

`dev-kit-js` を使うためには、contractFactoryを実行してクライアントを作成する必要があります。contractFactoryにはProviderが必要で、Providerはweb3jsから取得することができます

```javascript
import Web3 from "web3/dist/web3.min"

const provider  = new Web3(window.ethereum)
const clientDev = contractFactory(provider.currentProvider)
```

> Tips
web3を `pure js` で使う場合は、 `dist/web3.min.js` からImportします

クライアントを作成したら、以下のように使うことができます

```javascript
const balanceOfDEV = await clientDev.dev(addressDEV).balanceOf(addressWallet)
```

## 用意されている関数

用意されている関数をカテゴリ別にすると、以下の12個のカテゴリが用意されています

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

## Devトークンに関連する関数の使い方

### はじめに

用意されている関数の中の`dev` は、DEVトークンに関連する関数が揃っています。

はじめに`dev` を使うためにはDEVトークンのAddressを引数として渡す必要があります。

DEVトークンのAddressは以下のように取得できます

```javascript
import {addresses, contractFactory} from "@devprotocol/dev-kit"

const registryContract = clientDev.registry(addresses.eth.main.registry)
const addressDEV       = await registryContract.token()
```

Ropsten環境のAddressが欲しい場合は以下のように変更します

```javascript
const registryContract = clientDev.registry(addresses.eth.ropsten.registry)
const addressDEV       = await registryContract.token()
```

### name

*DEVトークンの名前を取得します*

- 引数
    - なし
- 返り値
    - トークンの名前<string>
- 使用方法

```javascript
const name = await clientDev.dev(addressDev).name() // Dev
```

### symbol

*DEVトークンのSymbolを取得します*

- 引数
    - なし
- 返り値
    - トークンのSymbol<string>
- 使用方法

```javascript
const symbol = await clientDev.dev(addressDev).symbol() // DEV
```

### decimals

*DEVトークンが使用する小数点以下の桁数を返します*

- 引数
    - なし
- 返り値
    - トークンが使用する小数点以下の桁数<string>
- 使用方法

```javascript
const decimals = await clientDev.dev(addressDev).decimals() // 18
```

### totalSupply

*発行済DEVトークン数を返します*

- 引数
    - なし
- 返り値
    - 発行済DEVトークン数<string>
- 使用方法

```javascript
const totalSupply = await clientDev.dev(addressDev).totalSupply()
```

### balanceOf

*指定したアドレスのDEVトークン残高を取得します*

- 引数
    - ウォレットアドレス
- 返り値
    - DEVトークン残高<string>
- 使用方法

```javascript
const balanceOfDEV = await clientDev.dev(addressDev).balanceOf(ウォレットアドレス)
```

> Tips
balanceOfなどで取得したDEVトークン（ERC20）は、18桁分を小数点以下と定義されています。そのため、取得した値を18桁分繰り下げた値がDEVトークンの値となります。また、18桁の数値をJavaScriptで扱うとオーバーフローしてしまいます。そのため、ライブラリを使用して扱うようにします。

```javascript
import {BigNumber} from "@ethersproject/bignumber"

const decimalNumber = Math.pow(10, decimals).toString() // 1000000000000000000
const dev = BigNumber.from(balanceOf).div(decimalNumber).toString()
```

### transfer

*DevトークンをAに転送します*

- 引数
    - 転送先のウォレットアドレス
    - 転送するDEVトークン数
- 返り値
    - 成否<boolean>
- 使用方法

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const transferDev   = BigNumber.from(転送するDEVトークン数).mul(decimalNumber).toString()
const transfer      = await clientDev.dev(address).transfer(転送先のアドレス, transferDev)
```

### approve

*DEVトークンを指定したアドレスから転送することを許可します*

- 引数
    - 転送を許可するウォレットアドレス
    - 転送するDEVトークン数
- 返り値
    - 成否<boolean>
- 使用方法

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const approveDev    = BigNumber.from(転送するDEVトークン数).mul(decimalNumber).toString()
const approve       = await clientDev.dev(addressDev).approve(転送を許可するアドレス, approveDev)
```

### allowance

*approveされたDEVトークンを引き出せる量を返します*

- 引数
    - 転送を許可したウォレットアドレス
    - 転送を許可されたウォレットアドレス
- 返り値
    - 転送可能なDevトークン<string>
- 使用方法

```javascript
const allowance = await clientDev.dev(addressDev).allowance(転送を許可したウォレットアドレス, 転送を許可されたウォレットアドレス)
```

### transferFrom

*approveされたDEVトークンを引き出す*

- 引数
    - 転送を許可したウォレットアドレス
    - 転送を許可されたウォレットアドレス
    - 転送する量
- 返り値
    - 成否<boolean>
- 使用方法

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const transferDev   = BigNumber.from(転送する量).mul(decimalNumber).toString()
const transferFrom  = await clientDev.dev(address).transferFrom(転送を許可したウォレットアドレス, 転送を許可されたウォレットアドレス, transferDev)
```

### deposit

*Devトークンをプロパティにステーキングする*

- 引数
    - ステーキングするプロパティのアドレス
    - ステーキングするDev数
- 返り値
    - 成否<boolean>
- 使用方法

```javascript
const decimalNumber = Math.pow(10, decimals).toString()
const stakingDev    = BigNumber.from(ステーキングするDev数).mul(decimalNumber).toString()
const staking       = await clientDev.dev(address).deposit(ステーキングするプロパティのアドレス, stakingDev)
```

### contract

web3jsのContractのインスタンスを返します

- 引数
    - なし
- 返り値
    - web3jsのContract
- 使用方法

```javascript
const contract = await clientDev.dev(address).contract()

// web3jsのContractを使用できます
// https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
contract.defaultBlock()
```

## まとめ

`dev-kit-js` の `dev` 関数では、ERC20で定義されている関数が用意されている他、 `dev-kit-js` で用意しているdeposit関数などがあります。deposit関数を利用するとプログラムを使ってDevのステーキングができるようになり、Stakes SocialのようなDappを作ることもできるようになります。また、ステーキングを解除する関数 `Lockup.withdraw` や、クリエイター報酬を引き出す関数 `withdraw.withdraw` も用意されており次の機会に紹介したいと思います。