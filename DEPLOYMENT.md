# FPS Aim Diary - Cloudflare デプロイガイド

## 前提条件

1. Cloudflareアカウントを持っていること
2. Node.js (v18以上) がインストールされていること
3. wranglerがインストールされていること

## セットアップ手順

### 1. Wranglerのインストールと認証

```bash
# wranglerをグローバルインストール（まだの場合）
npm install -g wrangler

# Cloudflareにログイン
wrangler auth login
```

### 2. D1データベースの作成

```bash
# D1データベースを作成
wrangler d1 create fps-aim-diary-db

# 出力されたdatabase_idをwrangler.tomlに設定
# database_id = "your-database-id-here"
```

### 3. データベースの初期化

```bash
# スキーマを適用
wrangler d1 execute fps-aim-diary-db --file=./migrations/0001_initial.sql
```

### 4. 依存関係のインストール

```bash
npm install
```

### 5. ビルドテスト

```bash
npm run build
```

### 6. Cloudflare Pagesプロジェクト作成

```bash
# Pages プロジェクトを作成
wrangler pages project create fps-aim-diary

# または、Cloudflare Dashboardから作成する場合:
# 1. Cloudflare Dashboard > Pages
# 2. "Create a project" > "Upload assets"
# 3. プロジェクト名: fps-aim-diary
```

### 7. デプロイ

```bash
# プロダクションデプロイ
npm run deploy

# または手動でデプロイ
wrangler pages deploy out --project-name fps-aim-diary
```

## 環境変数の設定

Cloudflare Dashboardで以下の環境変数を設定:

- `NODE_ENV`: `production`

## D1データベースのバインディング

Cloudflare Pages設定で:
1. Settings > Functions
2. D1 database bindings
3. Variable name: `DB`
4. D1 database: `fps-aim-diary-db`

## カスタムドメインの設定（任意）

1. Cloudflare Dashboard > Pages > fps-aim-diary
2. Custom domains タブ
3. "Set up a custom domain"

## デバッグ

ローカルでCloudflare Pages環境をテスト:

```bash
npm run preview
```

## トラブルシューティング

### ビルドエラー
- `npm run build`でローカルビルドが成功することを確認
- TypeScriptエラーがないことを確認

### データベース接続エラー
- D1データベースが正しく作成されているか確認
- wrangler.tomlのdatabase_idが正しいか確認
- バインディング設定が正しいか確認

### 404エラー
- _redirectsファイルが正しく配置されているか確認
- 静的エクスポートが正しく動作しているか確認