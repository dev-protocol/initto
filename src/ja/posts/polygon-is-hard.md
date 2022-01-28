---
title: Polygonには簡単にデプロイできる。そんなふうに考えていた時期が私にもありました。
author: Akira Taniguchi
date: 2022-01-28
socialImage: 'https://initto.devprotocol.xyz/images/ogp.png'
level: 初級 
tags:
  - polygon
---
# Polygonに対応しました
すでに一昔前な感覚がありますが、[弊プロダクトがPolygonネットワークで利用できる](https://twitter.com/devprtcl/status/1480836156434837507?s=20)ようになりました。
手数料が肥大化し、一部のお金持ちしか利用できなくなりつつあるメインネットに比べ、安い価格でDappを利用できるPolygonはNFTなどで人気のあるネットワークとして利用されます。
今までと違って小口での利用も多く、現実的な実運用がされているなという印象を持っています。

# ここからは愚痴です
以前[Arbitrum版のリリース](https://twitter.com/devprtcl/status/1455687580326907906?s=20)をしており、[Truffleもそのまま利用可能](https://trufflesuite.com/boxes/polygon/index.html)であるため、少なくともコントラクトやデプロイスクリプトなどのバックエンドの修正は必要がない、これは簡単な仕事だと高を括っていました。
結論から言うと甘かったです。

# MumbaiのPolygonscanがまともに動かない
Truffleを使ってMumbai(Polygonのテストネット)にDev Protocolをデプロイし、verifyしたものの、なにやら挙動がおかしい状態になりました。
どうやらEtherscanと違って、view関数もwrite関数も画面から実行するとエラーになってしまうようでした。
mainnetのPolygonscanはまともに動作します。また、Truffleを使った、web3.jsを介しての挙動はmumbaiでも特に問題がなかったので、おそらくMumbaiのPolygonscan自体の問題だろうと思われます。
Arbiscanのテストネットでも同様でしたが、こちらはview関数はまともに実行できたので、それよりひどい状況でした。

# proxyのソースコードがverifyされない
Mumbaiにデプロイしたコントラクトのverifyをしようとした時のことです。
Truffleのverifyコマンドを実行した時、logicコントラクトは問題がなかったものの、proxyコントラクトにおいてソースコードが登録されませんでした。
コンソールには「success」と表示されているのだが全くsuccessしていない。
しょうがないので、手動でファイルを作成し、画面からverifyしました。
ちなみにmainnetでは問題なくtruffle verifyコマンドでverifyが可能でしたので、またもMumbaiのPolygonscanの問題なのかなと思っています。

# HardHatが動かない
Dev Protocol本体はTruffleをベースに実装されていますが、それ以外のサードパーティ的なコントラクトはHardHatをベースに構築されています。
なのでサードパーティコントラクトはHardHatを使ってデプロイしているのですが、これが全く動作しない。
どうやらハードフォーク以降、[hardhatとMumbai Polygonの間で問題が発生](https://github.com/nomiclabs/hardhat/issues/2162)しているようです。
hardhat-deployと言うプラグインを入れ、Mumbai Polygon専用の独自スクリプトを実装する必要があるらしいです。
mainnet Polygonでは問題ないらしいので、もうMy Eth Walletからバイトコードを使ってデプロイしました。

# 結局のところ
要はMumbaiがまともに動きません。測らずともtest in prodを実行してしまったと言うのが今回の趣旨です。
<font color="Red">Arbitrumでの稼働実績やPolygon mainnetは正常に稼働していること、Dev Protocol自体は350を超える単体テストで常に不具合をチェックしていることなどから、利用することに関しては問題はありません。</font>
(まぁバグのないシステムなんてこの世にはありませんが)
お後がよろしいようで

# おまけ
弊社の協力者である[Shubham Kukreti](https://twitter.com/ShubhamKukretii)の[ナイスプレー](https://github.com/maticnetwork/matic-docs/pull/744#pullrequestreview-855930236)により[Polygonのドキュメントのブリッジ情報](https://docs.polygon.technology/docs/develop/network-details/mapped-tokens/)に弊トークンが記載されました。
すごい。

終わり。