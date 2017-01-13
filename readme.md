# phantomjs 及び casperjs のインストール
## nodejsのでのインストール
```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
$ source ~/.nvm/nvm.sh
$ nvm install node
$ npm install -g phantomjs casperjs forever
```

## バイナリーファイルのインストール
```sh
```

# 依存ソフトのインストール
```sh
$ sudo yum install freetype
$ sudo yum install fontconfig
```

# SSL認証書作成
```sh
cd ssl
# 秘密鍵の作成 (server.key)
openssl genrsa -aes128 -out server.key 2048
# Enter pass phrase for server.key: jobcan

# CSR（証明書の基になる情報）の作成　(server.csr)
openssl req -new -key server.key -sha256 -out server.csr

# 証明書（公開鍵）の作成 (server.crt)
openssl x509 -in server.csr -days 365 -req -signkey server.key -sha256 -out server.crt
```

## Plz change domain.json before use
