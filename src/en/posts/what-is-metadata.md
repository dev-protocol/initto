---
title: Metadata of sTokens
author: Kenta Sato
date: 2022-01-14
socialImage: 'https://initto.devprotocol.xyz/images/ogp.png' 
level: BEGINNER
tags:
- NFT
---

# Introduction

2021 was an eventful year for the Web3 scene since we witnessed the explosion of NFT's in mainstream media. NFT's stole the spotlight of news outlets with celebrities, companies, as well as auction houses (such as Sotheby's) leading the charge into adoption as they widely bought and sold items of this exciting new format. Some of the readers of this article already own NFTs and are well acquainted with them. Furthermore, there is an increasing number of people who are showing interest in NFTs and the benefits that this technology holds. Despite such a trend, some people are not yet familiar with what NFT metadata is. In this post, I’ll be explaining the fundamentals of metadata and the NFTs of Dev protocol.

# Metadata of NFT?

Since there are already so many references and websites telling you what NFTs are, we dive directly into the metadata of NFT. 

## What is metadata?

Metadata is defined as 

>data that provides information about other data. (quote from Merriam Webster)

In the case of NFT, EIP-721 explains that 

>The metadata extension is OPTIONAL for ERC-721 smart contracts. This allows your smart contract to be interrogated for its name and for details about the assets which your NFTs represent.

This explanation sounds a bit technical, so let’s have a look at another description.

>NFT metadata defines the NFT as an object, i.e., details about the digital asset. (quote from IPFS Blog)

In other words, metadata includes individual properties of each NFTs.

## How to get metadata?

First, you need to get HTTP or IPFS URL by giving tokenId of NFTs to tokenURL() in the case of ERC721 so as to retrieve metadata. (In case of ERC1155, you’ll use url()) If you access this  HTTP or IPFS URL, you can see metadata with JSON Schema like the below example.

The OpenSea page gives the following example of metadata.

```json
{
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
  "external_url": "https://openseacreatures.io/3", 
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
  "name": "Dave Starbelly",
  "attributes": [ ... ], 
}
```

## Usage of metadata?

Metadata contains the properties of each NFT. For instance, the property “image” gives us HTTP or IPFS URL and we can access images, videos, and music with these URLs. Marketplaces like OpenSea show us the properties of NFT based on this metadata. Now you’re starting to understand what metadata of NFT is.

# sTokens?

When it comes to NFT, you may come up with the idea of purchasing artworks, video clips, and music on the marketplace like OpenSea. If you’re well-acquainted with Dev Protocol, you may know the fact that you can mint NFT with it. From now on,  let’s dive into metadata of Dev Protocol NFT.

## How to get  NFT on Dev Protocol?

NFT of Dev Protocol is called sTokens. So what exactly is sTokens? The next quote tells us what sTokens is.

>sToken is an NFT given as a certificate of staking to patrons when they support (stake) creators.

sTokens are the tokens that are provided by staking. Please keep in mind this system.

## Feature of sTokens?

The new feature of sTokens is that creators can add illustrations or images to their minted NFT and you can potentially get a unique asset with staking.

Important points of Dev Protocol NFTs are:

①Users can receive sTokens, NFTs of Dev Protocol, as a certificate of staking.

②Creators can additionally put unique assets into NFT

Please check [this post](https://initto.devprotocol.xyz/en/s-token-update/) if you want to know the detail of sTokens.

## sTokens of metadata?

Maybe you already know what metadata of Dev Protocol NFT contains. There must be 2 pieces of information mentioned above in the metadata. 

In STokensManager.sol of Dev Protocol, you can find the tokenURL() function that we talked about.  This function returns Base64. If you try to decode this Base64 you can see metadata that is written with JSON schema. This metadata is composed of 3 properties: “name”, “description”, and “image”.

①“name” describes pieces of information about the Property Address that you staked and the amount of DEV that you  staked.

②In “image” image information that is encoded with Base64 is stored. Creators can also set IPFS URL of their own works.

As you see, the metadata of sTokens contains some properties like staking information and unique assets by creators that exactly represent Dev protocol.

# Conclusion

We went through the metadata of NFT this time. Please try to find metadata of your sTokens if you have already staked in Dev Protocol. If you are considering to stake, you can try to find your favorite art and stake your DEV on the creators. Thank you for reading until the end.


## References

https://eips.ethereum.org/EIPS/eip-721
 
Merriam Webster,
https://www.merriam-webster.com/dictionary/metadata
 
IPFS Blog, How to Store and Maintain NFT MetaData,
https://blog.ipfs.io/how-to-store-and-maintain-nft-metadata/
 
OpenSea, Metadata Standardds,
https://docs.opensea.io/docs/metadata-standards
 
Openzeppelin forum, How to provide metadata for ERC721,
https://forum.openzeppelin.com/t/how-to-provide-metadata-for-erc721/4057/3
 
Yusuke Ikeda, Launching NFT art function of sToken,
https://initto.devprotocol.xyz/en/s-token-update/
