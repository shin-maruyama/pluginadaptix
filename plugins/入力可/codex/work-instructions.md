# 入力可 作業指示

## 対象範囲

- 元ソース: `InputAllowed/`
- 難読化済み: `InputAllowede/`

## 作業ルール

- 元ソースのみ修正する。
- `InputAllowede/` は直接修正しない。
- 保存キー `elementArray` は変更しない。
- ZIPファイルは直接修正しない。

## 今回の変更

`desktop.js` と `mobile.js` に一覧画面のフィールド存在チェック警告を追加した。

## 確認コマンド

```bash
/Users/wildbore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check plugins/入力可/InputAllowed/contents/js/desktop.js
/Users/wildbore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check plugins/入力可/InputAllowed/contents/js/mobile.js
```
