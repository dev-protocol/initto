---
title: Deep Dive Khaos
author: Aggre
date: 2021-03-20
socialImage: 'https://initto.devprotocol.xyz/images/posts/deep-dive-khaos/ogp.png'
level: 中級以上
tags:
  - Khaos
---

# Khaos

こんにちは、Aggre です。

この記事では、Dev Protocol のサイドプロジェクトとして開発されている Khaos のことを知ることができます。

Khaos とは、ブロックチェーン上に存在しない情報をブロックチェーンの外部からブロックチェーンに持ち込む "オラクル(神託)" の機能を担っています。そのため Khaos Oracle と呼ぶこともあります。

# オラクルの必要性

Khaos に限らず、Ethereum には様々なオラクルプロトコルが存在します。Ethereum とは、スマートコントラクトによって定義されたプロトコルに基づいて発生する状態遷移の連鎖を保持した巨大なステートです。つまり入力トランザクションが存在しないデータは Ethereum 上に存在しないことになります。入力されるデータソースを HTTP から取得したい場合は、HTTP のレスポンスを手作業で入力するか、信頼できるボットによって自動的に入力させるかのどちらかとなり、オラクルとは後者のユースケースで使用されます。例えば "明日の東京の気温を当てた人が勝つブロックチェーンゲーム" を作るとき、"東京の気温データ" が必要になります。そのデータを天気マニアの Alice が手作業で入力する場合と、気象庁のデータベースから得られたデータをボットが入力するように記述されたスマートコントラクトと、どちらが信用できるでしょうか？ オラクルは、後者を選ぶ場合に必ず必要になる技術です。

# Khaos の必要性

オラクルの一般的な実装では、スマートコントラクトからイベントを emit して、そのイベントをオラクルプロトコルを構成するサーバーが検知し、最後にコールバック関数を呼び出す、という手法が採られます。emit するイベントのペイロードのなかにスマートコントラクトが要求している情報（例えば、"東京" の "気温" など）を付加することで、オラクルプロトコルはスマートコントラクトが何を欲しているのかを知ります。

Khaos はオラクルリクエストのためのペイロードを秘匿化することのできるオラクルです。オラクルしたい情報が何らかのシークレットトークンに基づいて取得する必要がある場合、パブリックなペイロードにシークレットトークンをそのまま含めることはできないので、シークレットトークンなどを公開可能な形式に換え安全にする必要があります。

Khaos を使うと、あなたのシークレットトークンを秘匿化したままで、パブリックブロックチェーン上でオラクルすることができます。

# Khaos を使う

あなたの Dapps でも Khaos を使うことができます。フロントエンドのための SDK, オラクル関数を実装するための Starter Kit を使うことで、すぐに開発を始めることができます。

_Khaos で使用可能なスマートコントラクトは現在、Dev Protocol のコアを構成するスマートコントラクトまたは Market, Policy コントラクトに限定されています。将来的にすべてのスマートコントラクトで使用可能になる予定です。_

## Khaos のオラクルフロー

Khaos の開発を始める前に、そのオラクルフローを理解しておくのはいいスタートです。Khaos は Khaos Core, Khaos Functions, Khaos Registry などの複数の要素により成り立ちますが、Dapps 開発者にとって重要なのは以下のフローです。

1. Khaos の Sign API(RESTful API) をコールして、秘匿化対象のデータを公開可能に変換した Public Signature を取得します。
2. スマートコントラクトからイベントを emit する。このとき、イベントペイロードに Public Signature を含めることで、あなたが定義したオラクル関数は秘匿情報を取り扱うことができます。
3. Khaos はあなたが定義したコールバック関数をコールして、フローを閉じます。

Khaos は多くのインターフェイスをユーザーに委ねることでオラクルに高い自由度を与えています。その代わりユーザーは多くのインターフェイスを自ら実装する必要がありますが、 Khaos Starter Kit を使うことですぐに開発を始めることができます。

## Public Signature

Khaos を扱ううえで重要なキーワードのひとつに Public Signature があります。

Public Signature とは Json Web Tokens によって暗号化された文字列ですが、暗号化に使われる情報はすべて公開可能な情報であり、誰でも生成、復号化できます。つまり Public Signature には秘密情報が一切含まれておらず、公開可能です。Khaos ではこの Public Signature をキーとして秘密情報を保存し、Khaos インスタンスの内部でのみ利用します。

Public Signature は以下のような JSON 文字列を送信者の Ethereum アカウントアドレスによって暗号化したものです。

```json
{
  "i": "...",
  "m": "..."
}
```

実装とテストは Khaos Core で確認できます。
[khaos-core/src/sign/publicSignature at main · dev-protocol/khaos-core (github.com)](https://github.com/dev-protocol/khaos-core/tree/main/src/sign/publicSignature)

## Khaos Starter Kit

[dev-protocol/khaos-starter-kit: 🌌Start developing Khaos Functions now (github.com)](https://github.com/dev-protocol/khaos-starter-kit)

ユーザーが定義すべきインターフェイスのテンプレートを提供しています。

このリポジトリをフォークしたらクローンして、あなたのローカル環境で開発を始めましょう。Khaos Starter Kit は yarn でパッケージマネジメントしているので、事前に [yarn をインストールしておく](https://classic.yarnpkg.com/en/docs/install/)必要もあります。

```text
$ git clone git@github.com:YOUR/khaos-starter-kit.git
$ cd khaos-starter-kit
$ yarn
```

src ディレクトリにはあなたが定義する必要のあるインターフェイスのテンプレート、そしてテストが TypeScript で書いてあります。

Khaos Starter Kit では、ESLint プラグイン [eslint-plugin-functional](https://www.npmjs.com/package/eslint-plugin-functional) をセキュリティのために推奨しています。あなたはそれを自由に変更できますが、なるべく変更せずに使うことをお勧めします。

### abi.ts

あなたのスマートコントラクトの ABI を [Human-Readable ABI Format](https://docs.ethers.io/v5/api/utils/abi/formats/#abi-formats--human-readable-abi) で記述した `array` を定義し、`abi` と命名してエクスポートします。

例えば `Query` というイベント、`callback` というコールバック関数を持つスマートコントラクトであれば以下のように書きます。Khaos が使用するのはイベントとコールバック関数だけなので、そのスマートコントラクトに他のインターフェイスがあってもすべてをここに定義する必要はありません。

```typescript`
import {Abi} from '@devprotocol/khaos-core'

export const abi: Abi = [
  'event Query(string calldata fooId, string calldata publicSignature, address account, bytes32 queryId)',
  'function callback(bytes32 queryId, bool result) external;'
]
```

### addresses.ts

オラクルリクエストを emit するスマートコントラクトのアドレスを `Promise<string | undefined>` で返す関数を定義し、`addresses` でエクスポートします。この関数の返却値はコールバック関数のアドレスとしても使用されます。

関数は引数として以下のようなオブジェクトを受け取ります。

```typescript
type Options = {
  readonly network: 'mainnet' | 'ropsten'
}
```

Ethereum のメインネットまたは Ropsten テストネットによってアドレスを切り分けることができます。

```typescript
import {FunctionAddresses} from '@devprotocol/khaos-core'

export const addresses: FunctionAddresses = async ({network}) =>
  network === 'mainnet'
    ? '0x1510EA12a30E5c40b406660871b335feA32f29A'
    : '0x609Fe85Dbb9487d55B5eF50451e20ba2Edc8F4B7'
```

### authorize.ts

Khaos の Sign API がコールされたときに、正規の署名リクエストかどうかを判定して `Promise<boolean | undefined>` で返す関数を定義し、`authorize` でエクスポートします。

authorize の結果が `true` の場合にのみ Public Signature が生成され、Khaos サーバーに暗号化された秘匿情報が保存されます。

関数は引数として以下のようなオブジェクトを受け取ります。`message` は verify の対象となる文字列で、Twitter ID や GitHub リポジトリ名などが該当します。`secret` には秘匿情報となる文字列です。
`request` は @azure/functions の `HttpRequest` 型なので、Sign API がコールされたときの様々なコンテキストを利用できます。

```typescript
type Options = {
  readonly message: string
  readonly secret: string
  readonly request: HttpRequest
}
```

Khaos Starter Kit には HTTP ライブラリとして bent がインストールされているので、外部の API をコールして、`message` が正規のものかどうか判断することができます。また、関数型プログラミングライブラリとして ramda もインストールされているのでケースバイケースで利用してください。

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

スマートコントラクトが emit するイベント名を `Promice<string | undefined>` で返す関数を定義し、`event` でエクスポートします。

関数は引数として以下のようなオブジェクトを受け取ります。

```typescript
type Options = {
  readonly network: 'mainnet' | 'ropsten'
}
```

Ethereum のメインネットまたは Ropsten テストネットによってイベント名を切り分けることができますが、多くの場合は同じイベント名を使用するはずです。

```typescript
import {FunctionEvent} from '@devprotocol/khaos-core'
import {always} from 'ramda'

export const event: FunctionEvent = always(Promise.resolve('Query'))
```

### oraclize.ts

スマートコントラクトからのオラクルリクエストによってコールされる関数を定義します。この関数はとても重要なパートを担っています。この関数の返却値は後述の `pack` 関数によって整形された後にスマートコントラクトへのコールバックを介してブロックチェーンに渡されます。 oraclize 関数がコールされるのは、Khaos によってイベントが検出され、Public Signature をキーとして秘匿情報が取得されたあとです。

関数は引数として以下のようなオブジェクトを受け取ります。`signatureOptions` は、Public Signature を復号化したデータです。また、`signatureOptions` は `authorize` 関数の結果が `true` を返した際に生成された Public Signature がイベントペイロードに含まれる場合にのみ定義されます。つまり、未認証の Public Signature が含まれている場合は `undefined` を返します。 `query.publicSignature` にはイベントペイロードに含まれる Public Signature、`query.transanctionhash` にはイベントを emit したトランザクションハッシュ、`query.allData` にはすべてのイベントペイロードが含まれています。

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

関数の返却値は以下のようなオブジェクトで解決される Promise です。

```typescript
type Options = {
  message: string
  status: number
  statusMessage: string
}
```

次の例では、Public Signature の署名者とオラクルリクエスト送信者が同一アカウントであることを確認しています。

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

スマートコントラクトのコールバック関数名/引数により解決する Promise を返す関数を定義し、`pack` でエクスポートします。

関数は引数として以下のようなオブジェクトを受け取ります。`results` は oraclize が返す Promise が解決したときの値と同じデータです。

```typescript
type Options = {
  readonly results: {
    readonly message: string
    readonly status: number
    readonly statusMessage: string
  }
}
```

次の例では、 `callback` と名付けられた関数に `[results.message, results.status, results.statusMessage]` という引数でコールバックするように指定しています。

```typescript
import {FunctionPack} from '@devprotocol/khaos-core'

export const pack: FunctionPack = async ({results}) => {
  return {
    name: 'callback',
    args: [results.message, results.status, results.statusMessage]
  }
}
```

## テスト

Khaos Starter Kit はデフォルトで ava でテストを書きます。テスティングフレームワークはあなたのプロジェクトに合わせて自由に変更できます。

テストは Khaos の利用には必須ではありませんが、仕様保証やメンテナンサビリティのために、なるべく正確なテストケースを用意することを強くお勧めします。

## デプロイ

すべてのインターフェイスとテストが完成したら、コードをデプロイします。

Khaos ではユーザー定義の関数は `index.js` の 1 ファイルにバンドルし、IPFS にデプロイします。Khaos Starter Kit ではデフォルトで Rollup によりバンドルし、Infura の IPFS ノードにデプロイします。

あなたが実行すべきコマンドはただこれだけです。

```text
yarn deploy
```

ソースコードによっては Rollup の設定を更新する必要があったり、追加のプラグインをインストールする必要がある場合があります。その場合、あなたは `rollup.config.js` を書き換えたり、追加のプラグインをインストールできます。また、Rollup 以外のバンドラーを利用することもできます。

デプロイすると以下のような標準出力があるので、`IPFS_HASH_FOR_DIRECTORY` の値をメモしておいてください。

```text
> {"Name":"index.js","Hash":"IPFS_HASH_FOR_FILE","Size":"554"}
> {"Name":"","Hash":"IPFS_HASH_FOR_DIRECTORY","Size":"609"}
```

## Khaos Registry

[dev-protocol/khaos-registry: 🌌Khaos Registry for functions ipfs hash (github.com)](https://github.com/dev-protocol/khaos-registry)

IPFS にデプロイされた関数のアドレスマップを管理しています。

このリポジトリをフォークして、`map/functions.json` に先ほどメモした `IPFS_HASH_FOR_DIRECTORY` の値を追記してください。

```json
[
  {
    "id": "foo-bar",
    "ipfs": "<IPFS_HASH_FOR_DIRECTORY>"
  }
]
```

フォークリポジトリに変更を push したら、ソースリポジトリに対して Pull Request を作成してください。

現在は Khaos の利用用途を Dev Protocol 関連コントラクトに限定しているため、IPFS にデプロイされた関数の `addresses` が Dev Protocol 上のコントラクトであることを検証します。

_将来的には、Khaos Registry はスマートコントラクトとして再構成、分散化される予定です。_

## Khaos Kit

[dev-protocol/khaos-kit-js: 🌌Khaos Kit for JavaScript (github.com)](https://github.com/dev-protocol/khaos-kit-js)

Khaos Kit は、JavaScript(TypeScript) から Khaos とインタラクションするための API を提供します。

### sign

`sign` API は、Khaos の Sign API を呼び出す HTTP リクエストのショートハンドです。

この関数は 2 つの引数を取ります。最初の引数は Khaos の認証 ID で、Khaos Registry の `id` プロパティで指定したものと同じ文字列です。2 つ目の引数はネットワーク名として `'mainnet'` または `'ropsten'` を取ります。

```typescript
// createPublicSignature.ts
import {sign} from '@devprotocol/khaos-kit'

export const createPublicSignature = sign('foo-bar', 'mainnet')
```

`sign` は `KhaosSignOptions` を引数に取る関数を返します。`KhaosSignOptions` の `message` は署名に用いたメッセージ、`signature` は Ethereum ウォレットで作成した署名、`secret` には秘匿化したい情報を渡します。

Ethereum ウォレットで署名するには、Web3 や Ethers の API を利用してください。

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

`emulate` API は、オラクルリクエストのためのイベントを emit したときの結果を off-chain でエミュレーションします。

この関数は 2 つの引数を取ります。最初の引数は Khaos の認証 ID で、Khaos Registry の `id` プロパティで指定したものと同じ文字列です。2 つ目の引数はネットワーク名として `'mainnet'` または `'ropsten'` を取ります。

```typescript
// emulator.ts
import {emulate} from '@devprotocol/khaos-kit'

export const emulator = emulate('foo-bar', 'mainnet')
```

`emulate` は `KhaosEmulateOptions` を引数に取る関数を返します。`KhaosEmulateOptions` は [@ethersproject/contracts の `Event` ](https://github.com/ethers-io/ethers.js/blob/6c43e20e7a68f3f5a141c74527ec63d9fe8458be/packages/contracts/src.ts/index.ts#L60) と同じ情報をすべてオプショナルにした `event` オブジェクトを取ります。 `Event.args` は `Array` を `{readonly [key: string]: any}` で `extend` した型ですが、`KhaosEmulateOptions.args` は `Record<string, string | number | undefined | null>` でオーバーライドして単純化されています。

この関数の戻り値は、Khaos Starter Kit で作成した `pack` の戻り値に `expectedTransaction` を追加したデータです。

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
