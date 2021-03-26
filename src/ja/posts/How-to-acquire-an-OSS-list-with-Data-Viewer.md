---
title: Data Viewerを使ってOSS一覧を取得する方法
author: Kawakami
date: 2021-03-26
socialImage: 'https://initto.devprotocol.xyz/images/posts/How-to-acquire-an-OSS-list-with-Data-Viewer/ogp.png'
level: 初級
tags:
- Tutorial
- DataViewer
---
# Data Viewerを使ってOSS一覧を取得する方法

## 背景

Dev ProtocolにOSSが登録されたらTwitterにツイートする機能を作成しましたので、コードを用いて紹介しようと思います。

## 概要

Dev ProtocolのData Viewerを使用すると、Dev Protocolに登録されているOSSの一覧を取得することができます。これを利用して新規に登録されたOSSをフィルタリングして取得します。
プログラムからツイートするためには、Twitter APIを使用します。Twitter APIを使用するためには[Twitter Developer](https://developer.twitter.com/en)に登録が必要になります。下記のサイトを参考にさせていただきました。
[参考にさせてもらったサイト](https://qiita.com/newt0/items/66cb76b1c8016e9d0339)

プログラムは、実行すると値の取得からツイートするまでのフローを実行するようにします。これをサーバ等のcrontabで15分毎に実行されるように設定します

## プログラム環境について

node環境でプログラミング言語は、[javascript module](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)を使っていこうと思います。

## Data ViewerからOSS一覧を取得する

Data ViewerからDev Protocolに登録されているOSS一覧を取得することができます

> Data Viewerとは、DevProtocolのトークン情報を取得するためのGraphQLになります。

下記のエンドポイントとクエリでDev Protocolに登録されているOSSの一覧が取得できます

```text
// エンドポイント
https://api.devprtcl.com/v1/graphql

// クエリ
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

fetchを利用して情報を取得してみましょう

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

習得したデータは以下のようなJSON形式になっています

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

## Twitter APIを利用してツイートする

NodeからTweetするのに大変便利なライブラリがあるのでそれを利用します

```text
$ npm install twitter
```

詳しくはライブラリの[ドキュメント](https://github.com/desmondmorris/node-twitter) を見ると良いのですが、以下のように使います

```javascript
const client = new twitter({
        consumer_key        : "xxxx",
        consumer_secret     : "xxxx",
        access_token_key    : "xxxx",
        access_token_secret : "xxxx"
    });

// Tweetする
client.post('statuses/update', {status: text},
            (error, tweet, response) =>
                {
                    if (!error) {
                        console.log(tweets);
                    }
                });
```

customer_keyやaccess_token_keyなどは[Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)から取得します

![Twitter Developer](/images/posts/How-to-acquire-an-OSS-list-with-Data-Viewer/pic01.png)

## コーディング

上記を参考にコーディングしたものがこちらになります。
javascript moduleを使っているのでファイル名は、 `index.mjs` になります

```javascript
import path from "path"
import fs from 'fs'
import twitter from "twitter"

/**
 * nodeでfetchを使えるようにする
 */
import fetch from "node-fetch";

/**
 * javascript moduleは、__dirnameが使えないので似ているものを用意する
 */
const dirname = path.dirname(new URL(import.meta.url).pathname)

/**
 * Tokenなどは.envファイルに用意しておくことにする
 * .envファイルは、dotenvで読み込む
 */
import dotenv from 'dotenv'
dotenv.config({ path: dirname + '/.env'});

/**
 * 一度送信した情報を記録するためのファイル
 */
const sendListFilePath = dirname + '/data/tweet.json';

/**
 * mainの処理
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
            // 二重送信を防止する
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
 * ツイート文面の作成
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
 * Twitter Clientの作成
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
 * Twitter Clientを利用してツイートする
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
 * DataViewerから承認されたOSS一覧を取得する
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

// main関数の実行
main().then(() => {
    console.log('end');
});
```

プログラムは下記のように実行できます

```text
$ node index.mjs
```

こちらは実際にBOTからツイートされたものです

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Welcome vasa-develop/cross-asset-swap 🎉✨<br>Patrons can now support vasa-develop/cross-asset-swap by staking DEV on Stakes Social. <br>Click the link below to get started 👍<a href="[https://t.co/mwgRebCkdg](https://t.co/mwgRebCkdg)">[https://t.co/mwgRebCkdg](https://t.co/mwgRebCkdg)</a></p>— Dev Protocol (@devprtcl) <a href="[https://twitter.com/devprtcl/status/1374586243548205056?ref_src=twsrc^tfw](https://twitter.com/devprtcl/status/1374586243548205056?ref_src=twsrc%5Etfw)">March 24, 2021</a></blockquote> <script async src="[https://platform.twitter.com/widgets.js](https://platform.twitter.com/widgets.js)" charset="utf-8"></script>

## Crontabを設定して定期実行する

上記のプログラムをサーバなど実行環境にアップロードして、crontabを設定すると完成になります。

```text
*/15 * * * * /home/foo/.nvm/versions/node/v14.15.4/bin/node /home/foo/index.mjs
```

## まとめ

いかがでしたでしょうか、DataViewerを使うことでDev Protocolで所持してアセットの情報などを取得することができます。アセットの他にも、アカウント、マーケット、ポリシーなどの情報が取れます。また次回これらの情報を使った簡単なDappを紹介できたらと思います。