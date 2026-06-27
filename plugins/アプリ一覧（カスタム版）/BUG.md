# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

## バグ履歴

### No.1 2026-24-06 BUG-026 設定保存後にconsole.logが残っている

| 項目 | 内容 |
|---|---|
| ID | BUG-026 |
| 重大度 | Low |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | 品質/ログ |
| 対象ファイル | appList/appList/contents/js/config.js |
| 行 | 1199 |
| 影響 | 機能影響は小さいが、運用時のコンソールノイズになる。 |
| 詳細 | 設定保存処理付近にデバッグログが残っている。 |
| 推奨対応 | 修正フェーズで削除する。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: 設定保存処理付近にデバッグログが残っている。<br>コード上で確認済み: console出力が対象行に残っている。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | 設定保存エラー時のデバッグ `console.log` を削除しました。 |
| 修正ファイル | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js |
| 確認結果 | node --check 成功。対象console.log削除を静的確認済み。 |

---

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0001 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0002 | Medium | DOM | DOM取得失敗時のnull参照リスク | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | DOM取得結果の存在確認を追加し、対象要素が存在しない場合にnull参照しないようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0003 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/アプリ一覧（カスタム版）/appList/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0004 | Medium | DOM | DOM取得失敗時のnull参照リスク | plugins/アプリ一覧（カスタム版）/appList/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | DOM取得結果の存在確認を追加し、対象要素が存在しない場合にnull参照しないようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0005 | Medium | DOM | DOM取得失敗時のnull参照リスク | plugins/アプリ一覧（カスタム版）/appList/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | DOM取得結果の存在確認を追加し、対象要素が存在しない場合にnull参照しないようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
