FROM node:16-alpine3.15
#ENV NODE_ENV production

# アプリケーションディレクトリを作成する
WORKDIR /app

# アプリケーションの依存関係をインストールする
COPY package*.json ./
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
