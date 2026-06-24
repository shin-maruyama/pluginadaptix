# BUG.md

## バグ履歴

### No.1 2026-24-06 BUG-007 mobile.jsでdesktop用グループ開閉APIを使用している

| 項目 | 内容 |
|---|---|
| ID | BUG-007 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | TabDisplay/TabDisplay/contents/js/mobile.js |
| 行 | 66 |
| 影響 | モバイルでグループを含む設定時に実行時エラーとなり、タブ表示全体が止まる可能性がある。 |
| 詳細 | mobile.js内で `kintone.app.record.setGroupFieldOpen` を使用している。 |
| 推奨対応 | mobileでサポートされるAPIの有無を確認し、未対応ならモバイルでは該当処理をスキップする。 |
| ステータス | 未対応（修正保留） |

---

### No.2 2026-24-06 BUG-013 desktop.jsでDOM取得結果のnullチェックが不足している

| 項目 | 内容 |
|---|---|
| ID | BUG-013 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | DOM不具合 |
| 対象ファイル | TabDisplay/TabDisplay/contents/js/desktop.js |
| 行 | 82 |
| 影響 | 対象フィールドDOMが存在しない条件でタブ表示処理が停止する。 |
| 詳細 | `fieldWrap2` がnullの可能性があるまま `hasAttribute` を呼んでいる。 |
| 推奨対応 | DOM取得結果のnullチェックを追加する。 |
| ステータス | 未対応（修正保留） |

---
