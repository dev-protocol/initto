---
title: Discordマーケットがローンチされます
author: Yusuke Ikeda
date: 2022-02-25
socialImage: 'https://initto.devprotocol.xyz/images/ogp.png'
level: 初級 
tags:
  - ロードマップ
  - document
  - Khaos
---
今月末にDev protocolの新しいマーケットとして、Discordマーケットがローンチされます。
Githubマーケット、YouTubeマーケットについで３番目のマーケットとして、Discordマーケットが追加されることになりました。
DiscordマーケットはArbitrumとPolygonの２つのネットワークで展開されます。
Discordマーケットの追加により、Discordギルド（サーバー）を、ソーシャルトークン化することが可能です。

## なぜDiscordマーケットか？
多くのDAOがコミュニケーションツールとしてDiscordを採用しています。
そのためDiscordは、ソーシャルトークン化の需要が最も大きいプラットフォームであると我々は考えています。
2022年はクリエイターエコノミー、ソーシャルトークンの普及がより一層進んでいくことは間違いありません。
Discordマーケットをスタートさせることで、Dev protocolにより多くのクリエイターを集め、エコシステムを拡大することができます。
Discordマーケットは、今後Dev protocolをさらに成長させていくために、現時点で最も有効なマーケットであると考えています。

## マーケットを拡大していくことの意味
Dev protocolはOSSクリエイターを支援するためのプロトコルとして一般的に認知されていますが、Dev protocolの適用範囲はOSSだけにとどまりません。
先日のYouTubeマーケットのスタートは、OSS以外の領域でのクリエイターエコノミー拡大の最初の一歩でした。
YouTubeマーケットの開始によって、YouTubeチャンネルをソーシャルトークン化できるようになり、ソーシャルトークンを使ってYouTuberとファンが交流できるようになりました。

今回のアップデートでは、Discordマーケットが追加されますが、今後もTwitter, Instagramなど、様々なマーケットが追加されていく予定です。
クリエイターエコノミーの規模はDev protocolにとって重要です。
なぜならDev protocolを利用するクリエイターが増えるほど、DEVトークンの需要も増加し、DEVの価値も高まっていくからです。
Dev protocol上のクリエイターエコノミーとは、簡単に言えば、Dev protocolコミュニティの価値そのものです。
よって我々は今後もマーケットを拡大していき、Dev protocolのさらなる発展を目指します。
我々の最終的な目標は、あらゆるクリエイターがDev protocolを利用しているような世界です。

## マーケット拡大におけるKhaosオラクルの重要性
Dev protocolが開発している常用なプロジェクトの一つとして、Khaosがあります。
Khaos とは、ブロックチェーン上に存在しない情報をブロックチェーンの外部からブロックチェーンに持ち込む "オラクル(神託)" の機能を担っています。
Khaosを用いることで、Youtube, Discordなど、ブロックチェーン外部のありとあらゆるサービスを、イーサリアムネットワークと連携させることができます。

例えばAliceが自身のDiscordギルドのAliceギルドをソーシャルトークン化することを考えます。
Aliceはソーシャルトークンを発行するにあたって、まず自身がAliceギルドの所有者であることを証明する必要があります。
このような認証はブロックチェーン上ではなく、Discordサーバーとやり取りすることで行われます。
認証にあたってAliceはDiscordのパーソナルアクセストークン(PAT)をDiscordサーバーにポストして、本人確認を行います。

このようにソーシャルトークンの発行において、ブロックチェーン外部とのやり取りが必ず発生します。
Khaosを用いることで、このような外部サービスとのやり取りをスムーズに行うことができます。
また認証に使用するパーソナルアクセストークンのような秘匿情報も、自動的に暗号化してセキュアにオラクライズすることが可能になります。
Khaosは非常に柔軟性が高いライブラリのため、少しのカスタマイズで、YouTube, Discord, Twitterなどあらゆる外部サービスとの連携が可能になります。

もしKhaosを使い独自に新しいマーケットを開発したい場合、[khaos-starter-kit](https://github.com/dev-protocol/khaos-starter-kit)を使って、新しいマーケットを追加することができます
（事前にコミュニティ内で新しいマーケットを追加することについてのコンセンサスは必要です）。
今回のDiscordマーケットではこのスターターキットをもとに[khaos-discord-market](https://github.com/dev-protocol/khaos-discord-market)が開発されました。
マーケットの追加の際は、スターターキットのauthorize関数を個別のマーケット用にカスタマイズすることで、マーケット認証が行えるようになります。

メインモジュールの[Khaos](https://github.com/dev-protocol/khaos)のREADMEでKhaosのオラクル機能の概要が説明されています。
こちらの記事([Deep Dive Khaos](https://initto.devprotocol.xyz/ja/deep-dive-khaos/))では、Khaosについてより詳しい解説を読むことができます。開発に興味がある方は参考にしてください。

## 結論
今月末に新たなマーケットとして、Discordマーケットがリリースされます。
マーケットの拡大は、Dev protocolクリエイターエコノミーの拡大、DEVトークンの価値向上につながります。
Dev protocolは今後も積極的にOSS以外のマーケットを拡大していきます（おそらく次回はTwitter)。