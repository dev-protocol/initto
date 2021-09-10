---
title: Dev Protocol HandsOn - ログインと所持DEV表示
author: Kawakami
date: 2021-09-06
socialImage: 'https://initto.devprotocol.xyz/images/posts/handson/ogp_handson-01.png'
level: 初級
tags:
- HandsOn
---

## Metamaskに接続して認証を行い、ユーザーのウォレットアドレスと所持DEVを表示する

はじめに今回作成する完成品を紹介します。
<iframe src="https://codesandbox.io/embed/login-with-wallet-9hnhu?autoresize=1&fontsize=14&hidenavigation=1&theme=dark&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Login with Wallet" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

または以下のURLにアクセスしてください
[https://9hnhu.csb.app/](https://9hnhu.csb.app/)

このアプリケーションは、Metamaskに接続して認証を行い、ユーザーのウォレットアドレスと所持DEVを表示するアプリケーションになっています。

【動作説明】
- Walletボタンを押すとMetamaskに接続処理が走ります
- Metamaskがなかったり、Ropsten環境が設定されていない場合にエラーになります
- Metamaskと正常に接続できるとログイン完了となります
- ログインが完了するとあなたのウォレットアドレスと、所持DEV数が表示されます

## それではハンズオンに入ります。
以下のURLにアクセスしてCodesandboxを開いてください。
[https://codesandbox.io/s/login-with-wallet-build-qknzh](https://codesandbox.io/s/login-with-wallet-build-qknzh)

左側のExploreからsrc/index.tsを選択して、ソースコードを表示させてください。

最下部までスクロールすると、①があります。
これから①〜⑨までをコーディングしていきます。

①：ここでは、ボタンのクリックイベントとclickLoginButtonメソッドの紐づと、ボタン押された際の処理のコードが書かれています。

②：上部にスクロールして②を見つけてください。clickLoginButtonメソッドは、Metamaskにアクセスして認証処理を行い、ユーザーのウォレットアドレスと所持DEVを表示する。までを行っているメソッドです。

③：③から⑦にかけて、Metamaskの状態を判断してログイン済みかを判断します。Metamaskの状態として以下を定義しています

| ログイン判定 | Metamaskの状態            | 説明                                                       |
| ------ | ---------------------- | -------------------------------------------------------- |
| 未ログイン  | Metamaskが未インストール状態     | ブラウザにMetamaskが搭載されていない状態                                 |
| 未ログイン  | Metamaskと未接続状態         | MetamaskでWebサイトが接続許可できていない状態                             |
| 未ログイン  | Metamaskで未ログイン状態       | Metamask上でログインがされていない状態                                  |
| 未ログイン  | Metamaskの接続ネットワークが違う状態 | Metamaskが接続しているネットワークがWebサイトが期待しているネットワークと違っている          |
| ログイン   | 上記の状態に当てはまっていない        | Metamaskからウォレットアドレスが取得できて、Webサイトが期待しているネットワークに接続が行えている状態 |

③では「Metamaskが未インストール状態」を判定します。スクロールして、`isMetamask`関数を見つけます。`isMetamask`関数を以下のようにコーディングします。

```tsx
function isMetamask(): boolean {
  return !!window.ethereum && !!window.ethereum.isMetaMask;
}
```

`wen3.js`がインストールされると、`window`オブジェクトに`ethereum`が追加されます。`ethereum`には`isMetamask`関数があり「Metamaskが未インストール状態」を判定できます。

④：次に「Metamaskと未接続状態」を判定します。スクロールして`connectMetaMask`関数を見つけます。`connectMetaMask`関数を以下のようにコーディングします。

```tsx
async function connectMetaMask(): Promise<boolean> {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (e) {
    if (e.code === 4001) {
      return false;
    }
  }
  return true;
}
```

「Metamaskと未接続状態」を判定するには、Metamaskからイーサリアムのアドレスを問い合わせます。その際にユーザーがMetamaskで接続拒否するなどWebサイトとMetamaskの接続が確立できていない場合に`4001`コードのエラーを返すのでこれを利用して判定します。
参考：[https://docs.metamask.io/guide/rpc-api.html#permissions](https://docs.metamask.io/guide/rpc-api.html#permissions)

⑤：次に「Metamaskで未ログイン状態」を判定します。スクロールして`isMetaMaskLogin`関数を見つけます。`isMetaMaskLogin`関数を以下のようにコーディングします。

```tsx
async function isMetaMaskLogin(): Promise<boolean> {
  return !!(await getAccount());
}
```

`isMetaMaskLogin`関数では、`getAccount`関数を呼んでいます。`getAccount`関数ではMetamaskからウォレットアドレスを取得して返しています。
`getAccount`関数を以下のようにコーディングします。

```tsx
async function getAccount() {
  const accounts = (await window.ethereum.request({
    method: "eth_accounts"
  })) as string[];

  return accounts[0];
}
```

⑥：次に「Metamaskの接続ネットワークが違う状態」を判定します。スクロールして`isMainNet`関数を見つけます。`isRopsten`関数を以下のようにコーディングします。

```tsx
function isRopsten() {
  return parseInt(window.ethereum.chainId) === 3;
}
```

`window.ethereum.chainId`では、接続しているネットワークによって以下の`CHAIN_ID`を返します

| ネットワーク名 | CHAIN_ID | 説明 |
| ------- | -------- | ------------------------ |
| Mainnet | 1        | Ethereum 本番環境ネットワーク |
| Ropsten | 3        | Ethereum テストネットワーク (PoW) |
| Rinkeby | 4        | Ethereum テストネットワーク (PoA) |

参考：[https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)

⑦：スクロールして⑦を見つけてください。⑦では、③から⑥までのチェックで引っかからない場合を「ログイン済み状態」としています。この後は、ログイン後の処理をコーディングしていきます。

⑧：ユーザーのウォレットアドレスを取得して表示させます。スクロールして⑧を探して以下のようにコーディングします。

```tsx
  const walletAddress = await getAccount();
  const addressElement = document.getElementById("address");
  addressElement.innerText = walletAddress;
```

ウォレットアドレスを取得するのに⑤で作成した`getAccount`関数を使っています。

⑨：次に、ユーザーの所持DEVを取得して表示させます。スクロールして`getBalanceOfDEV`関数をみつけます。`getBalanceOfDEV`関数を以下のようにコーディングします。

```tsx
import { addresses, contractFactory } from "@devprotocol/dev-kit";
import { BigNumber } from "@ethersproject/bignumber";
import Web3 from "web3";

async function getBalanceOfDEV(walletAddress: string) {
  const provider = new Web3(window.ethereum);
  const client = contractFactory(provider.currentProvider);

  const registryContract = client.registry(addresses.eth.ropsten.registry);

  const addressDEV = await registryContract.token();

  const amountBigNumber = BigNumber.from(
    await client.dev(addressDEV).balanceOf(walletAddress)
  );

  const amount = amountBigNumber.div("1000000000000000000").toString();
  return amount
}
```

※`getBalanceOfDEV`を呼び出すときは`await`を追記してください

`contractFactory`は、`@devprotocol/dev-kit`で宣言されている関数で、`Web3`の`currentProvider`を引数に渡すことで`client`を作成することができます。この`client`を利用してDevProtocolを操作することができます。

ここからは`client`を利用して所持DEV数を取得しています。

```tsx
const registryContract = client.registry(addresses.eth.ropsten.registry);
```

Dev Protocolのコントラクトは種類ごとに分散されており、それぞれのコントラクトのアドレスは`registryContract`で管理されています。上記の部分では、`ropsten` 環境の`registryContract`を取得しています。DevProtocolでは、`main`と`ropsten`の環境があります。

```tsx
const addressDEV = await registryContract.token();
```

このハンズオンでは、所持DEV数を表示させたいので、DEVトークンを扱っている`token`コントラクトのアドレスを返しています。
[Etherscan](https://ropsten.etherscan.io/address/0x5312f4968901Ec9d4fc43d2b0e437041614B14A2)でコントラクトを見ることもできます。

```tsx
  const amountBigNumber = BigNumber.from(
    await client.dev(addressDEV).balanceOf(walletAddress)
  );
```

`dev`関数はDEVトークンに関連するコントラクトのためのメソッドです。`dev`関数にDEVトークンのコントラクトアドレスを設定し、`balanceOf`メソッドに対象者のウォレットアドレスを指定することで、対象者の所持DEV数が返ってきます

---

`client`には`dev`関数の他にも以下の関数があります。

```tsx
export type DevkitContract = {
        readonly allocator: ReturnType<typeof createAllocatorContract>
        readonly market: ReturnType<typeof createMarketContract>
        readonly property: ReturnType<typeof createPropertyContract>
        readonly propertyFactory: ReturnType<typeof createPropertyFactoryContract>
        readonly lockup: ReturnType<typeof createLockupContract>
        readonly withdraw: ReturnType<typeof createWithdrawContract>
        readonly dev: ReturnType<typeof createDevContract>
        readonly registry: ReturnType<typeof createRegistryContract>
        readonly policy: ReturnType<typeof createPolicyContract>
        readonly policyGroup: ReturnType<typeof createPolicyGroupContract>
        readonly metrics: ReturnType<typeof createMetricsContract>
        readonly policyFactory: ReturnType<typeof createPolicyFactoryContract>
}
```

コードベース：[https://github.com/dev-protocol/dev-kit-js/blob/372c762539855b794af2e3df5774061d640f61d0/lib/contract.ts](https://github.com/dev-protocol/dev-kit-js/blob/372c762539855b794af2e3df5774061d640f61d0/lib/contract.ts)

また、`dev`関数には`balanceOf`関数の他にも以下の関数があります

```tsx
export type DevContract = {
        readonly totalSupply: () => Promise<string>
        readonly balanceOf: (address: string) => Promise<string>
        readonly transfer: (to: string, value: string) => Promise<boolean>
        readonly allowance: (from: string, to: string) => Promise<string>
        readonly approve: (to: string, value: string) => Promise<boolean>
        readonly transferFrom: (
                from: string,
                to: string,
                value: string
        ) => Promise<boolean>
        readonly name: () => Promise<string>
        readonly symbol: () => Promise<string>
        readonly decimals: () => Promise<string>
        readonly deposit: (to: string, value: string) => Promise<boolean>
        readonly contract: () => Contract
}
```

コードベース：[https://github.com/dev-protocol/dev-kit-js/blob/372c762539855b794af2e3df5774061d640f61d0/lib/dev/index.ts](https://github.com/dev-protocol/dev-kit-js/blob/372c762539855b794af2e3df5774061d640f61d0/lib/dev/index.ts)

---

```tsx
const amount = amountBigNumber.div("1000000000000000000").toString();
```

ERC20トークンの小数点以下は18桁なので、小数点を合わせるために割っています。

以上でコーディングは終了となります。動作確認をしてみましょう。
ログインが行えて、自分のウォレットアドレスと所持DEV数が画面に表示されたら完了です。

