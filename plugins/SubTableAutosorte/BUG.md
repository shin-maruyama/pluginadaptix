# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

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
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.jsの保存成功・詳細表示・PUTソート処理で `kintone.app.getId()` を使用している。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。 |
| 修正準備状況 | 準備完了 |

---
