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

---

# 18. プラグイン修正・機能追加運用ルール

仕様書作成済みのプラグインを修正、機能追加、不具合対応する場合は、この章を必ず適用する。

## 修正前の必須確認

コード変更前に、対象プラグインについて以下を必ず確認する。

```text
AGENTS.md
plugins/<プラグイン名>/specification.md
plugins/<プラグイン名>/codex/work-instructions.md
plugins/<プラグイン名>/codex/test-plan.md
plugins/<プラグイン名>/codex/troubleshooting.md
plugins/<プラグイン名>/codex/next-tasks.md
```

確認後に修正方針を決定する。

## 修正計画

コード変更前に以下を簡潔に記録する。

```md
## 修正目的

## 原因

## 修正方針

## 変更対象

## 影響範囲
```

## 変更範囲最小化

最小変更を原則とする。

禁止事項:

* 無関係なコード修正
* 無関係なリファクタリング
* 不要な命名変更
* 不要なファイル移動
* 不要なライブラリ変更

## 修正時の記録

変更したファイルごとに以下を記録する。

```md
## 変更ファイル

ファイル名

### 修正理由

### 修正内容

### 影響範囲

### テスト内容
```

## テスト実施順序

修正後は以下の順で確認する。

1. 静的確認: 構文エラー、参照エラー、manifest整合性
2. REST API確認: APIエラー、レスポンス、権限
3. Node.js確認: ロジック、設定値
4. Playwright確認: 画面動作
5. 最終視覚確認: 必要な場合のみ実施

## バグ修正時の記録

バグ修正時は以下を必ず記録する。

```md
## 発生条件

## 再現手順

## 原因

## 修正内容

## 再発防止策
```

## 機能追加時の記録

機能追加時は以下を必ず記録する。

```md
## 要求内容

## 仕様変更内容

## UI変更内容

## 設定変更内容

## API変更内容

## テスト内容
```

## ファイル管理

元ソースのみ修正する。

以下は直接修正しない。

```text
plugins/<プラグイン名>/<プラグイン名>e
```

難読化済みファイルは生成物として扱う。

## 完了時の更新

作業完了時は以下を更新する。

```text
plugins/<プラグイン名>/codex/handover-YYYY-MM-DD.md
plugins/<プラグイン名>/codex/next-tasks.md
```

必要な場合は以下も更新する。

```text
plugins/<プラグイン名>/decisions/
plugins/<プラグイン名>/codex/troubleshooting.md
```

## レビュー観点

修正完了後に以下を確認する。

* 既存機能を壊していないか
* 権限処理に影響していないか
* モバイルへ影響していないか
* サブテーブルへ影響していないか
* 添付ファイルへ影響していないか
* REST APIへ影響していないか
* 設定保存へ影響していないか

## 作業完了報告

作業完了時の報告は以下のみ簡潔に出力する。

* 修正内容
* 変更ファイル
* テスト結果
* 未解決事項
* 次回作業

---

# 19. ビルド・難読化・ZIP化・配布物作成ルール

kintoneプラグインの修正後に、元ソースから難読化済みファイルを生成し、kintoneにアップロード可能なZIP形式のプラグインファイルを作成する場合は、この章を必ず適用する。

## 基本方針

* 元ソースを正とする。
* 難読化済みファイルとZIPファイルは生成物として扱う。
* 生成物を修正する場合は、必ず元ソースに戻って修正する。

## 対象パス

各プラグインは以下に配置する。

```text
plugins/<プラグイン名>
```

元ソースは以下を基本とする。

```text
plugins/<プラグイン名>/<プラグイン名>
```

難読化済みファイルは以下を基本とする。

```text
plugins/<プラグイン名>/<プラグイン名>e
```

## 禁止事項

以下は禁止する。

* 難読化済みファイルを直接修正する。
* ZIP内のファイルだけを直接修正する。
* manifest.json の整合性を確認せずZIP化する。
* 不要なファイルをZIPに含める。
* `.env` をZIPに含める。
* `node_modules` をZIPに含める。
* `coverage` をZIPに含める。
* `playwright-report` をZIPに含める。
* `test-results` をZIPに含める。
* OS生成ファイルをZIPに含める。

## ビルド前確認

ZIP化前に以下を確認する。

```text
AGENTS.md
plugins/<プラグイン名>/specification.md
plugins/<プラグイン名>/codex/work-instructions.md
plugins/<プラグイン名>/codex/test-plan.md
```

確認項目:

* 修正対象が元ソースであること。
* 難読化済みファイルを直接編集していないこと。
* manifest.json の参照先が存在すること。
* 必要なJS/CSS/HTML/imageファイルが存在すること。
* 不要な開発用ファイルが含まれないこと。

## 難読化ルール

難読化は元ソースから実行する。

難読化前後で以下を確認する。

* 元ソースの変更内容が反映されている。
* 難読化済みファイルが更新されている。
* manifest.json の参照先と一致している。
* 不要な `console.log` が残っていない。
* 構文エラーがない。

## ZIP化ルール

ZIPにはkintoneプラグインとして必要なファイルのみ含める。

含める可能性があるもの:

```text
manifest.json
html/
css/
js/
image/
icon.png
```

含めないもの:

```text
codex/
decisions/
specification.md
README.md
.env
.env.example
node_modules/
coverage/
playwright-report/
test-results/
dist/
.git/
.DS_Store
Thumbs.db
```

## manifest.json確認

ZIP化前に必ず以下を確認する。

* manifest.json が存在する。
* name が正しい。
* version が正しい。
* desktop.js の参照先が存在する。
* mobile.js の参照先が存在する場合は存在確認する。
* config.js の参照先が存在する。
* CSS参照先が存在する。
* icon参照先が存在する。
* 不要な参照がない。

## バージョン管理

修正内容に応じてバージョンを更新する。

目安:

* 軽微な修正: patch
* 機能追加: minor
* 互換性に影響する変更: major

例:

```text
1.0.0 -> 1.0.1
1.0.1 -> 1.1.0
1.1.0 -> 2.0.0
```

バージョン更新時は以下にも記録する。

```text
plugins/<プラグイン名>/codex/handover-YYYY-MM-DD.md
plugins/<プラグイン名>/codex/next-tasks.md
```

## ZIPファイル名

難読化していない通常版:

```text
<プラグイン名>-v<version>.zip
```

難読化版:

```text
<プラグイン名>-ev<version>.zip
```

難読化を行わない場合は通常版のみ作成する。

```text
<プラグイン名>-v<version>.zip
```

難読化を行う場合は通常版と難読化版の2種類を作成する。

```text
<プラグイン名>-v<version>.zip
<プラグイン名>-ev<version>.zip
```

通常利用者へ提供するファイルは難読化版とする。

```text
<プラグイン名>-ev<version>.zip
```

開発・保守用として保管するファイルは通常版とする。

```text
<プラグイン名>-v<version>.zip
```

## 作成後確認

ZIP作成後に以下を確認する。

* ZIPが作成されている。
* ZIP内にmanifest.jsonがある。
* ZIP内に不要ファイルが入っていない。
* ZIP内の参照パスがmanifest.jsonと一致している。
* kintoneにアップロード可能な構成になっている。

## 生成物の扱い

以下は生成物として扱う。

```text
<プラグイン名>e
<プラグイン名>-v<version>.zip
<プラグイン名>-ev<version>.zip
dist/
```

## 作業完了時の更新

作業完了時は以下を更新する。

```text
plugins/<プラグイン名>/codex/handover-YYYY-MM-DD.md
plugins/<プラグイン名>/codex/next-tasks.md
```

必要に応じて以下も更新する。

```text
plugins/<プラグイン名>/decisions/
plugins/<プラグイン名>/codex/troubleshooting.md
```

## 作業完了報告

以下のみ簡潔に報告する。

* 対象プラグイン
* 更新バージョン
* 通常版ZIP
* 難読化版ZIP
* 更新した生成物
* ZIP内確認結果
* 未確認事項
* 次回作業

---

# 20. kintoneプラグイン調査・解析ルール

不具合調査、機能調査、改修前調査では、最小限の調査で原因を特定する。
調査は広げるのではなく絞り込み、原因候補を特定してから必要箇所だけ読む。

## 基本原則

* 最初から全体を読まない。
* リポジトリ全体を横断調査しない。
* 関係ないプラグインを調査しない。
* 推測で断定しない。
* 難読化ファイルは参考のみとし、原因調査は元ソースを優先する。

## 調査優先順位

以下の順番で調査する。

1. `specification.md` を確認する。
2. `codex/troubleshooting.md`、`codex/handover-YYYY-MM-DD.md`、`codex/next-tasks.md` を確認する。
3. `manifest.json` で読み込みJS、CSS、設定画面JS、モバイルJSを確認する。
4. 対象イベントを特定する。
5. 対象関数を、関数名、イベント名、フィールドコード、REST API名で検索して特定する。
6. 対象関数、周辺処理、呼び出し元、呼び出し先のみ確認する。

## 不具合調査手順

1. 現象を整理し、発生画面、発生条件、エラーメッセージ、再現手順を記録する。
2. 影響範囲として、一覧画面、詳細画面、編集画面、モバイル、設定画面を確認する。
3. 関連イベントを特定する。
4. 関連関数のみ確認する。
5. 原因仮説を作成する。
6. 必要箇所のみ確認して仮説を検証する。
7. 原因確定後、修正前に原因、修正方針、変更対象を報告する。

原因仮説の例:

```text
値取得失敗
権限不足
APIエラー
フィールドコード変更
DOM変更
```

## 対象イベント調査

まず対象画面に対応するイベント名を検索する。

```javascript
app.record.index.show
app.record.detail.show
app.record.create.show
app.record.edit.show
```

## フィールド調査

まずフィールドコードを検索する。

```javascript
record["フィールドコード"]
```

## サブテーブル調査

まず以下を検索する。

```javascript
.value.forEach
.value.length
record["テーブルコード"]
```

## 添付ファイル調査

まず以下を検索する。

```javascript
FILE
attachment
fileKey
```

## REST API調査

まず以下を検索する。

```javascript
kintone.api(
```

確認内容:

* GET
* POST
* PUT
* DELETE

## 権限調査

まず以下を検索する。

```javascript
getLoginUser
permission
creator
```

## DOM調査

まず以下を検索する。

```javascript
querySelector
getElementById
createElement
kintone.app.getHeaderMenuSpaceElement
```

## CSS調査

まず対象クラス名を検索する。
CSS全体は読まず、必要部分のみ確認する。

## 禁止事項

以下は禁止する。

* 全JS読込
* 全CSS読込
* 全HTML読込
* リポジトリ全体検索
* 無関係プラグイン調査
* 推測による断定

## 調査結果報告

長文を避け、以下のみ簡潔に報告する。

```text
現象
原因
対象ファイル
対象関数
修正方針
影響範囲
```

## トークン節約ルール

必ず以下を守る。

* 必要箇所だけ読む。
* 必要関数だけ読む。
* 必要イベントだけ読む。
* 必要APIだけ読む。
* 必要画面だけ確認する。

---

# 21. kintoneプラグイン共通コーディング規約

全プラグインでコード品質を統一し、保守性、可読性、解析性を向上させる。
実装はシンプルを優先し、既存実装との整合性を最優先する。

## 基本方針

* 複雑な実装を避ける。
* 既存実装との整合性を優先する。
* 要求された範囲のみ変更する。
* 不要なリファクタリングを行わない。
* 新規実装は最後の手段とする。

## 実装優先順位

実装時は以下を優先する。

1. 既存関数利用
2. 既存共通処理利用
3. 既存UI利用
4. 新規関数作成

## JavaScript規約

`var` は使用しない。

禁止:

```javascript
var value = '';
```

使用:

```javascript
const value = '';
let count = 0;
```

グローバル変数は作成しない。

禁止:

```javascript
window.data = {};
let globalValue = '';
```

必要な状態は即時実行関数内で管理する。

基本構造:

```javascript
(function() {
  'use strict';

})(jQuery);
```

## 定数管理

固定値、ステータス値、フィールドコード、イベント名は定数化する。

禁止:

```javascript
if (status === '完了') {
}

record['顧客名'];
```

使用:

```javascript
const STATUS_COMPLETE = '完了';
const FIELD_CUSTOMER_NAME = '顧客名';

if (status === STATUS_COMPLETE) {
}

record[FIELD_CUSTOMER_NAME];
```

イベント名も定数化する。

```javascript
const EVENTS = [
  'app.record.detail.show'
];
```

## DOM規約

同じDOMを複数回取得しない。

禁止:

```javascript
document.querySelector('.btn');
document.querySelector('.btn');
document.querySelector('.btn');
```

使用:

```javascript
const button = document.querySelector('.btn');
```

大量のHTML文字列連結は禁止する。
UI作成は `createElement()`、`appendChild()`、既存UIを優先する。

## 関数規約

1関数1責務を原則とする。
関数長は100行以内を目安とし、50行以内を推奨する。
ネストは最大3階層までとする。
条件分岐は早期 `return` を優先する。

禁止:

```javascript
function saveDataAndCreateUIAndCallApi() {
}
```

使用:

```javascript
createUI();
saveData();
callApi();
```

## console規約

`console.log()`、`console.error()`、`console.warn()` は開発中のみ使用する。
リリース前、難読化前、ZIP化前には不要なconsole出力を削除する。

## エラー処理

以下は `try-catch` を使用する。

* REST API
* 添付ファイル
* JSON処理
* 外部通信

例:

```javascript
try {
} catch (error) {
  console.error(error);
}
```

## REST API規約

REST APIは `kintone.api()` を使用する。
同一API処理を複数箇所へ重複実装しない。
API処理は既存関数または共通処理を優先して利用する。

## Promise規約

非同期処理は `async/await` を優先する。
`.then()` の多重ネストは避ける。

使用:

```javascript
const result = await apiCall();
```

## 配列処理

配列処理は目的に応じて以下を優先する。

```text
map
filter
find
some
every
```

不要な `for` ループは避ける。

## サブテーブル規約

サブテーブルを扱う場合は必ず存在確認する。

```javascript
if (!record[TABLE_CODE]) {
  return;
}
```

## 添付ファイル規約

添付ファイルを扱う場合は必ず存在確認する。

```javascript
if (!files.length) {
  return;
}
```

## CSS規約

`!important` は必要最小限のみ使用する。
インラインCSSは避け、class付与を優先する。

禁止:

```javascript
element.style.color = 'red';
```

使用:

```javascript
element.classList.add('error');
```

## jQuery規約

新規実装では原則としてjQueryを使用しない。
既存プラグインがjQueryベースの場合のみ、既存実装との整合性を優先して利用できる。

## kintone UI規約

UIは以下の優先順位で実装する。

```text
kintone標準UI
既存UI
独自UI
```

## モバイル対応規約

追加機能や修正はPCとモバイルの両方への影響を確認する。
モバイル対象外の場合は、その理由を handover に記録する。

## 設定保存規約

プラグイン設定は必ず以下を使用する。

```javascript
kintone.plugin.app.getConfig()
kintone.plugin.app.setConfig()
```

## バージョン管理規約

修正時は `manifest.json` の version を確認する。
必要に応じて patch、minor、major を更新し、handover と next-tasks に記録する。

## コメント規約

コメントは「なぜその処理が必要なのか」を書く。

禁止:

```javascript
// 変数代入
const name = '';
```

推奨:

```javascript
// kintone標準検索との競合を防ぐため
const searchArea = ...
```

## 難読化規約

修正対象は元ソースのみとする。
`<プラグイン名>e` は直接修正しない。

## 修正完了時チェック

必ず以下を確認する。

* 構文エラーなし
* 未使用変数なし
* console残置なし
* APIエラーなし
* PC確認
* モバイル影響確認
* 設定保存確認
* 権限影響確認
* サブテーブル影響確認
* 添付ファイル影響確認

## トークン節約ルール

コード生成時は以下を守る。

* 既存関数を再利用する。
* 既存UIを再利用する。
* 既存API処理を再利用する。
* 必要最小限のコードのみ追加する。
* 不要なリファクタリングを行わない。

---

# 22. バグ管理CSV運用

バグ一覧CSVは以下で管理する。

```text
bug-management/bug-management-list.csv
```

過去分は以下に保存する。

```text
bug-management/archive/
```

Codexがバグ調査・修正を行う場合は、まず `bug-management/bug-management-list.csv` を確認する。

CSVの `プラグイン` 列をもとに、対象プラグインを特定する。

対象プラグインごとに以下を更新する。

```text
plugins/<プラグイン名>/BUG.md
plugins/<プラグイン名>/codex/bug-analysis.md
plugins/<プラグイン名>/codex/fix-plan.md
plugins/<プラグイン名>/codex/next-tasks.md
```

最新版として利用するCSVは `bug-management-list.csv` として保存する。
履歴として残す場合は `bug-management/archive/bug-management-list-YYYY-MM-DD.csv` として保存する。
