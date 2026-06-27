# 入力不可 作業指示

## 対象範囲

- 元ソース: `InputDisabled/`
- 難読化済み: `InputDisablede/`

## 作業ルール

- 元ソースのみ修正する。
- `InputDisablede/` は直接修正しない。
- 保存キー `elementArray` と `color` は変更しない。
- ZIPファイルは直接修正しない。

## 今回の変更

`desktop.js` と `mobile.js` に一覧画面のフィールド存在チェック警告を追加した。

## 確認コマンド

```bash
/Users/wildbore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check plugins/入力不可/InputDisabled/contents/js/desktop.js
/Users/wildbore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check plugins/入力不可/InputDisabled/contents/js/mobile.js
```
