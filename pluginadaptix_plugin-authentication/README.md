# pluginadaptix_plugin-authentication

## 概要

kintoneプラグインのライセンス認証、契約確認、ドメイン判定、更新確認、配布管理を行うNode.js/TypeScriptモノレポです。

## 管理対象

- Express認証APIサーバー
- 認証用kintoneプラグインクライアント
- kintone REST APIクライアントと共通型
- OpenAPI、テーブル定義、ER図、画面・シーケンス設計

## 主な機能

- ライセンス認証・状態確認・解除
- 契約・ドメイン・プラグインバージョン判定
- プラグイン一覧・ダウンロードトークン管理
- 認証ログ管理

## ディレクトリ構成

```text
apps/api-server/       認証API
apps/kintone-plugin/   認証クライアント
packages/shared/       共通型・定数
packages/kintone-client/ kintone REST APIクライアント
docs/                  認証システム設計書
```

## 開発環境

- Node.js
- TypeScript
- Express
- pnpm workspace

## セットアップ方法

```bash
pnpm install
```

`.env.example` の変数名を参照し、実値を含む `.env` はコミットせず、必要な値は実行環境から渡してください。

## 実行方法

```bash
pnpm --filter @pluginadaptix/api-server build
node apps/api-server/dist/main.js
```

認証用kintoneプラグインのZIP生成は、関連リポジトリ `pluginadaptix_packages` のCLIを使用します。

## テスト方法

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 注意事項

- API仕様は `docs/openapi.yaml` を最優先とします。
- APIキー、ライセンス秘密鍵、認証トークンをソースやログへ記載しません。
- ライセンスキーはログへ平文出力しません。

## 関連リポジトリ

- `pluginadaptix_packages`
- `pluginadaptix_plugins`
