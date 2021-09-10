---
title: Dev Protocol HandsOn - プロパティ表示とステーキング
author: Kawakami
date: 2021-09-06
socialImage: 'https://initto.devprotocol.xyz/images/posts/handson/ogp_handson-02.png'
level: 初級
tags:
- HandsOn
---

# 登録されているプロパティを表示しステーキングを行う

このハンズオンでは、Dev Protocolに登録されているプロジェクト（コード上ではプロパティと呼ばれています）を表示させます。Dev ProtocolのデータはGraphQLで呼び出すことができます。
はじめに、GraphQLを使ってデータを見てみましょう。GraphQLは以下のリンクからアクセスすることができます。

メインネット環境
[https://explorer.graphql.devprotocol.xyz/](https://explorer.graphql.devprotocol.xyz/)

オンボードされているプロパティを検索してみましょう。
オンボードされているプロパティを表示するためには、`Explorer`から`property_authentication`を選択します。

はじめに今回作成する完成品を紹介します。
<iframe src="https://codesandbox.io/embed/display-property-and-staking-c1o4r?autoresize=1&fontsize=14&hidenavigation=1&theme=dark&view=preview"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="display property and staking"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

または以下のURLにアクセスしてください
[https://c1o4r.csb.app/](https://c1o4r.csb.app/)

このアプリケーションは、アクセス時にGraphQLからプロパティリストを取得して、最初の1件のみを表示させています。プロパティには「1 DEV」をステーキングするボタンがあり、このボタンを押すとステーキングが行われます。

## それではハンズオンに入ります。
以下のURLにアクセスしてCodesandboxを開いてください。
[https://codesandbox.io/s/display-property-and-staking-build-vet8e?file=/src/index.ts](https://codesandbox.io/s/display-property-and-staking-build-vet8e?file=/src/index.ts)

左側のExploreから`src/index.ts`を選択して、ソースコードを表示させてください。
最下部までスクロールすると、①があります。

今回は①〜②をコーディングしていきます。

①：ここでは、ページが表示されたらGraphQLからプロパティの一覧を取得しそれを返すまでを行います。スクロールして`getPropertyFromRopsten`関数をみつけます。`getPropertyFromRopsten`関数を以下のようにコーディングします。

```tsx
async function getPropertyFromRopsten() {
  // GraphQLからプロパティ情報を取得する
  const response = await fetch(
    "https://devprtcl-event-ropsten.azurewebsites.net/v1/graphql",
    {
      method: "POST",
      headers: {
        "X-Requested-With": "xhr",
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "SjV2f9iWscDxFj4KU"
      },
      body: JSON.stringify({
        query: `
          query MyQuery {
            property_meta(limit: 3) {
              name
              property
            }
          }
        `
      })
    }
  );
  const json = await response.json();
  const convert = Array.from(json.data.property_meta).map((value) => {
    return { property_meta: value };
  });
  return convert;
}
```

GraphQLへの問い合わせは`fetch`を使用して問い合わせています。`fetch`の`body`の`query`では、GraphQLで発行したクエリをそのまま貼り付けることができます。
※本来はクエリで`property_authentication`を指定するのですが、Ropsten環境では動かないため`property_meta`を指定しています。

コーディングが終わったら実行してプロパティ名が変わることを確認してみましょう

`getPropertyFromRopsten`関数はRopsten環境のプロパティを取得するものです。メインネット環境からプロパティを取得する`getPropertyFromMain`関数もコーディングしてみましょう。

`getPropertyFromMain`関数を以下のように変更します。

```tsx
async function getPropertyFromMain() {
  const response = await fetch("https://api.devprotocol.xyz/v1/graphql", {
    method: "POST",
    headers: {
      "X-Requested-With": "xhr",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `
        query property_stake_social_onboard {
          property_authentication(
            order_by: {property_creation: {block_number: desc}}
            limit: 3
          ) {
            property_meta {
              name
              property
            }
          }
        }
        `
    })
  });
  const json = await response.json();
  const allCreatorInfo = json.data.property_authentication;
  return allCreatorInfo;
}
```

コーディングが終わったら、`getPropertyFromRopsten`を呼び出している部分を`getPropertyFromMain`を呼び出すように変更してみましょう

```tsx
  // ① Onboardしているプロパティの一覧を取得する
  const properties = await getPropertyFromMain();
  // const properties = await getPropertyFromRopsten();
```

コーディングが終わったら実行してプロパティ名が変わることを確認してみましょう。
確認が終わったら、`getPropertyFromRopsten`を使うように戻しておきます

②：次にStakingボタンが押された時の処理をコーディングしていきます。スクロールして`clickStakingButton`関数をみつけます。`clickStakingButton`関数を以下のようにコーディングします。

```tsx
async function clickStakingButton() {
  const msg = document.getElementById("msg");
  msg.classList.remove("hide");

  const propertyAddress = this.dataset.propertyAddress;

  // Clientを作成する
  const provider = new Web3(window.ethereum);
  const client = contractFactory(provider.currentProvider);

  // ropstenネットワークのDevProtocolのアドレスを取得する
  const registryContract = client.registry(addresses.eth.ropsten.registry);
  const addressDev = await registryContract.token();

  // 1DEV = 1000000000000000000に変換する
  const amountBigNumber = BigNumber.from("1");
  const amount = amountBigNumber.mul("1000000000000000000").toString();

  try {
    // deposit(`プロパティのアドレス`, `ステーキング額`)
    const result = await client
      .dev(addressDev)
      .deposit(propertyAddress, amount);
    msg.classList.add("hide");
    return result
      ? alert("ステーキング成功しました")
      : alert("ステーキング失敗しました");
  } catch (e) {
    msg.classList.add("hide");
    alert("もう一度Loginしてください");
    console.log(e);
    return;
  }
}
```

前半は前回のハンズオンでもコーディングしたDev-kit-jsの`client`を作成しているものです

```tsx
  const propertyAddress = this.dataset.propertyAddress;

  // Clientを作成する
  const provider = new Web3(window.ethereum);
  const client = contractFactory(provider.currentProvider);
```

ステーキングを行う`deposit`関数は、トークンコントラクトに含まれているので、トークンコントラクトのアドレスを取得しています。

```tsx
  // ropstenネットワークのDevProtocolのアドレスを取得する
  const registryContract = client.registry(addresses.eth.ropsten.registry);
  const addressDev = await registryContract.token();
```

今回は１DEVをステーキングするのですが、１DEVの単位を合わせるために18桁に変更させます。
桁数の大きな数値をJSは扱えないので、ライブラリを使用しています

```tsx
  // 1DEV = 1000000000000000000に変換する
  const amountBigNumber = BigNumber.from("1");
  const amount = amountBigNumber.mul("1000000000000000000").toString();
```

`client`の`dev`関数にトークンコントラクトのアドレスを設定し、`deposit`関数を呼び出すことでステーキングが行われます。ステーキングが完了すると、返値として`true`が返されます

```tsx
  // deposit(`プロパティのアドレス`, `ステーキング額`)
  const result = await client.dev(addressDev).deposit(propertyAddress, amount);
```

---

`dev`関数には`deposit`の他にも以下の関数があります

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

以上でコーディングは終了となります。動作確認をしてみましょう。
はじめにログインを行い、Stakingボタンを押して「Stakingに成功しました」とメッセージが表示されたら完了です。

Etherscanで確認してみましょう。Etherscanとはイーサリアムのトランザクションを確認できるWebサイトで、今回ステーキングしたトランザクションも記録されています。DEVトークンコントラクトのアドレスで検索してログを見てみましょう。
[https://ropsten.etherscan.io/address/0x5312f4968901Ec9d4fc43d2b0e437041614B14A2](https://ropsten.etherscan.io/address/0x5312f4968901Ec9d4fc43d2b0e437041614B14A2)