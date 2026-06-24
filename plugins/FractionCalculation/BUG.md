# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-009 mobile.jsの設定済みフィールド確認でdesktop APIのgetIdを使用している

| 項目 | 内容 |
|---|---|
| ID | BUG-009 |
| 重大度 | Medium |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | FractionCalculation/FractionCalculation/contents/js/mobile.js |
| 行 | 324 |
| 影響 | モバイル一覧で設定済みフィールドの存在チェックが失敗し、警告表示が機能しない可能性がある。 |
| 詳細 | mobile.jsのフォームレイアウト取得で `kintone.app.getId()` を使用している。 |
| 推奨対応 | `kintone.mobile.app.getId()` を利用する。 |
| ステータス | 未対応（修正保留） |

---
