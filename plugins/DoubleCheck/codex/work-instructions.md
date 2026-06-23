# DoubleCheck Codex作業指示書

## 対象プラグイン

DoubleCheck

## 対象パス

```text
plugins/DoubleCheck
```

## 元ソース場所

```text
plugins/DoubleCheck/DoubleCheck
```

## 難読化版場所

```text
plugins/DoubleCheck/DoubleChecke
```

## 元ソースと難読化版の対応関係

- 元ソース: `plugins/DoubleCheck/DoubleCheck`
- 難読化版: `plugins/DoubleCheck/DoubleChecke`
- 難読化版は生成物として扱い、直接修正しません。

## 修正前の必須確認

コード変更前に以下を必ず確認します。

```text
AGENTS.md
plugins/DoubleCheck/specification.md
plugins/DoubleCheck/codex/work-instructions.md
plugins/DoubleCheck/codex/test-plan.md
plugins/DoubleCheck/codex/troubleshooting.md
plugins/DoubleCheck/codex/next-tasks.md
```

確認後に修正方針を決定します。

## 修正計画テンプレート

コード変更前に以下を簡潔に記録します。

```md
## 修正目的

## 原因

## 修正方針

## 変更対象

## 影響範囲
```

## 調査・解析ルール

不具合調査、機能調査、改修前調査では、最初から全体を読まず、原因候補を特定してから必要箇所だけ確認します。

調査優先順位:

1. `plugins/DoubleCheck/specification.md` を確認する。
2. `plugins/DoubleCheck/codex/troubleshooting.md`、`plugins/DoubleCheck/codex/handover-YYYY-MM-DD.md`、`plugins/DoubleCheck/codex/next-tasks.md` を確認する。
3. manifest.json で読み込みJS、CSS、設定画面JS、モバイルJSを確認する。
4. 対象イベントを特定する。
5. 関数名、イベント名、フィールドコード、REST API名で検索して対象関数を特定する。
6. 対象関数、周辺処理、呼び出し元、呼び出し先のみ確認する。

優先して検索する語句:

```text
app.record.index.show
app.record.detail.show
app.record.create.show
app.record.edit.show
kintone.api(
record["フィールドコード"]
.value.forEach
.value.length
FILE
attachment
fileKey
getLoginUser
permission
creator
querySelector
getElementById
createElement
kintone.app.getHeaderMenuSpaceElement
```

CSS調査は対象クラス名を検索し、CSS全体は読みません。
難読化ファイルは参考のみとし、原因調査は元ソースを優先します。

調査結果は以下のみ簡潔に報告します。

```text
現象
原因
対象ファイル
対象関数
修正方針
影響範囲
```

## 共通コーディング規約

実装時は AGENTS.md の「kintoneプラグイン共通コーディング規約」を必ず確認します。

実装優先順位:

1. 既存関数利用
2. 既存共通処理利用
3. 既存UI利用
4. 新規関数作成

主な規約:

- シンプルな実装を優先し、複雑な実装や不要なリファクタリングは行いません。
- `var`、グローバル変数、不要なインラインCSS、不要なHTML文字列大量連結は使用しません。
- 即時実行関数、`'use strict'`、既存実装の構造を優先します。
- 固定値、フィールドコード、イベント名は定数化します。
- 同じDOMを複数回取得せず、取得結果を再利用します。
- 1関数1責務、関数長100行以内、ネスト3階層以内、早期 return を意識します。
- REST API、添付ファイル、JSON処理、外部通信は try-catch を使用します。
- 非同期処理は async/await を優先し、Promiseの多重ネストは避けます。
- サブテーブル、添付ファイルは必ず存在確認します。
- jQueryは既存プラグインがjQueryベースの場合のみ、既存実装との整合性を優先して利用します。
- プラグイン設定は `kintone.plugin.app.getConfig()` と `kintone.plugin.app.setConfig()` を使用します。
- 修正対象は元ソースのみとし、難読化済みファイルは直接修正しません。

修正完了時チェック:

- 構文エラーなし
- 未使用変数なし
- console残置なし
- APIエラーなし
- PC確認
- モバイル影響確認
- 設定保存確認
- 権限影響確認
- サブテーブル影響確認
- 添付ファイル影響確認

## 修正時の注意事項

- まず仕様書、関連API、関連設定、対象ファイルの該当箇所を確認します。
- REST API、Node.js、Playwright を優先して確認します。
- Computer Use は最終的な視覚確認が必要な場合のみ使用します。
- 変更後は実施したテストと結果を作業日の handover ファイルへ記録します。
- 変更範囲は最小にし、要求範囲外の整形やリファクタリングは行いません。

## 修正禁止事項

- 難読化済みファイルの直接修正
- 無関係なコード修正
- 無関係なリファクタリング
- 不要な命名変更
- 不要なファイル移動
- 不要なライブラリ変更
- ZIP内のファイルだけを直接修正
- manifest.json の整合性を確認しないZIP化
- .env の作成またはZIP同梱
- APIキー、トークン、Cookie、秘密鍵などの実値記載

## 変更ファイル記録テンプレート

変更したファイルごとに以下を記録します。

```md
## 変更ファイル

ファイル名

### 修正理由

### 修正内容

### 影響範囲

### テスト内容
```

## バグ修正時の記録

バグ修正時は以下を必ず記録します。

```md
## 発生条件

## 再現手順

## 原因

## 修正内容

## 再発防止策
```

## 機能追加時の記録

機能追加時は以下を必ず記録します。

```md
## 要求内容

## 仕様変更内容

## UI変更内容

## 設定変更内容

## API変更内容

## テスト内容
```

## 動作確認方法

1. 静的確認: 構文エラー、参照エラー、manifest整合性を確認します。
2. REST API確認: APIエラー、レスポンス、権限を確認します。
3. Node.js確認: ロジック、設定値、変換処理を確認します。
4. Playwright確認: 画面動作を必要最小回数で確認します。
5. 最終視覚確認: UI表示やレイアウト確認が必要な場合のみ実施します。

## ビルド前確認

ZIP化前に以下を確認します。

```text
AGENTS.md
plugins/DoubleCheck/specification.md
plugins/DoubleCheck/codex/work-instructions.md
plugins/DoubleCheck/codex/test-plan.md
```

確認項目:

- 修正対象が元ソース `plugins/DoubleCheck/DoubleCheck` であること。
- 難読化済みファイル `plugins/DoubleCheck/DoubleChecke` を直接編集していないこと。
- `plugins/DoubleCheck/DoubleCheck/contents/manifest.json` が存在すること。
- manifest.json のJS/CSS/HTML/image参照先が存在すること。
- ZIPに不要な開発用ファイルが含まれないこと。

## ビルド手順

- 要確認
- 既存の package.json、ビルドスクリプト、README を確認してから実行します。
- 不明な場合は推測で実行せず、next-tasks.md に確認事項として記録します。
- ビルド結果は handover-YYYY-MM-DD.md に記録します。

## 難読化手順

- 要確認
- 難読化は元ソース `plugins/DoubleCheck/DoubleCheck` から実行します。
- 難読化済みファイルは `plugins/DoubleCheck/DoubleChecke` に生成されるものとして扱います。
- 難読化済みファイルは直接修正しません。

難読化前後の確認項目:

- 元ソースの変更内容が反映されている。
- 難読化済みファイルが更新されている。
- manifest.json の参照先と一致している。
- 不要な `console.log` が残っていない。
- 構文エラーがない。

## ZIP化手順

- 通常版ZIPは元ソース `plugins/DoubleCheck/DoubleCheck` の `contents` 配下を基準に作成します。
- 難読化版ZIPは難読化済み版 `plugins/DoubleCheck/DoubleChecke` の `contents` 配下を基準に作成します。
- ZIPにはkintoneプラグインとして必要なファイルのみ含めます。

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

ZIP化前に必ず以下を確認します。

- manifest.json が存在する。
- name が正しい。
- version が正しい。
- desktop.js の参照先が存在する。
- mobile.js の参照先が存在する場合は存在確認する。
- config.js の参照先が存在する。
- CSS参照先が存在する。
- icon参照先が存在する。
- 不要な参照がない。

## バージョン管理

修正内容に応じて manifest.json の version を更新します。

- 軽微な修正: patch
- 機能追加: minor
- 互換性に影響する変更: major

バージョン更新時は以下にも記録します。

```text
plugins/DoubleCheck/codex/handover-YYYY-MM-DD.md
plugins/DoubleCheck/codex/next-tasks.md
```

## ZIPファイル名ルール

通常版ZIP:

```text
DoubleCheck-v<version>.zip
```

難読化版ZIP:

```text
DoubleCheck-ev<version>.zip
```

難読化を行わない場合は通常版ZIPのみ作成します。
難読化を行う場合は通常版ZIPと難読化版ZIPの2種類を作成します。
通常利用者へ提供するファイルは難読化版ZIP、開発・保守用として保管するファイルは通常版ZIPとします。

## ZIP作成後確認

- ZIPが作成されている。
- ZIP内に manifest.json がある。
- ZIP内に不要ファイルが入っていない。
- ZIP内の参照パスが manifest.json と一致している。
- kintoneにアップロード可能な構成になっている。

## 生成物の扱い

以下は生成物として扱います。

```text
plugins/DoubleCheck/DoubleChecke
DoubleCheck-v<version>.zip
DoubleCheck-ev<version>.zip
dist/
```

生成物を修正する場合は、必ず元ソースに戻って修正します。

## 完了時の更新

作業完了時は以下を更新します。

```text
plugins/DoubleCheck/codex/handover-YYYY-MM-DD.md
plugins/DoubleCheck/codex/next-tasks.md
```

必要な場合は以下も更新します。

```text
plugins/DoubleCheck/decisions/
plugins/DoubleCheck/codex/troubleshooting.md
```

## レビュー観点

- 既存機能を壊していないか
- 権限処理に影響していないか
- モバイルへ影響していないか
- サブテーブルへ影響していないか
- 添付ファイルへ影響していないか
- REST APIへ影響していないか
- 設定保存へ影響していないか
- manifest.json とZIP内ファイルの参照が一致しているか
- ZIPに不要ファイルが含まれていないか
