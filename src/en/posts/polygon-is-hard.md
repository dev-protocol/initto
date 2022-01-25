---
title: I thought it easy to deploy Polygon, but…
author: Akira Taniguchi
date: 2022-01-28
socialImage: 'https://initto.devprotocol.xyz/images/ogp.png'
level: BEGINNER 
tags:
  - polygon
---
# Releasing Polygon
It’s a belated announcement, but [Polygon network has finally become available for Dev Protocol](https://twitter.com/devprtcl/status/1480836156434837507?s=20). Compared with the Ethereum mainnet where fees became more expensive, which resulted in the service only for the rich, Polygon is widely used as a popular network for NFTs that is compatible with Dapps at a low price.
Unlike before, Polygon is increasingly deployed by small-scale users as well, and we’re impressed by its reality-based operation.

# However, we also had a little trouble…
Since we released [the Arbitrum version](https://twitter.com/devprtcl/status/1455687580326907906?s=20) and [Truffle remains available](https://trufflesuite.com/boxes/polygon/index.html), we expected a quick and easy deploying process at the most and there would be no need to modify the back-ends like contracts and deploy scripts.
Unfortunately, the expectation was an illusion.

# Polygonscan of Mumbai didn’t seem to work properly
Although we tried deploying and verifying Mumbai (a test net of Polygon) into Dev Protocol by Truffle, there was something strange about its behavior.
Unlike Etherscan, an error seems to occur when we operate view function as well as write function from the screen, while Polygonscan on mainnet operates normally. The behavior via web3.js by Truffle was not problematic at all, so what didn’t work properly seemed to be Polygonscan of Mumbai itself.
Despite the fact that the test net of Arbiscan was in the same situation, the view function in it worked well. The situation of the Polygonscan looked worse than that of Arbiscan.

# The source code of proxy was not verified
It happened when we were about to verify the contracts deployed to Mumbai.
When the verify command in Truffle was activated, the source code was not registered at the proxy contracts, although there was no problem in logic contracts.
The console displayed “success”, but it didn’t succeed at all.
It couldn’t be helped, so we manually created a file, and verified it from screen.
Since we didn’t have any trouble in verifying by the verify command of Truffle at the mainnet, we thought the problem was in Polygonscan of Mumbai itself again.

# HardHat didn’t work
Dev Protocol itself was implemented based on Truffle, but the other third party contracts were built on the basis of HardHat.
That’s why we deployed third party contracts by HardHat, however, HardHat didn’t work at all.
There seemed to be [a problem occurred between HardHat and Mumbai polygon](https://github.com/nomiclabs/hardhat/issues/2162) after hard-fork.
It’s said that we need to implement original script exclusively for Mumbai Polygon after installing a plug-in called hardhat-deploy.
We ended up deploying by using byte-code from My Eth Wallet, as there was no problem in mainnet Polygon.

# The point is…
Mumbai didn’t work properly. What we’d like to express for the post this time is that we didn’t expect to operate test in prod, but in fact, we did.
<font color="Red">Considering 1) operational perfomance in Arbiturum, 2) the fact that Polygon mainnet normally operates, and 3) the fact that Dev Protocol itself always checks bugs with more than 350 unit tests, there should be no problem in its use.</font>
(Of course, there is no system without bugs in this world.)
Thank you for reading this article until the end.


# Special thanks
Thanks to [the great work](https://github.com/maticnetwork/matic-docs/pull/744#pullrequestreview-855930236) of [Shubham Kukreti](https://twitter.com/ShubhamKukretii), a cooperator of Dev Protocol, Dev tokens were added to [the bridge information of documents in Polygon](https://docs.polygon.technology/docs/develop/network-details/mapped-tokens/).
Awesome!
