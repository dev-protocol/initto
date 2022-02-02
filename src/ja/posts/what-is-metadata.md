---
title: sTokensのmetadata
author: Kenta Sato
date: 2022-01-14
socialImage: 'https://initto.devprotocol.xyz/images/ogp.png' 
level: 初級
tags:
- NFT
- 用語集
---

# はじめに

2021年、web3の領域においては多くの変化がありました。中でも大きな話題の一つにNFTがあります。著名人の購入、大企業の参入、老舗オークションハウスにおける販売など多くのNFTに関するニュースを目にしました。読者の中にも、実際に購入された方もいるのではないでしょうか。しかし、NFTのmetadataについてご存じの人はあまりいないと思います。今回のブログではNFTのmetadata、そしてDev ProtocolのNFTがもつmetadataについてみていきます。

# NFTのmetadata

NFTについては多くのところで説明されているので、ここで説明はしません。ここではNFTのmetadataについて詳しくみていきます。

## Metadataとは？

Metadataとは、

>data that provides information about other data.

他のデータについての情報を提供するデータ
(Merriam Websterから引用)

と定義されています。

ではNFTにおけるmetadataとはなんでしょうか？EIP-721では次のように説明されています。

>The metadata extension is OPTIONAL for ERC-721 smart contracts. This allows your smart contract to be interrogated for its name and for details about the assets which your NFTs represent.

metadataはERC721のオプションで、NFTが表す資産についての名前や詳細について........
この文章を訳すのは難しいので、他の引用を見てみます。

>NFT metadata defines the NFT as an object, i.e., details about the digital asset.

metadataはNFTをオブジェクト、すなわちデジタル資産についての詳細である。（IPFS Blogから引用）

まとめるとmetadataには個々のNFTの情報が入っているといえます。

## どうやってmetadataを取得するか？

metadataを取得するには、ERC721の場合まずtokenURI()に、NFTのtoken idを渡すことによってhttpまたはIPFS URLを取得します(ERC1155の場合はurl())。このhttp、IPFS URLにアクセスすると、JSON Schemaのmetadata見ることができます。

OpenSeaサイトでは次のようなmetadataの例が挙げられています。

```json
{
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
  "external_url": "https://openseacreatures.io/3",
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
  "name": "Dave Starbelly",
  "attributes": [ ... ],
}
```

## Metadataで何をするのか？

metadataは個々のNFTの情報です。例えば、”image”にあるhttpまたはIPFS URLにアクセスし画像、動画を取得することができます。OpenSeaなどのマーケットプレイスは、このmetadataを表示することで個々のNFTについての情報を公開しています。

これでNFTのmetadataがどのようなものか理解できたと思います。

# sTokens

NFTというとアート、動画、音楽などをOpenSeaに代表されるマーケットプレイスを通じて購入することをイメージすると思います。しかし、Dev Protocolについて詳しい方はご存じだと思いますが、Dev ProtocolもNFTを発行しています。ここからはDev ProtocolのNFTについてみていきます。

## どうやったらDev ProtocolのNFTがもらえるのか？

Dev Protocolが提供するNFTはsTokensといいます。sTokensとはどのようなものでしょうか？以下の引用が説明してくれます。

>sTokensとは（エストークン：Staking Tokenの略）、パトロンがクリエイターを支援したとき(スーテクしたとき)、パトロンにステーキングの証明書として与えられるNFTです。

Dev ProtocolのNFTは、ステーキングしたときにもらえるトークン。このステーキングされた時に発行される、ということを覚えておいてください

## Dev ProtocolのNFTの特徴とは？

新しいsTokensの特徴として、クリエイターがsTokensにイラスト、画像を紐づけられることがあります。


一度まとめてみます。

①Dev ProtocolのNFTであるsTokensはステーキングの証明としてもらえる。

②クリエイターはsTokensにイラストや画像を追加できる。

（簡単にsTokensについて説明しましたが詳しくは[ここ](https://initto.devprotocol.xyz/ja/s-token-update/)を見てください。）

## sTokensのmetadataとは？

もうお分かりですね、上記の二つの情報がsTokensのmetadataの中に入っているはずです。

それでは見ていきます。Dev ProtocolのSTokensManager.solの中に、先ほど説明したtokenURL()があります。Dev Protocolではこの関数がBASE64を返します。このBASE64をデコードするとjsonで表記されたmetadataになります。sTokensのmetadataではname, description, imageの３つの情報を保有しています。

①“name”の部分にはステーキングしたpropertyのアドレス、そしてステーキングしたDEVの数が記されています。

②"image"の部分にはデフォルトでbase64にエンコードされた画像情報が保存されています。この部分はクリエイターが自身の作品のIPFS URLをセットすることもできます。

このようにsTokensのmetadataにはステーキング、そしてクリエイターの表現したものという、Dev Protocolを象徴する情報が入っています。

# 最後に

今回はNFTのmetadataについて取り上げました。すでにステーキングをされた方は、自身のsTokensのmetadataを探してみてください。これからステーキングを考えている方は、クリエイターが提供するアート機能を参考にステーキング先を選ぶのも面白いかもしれません。最後まで読んでいただきありがとうごいました。

## 参考資料

[EIP 721](https://eips.ethereum.org/EIPS/eip-721)
 
[Merriam Webster](https://www.merriam-webster.com/dictionary/metadata)
 
[IPFS Blog, How to Store and Maintain NFT MetaData](https://blog.ipfs.io/how-to-store-and-maintain-nft-metadata/)
 
[OpenSea, Metadata Standardds](https://docs.opensea.io/docs/metadata-standards)
 
[Openzeppelin forum, How to provide metadata for ERC721](https://forum.openzeppelin.com/t/how-to-provide-metadata-for-erc721/4057/3)
 
[Yusuke Ikeda, Launching NFT art function of sToken](https://initto.devprotocol.xyz/ja/s-token-update/)