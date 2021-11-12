---
title: Dev Protocol v1とv2の違い
author: Akira Taniguchi
date: 2021-11-12
socialImage: ''https://initto.devprotocol.xyz/images/posts/20211112/ogp--2.png''
level: 初級
tags:
- Solidity
---

# Dev Protocol V2をリリースしました
先日[Dev Protocol v2をリリースしました](https://twitter.com/devprtcl/status/1455687580326907906?s=20)。
v1は2020年の1月にリリースされました。リリース以降、主なところで言うと、
* 年利基準の改正
* Treasuryの設置
* ステーキング証明書(NFT)の発行
* ステーキング分散化の試作

など、下位互換を保ちながらさまざまな機能追加をしてきました。
そしてこの度、リリースされたv2はマルチチェーンをサポートする前提で実装されています。機能はそのままに技術的な負債を切りすて、下位互換を廃棄しました。
新しいモジュールとはいえ、しっかりテストもしています。[staks.social](https://stakes.social/)から利用可能です。[マニュアル](https://docs.devprotocol.xyz/en/stakes-social/)もあります。何かサポートが必要な場合は[公式Twitterアカウント](https://twitter.com/devprtcl)までご連絡いただければと思います。

# そもそも何が違うの？
v1とv2では大小さまざまな相違点があります。
仕様はソースに書かれていると考えている硬派な方は、続きを読む前にソースの差分を確認してみるのもいいかもしれません。
[v1 source](https://github.com/dev-protocol/protocol)
[v2 source](https://github.com/dev-protocol/protocol-v2)
それでは順番に説明していきます。

## ネットワーク
コードそのものではなく、運用の話で恐縮ですが、v1とv2の一番の違いはLayer2(今はArbitrum Oneのみ)で稼働しているところです。
近年、Ethereumのトランザクションの量が増え、Dappsをメインネットで稼働しようとすると、必ずガス代の高さが問題になっていました。
その問題を解決するため、そもそものロジックのスリム化も加えつつ、稼働フィールドを変え、利用しやすくしました。
当初はzkSyncでの展開を想定していましたが、zkSync自体の実装進捗があまり芳しくなく、Optimismはデプロイヤーのホワイトリスト制限がまだかかっていたため、Arbitrumが選択されました。
もちろん即日WithdrawができるzkRollupは今後の本命と考えているため、各Layer2の横展開も想定しています。

## Upgradable手法
スマートコントラクトはブロックチェーン上にプログラムがデプロイされるため、後から変更が出来ません。そのため、昨今はさまざまな手法が確立され、コントラクトが運用されています。
結論から言うと、v2は[proxyパターン](https://blog.openzeppelin.com/proxy-patterns/)を使って実装されています。
proxyパターンとは簡単に言うと、proxyコントラクトとlogicコントラクトを用意して、proxyコントラクトを経由してlogicコントラクトを[デリゲートコール](https://solidity-by-example.org/delegatecall/)することにより、ストレージのデータをproxyコントラクトに保持したまま、実際の振る舞いはlogicコントラクトに記載できると言う手法です。
[内部的な変数の順番を固定化する必要があり](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#modifying-your-contracts)、実装・運用するにあたって神経を使いますが、コントラクトを更新できると言うメリットは大きく、この手法でv2は実装されています。
proxyパターンはTransparentパターンというものとUUPSパターンというものがあります。(もっとあるかもしれませんが)
[双方メリットとデメリットがあります](https://docs.openzeppelin.com/contracts/4.x/api/proxy#transparent-vs-uups)が、場合によってはlogicコントラクトにロックがかかり、updateができなくなるというデメリットは大きいと判断し、Dev ProtocolはTransparentパターンを選択しました。
ちなみにですが、v1もupgradableな手法で設計されており、こちらは[EternalStorageパターン](https://fravoll.github.io/solidity-patterns/eternal_storage.html)を利用しています。
一見こちらでも良さそうですが、ロジックとは別のコントラクトに毎回データを書き込みにいくという複雑さもさることながら、何よりガス代の増加という形でユーザのウォレットに跳ね返ってくるため、v2では利用しなくなりました。

## Solidityバージョン
v1は0.5.17で記述されていますが、v2は0.8.9で記述されています。
0.8.9はv2リリース時点での最新Solidityバージョンです。HardHatでサポートされている最新バージョンが0.8.4(2021/11/8現在)なので、先走り過ぎですね。
Solidityは0.5系でだいぶまともになったと昔からSolidityに関わっている人が言ってたりしますが、一度0.8系でコントラクトを書くともう0.5系には戻れません。
Solidityは0.5と0.8の間で、インターフェースの仕様や関数の修飾子など、言語としてパワーアップしており、何より構造体や配列の扱いが非常に楽になっていて、シンプルに、かつ堅実に実装することができます。
v1もまだまだ現役で稼働を続けるのですが、まぁその辺りは頑張ってやっていくしかないですね。

## データのオンチェーン完結
例えばv1はDev Protocolに認証されたアセットのアドレスを知りたい場合、
1. アセット認証時、コントラクトがイベントを生成
2. 1をポーリング起動しているバッチが読み取り、DBに保存(オフチェーン)
3. stakes.socialからGraphQLを発行し、DBからデータを読み取る

という処理を行っていました。
ガス代を気にしてそういう設計にしていたのですが、構造が煩雑で、かつポーリングでチェックしていることからタイムラグもあり、今から思えばあまりいい仕組みではなかったかもしれません。
しかしながらv2は認証されたアセットのアドレスをコントラクトが保持しており、コントラクトの関数を実行することにより、ほぼリアルタイムで取得することができます。
このようにv2はガス代が安いLayer2の恩恵をフルに活用し、オフチェーンでの処理を極力(GitHubなどの認証における、トークンの処理やAPIの実行部分はオフチェーンですが、、、)避け、全てオンチェーンで完結するようにしています。

## まとめ
v2をリリースして終わりというわけではなく、ここからさらに新しい機能の実装や、新たな領域の開拓(YouTubeの収益化)なども進めていきます。
最新情報は下記で発信していきますので、よかったらフォローよろしくお願いいたします。

- [Discord](https://discord.gg/VwJp4KM)
- [Telegram](https://t.me/devprtcl)
- [Twitter](https://twitter.com/devprtcl)
