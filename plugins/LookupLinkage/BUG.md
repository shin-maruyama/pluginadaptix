# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-004 mobile.jsでアプリID取得にdesktop APIを使用している

| 項目 | 内容 |
|---|---|
| ID | BUG-004 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | LookupLinkage/LookupLinkage/contents/js/mobile.js |
| 行 | 92 |
| 影響 | モバイルでルックアップ設定確認処理が失敗し、以降の連動処理にも影響する可能性がある。 |
| 詳細 | mobile.js内で `kintone.app.getId()` を使用している。 |
| 推奨対応 | `kintone.mobile.app.getId()` に置換する。 |
| ステータス | 未対応（修正保留） |

---

### No.2 2026-24-06 BUG-005 mobile.jsでdesktop用record.getを使用している

| 項目 | 内容 |
|---|---|
| ID | BUG-005 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | LookupLinkage/LookupLinkage/contents/js/mobile.js |
| 行 | 107 |
| 影響 | モバイルのchangeイベントで実行時エラーになり、値連動が止まる可能性が高い。 |
| 詳細 | mobile.js内で `kintone.app.record.get()` を使用している。 |
| 推奨対応 | event.recordを使用するか、mobile用APIへ置換する。 |
| ステータス | 未対応（修正保留） |

---
