# CrossAppRecordSync BUG管理

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0012 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0013 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0014 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0015 | Medium | 添付ファイル | 添付ファイル存在確認漏れの可能性 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | 添付ファイル配列の存在確認を追加し、空配列または未設定時は空配列を返すようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0016 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0017 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0018 | Medium | 添付ファイル | 添付ファイル存在確認漏れの可能性 | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | 添付ファイル配列の存在確認を追加し、空配列または未設定時は空配列を返すようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0019 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0020 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
