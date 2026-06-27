# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

## バグ履歴

### No.1 2026-24-06 BUG-025 ブラウザ終了/戻る操作時にロック解除されない可能性がある

| 項目 | 内容 |
|---|---|
| ID | BUG-025 |
| 重大度 | Medium |
| 確度 | 要確認 |
| 人間確認 | 必要 |
| 分類 | 仕様確認 |
| 対象ファイル | RecordRockb/RecordRockb/contents/js/desktop.js |
| 行 | 68 |
| 影響 | ロック用ユーザー選択フィールドに値が残り、他ユーザーが編集できない状態になる可能性がある。 |
| 詳細 | ロック解除はキャンセルボタン押下と編集保存時が中心で、ブラウザ終了、タブクローズ、通信失敗時の解除保証が見えない。 |
| 推奨対応 | 仕様として許容するか、人間判断が必要。解除期限や強制解除運用を検討する。 |
| ステータス | 修正済み・要確認 |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: ロック解除はキャンセルボタン押下と編集保存時が中心で、ブラウザ終了、タブクローズ、通信失敗時の解除保証が見えない。<br>推測: cancelクリック以外の画面離脱では解除APIが呼ばれない可能性がある。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | キャンセル時のロック解除処理を共通化し、ページ離脱時 `pagehide` でも解除処理を呼ぶようにしました。 |
| 修正ファイル | plugins/レコードロック確認/RecordRockb/contents/js/desktop.js |
| 確認結果 | node --check 成功。pagehide登録の静的確認済み。ブラウザ終了時のAPI到達性は実機確認が必要。 |

---

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0046 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/レコードロック確認/RecordRockb/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0047 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/レコードロック確認/RecordRockb/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0048 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/レコードロック確認/RecordRockb/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
