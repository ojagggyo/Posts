# Blog


## 環境設定
npm i
npm install webpack



### 
git pull
webpack
### イメージ作成
sudo docker build . -t yasu/blog
### コンテナ作成
sudo docker run -d --name blog -p 3000:3000 yasu/blog



### memo
docker build -t nodejs-docker .
docker run -p 3000:3000 nodejs-docker

sudo docker network disconnect mynet0 api
sudo docker stop -t 600 api
sudo docker rm api