# Blog


## 環境設定
npm i
npm install webpack



### 
git pull
webpack --mode production
### dockerイメージ作成
sudo docker build . -t yasu/blog
### コンテナ作成
sudo docker run -d --name blog --net=mynet0 --ip=172.100.0.101 -p 3000:3000 yasu/blog

