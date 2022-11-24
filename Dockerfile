FROM node:16-alpine3.15
ENV NODE_ENV production

# アプリケーションディレクトリを作成する
WORKDIR /app

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY package*.json ./

RUN npm install

# アプリケーションのソースをバンドルする
COPY . .
COPY ./public ./public

EXPOSE 3000

CMD [ "node", "index.js" ]