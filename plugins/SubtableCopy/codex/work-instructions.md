# SubtableCopy Codex作業指示書

## 対象プラグイン

SubtableCopy

## 対象パス

```text
plugins/SubtableCopy
```

## 元ソース場所

```text
plugins/SubtableCopy/SubtableCopy
```

## 難読化版場所

```text
plugins/SubtableCopy/SubtableCopye
```

## 元ソースと難読化版の対応関係

- 元ソース: `plugins/SubtableCopy/SubtableCopy`
- 難読化版: `plugins/SubtableCopy/SubtableCopye`
- 難読化版は生成物として扱い、直接修正しません。

## 修正前の必須確認

コード変更前に以下を必ず確認します。

```text
AGENTS.md
plugins/SubtableCopy/specification.md
plugins/SubtableCopy/codex/work-instructions.md
plugins/SubtableCopy/codex/test-plan.md
plugins/SubtableCopy/codex/troubleshooting.md
plugins/SubtableCopy/codex/next-tasks.md
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

1. `plugins/SubtableCopy/specification.md` を確認する。
2. `plugins/SubtableCopy/codex/troubleshooting.md`、`plugins/SubtableCopy/codex/handover-YYYY-MM-DD.md`、`plugins/SubtableCopy/codex/next-tasks.md` を確認する。
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
plugins/SubtableCopy/specification.md
plugins/SubtableCopy/codex/work-instructions.md
plugins/SubtableCopy/codex/test-plan.md
```

確認項目:

- 修正対象が元ソース `plugins/SubtableCopy/SubtableCopy` であること。
- 難読化済みファイル `plugins/SubtableCopy/SubtableCopye` を直接編集していないこと。
- `plugins/SubtableCopy/SubtableCopy/contents/manifest.json` が存在すること。
- manifest.json のJS/CSS/HTML/image参照先が存在すること。
- ZIPに不要な開発用ファイルが含まれないこと。

## ビルド手順

- 要確認
- 既存の package.json、ビルドスクリプト、README を確認してから実行します。
- 不明な場合は推測で実行せず、next-tasks.md に確認事項として記録します。
- ビルド結果は handover-YYYY-MM-DD.md に記録します。

## 難読化手順

- 要確認
- 難読化は元ソース `plugins/SubtableCopy/SubtableCopy` から実行します。
- 難読化済みファイルは `plugins/SubtableCopy/SubtableCopye` に生成されるものとして扱います。
- 難読化済みファイルは直接修正しません。

難読化前後の確認項目:

- 元ソースの変更内容が反映されている。
- 難読化済みファイルが更新されている。
- manifest.json の参照先と一致している。
- 不要な `console.log` が残っていない。
- 構文エラーがない。

## ZIP化手順

- 通常版ZIPは元ソース `plugins/SubtableCopy/SubtableCopy` の `contents` 配下を基準に作成します。
- 難読化版ZIPは難読化済み版 `plugins/SubtableCopy/SubtableCopye` の `contents` 配下を基準に作成します。
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
plugins/SubtableCopy/codex/handover-YYYY-MM-DD.md
plugins/SubtableCopy/codex/next-tasks.md
```

## ZIPファイル名ルール

通常版ZIP:

```text
SubtableCopy-v<version>.zip
```

難読化版ZIP:

```text
SubtableCopy-ev<version>.zip
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
plugins/SubtableCopy/SubtableCopye
SubtableCopy-v<version>.zip
SubtableCopy-ev<version>.zip
dist/
```

生成物を修正する場合は、必ず元ソースに戻って修正します。

## 完了時の更新

作業完了時は以下を更新します。

```text
plugins/SubtableCopy/codex/handover-YYYY-MM-DD.md
plugins/SubtableCopy/codex/next-tasks.md
```

必要な場合は以下も更新します。

```text
plugins/SubtableCopy/decisions/
plugins/SubtableCopy/codex/troubleshooting.md
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
