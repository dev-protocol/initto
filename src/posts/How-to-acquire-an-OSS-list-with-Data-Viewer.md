---
title: How to acquire an OSS list with Data Viewer
author: Kawakami
date: 2021-03-26
socialImage: 'https://initto.devprotocol.xyz/images/posts/How-to-acquire-an-OSS-list-with-Data-Viewer/ogp_en.png'
level: BEGINNER
tags:
- Tutorial
- DataViewer
---
# How to acquire an OSS list with Data Viewer

## Background

A function is newly created to tweet on Twitter when OSS is registered on Dev Protocol. We’ll show it to you with codes.

## Outline

If you use Data Viewer of Dev Protocol, you can obtain an OSS list registered at Dev Protocol. Making use of it enables you to get newly registered OSS by filtering.
In order to tweet via the program, you have to use Twitter API. You need a registration for [Twitter Developer](https://developer.twitter.com/en) to start using Twitter API. 

The program executes flows from the acquisition of value to tweet when it’s operated. You need to set it up so as to be executed every 15 minutes at crontab in the place like servers.

## Program environment

We’ll use [javascript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) for the programming language of node.

## Obtain an OSS list from Data Viewer

You can obtain a list of OSS registered at Dev Protocol from Data Viewer.

> Data Viewer is  GraphQL to acquire token information of Dev Protocol.

It’s possible for you to acquire an OSS list registered at Dev Protocol by the following end point and query.

```text
// end point
https://api.devprtcl.com/v1/graphql

// query
query Properties {
    property_authentication(limit: 3, order_by: {block_number: desc}) {
        authentication_id
        property
        property_meta {
            name
        }
    }
}
```

Let’s get the information by making use of fetch.

```javascript
const response = await fetch("https://api.devprtcl.com/v1/graphql", {
        method: "POST",
        headers: {
            "X-Requested-With": "xhr",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
query Properties {
    property_authentication(limit: 3, order_by: {block_number: desc}) {
        authentication_id
        property
        property_meta {
            name
        }
    }
}
            `,
        }),
    });

const json = await response.json();

const listsOSS = json.data.property_meta;
```

Obtained data is a JSON format as stated below.

```json
{
    "data": {
        "property_authentication": [
            {
                "authentication_id": "foo/bar",
                "property": "0x0123456789012345678901234567890123456789",
                "property_meta": {
                    "name": "foo"
                }
            },
            ...
        ]
    }
}
```

## Tweet with Twitter API

You can use quite a convenient library to tweet from Node.

```shell
$ npm install twitter
```

For its details, see the [document](https://github.com/desmondmorris/node-twitter) of the library, and the following is an example use of it.

```javascript
const client = new twitter({
        consumer_key        : "xxxx",
        consumer_secret     : "xxxx",
        access_token_key    : "xxxx",
        access_token_secret : "xxxx"
    });

// Tweet
client.post('statuses/update', {status: text},
            (error, tweet, response) =>
                {
                    if (!error) {
                        console.log(tweets);
                    }
                });
```

You can get customer_key, access_token_key etc from [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).

![Twitter Developer](/images/posts/How-to-acquire-an-OSS-list-with-Data-Viewer/pic01.png)

## Coding

The following example is coded by referring to the above explanation.
The file name of it is `index.mjs` since we’ve used javascript module.

```javascript
import path from "path"
import fs from 'fs'
import twitter from "twitter"

/**
 * Make fetch available at node
 */
import fetch from "node-fetch";

/**
 * Prepare a similar thing for javascript module, because _dirname can’t be used.
 */
const dirname = path.dirname(new URL(import.meta.url).pathname)

/**
 * Prepare such items as token at .env file.
 * Read .env file by dotenv.
 */
import dotenv from 'dotenv'
dotenv.config({ path: dirname + '/.env'});

/**
 * Files for recording information that is once sent.
 */
const sendListFilePath = dirname + '/data/tweet.json';

/**
 * Processing main
 */
async function main() {
    const client = getClientTwitter(
        process.env.consumer_key,
        process.env.consumer_secret,
        process.env.access_token_key,
        process.env.access_token_secret
    );

    const jsonObject = JSON.parse(fs.readFileSync(sendListFilePath, 'utf8'));

    try {
        for ( const info of await getAllAuthenticationProperties()) {
            // Prevent double transmission
            if (jsonObject[info.property] === 'send') {
                continue;
            }

            const tweet = getTweetArticle(info.property_meta.name, info.authentication_id, info.property);

            const postResult = await postTweet(client, tweet);

            jsonObject[info.property] = "send";
        }
    } catch (e) {
        console.error(e);
    }

    fs.writeFileSync(sendListFilePath, JSON.stringify(jsonObject));
}

/**
 * Create the contents of Tweet
 */
const getTweetArticle = (name, authentication_id, address) => {
    return `
Welcome ${name} 🎉✨
Patrons can now support ${authentication_id} by staking DEV on Stakes Social. 
Click the link below to get started 👍
https://stakes.social/${address}
    `
}

/**
 * Create Twitter Client
 */
const getClientTwitter = (customer_key, customer_secret, access_token_key, access_token_secret) => {
    return new twitter({
        consumer_key        : customer_key,
        consumer_secret     : customer_secret,
        access_token_key    : access_token_key,
        access_token_secret : access_token_secret
    });
}

/**
 * Tweet with Twitter Client
 */
const postTweet = (client, text) => {
    return new Promise((resolve, reject) => {
        client.post(
            'statuses/update',
            {
                status: text
            },
            (error, tweet, response) =>
            {
                if (!error) {
                    resolve(tweet);
                } else {
                    reject(error);
                }
            }
        );
    })
}

/**
 * Acquire an OSS list approved by Data Viewer
 */
export const getAllAuthenticationProperties = async () => {
    const response = await fetch(
        "https://api.devprtcl.com/v1/graphql",
        {
            method: "POST",
            headers: {
                "X-Requested-With": "xhr",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query Properties {
                    property_authentication(limit: 3, order_by: {block_number: desc}) {
                        authentication_id
                        property
                        property_meta {
                            name
                        }
                    }
                }
                `,
            }),
        }
    );

    const json = await response.json();

    return json.data.property_authentication;
};

// Execute main function
main().then(() => {
    console.log('end');
});
```

The program can be executed with this:

```shell
$ node index.mjs
```

This is actually tweeted from BOT

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Welcome vasa-develop/cross-asset-swap 🎉✨<br>Patrons can now support vasa-develop/cross-asset-swap by staking DEV on Stakes Social. <br>Click the link below to get started 👍<a href="[https://t.co/mwgRebCkdg](https://t.co/mwgRebCkdg)">[https://t.co/mwgRebCkdg](https://t.co/mwgRebCkdg)</a></p>— Dev Protocol (@devprtcl) <a href="[https://twitter.com/devprtcl/status/1374586243548205056?ref_src=twsrc^tfw](https://twitter.com/devprtcl/status/1374586243548205056?ref_src=twsrc%5Etfw)">March 24, 2021</a></blockquote> <script async src="[https://platform.twitter.com/widgets.js](https://platform.twitter.com/widgets.js)" charset="utf-8"></script>

## Setting up Crontab for regular execution

You can complete the whole process after you’ve uploaded the above program to execution environment like servers and set up crontab.

```shell
*/15 * * * * /home/foo/.nvm/versions/node/v14.15.4/bin/node /home/foo/index.mjs
```

## Conclusion

How was it? You can acquire asset information, which you possess at Dev Protocol, by utilizing Data Viewer. Other than assets, you can also get information such as account, market and policy. Next time, we’ll introduce easy Dapps that incorporate such information to you.
