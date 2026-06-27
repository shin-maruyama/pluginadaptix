# 入力可 単体テスト結果

## 1. 判定サマリー

| 項目 | 内容 |
|---|---|
| 総合判定 | 要確認 |
| 対象プラグイン | 入力可 |
| 対象バージョン | 1 |
| 実施日 | 2026-06-27 |
| 実施者 | Codex |
| テスト種別 | 単体テスト |
| OK件数 | 7 |
| NG件数 | 0 |
| 要確認件数 | 4 |
| 未実施件数 | 1 |

## 2. 参照資料

| ファイル | 確認状況 | 備考 |
|---|---|---|
| specification.md | OK | 今回作成 |
| Manual.md | OK | 今回作成 |
| BUG.md | OK | 今回作成 |
| TEST_SPEC.md | OK | 今回作成 |
| manifest.json | OK | 参照確認済み |

## 3. 実行コマンド

| No | コマンド | 結果 | 備考 |
|---|---|---|---|
| 1 | `node --check desktop.js` | OK | bundled Node.jsで実行 |
| 2 | `node --check mobile.js` | OK | bundled Node.jsで実行 |
| 3 | `npm test` | 対象外 | package.jsonなし |
| 4 | `npm run lint` | 対象外 | package.jsonなし |

## 4. 単体テスト結果一覧

| No | テスト項目 | 確認内容 | 判定 |
|---|---|---|---|
| 1 | manifest.json構文 | JSONとして正しいか | OK |
| 2 | 参照ファイル存在確認 | JS/CSS/HTML/iconの参照先が存在するか | OK |
| 3 | JS構文確認 | PC/モバイルJSに構文エラーがないか | OK |
| 4 | getConfig確認 | 設定取得処理があるか | OK |
| 5 | setConfig確認 | 設定保存処理があるか | OK |
| 6 | フィールド存在チェック | 一覧画面で設定済みフィールドを確認するか | OK |
| 7 | 毎回表示確認 | 表示済み制御がないか | OK |
| 8 | 実機表示 | SweetAlert2が表示されるか | 要確認 |

## 5. NG一覧

なし。

## 6. 要確認一覧

| No | テスト項目 | 対象ファイル | 要確認理由 | 実機確認内容 |
|---|---|---|---|---|
| 1 | PC警告表示 | desktop.js | kintone環境が必要 | 一覧画面で警告が表示されること |
| 2 | モバイル警告表示 | mobile.js | kintone環境が必要 | モバイル一覧画面で警告が表示されること |
| 3 | 入力可制御 | desktop.js/mobile.js | kintone環境が必要 | 対象フィールドが入力可能になること |

## 7. 未実施一覧

| No | テスト項目 | 理由 | 次回実施方法 |
|---|---|---|---|
| 1 | 実機操作 | kintone環境未接続 | TEST_SPEC.mdに従って確認 |

## 8. BUG.mdとの対応

| BUG ID | 不具合内容 | 修正状況 | 単体テスト判定 | 備考 |
|---|---|---|---|---|
| FIELD-CHECK-001 | 一覧画面警告未実装 | 修正済み | 要確認 | 実機表示は未確認 |

## 9. 総合判定理由

構文エラーはなく、一覧画面警告処理の追加は静的に確認できた。kintone実機確認が未実施のため要確認。

## 10. 次回対応

kintone PC/モバイルで警告表示と入力可制御を確認する。

## 11. 変更ファイル

- `InputAllowed/contents/js/desktop.js`
- `InputAllowed/contents/js/mobile.js`
- `specification.md`
- `Manual.md`
- `BUG.md`
- `TEST_SPEC.md`
- `codex/unit-test-result.md`
