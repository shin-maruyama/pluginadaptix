# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

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
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.js内で `kintone.app.getId()` を使用している。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。 |
| 修正準備状況 | 準備完了 |

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
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.js内で `kintone.app.record.get()` を使用している。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。 |
| 修正準備状況 | 準備完了 |

---
