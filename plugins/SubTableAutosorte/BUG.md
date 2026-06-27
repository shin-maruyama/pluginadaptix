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
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.jsの保存成功・詳細表示・PUTソート処理で `kintone.app.getId()` を使用している。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | モバイル用appId取得関数を追加し、保存後ソート処理を含むmobile.js内のappId取得を共通化しました。 |
| 修正ファイル | plugins/SubTableAutosorte/SubTableAutosort/contents/js/mobile.js |
| 確認結果 | node --check 成功。mobile appId取得の静的確認済み。kintone実機確認は未実施。 |

---

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0061 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/SubTableAutosorte/SubTableAutosort/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0062 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/SubTableAutosorte/SubTableAutosort/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0063 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/SubTableAutosorte/SubTableAutosort/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0064 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/SubTableAutosorte/SubTableAutosort/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0065 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/SubTableAutosorte/SubTableAutosort/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
