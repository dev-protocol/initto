---
title: Composability and Interface of Dev Protocol
author: Kenta Sato
date: 2021-11-26
socialImage: 'https://initto.devprotocol.xyz/images/posts/20211125/ogp--1.png' 
level: BEGINNER
tags:
- Smart Contracts
---

## Introduction

In this blog, I want to talk about composability that is one of the most powerful features of smart contracts. In addition, I will also introduce how you can interact with Dev Protocol by using programming languages. If you know good what composability is, you can skip the first part, and please go to About Dev Protocol. Now Let’s dive into composability!

# Composability

## Definition of Composability

You can not find the word composability in the dictionary. On the page of O'Reilly, there is the following definition 

Composability: This is the ability to interact with any other component, be re-combined to form new behaviors.

But what does exactly mean the composability of smart contracts? The next quote from [ethereum.org](https://ethereum.org/en/) gives us an answer.

Ethereum and its apps are transparent and open source. You can fork code and re-use functionality others have already built. If you don't want to learn a new language you can just interact with open-sourced code using JavaScript and other existing languages.

In other words, permissionless composability allows developers to use and combine deployed contracts to build their new applications or on top of them. This is the composability of smart contracts in Ethereum. This composability is known as building blocks or Money LEGOs in the case of DeFi. There are already so many applications that are built based on this composability. 

## Why is the composability of smart contracts so powerful?

It seems that not only smart contracts but also API(Application Programming Interface) have composability. So now we will think about why the composability of smart contracts is so powerful. There are the following two reasons for that.

1. Without permission

If you want to use an existing API, you need often permission from the API provider. Especially in the area of Web2, each company tries to create its ecosystem to enclose customers for profit and hinder interaction with competitors. It’s impossible to collaborate and share data with other ecosystems to create applications. This is the reason why composability is restricted in Web2. On the contrary, the composability of smart contracts allows everybody to access deployed contracts without permission.  

2. Token Standard

In the Ethereum community, people make proposals to improve Ethereum(Ethereum Improvement Proposals). Application-level standards and conventions are called “ERC(Ethereum Requests for Comment)”. For example, ERC20 is the Token standard for Fungible Tokens and ERC721 for No-Fungible Tokens. If Tokens are created by following this standard, they have the same features. These standards allow Tokens to be reused in other applications(Composability).

The Composability of smart contracts is so powerful because anyone can access open-source and integrate easily applications with deployed contracts that are standardized by ERC.   

# About Dev Protocol
 
As we can see, the deployed contracts have functionality like “LEGO blocks” on the Ethereum network based on Composability. Dev Protocol v1 is deployed on Ethereum Mainnet and Dev Protocol v2 on Arbtrum Mainnet(Arbitrum One), so everybody can access Dev Protocol permissionless. Furthermore, Dev Protocol creates DEV Token following ERC20 and S-Token following ERC721. That’s why you can combine seamlessly Dev Protocol into your application to build the original application like building blocks.
.  
# The Interface of Dev Protocol

There are two different ways to access Dev Protocol.  First, you can access directly Dev Protocol by using solidity. Please check [this site](https://docs.devprotocol.xyz/en/developers/tools/interfaces/) to see more detail with development using solidity.
Second, the Dev Protocol development team provides Dev Kit for you. Dev Kit uses web3 js to access Dev Protocol and people can work this tool kit with JavaScript or TypeScript. [About Dev Kit](https://docs.devprotocol.xyz/en/developers/tools/dev-kit/)

## Conclusion

In this blog, we talked about composability that characterizes smart contracts. The composability allows the developer to use deployed contracts as “blocks” and build their original applications. Please try to combine Dev Protocol into your application in your way. We can not wait to see your application with Dev Protocol. Thank you for reading. 

  
## References

Linda Xie, Composability is Innovation, <https://future.a16z.com/how-composability-unlocks-crypto-and-everything-else/>

Chainlink, DeFi’s Permissionless Composability is Supercharging Innovation,

<https://blog.chain.link/defis-permissionless-composability-is-supercharging-innovation/>

0xjim, The True Power of DeFi: Composability,
<https://medium.com/coinmonks/the-true-power-of-defi-composability-14fe8355e0d0>

O’Reilly, <https://www.oreilly.com/library/view/architecting-the-industrial/9781787282759/4fa35214-c104-4011-97f2-01c2f06b4840.xhtml>