---
title: Difference between Dev Protocol v1 and v2
author: Akira Taniguchi
date: 2021-11-12
socialImage: 'https://initto.devprotocol.xyz/images/posts/20211112/ogp--1.png'
level: 初級
tags:
- Solidity
---

# Dev Protocol V2 Released
[Dev Protocol v2 was released](https://twitter.com/devprtcl/status/1455687580326907906?s=20) the other day. 
v1 was released in January 2020.
Various functions have been added since its release such as:

- Revision of APY standard
- Installation of Treasury
- Issuing the staking certificate (NFT)
- Prototype of decentralized staking

These major points of addition were completed by keeping the backward compatibility.
Recently released v2, however, is implemented under the premise that it supports multichain.
The functions still remain, while technical debts were cut out and backward compatibility was abolished.
Although it’s a new module, we’ve conducted a test. 
It is available at [stakes.social](https://stakes.social/).
[Manuals](https://docs.devprotocol.xyz/en/stakes-social/) are also available.
If you need any assistance, please contact our [official Twitter account](https://twitter.com/devprtcl).

# What’s the difference?
There are actually many major and minor differences.
If you are the one who love finding the specification in the source, you’d find it interesting to check the differences in it before reading next paragraphs.
[v1 source](https://github.com/dev-protocol/protocol)
[v2 source](https://github.com/dev-protocol/protocol-v2)
Now, let’s have a look at it.

## Network
Although it’s all about operation rather than code itself, this is an important topic. The biggest difference between v1 and v2 is that v2 is operated with Layer2 (currently run by only Arbitrum One). 
The number of transactions is increasing at Ethereum in recent years. However, if Dapps are to be operated in the main net, the costly gas fees became one of the major issues.
In order to solve the problem and to make it more accessible for users, we managed to change operation field as well as streamline the existing logic.
We thought of developing with zkSync at first, but Arbitrum was adopted because implementation progress of zkSync was slightly unfavorable. The fact that Optimism had a whitelist limitation of deployers was another reason for it.
Of course we think zkRollup, which would realize same-day withdraw, is perhaps favorable in the future, so we’re expecting to roll it out to each Layer 2.

## Upgradable method
Since the program of smart contract is deployed on blockchain, it can’t be changed afterwards.
As a result, many different types of methods have been established in recent years to operate contracts.
V2 is implemented by using [proxy patterns](https://blog.openzeppelin.com/proxy-patterns/).
A proxy contract and a logic contract are used for proxy patterns. Briefly speaking, proxy patterns are means that enable you to write the programming code on the logic contract, while the data in the storage is kept in the proxy contract at the same time, by [delegatecalling](https://solidity-by-example.org/delegatecall/) the logic contract through the proxy contract.
[There is a need to stabilize the inner order of variables](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#modifying-your-contracts), so you should be a bit sensitive to implement or operate the proxy patterns. However, considering the advantages of updating contracts, we implemented v2 with this method.
There are two types of proxy patterns: Transparent pattern and UUPS pattern (there might be more).
[Although both of them have advantages and disadvantages](https://docs.openzeppelin.com/contracts/4.x/api/proxy#transparent-vs-uups), we chose Transparent pattern, because in some cases logic contracts of UUPS are locked, and this would create a major inconvenience of hindering us from updating.
v1 is designed with upgradable methods as well, and we used [EternalStorage pattern](https://fravoll.github.io/solidity-patterns/eternal_storage.html) for it.
You might think EternalStorage pattern can also be used for v2, but we didn’t adopt it because of its complexity of writing the data to different contracts from its logic each time, and of affecting users’ wallets in terms of the rise of gas fees.

## Solidity version
v1 is described at 0.5.17 while v2 is described at 0.8.9.
0.8.9 is the latest Solidity version at the moment of v2 release. The newest version supported by HardHat is 0.8.4 (as of Nov. 8th, 2021), so it seems v2 is on the cutting edge.
Some developers, who had been familiar with Solidity for long, would say that it became quite normal in its 0.5 series, but they can’t go back to 0.5 series any more, once they start to write contracts in 0.8 series.
Through the updates from 0.5 to 0.8, Solidity has dramatically improved as a language in terms of such areas like specification of interface and modifiers of functions. In addition, handling of structure and array became so easy that we could implement simply and steadily.
Although v1 continues its operation actively, things are subject to change, as you may know.

## All the data is on chain
 If you want to know the asset address authenticated by Dev Protocol, the following 3 transactions were done for v1:
 
 1. events are generated by contracts at the time of asset authentication
 2. batch with polling start reads 1., and saves in DB (off chain)
 3. data is read from DB after issuing GraphQL from stakes.social
 
This design is created to take gas fees into consideration. However, in retrospect, it didn’t seem to be a good system due to its complex structure and time lag caused by the check in polling. 
Instead, in v2, contracts hold authenticated asset address, so we can obtain it in almost real time by executing contract functions.
v2 makes good use of Layer2 that reduces gas fees, and avoids as much off chain transaction as possible (note that token transaction and API execution part are off chain at the authentication in GitHub) to complete everything on chain.


## To be continued…
Release of v2 is not an end, but a start for implementing new functions and pioneering new areas such as (monetizing at YouTube).
Please join in or follow the following SNS to find out our latest news and information.

- [Discord](https://discord.gg/VwJp4KM)
- [Telegram](https://t.me/devprtcl)
- [Twitter](https://twitter.com/devprtcl)
