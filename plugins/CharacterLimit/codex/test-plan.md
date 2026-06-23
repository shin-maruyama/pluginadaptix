# CharacterLimit テスト計画書

## 実施順序

修正後は以下の順で確認します。

1. 静的確認
2. REST API確認
3. Node.js確認
4. Playwright確認
5. ZIP構成確認
6. 最終視覚確認

## 静的確認

- 構文エラーを確認します。
- 未定義変数、参照エラー、イベント名の組み立てミスを確認します。
- manifest.json と読み込みJS/CSS/HTMLの整合性を確認します。
- 難読化済みファイルを直接変更していないことを確認します。
- 不要な `console.log` が残っていないことを確認します。

## REST API確認

- REST API利用箇所がある場合、エンドポイント、HTTPメソッド、リクエスト、レスポンス、権限を確認します。
- APIエラー時の表示、戻り値、処理中断条件を確認します。
- APIキーやトークンなどの実値は記録しません。

## Node.js確認

- package.json の既存スクリプトを確認してから実行します。
- 必要に応じて対象プラグインに限定した検証を実施します。
- ロジック、設定値変換、JSON保存形式、境界値を確認します。
- ZIP内ファイル一覧や manifest 参照チェックをNode.jsで確認できる場合は優先します。

## Playwright確認

- 静的解析、ソース確認、API確認の後に実施します。
- 同一確認の繰り返しは避け、必要最小回数で検証します。
- 設定画面、追加画面、編集画面、詳細画面、一覧画面のうち影響範囲のみ確認します。

## ZIP構成確認

ZIP作成後に以下を確認します。

- ZIPが作成されている。
- ZIP内に manifest.json がある。
- ZIP内に不要ファイルが入っていない。
- ZIP内のJS/CSS/HTML/image参照パスが manifest.json と一致している。
- 通常版ZIP名が `CharacterLimit-v<version>.zip` になっている。
- 難読化版ZIP名が `CharacterLimit-ev<version>.zip` になっている。

ZIPに含めないもの:

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

## kintone実機確認

必要な場合のみ実施します。

- プラグインアップロード
- アプリへの適用
- 設定画面表示
- 設定保存
- 対象画面での動作確認
- 実機確認で得た仕様は specification.md に追記します。

## 回帰テスト

- 既存動作に影響する画面、イベント、設定値を確認します。
- モバイル、サブテーブル、添付ファイル、REST API、設定保存への影響を確認します。
- 難読化版を生成した場合は、元ソースと同等の動作を確認します。

## 最終視覚確認

- レイアウト、CSS、UI表示の確認が必要な場合のみ実施します。
- Computer Use はこの段階の最終確認に限定します。

## テスト結果記録テンプレート

```md
## テスト結果

### 静的確認

### REST API確認

### Node.js確認

### Playwright確認

### ZIP構成確認

通常版ZIP:

難読化版ZIP:

ZIP内確認結果:

### kintone実機確認

### 最終視覚確認

### 未実施項目と理由
```
