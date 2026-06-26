# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

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
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.js内で `kintone.app.record.setGroupFieldOpen` を使用している。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。 |
| 修正準備状況 | 準備完了 |

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
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: `fieldWrap2` がnullの可能性があるまま `hasAttribute` を呼んでいる。<br>コード上で確認済み: DOM取得結果のnullチェック不足が対象行周辺にある。 |
| 修正準備状況 | 準備完了 |

---
