---
title: Dev Protocol HandsOn - ステーキング一覧と引き出し
author: Kawakami
date: 2021-09-06
socialImage: 'https://initto.devprotocol.xyz/images/posts/handson/ogp_handson-03.png'
level: 初級
tags:
- HandsOn
---

# ステーキングしているプロパティの一覧表示とステーキングの引き出しをする

このハンズオンでは、ステーキングしているプロパティ情報をGraphQLから取得します。はじめにGraphQLを利用してステーキングしているプロパティ一覧を取得してみましょう。GraphQLは以下のリンクからアクセスすることができます。

メインネット環境
[https://explorer.graphql.devprotocol.xyz/](https://explorer.graphql.devprotocol.xyz/)

`account_lockup`のwhereに`account_address` を指定して`_ilike`の値に、以下のアドレスを設定して実行してください。いくつかのデータが取得できると思います

`0x262A038D0bc05B4112c7D58BBfd407810bcfE2aB`

このデータがステーキングしているプロパティのデータになります。このデータを利用してハンズオンを行なっていきます。
※Ropsten環境では現在`account_lockup`の検索は行えません。

はじめに今回作成する完成品を紹介します。

<iframe src="https://codesandbox.io/embed/your-staking-and-withdraw-61lsg?autoresize=1&fontsize=14&hidenavigation=1&theme=dark&view=preview"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="your staking and withdraw"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

または、以下のURLにアクセスしてください
[https://61lsg.csb.app/](https://61lsg.csb.app/)

このアプリケーションは、アクセス時にGraphQLからアクセスしている人がステーキングしているプロパティリストを取得して、最初の1件のみを表示させています。プロパティには「1 DEV」を引き出すボタンがあり、このボタンを押すとステーキングの引き出しが行われます。
※Ropsten環境では現在`account_lockup`の検索が行えないため、前回のハンズオンでステーキングしたプロパティのアドレスを直接指定しています。

## それではハンズオンに入ります。
以下のURLにアクセスしてCodesandboxを開いてください。
[https://codesandbox.io/s/your-staking-and-withdrow-build-hfzmb?file=/src/index.ts](https://codesandbox.io/s/your-staking-and-withdrow-build-hfzmb?file=/src/index.ts)

左側のExploreから`src/index.ts`を選択して、ソースコードを表示させてください。
今回は①〜②をコーディングしていきます。

①：ここではページが表示されたらGraphQLからアクセスしている人がステーキングしているプロパティリストを取得してきます。スクロールして`getStakingPropertyFromRopsten`関数をみつけます。`getStakingPropertyFromRopsten`関数を以下のようにコーディングします。

```tsx
async function getStakingPropertyFromRopsten(address) {
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
    return {
      value: "20000000000000000000",
      property_meta: value,
      property_address: "0xb42612a90d05785c005b292f635871ca28aa10e0"
    };
  });
  return convert;
}
```

GraphQLへの問い合わせは`fetch`を使用して問い合わせています。`fetch`の`body`の`query`では、GraphQLで発行したクエリをそのまま貼り付けることができます。
※現在はRopsten環境ではステーキングしているプロパティ一覧を取得できないためコードに手を加えています。

コーディングが終わったら実行してプロパティ名が変わることを確認してみましょう

`getStakingPropertyFromRopsten`関数はRopsten環境のプロパティを取得するものです。メインネット環境からプロパティを取得する`getStakingPropertyFromMain`関数もコーディングしてみましょう

`getStakingPropertyFromMain`関数を以下のように変更します。

```tsx
async function getStakingPropertyFromMain(address) {
  const response = await fetch("https://api.devprotocol.xyz/v1/graphql", {
    method: "POST",
    headers: {
      "X-Requested-With": "xhr",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `
        query Staking_properties {
          account_lockup(
            where: {account_address: {_ilike: "${address}"}}
          ) {
            value
            property_meta {
              name
            }
            property_address
          }
        }
        `
    })
  });
  const json = await response.json();
  const allStakingInfo = json.data.account_lockup;
  return allStakingInfo;
}
```

query内の`where`には、引数で渡されている`address`を設定します。

コーディングが終わったら、`getStakingPropertyFromRopsten`を呼び出している部分を`getStakingPropertyFromMain`を呼び出すように変更してみましょう

```tsx
  // ① Onboardしているプロパティの一覧を取得する
  const properties = await getStakingPropertyFromMain(await getAccount());
  // const properties = await getStakingPropertyFromRopsten(await getAccount());
```

コーディングが終わったら実行してみましょう。もしあたながStakes.socialでステーキングをしていればプロパティ名が変わります。

確認が終わったら、`getStakingPropertyFromRopsten`を使うように戻しておきます

②：次にWithdrowボタンが押された時の処理をコーディングしていきます。スクロールして`clickWithdrowButton`関数をみつけます。`clickWithdrowButton`関数を以下のようにコーディングします。

```tsx
async function clickWithdrawButton() {
  const msg = document.getElementById("msg");
  msg.classList.remove("hide");

  const propertyAddress = this.dataset.propertyAddress;

  // Clientを作成する
  const provider = new Web3(window.ethereum);
  const client = contractFactory(provider.currentProvider);

  // ropstenネットワークのDevProtocolのアドレスを取得する
  const registryContract = client.registry(addresses.eth.ropsten.registry);

  // withdrawはlockupコントラクトに含まれているので、lockupコントラクトのアドレスを取得します
  const addressLockup = await registryContract.lockup();

  // 1DEV = 1000000000000000000に変換する
  const amountBigNumber = BigNumber.from("1");
  const amount = amountBigNumber.mul("1000000000000000000").toString();

  try {
    // withdraw(`プロパティのアドレス`, `引き出し額`)
    const result = await client
      .lockup(addressLockup)
      .withdraw(propertyAddress, amount);

    msg.classList.add("hide");

    return result
      ? alert("引き出しに成功しました")
      : alert("引き出しに失敗しました");
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
  // Clientを作成する
  const provider = new Web3(window.ethereum);
  const client = contractFactory(provider.currentProvider);

  // ropstenネットワークのDevProtocolのアドレスを取得する
  const registryContract = client.registry(addresses.eth.ropsten.registry);

  // withdrawはlockupコントラクトに含まれているので、lockupコントラクトのアドレスを取得します
  const addressLockup = await registryContract.lockup();
```

今回は１DEVを引き出すのですが、DEVの単位を合わせるために18桁に変更させます。
桁数の大きな数値をJSは扱えないので、ライブラリを使用しています

```tsx
  // 1DEV = 1000000000000000000に変換する
  const amountBigNumber = BigNumber.from("1");
  const amount = amountBigNumber.mul("1000000000000000000").toString();
```

`lockup`コントラクトのアドレスが取得できたらそのアドレスを`lockup`に渡し、`withdraw`関数を呼び出すことでステーキングの引き出しが行われます。

```tsx
  // withdraw(`プロパティのアドレス`, `引き出し額`)
  const result = await client
    .lockup(addressLockup)
    .withdraw(propertyAddress, "1");

  result ? alert("引き出しに成功しました") : alert("引き出しに失敗しました");
```

以上でコーディングは終了となります。動作確認をしてみましょう。
はじめにログインを行い、Withdrawボタンを押して「引き出しに成功しました」とメッセージが表示されたら完了です。

Etherscanで確認してみましょう。Etherscanとはイーサリアムのトランザクションを確認できるWebサイトで、今回ステーキングしたトランザクションも記録されています。lockupコントラクトのアドレスで検索してログを見てみましょう。
[https://ropsten.etherscan.io/address/0xf6ef27D18594228A851BfDF8e3139c4f90956E9A](https://ropsten.etherscan.io/address/0xf6ef27D18594228A851BfDF8e3139c4f90956E9A)