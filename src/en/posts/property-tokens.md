---
title: What are property tokens? How can we make use of them?
author: Yusuke Ikeda
date: 2021-12-09
socialImage: 
level: BEGINNER
tags:
  - document
---

In this article, I’d like to introduce property tokens, one of the major innovations of Dev Protocol, and their potential application.


# What are Property tokens?

Property tokens are used for receiving staking reward by OSS creators. The total amount to supply property tokens is fixed, and creators receive their staking reward in proportion to the property tokens that they hold.

Let’s say that Alice, a creator, registered her project as Property A at DEV Protocol. When Property A is registered, certain amount of Property A tokens is issued (As an easy-to-follow example here, let’s say 1 million tokens is issued). Alice receives 95% of the issued tokens, and the rest of 5% is sent to Treasury, a fund of DEV Protocol.

Now, here’s a staking user who will stake 10,000 DEV to Property A. If we suppose that APY is about 50%, the reward that the user would receive a year later will be 5,000 DEV (10,000 DEV X 50% = 5,000 DEV). When a user stakes the project, holders of Property A tokens also receive almost the same amount of reward as users’ staking reward. Creators receive their reward in accordance with the ratio of Peoperty A tokens they hold. In this example, since Alice holds 95% of Property A tokens, the amount that Alice receives would be approximately 4,750 DEV (5,000 DEV X 95% = 4,750 DEV), and the rest of 5%, which is a reward of 250 DEV, is generated as reward for Treasury. It is also possible for Alice to transfer the half amount of property tokens to Bob, who is her co-developer. In this case, the reward of 4,750 DEV will be devided into half for Alice and Bob.

The following points are the functions of property tokens that we’ve looked at so far:


- Staking rewards generated for creators is also paid for property token holders.
- Staking rewards are allocated according to the proportion of tokens the holders have against the total supply of property tokens.
- Treasury, a fund of Dev protocol, holds 5% of the total supply of property tokens.


# Application example : Circulation of property tokens

Currently, property tokens are owned by only creators and Treasury, while general users have no way to obtain them. As an application example this time, let’s imagine the situation where general users can obtain property tokens by circulating them in the market. As we saw in the previous section, Treasury holds 5% of the total amount of property tokens. Let’s think about the liquidity provision of property tokens possessed by Treasury through Uniswap. If Treasury provides liquidity, general users will have an opportunity to get property tokens through AMM. Liquidity provision of property tokens by Treasury like this will bring about the following advantages:


- Treasury can get the reward from the liquidity provision of property tokens.
- Investors can buy property tokens and get staking reward generated.
- Index tokens of multiple properties can be composed by using property tokens in circulation.

From the perspective of investors who buy property tokens, they can profit more by buying the tokens of an attractive project that would collect more staking, as compared to the normal staking by DEV. However this approach tends to be riskier than just buying dev itself because it can be hard to tell which projects to choose. As we saw in the previous section, reward originated from property tokens is proportional to the total amount of staking that was staked to the property (creators’ projects). Investors, therefore, will start investing attractive projects that would collect much more staking to aim for the higher staking reward.

Some enthuiastic investors would consider the growth potential of each property, and invest in a property that has higher possibility of a return. On the other hand, some general users would desire to just get average profit without thinking too much about investment strategy for each property. In order to meet such needs, we can issue tokens as an index fund composed by multiple properties. [DeFi Pulse Index](https://www.tokensets.com/portfolio/dpi) has already succeeded in creating such token index. If property tokens are circulated in a DEX, it would be possible to create property token Index, just like the DeFi Pulse Index. When we are indexing property tokens, we would rank each property in accordance with its staking amount, and compose an index by collecting the top 20 properties. With the index like this, we can evaluate the growth of a creator economy in Dev Protocol by a single index.


# Conclusion

Circulation of property tokens will make it easier for users to access DEV Protocol’s economy. It will also give various methods to users for investing in DEV Protocol’s economy. There are many unknown effects that the application of property tokens would have on creator economy, so we’re hoping to have lively discussion about it in the community.
