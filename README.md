特定のDiscordチャンネルのコメントを3分で削除するbot(滅びの呪文付き)

## Demo
![demo](https://github.com/sharky-hoodies/discord-bot-laputa/assets/24955202/a50e807a-d0ac-46cb-b68b-1327bfd61b1b)

## SetUp
1. [DiscordDeveloperPortal](https://discord.com/developers/applications)でbotを準備(権限はadmin)
2. 「.env」を設定
- DISCORD_BOT_TOKENにDiscord Botのトークンを入力
- DISCORD_TARGET_CHANNLE_IDに対象のチャンネルIDを入力
- DISCORD_DELETE_TIME_SECONDSに削除間隔を入力(秒)

## Deploy -> CloudRun
### 1. 環境変数定義
```shell
GCP_PROJECT_ID="{GCPプロジェクトのID}"
IMAGE_REPO_REGION="{リポジトリのリージョン名}"
IMAGE_REPO_HOST="${IMAGE_REPO_REGION}-docker.pkg.dev"
IMAGE_REPO_NAME="{リポジトリ名}"
IMAGE_NAME="リポジトリのイメージ名"
IMAGE_URL="${IMAGE_REPO_HOST}/${GCP_PROJECT_ID}/${IMAGE_REPO_NAME}/${IMAGE_NAME}:latest"
SERVICE_NAME="{CloudRunのサービス名}"
SERVICE_REGION="CloudRunのリージョン名"
```

### 2. gcloud 認証
```shell
gcloud auth login
```

### 3. レジストリへのPush
```shell
gcloud artifacts repositories create ${IMAGE_REPO_NAME} \
    --location=${IMAGE_REPO_REGION} \
    --repository-format=docker
```

### 4. Dockerの認証ヘルパーにgcloudを登録
```shell
gcloud auth configure-docker ${IMAGE_REPO_HOST}
```

### 5-a. ローカルでBuild
```shell
docker build --no-cache . -t ${IMAGE_URL}
```

### 6-a. ローカルからイメージを Artifact Registry へpush
```shell
docker push ${IMAGE_URL}
```

### 7-a. Cloud Run へデプロイ
```shell
gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URL} \
    --region=${SERVICE_REGION} \
    --min-instances=0 \
    --max-instances=4 \
    --ingress=all \
    --allow-unauthenticated \
    --cpu=1 \
    --port=8080 \
    --set-env-vars=NAME='Cloud Run'
```

## 個人的なmemo(2023/04月頃のお話)
おそらくMacのM1/M2チップだと、 ローカルのDockerからCodeBuildをしなければならない。。みたいです。
https://cloud.google.com/run/docs/troubleshooting
```
コンテナ ランタイムの契約に従って、コンテナ イメージを 64 ビット Linux 用にコンパイルされていることを確認します。
注: ARM ベースのマシンでコンテナ イメージを作成した場合、Cloud Run で意図したとおりに動作しないことがあります。この問題を解決するには、Cloud Build を使用してイメージをビルドします。
```
なのでARMチップ使ってる場合は、GCP(CodeBuild)でビルドをする必要がある。。みたいです。
以下、b手順になります。

### 5-a. CodeBuildを利用してビルド
```shell
gcloud builds submit --tag ${IMAGE_URL}
```

### 6-a. Cloud Runにデプロイ
```shell
gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URL} \
    --region=${SERVICE_REGION} \
    --min-instances=0 \
    --max-instances=1 \
    --ingress=all \
    --allow-unauthenticated \
    --cpu=1 \
    --port=8080 \
    --set-env-vars=NAME='Cloud Run'
```

## 素材に関して
当botで利用している画像は、[ジブリ公式HP](https://www.ghibli.jp/info/013409/)より提供されているものを常識の範囲内で利用しております。
