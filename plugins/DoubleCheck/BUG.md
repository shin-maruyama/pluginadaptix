# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-003 モバイル編集保存時に自レコード除外判定が効かない

| 項目 | 内容 |
|---|---|
| ID | BUG-003 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | 保存処理不具合 |
| 対象ファイル | DoubleCheck/DoubleCheck/contents/js/mobile.js |
| 行 | 81 |
| 影響 | モバイル編集時、自レコードが重複チェック対象から除外されず、既存値のまま保存しても重複エラーになる可能性がある。 |
| 詳細 | mobile submitイベント内でdesktopイベント名 `app.record.edit.submit` を比較している。 |
| 推奨対応 | `mobile.app.record.edit.submit` を判定する。 |
| ステータス | 未対応（修正保留） |

---
