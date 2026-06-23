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

---

# 17. kintoneプラグイン開発運用ルール

## 開発方針

* kintoneプラグインの調査・修正・開発では、REST API を優先する。
* Node.js による静的確認、補助スクリプト、テスト実行を優先する。
* Playwright による画面検証を優先する。
* Computer Use は最終確認、レイアウト確認、CSS確認、UI表示確認など視覚確認が必要な場合のみ使用する。
* コード変更前に必ず対象プラグインの仕様書と作業指示書を確認する。
* コード変更後は実行したテストと結果を対象プラグインの引継ぎ資料へ記録する。

## プラグイン配置

各プラグインは以下に配置する。

```text
plugins/<プラグイン名>
```

各プラグインの元ソースは以下を基本とする。

```text
plugins/<プラグイン名>/<プラグイン名>
```

各プラグインの難読化済み版は以下を基本とする。

```text
plugins/<プラグイン名>/<プラグイン名>e
```

個別プラグインを指定する場合は、以下を対象範囲とする。

```text
plugins/<プラグイン名>
```

## ドキュメント運用

作業開始時は、原則として以下を最初に確認する。

```text
AGENTS.md
plugins/<プラグイン名>/specification.md
plugins/<プラグイン名>/codex/work-instructions.md
```

作業終了時は必ず以下を更新する。

```text
plugins/<プラグイン名>/codex/handover-YYYY-MM-DD.md
```

重要な設計判断は以下へ記録する。

```text
plugins/<プラグイン名>/decisions/
```

障害対応は以下へ記録する。

```text
plugins/<プラグイン名>/codex/troubleshooting.md
```

次回作業内容は以下へ記録する。

```text
plugins/<プラグイン名>/codex/next-tasks.md
```

対象プラグイン直下には以下の構成を維持する。

```text
plugins/<プラグイン名>/
├── specification.md
├── codex/
│   ├── work-instructions.md
│   ├── test-plan.md
│   ├── troubleshooting.md
│   ├── next-tasks.md
│   └── handover-YYYY-MM-DD.md
└── decisions/
```

## .env 運用

`.env` は作成しない。

必要な環境変数がある場合は、実値を含まない以下のみ作成する。

```text
.env.example
```

APIキー、APIトークン、ライセンス秘密鍵、WordPress APIキー、認証トークン、Cookie はソースコードとドキュメントへ実値を記載しない。

## 難読化ファイル運用

* 難読化済みファイルは直接修正しない。
* 必ず元ソースを修正する。
* 難読化版は生成物として扱う。
* 元ソースと難読化版の対応関係を `codex/work-instructions.md` へ記録する。

## 作業優先順位

作業時は以下の優先順位で実施する。

1. ドキュメント確認
2. REST API調査
3. Node.js実装
4. Playwright検証
5. Computer Use最終確認

## トークン最適化・開発効率化

* 目的達成に必要な最小限の調査・変更のみ行う。
* リポジトリ全体を最初から読まない。
* ファイル全体を読む前に `rg` などで関連箇所を特定する。
* 要求範囲外の整形、リファクタリング、ファイル移動、ライブラリ変更を行わない。
* 既存ドキュメントが存在する場合は追記を優先する。
* Playwright実行前に静的解析、ソース確認、API確認を行う。
* Computer Use は調査目的では使用せず、必要最小限の視覚確認に限定する。
* 1件の要望に対しては、まず局所修正を検討する。
* 新規実装より既存関数、既存ユーティリティ、既存コンポーネントの利用を優先する。
