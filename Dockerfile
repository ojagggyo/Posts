FROM node:12

# アプリケーションディレクトリを作成する
WORKDIR /usr/public

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY package*.json ./

RUN npm install

# アプリケーションのソースをバンドルする
COPY ./public /usr/public

EXPOSE 3333

CMD [ "node", "index.js" ]