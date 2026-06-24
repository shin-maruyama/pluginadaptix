# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-008 mobile.jsの保存後ソート処理でdesktop APIのgetIdを使用している

| 項目 | 内容 |
|---|---|
| ID | BUG-008 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | SubTableAutosorte/SubTableAutosort/contents/js/mobile.js |
| 行 | 184 |
| 影響 | モバイル保存後のサブテーブル自動ソートが失敗する可能性がある。 |
| 詳細 | mobile.jsの保存成功・詳細表示・PUTソート処理で `kintone.app.getId()` を使用している。 |
| 推奨対応 | mobile用のappId取得関数を共通化し、全箇所で利用する。 |
| ステータス | 未対応（修正保留） |

---
