# AGENTS.md

# kintoneプラグイン認証システム

---

# 1. プロジェクト概要

本リポジトリは、

「kintoneプラグイン認証システム」

の開発を行うためのリポジトリです。

本システムは以下の機能を提供します。

* kintoneプラグインライセンス認証
* ライセンス状態確認
* kintoneドメイン管理
* プラグイン更新確認
* プラグイン配布管理
* WordPress会員サイト連携
* kintoneによる管理DB
* 認証ログ管理

---

# 2. 技術スタック

以下の技術を使用します。

## バックエンド

* Node.js
* TypeScript
* Express

## フロントエンド

* kintone Plugin
* JavaScript
* TypeScript

## CMS

* WordPress
* PHP

## データ管理

* kintone REST API

## CI/CD

* GitHub Actions

## パッケージ管理

* pnpm workspace

---

# 3. リポジトリ構成

```text
apps/
├── api-server
├── kintone-plugin
└── wordpress-integration

packages/
├── shared
└── kintone-client

docs/

kintone/

infra/

scripts/
```

---

# 4. 必ず参照する設計書

実装前に以下を確認すること。

```text
docs/01_basic_design.md
docs/02_screen_design.md
docs/03_api_design.md
docs/04_kintone_app_definition.md
docs/05_table_definition.md
docs/er-diagram.md
docs/sequence-diagrams.md
docs/openapi.yaml
```

設計書間で矛盾がある場合は以下を優先する。

```text
1. openapi.yaml
2. テーブル定義書
3. ER図
4. API詳細設計書
5. ソースコード
```

---

# 5. 実装ルール

## 基本方針

* 小さな変更単位で実装する
* Issue単位でPull Requestを作成する
* 不要なリファクタリングを行わない
* 可読性を優先する
* 必ずテストを追加する

---

## TypeScriptルール

### 禁止

```ts
any
```

### 必須

* strictモード
* export関数は戻り値型を定義
* 共通型は shared に配置

---

## API実装ルール

API仕様は

```text
docs/openapi.yaml
```

に従うこと。

レスポンス形式は必ず以下を利用する。

```ts
{
  success: boolean;
  code: string;
  message: string;
  data?: unknown;
}
```

---

### Controller

担当

* Request受取
* Validation
* Response返却

禁止

* 業務ロジック

---

### Service

担当

* 業務ロジック
* 認証処理
* 契約判定
* ライセンス判定

---

### Repository

担当

* kintoneアクセス
* データ取得
* データ更新

禁止

* 業務ロジック

---

# 6. kintone実装ルール

kintoneレコード番号を業務キーとして使用しない。

必ず以下を使用する。

```text
customer_id
contract_id
license_id
plugin_id
version_id
domain_id
log_id
```

---

## フィールドコード

フィールドコードは

```text
docs/05_table_definition.md
```

を参照すること。

勝手に変更しない。

---

## App ID

App IDは環境変数から取得する。

例

```env
KINTONE_APP_CUSTOMERS=100
KINTONE_APP_CONTRACTS=101
KINTONE_APP_LICENSES=102
```

---

# 7. セキュリティルール

## 禁止事項

ソースコードへ以下を記載しない。

```text
APIキー
APIトークン
ライセンス秘密鍵
WordPress APIキー
認証トークン
Cookie
```

---

## 必須

環境変数を利用する。

例

```env
API_KEY=
LICENSE_KEY_SECRET=
DOWNLOAD_TOKEN_SECRET=
```

---

## ライセンスキー

ログへ平文出力しない。

NG

```text
LIC-XXXX-XXXX-XXXX
```

OK

```text
LIC-****-****-1234
```

---

# 8. 実装対象API

実装対象は以下。

```text
GET  /v1/health

POST /v1/licenses/authenticate

GET  /v1/licenses/status

POST /v1/licenses/deactivate

GET  /v1/plugins/version

GET  /v1/plugins

POST /v1/plugins/download-token

GET  /v1/contracts/status

POST /v1/auth-logs
```

---

# 9. エラーコード

必ず共通定数を使用する。

```text
OK

INVALID_REQUEST

INVALID_API_KEY

LICENSE_NOT_FOUND

INVALID_LICENSE_KEY

LICENSE_EXPIRED

LICENSE_SUSPENDED

DOMAIN_MISMATCH

DOMAIN_LIMIT_EXCEEDED

PLUGIN_NOT_FOUND

PLUGIN_MISMATCH

PLUGIN_NOT_ALLOWED

CONTRACT_NOT_FOUND

CONTRACT_EXPIRED

RATE_LIMIT_EXCEEDED

INTERNAL_SERVER_ERROR
```

Controller内で文字列を直接記述しない。

---

# 10. テストルール

新規実装時は必ずテストを作成する。

最低限必要なテスト

* 正常系
* バリデーションエラー
* 認証エラー
* NotFound
* ライセンス期限切れ

---

## 実行コマンド

```bash
pnpm lint

pnpm typecheck

pnpm test

pnpm build
```

全て成功させること。

---

# 11. GitHubルール

## ブランチ

```text
feature/<issue番号>-<概要>

fix/<issue番号>-<概要>

docs/<issue番号>-<概要>

chore/<issue番号>-<概要>
```

例

```text
feature/6-license-auth

feature/7-license-status

fix/14-domain-check
```

---

## コミット

Conventional Commitsを利用する。

例

```text
feat: ライセンス認証APIを追加

fix: ドメイン照合エラーを修正

docs: OpenAPI仕様書を追加

test: 認証サービスのテストを追加
```

---

# 12. Pull Requestルール

PRには以下を記載する。

```md
## 概要

## 対応Issue

## 変更内容

## テスト結果

## 影響範囲

## レビュー観点
```

---

# 13. Codex向け指示

実装開始前に

* AGENTS.md
* OpenAPI
* ER図
* テーブル定義書

を読むこと。

---

## 実装手順

1. 設計書確認
2. 型定義確認
3. 実装
4. テスト追加
5. lint実行
6. build実行
7. PR作成

---

# 14. Definition of Done

以下を満たしたら完了とする。

* 設計書通りに実装されている
* TypeScriptエラーなし
* テスト成功
* lint成功
* build成功
* 機密情報なし
* PR説明あり

---

# 15. 開発順序

```text
1. モノレポ作成

2. shared作成

3. kintone-client作成

4. APIサーバー作成

5. ライセンス認証API

6. ライセンス状態確認API

7. 更新確認API

8. ダウンロードAPI

9. kintoneプラグイン

10. WordPress連携

11. CI/CD
```

---

# 16. Codexへの最重要指示

不明な仕様を推測して実装しない。

判断に迷う場合は

* docs/openapi.yaml
* docs/05_table_definition.md
* docs/er-diagram.md

を優先して参照すること。

設計書に存在しない仕様は実装せず、Issueへ質問を返すこと。
