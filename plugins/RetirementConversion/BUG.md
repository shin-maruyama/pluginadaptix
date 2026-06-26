# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

## バグ履歴

### No.1 2026-24-06 BUG-014 ユーザー一覧100件超過時の再帰呼び出しが未定義関数になっている

| 項目 | 内容 |
|---|---|
| ID | BUG-014 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | API処理不具合 |
| 対象ファイル | RetirementConversion/RetirementConversion/contents/js/desktop.js |
| 行 | 183 |
| 影響 | ユーザー数が100件を超える環境で退職者チェックが途中で失敗する。 |
| 詳細 | メソッド内で `getAllUsers` を直接呼んでいるが、関数スコープに定義されていない。 |
| 推奨対応 | `return total.getAllUsers(offset + 100, users);` のようにメソッド経由で呼ぶ。mobile.jsも同様確認。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: メソッド内で `getAllUsers` を直接呼んでいるが、関数スコープに定義されていない。<br>コード上で確認済み: メソッド内再帰でオブジェクト修飾なしの関数名を呼び出している。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | 100件超過時の再帰呼び出しを `total.getAllUsers(...)` に修正しました。 |
| 修正ファイル | plugins/RetirementConversion/RetirementConversion/contents/js/desktop.js<br>plugins/RetirementConversion/RetirementConversion/contents/js/mobile.js |
| 確認結果 | node --check 成功。再帰呼び出し先の静的確認済み。100件超ユーザー環境での実機確認は未実施。 |

---

### No.2 2026-24-06 BUG-019 空のサブテーブルで存在チェックがTypeErrorになる

| 項目 | 内容 |
|---|---|
| ID | BUG-019 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | サブテーブル不具合 |
| 対象ファイル | RetirementConversion/RetirementConversion/contents/js/desktop.js |
| 行 | 151 |
| 影響 | 空のサブテーブルを含む一覧で退職者チェック処理が落ちる可能性がある。 |
| 詳細 | サブテーブルの先頭行 `value[0]` が存在する前提でユーザー選択フィールドを確認している。 |
| 推奨対応 | 空行時の分岐を追加する。mobile.jsも同様確認。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: サブテーブルの先頭行 `value[0]` が存在する前提でユーザー選択フィールドを確認している。<br>コード上で確認済み: サブテーブルの行存在確認前に value[0] を参照している。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | サブテーブルの値配列が空の場合は存在なしとして扱うガードを追加しました。 |
| 修正ファイル | plugins/RetirementConversion/RetirementConversion/contents/js/desktop.js<br>plugins/RetirementConversion/RetirementConversion/contents/js/mobile.js |
| 確認結果 | node --check 成功。空行ガードの静的確認済み。kintone実機確認は未実施。 |

---

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0049 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0050 | Medium | DOM | DOM取得失敗時のnull参照リスク | plugins/RetirementConversion/RetirementConversion/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | DOM取得結果の存在確認を追加し、対象要素が存在しない場合にnull参照しないようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0051 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0052 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0053 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0054 | Medium | DOM | DOM取得失敗時のnull参照リスク | plugins/RetirementConversion/RetirementConversion/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | DOM取得結果の存在確認を追加し、対象要素が存在しない場合にnull参照しないようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0055 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0056 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0057 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/RetirementConversion/RetirementConversion/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
