# ラジオボタン表示フィールド切替 単体テスト結果

## 1. 判定サマリー

| 項目 | 内容 |
|---|---|
| 総合判定 | 要確認 |
| 対象プラグイン | ラジオボタン表示フィールド切替 |
| 対象バージョン | 2.0.9 |
| 実施日 | 2026-06-27 |
| 実施者 | Codex |
| テスト種別 | 単体テスト |
| OK件数 | 6 |
| NG件数 | 0 |
| 要確認件数 | 5 |
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
| 4 | フィールド存在チェック | 保存済みフィールドを一覧画面で確認する処理があるか | OK |
| 5 | 削除フィールド警告 | 存在しないフィールドを警告対象にするか | OK |
| 6 | 毎回表示確認 | 表示済み制御がないか | OK |
| 7 | 対象情報表示 | 設定項目、コード、現在状態を表示するか | OK |
| 8 | 複数フィールド | 複数不足時に複数件表示できるか | 要確認 |
| 9 | PC実機表示 | SweetAlert2の見え方 | 要確認 |
| 10 | モバイル実機表示 | SweetAlert2の見え方 | 要確認 |

## 5. NG一覧

なし。

## 6. 要確認一覧

| No | テスト項目 | 対象ファイル | 要確認理由 | 実機確認内容 |
|---|---|---|---|---|
| 1 | PC警告表示 | desktop.js | kintone環境が必要 | 一覧画面で警告が表示されること |
| 2 | モバイル警告表示 | mobile.js | kintone環境が必要 | モバイル一覧画面で警告が表示されること |

## 7. 未実施一覧

| No | テスト項目 | 理由 | 次回実施方法 |
|---|---|---|---|
| 1 | 実機操作 | kintone環境未接続 | TEST_SPEC.mdに従って確認 |

## 8. BUG.mdとの対応

| BUG ID | 不具合内容 | 修正状況 | 単体テスト判定 | 備考 |
|---|---|---|---|---|
| FIELD-CHECK-001 | 警告表示情報不足 | 修正済み | 要確認 | 実機表示は未確認 |

## 9. 総合判定理由

構文エラーはなく、警告表示の情報追加は静的に確認できた。kintone実機での表示確認が未実施のため、総合判定は要確認。

## 10. 次回対応

kintone PC/モバイルで警告表示を実機確認する。

## 11. 変更ファイル

- `RadioButtonDisplaySwitching/contents/js/desktop.js`
- `RadioButtonDisplaySwitching/contents/js/mobile.js`
- `specification.md`
- `Manual.md`
- `BUG.md`
- `TEST_SPEC.md`
- `codex/unit-test-result.md`
