FROM node:12

# アプリケーションディレクトリを作成する
WORKDIR /usr/src

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY package*.json ./
COPY index.js ./

RUN npm install

# アプリケーションのソースをバンドルする
COPY ./public /usr/src/public

EXPOSE 3333

CMD [ "node", "index.js" ]
#CMD [ "pwd" ]