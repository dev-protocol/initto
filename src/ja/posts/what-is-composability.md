---
title: Composability と Dev Protocolの提供するインターフェース
author: Kenta Sato
date: 2021-11-26
socialImage: 'https://initto.devprotocol.xyz/images/posts/20211125/ogp--2.png' 
level: 初級
tags:
- Smart Contracts
---

## はじめに

このブログではスマートコントラクト最大の特徴の一つとも言えるコンポーサビリティ、そしてDev Protocolが提供するインターフェースについて書いていきます。最初に、なぜスマートコントラクトにおいてBuilding blocks、あるいはDefiにおいてMoney LEGOsという言葉が使われるのかについて、コンポーサビリティの定義を考えながら書いていきます。そして最後にDev Protocolが提供するインターフェースについて紹介します。コンポーサビリティについて詳しい方は、Dev Protocolについてから読み進めて下さい。


# コンポーサビリティ

## コンポーサビリティの定義

英語の辞書で探してもComposabilityという単語は出てきません。O’Reillyのページに記載されている定義では

Composability: This is the ability to interact with any other component, be re-combined to form new behaviors.

と書かれています。この定義から、他のコンポーネントと関わりあうこと、また新しい何かを生み出すために取り込まれることを意味することが分かります。では、スマートコントラクトにおいてコンポサービリティは何を表しているのでしょうか？

以下の引用が、その答えを教えてくれます。

Ethereum and its apps are transparent and open source. You can fork code and re-use functionality others have already built. If you don't want to learn a new language you can just interact with open-sourced code using JavaScript and other existing languages.

[ethereum.org](https://ethereum.org/en/) から引用

訳に挑戦してみます。

イーサリアムとそのアプリケーションはオープンソースです。誰でも他の開発者が書いたコードをフォークしたり、再利用することができます。またJavaScriptや他のプログラミング言語を使って、これらのオープンソースにアクセスすることが可能です。

といったところでしょうか。

このように開発者は、すでにデプロイされているコントラクトを、許可なく自分のアプリケーションに組み入れたり、デプロイされているコントラクトを組み合わせることによって新しいアプリケーションを創り出すことができる。これがイーサリアムのスマートコントラクトにおけるコンポーサビリティです。スマートコントラクトにおけるbuilding blocks、DefiにおいてMoney LEGOsという言葉は、このコンポーサビリティに基づいて成り立っています。実際に多くのDappsがこのコンポーサビリティを利用して作られています。


## なぜスマートコントラクトのコンポーサビリティは優れているのか？

ここまで聞いていると、コンポーサビリティは既存のAPI(Application Programming Interface)でも実現されていると感じます。ここからは、なぜスマートコントラクトのコンポーサビリティが優れているかについて考えていきます。それには以下の二つの理由が挙げられます。

1. パーミッションレスであること

既存のAPIを自分のアプリケーションで使う場合、多くのAPIでは提供元と契約する、または許可を必要とします。さらにWeb2の世界では、どの企業も利益を最大化することを目指し、顧客を囲い込んだ独自経済圏を確立します。そのため他社のサービスを自社のアプリケーションに組み込むことや、自社のサービスが他社の経済圏で使われることを許可しません。これがWeb2において、コンポーサビリティが制限されている理由です。これに対してスマートコントラクトのコンポーサビリティでは、誰もがパーミッションレスでデプロイされているコントラクトを使用することができます。

2. 標準規格

イーサリアムのコミュニティーでは、イーサリアムをより良いものにするために様々な提案が行われています(Ethereum Improvement Proposals)。この中でも特にアプリケーションに関する標準規格はERC(Ethereum Requests for Comment)と呼ばれています。例えば、ERC20はFungible Tokens、ERC721はNo-Fungible Tokensの仕様です。ERC20やERC721規格によって発行されたトークンはそれぞれ同じ特徴を持っています。このトークンの標準規格は、異なるアプリケーション間におけるやり取りを容易にします（コンポーサビリティを提供する）。

イーサリアムにおけるコンポーサビリティが優れているのは、誰でもオープンソースのコードにアクセス可能であること、さらに標準規格によりそれぞれのコンポーネントを簡単に再利用することができる点であるといえます。

# Dev Protocolについて

ここまで見たようにイーサリアム上にデプロイされたコントラクトは、“LEGOのブロック”のように機能する事がおわかりいただけたと思います。Dev Protocolのv1はイーサリアムメインネット、v2はLayer2のArbitrumメインネット(Arbitrum One)上にデプロイされていて、パーミッションレスでアクセスが可能です。また、Dev Protocolで使われているDEVトークンはERC20、S-TokenはERC721を準拠しています。このことからDev ProtocolをLEGOのブロックのように利用して、あなたのオリジナルDappsを作ることができます。


# Dev Protocolが提供するインターフェースについて

Dev Protocolにアクセスする方法は２つあります。一つ目はSolidityを使いDev Protocolのスマートコントラクトに直接アクセスする方法。これについては[Interfaces](https://docs.devprotocol.xyz/en/developers/tools/interfaces/)を参考にしてください。二つ目は、Dev Protocol開発チームが提供するDev Kitを使う方法です。Dev Kitはweb3 jsを通じてDev Protocolにアクセスしていて、JavaScript, TypeScriptで使用することが可能です。
Dev Kitについては、[ここ](https://docs.devprotocol.xyz/en/developers/tools/dev-kit/)に詳しく書かれています。


## 最後に

今回のブログではスマートコントラクトの特徴の一つであるコンポーサビリティについて触れてきました。スマートコントラクトのコンポーサビリティを使い、開発者はすでにデプロイされているコントラクトを“ブロック”として取り入れ、オリジナルの機能をもったアプリケーションをつくることができます。あなたもDev Protocolを組み込んだアプリケーションを作ってみてください。最後まで読んでいただきありがとうございました。


## 参考資料

https://eips.ethereum.org/EIPS/eip-1

Linda Xie, Composability is Innovation, <https://future.a16z.com/how-composability-unlocks-crypto-and-everything-else/>

Chainlink, DeFi’s Permissionless Composability is Supercharging Innovation,

<https://blog.chain.link/defis-permissionless-composability-is-supercharging-innovation/>

0xjim, The True Power of DeFi: Composability,
<https://medium.com/coinmonks/the-true-power-of-defi-composability-14fe8355e0d0>

O’Reilly, <https://www.oreilly.com/library/view/architecting-the-industrial/9781787282759/4fa35214-c104-4011-97f2-01c2f06b4840.xhtml>