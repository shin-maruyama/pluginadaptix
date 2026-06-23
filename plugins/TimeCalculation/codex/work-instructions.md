# TimeCalculation Codex作業指示書

## 対象プラグイン

TimeCalculation

## 対象パス

```text
plugins/TimeCalculation
```

## 元ソース場所

```text
plugins/TimeCalculation/TimeCalculation
```

## 難読化版場所

```text
plugins/TimeCalculation/TimeCalculatione
```

## 元ソースと難読化版の対応関係

- 元ソース: `plugins/TimeCalculation/TimeCalculation`
- 難読化版: `plugins/TimeCalculation/TimeCalculatione`
- 難読化版は生成物として扱い、直接修正しません。

## 修正時の注意事項

- 作業開始時にリポジトリ直下の AGENTS.md と、このファイル、specification.md を確認します。
- まず REST API、Node.js、Playwright で確認します。
- Computer Use は最終的な視覚確認が必要な場合のみ使用します。
- 変更前に対象仕様、関連API、関連設定を確認します。
- 変更後は実施したテストと結果を handover-2026-06-23.md または作業日の handover ファイルへ記録します。

## 修正禁止事項

- 難読化済みファイルの直接修正
- 要求範囲外の整形、変数名変更、リファクタリング
- 不要なライブラリ追加、ファイル移動
- .env の作成
- APIキー、トークン、Cookie、秘密鍵などの実値記載

## 動作確認方法

1. 静的確認: `rg` で対象関数、API、イベント、設定キーを検索します。
2. Node.js確認: 既存スクリプトまたは最小限の検証スクリプトで確認します。
3. REST API確認: 必要なAPIとレスポンスを確認します。
4. Playwright確認: 必要最小回数で画面操作を検証します。
5. 最終視覚確認: UI表示やレイアウト確認が必要な場合のみ実施します。

## ビルド手順

- 要確認
- 既存の package.json、ビルドスクリプト、README を確認してから実行します。
- 不明な場合は推測で実行せず、next-tasks.md に確認事項として記録します。

## 難読化手順

- 要確認
- 元ソースを修正した後、既存の難読化手順を確認して生成します。
- 難読化後は元ソースとの対応関係と生成日時を引継ぎ資料へ記録します。
