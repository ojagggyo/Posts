# Posts


## 環境設定（初めて）
npm i
npm install webpack



### 
git pull && webpack --mode production

### dockerイメージ作成
sudo docker build . -t ojagggyo/posts

### コンテナ作成
sudo docker run -d --name posts --net=mynet0 --ip=172.100.0.101 -p 3000:3000 ojagggyo/posts

