# ラジオボタン表示フィールド切替 作業指示

## 対象範囲

- 元ソース: `RadioButtonDisplaySwitching/`
- 難読化済み: 現時点では同一プラグイン配下に未確認

## 作業ルール

- 元ソースのみ修正する。
- ZIPファイルは直接修正しない。
- 設定キー `settings` と `groupNameHideCheck` は変更しない。
- 警告表示は一覧画面表示ごとに実行する。

## 今回の変更

`desktop.js` と `mobile.js` の一覧画面警告を、設定項目ごとに詳細表示する形式へ調整した。

## 確認コマンド

```bash
/Users/wildbore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check plugins/ラジオボタン表示フィールド切替/RadioButtonDisplaySwitching/contents/js/desktop.js
/Users/wildbore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check plugins/ラジオボタン表示フィールド切替/RadioButtonDisplaySwitching/contents/js/mobile.js
```
