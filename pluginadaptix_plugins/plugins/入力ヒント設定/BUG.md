# BUG.md

## 解析メモ

- 2026-06-26: bug-management-list.csv は未配置のため、既存 BUG.md のバグ情報を起点に関連ファイル解析と修正準備を実施しました。
- 対象プラグイン配下のファイル一覧、manifest、JS/CSS/HTML、codex文書、難読化版の存在を確認しました。
- 難読化済みファイルは参考扱いとし、修正対象候補は元ソース側に限定しています。

## バグ履歴

### No.1 2026-24-06 BUG-016 空のサブテーブルで存在チェックがTypeErrorになる

| 項目 | 内容 |
|---|---|
| ID | BUG-016 |
| 重大度 | High |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | サブテーブル不具合 |
| 対象ファイル | InputHintSetting/InputHintSetting/contents/js/desktop.js |
| 行 | 64 |
| 影響 | 空のサブテーブルで入力ヒント設定処理が落ちる可能性がある。 |
| 詳細 | サブテーブルの先頭行 `value[0]` が存在する前提で存在チェックしている。 |
| 推奨対応 | 空行時はDOM/フィールド定義ベースで判定する。mobile.jsも同様確認。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: サブテーブルの先頭行 `value[0]` が存在する前提で存在チェックしている。<br>コード上で確認済み: サブテーブルの行存在確認前に value[0] を参照している。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | サブテーブルの値配列が空の場合は存在なしとして扱うガードを追加しました。関連するデバッグログも削除しました。 |
| 修正ファイル | plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js<br>plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js |
| 確認結果 | node --check 成功。空行ガードの静的確認済み。kintone実機確認は未実施。 |

---

### No.2 2026-24-06 BUG-006 mobile.jsのサブテーブル行追加イベントがdesktopイベント名になっている

| 項目 | 内容 |
|---|---|
| ID | BUG-006 |
| 重大度 | Medium |
| 確度 | 高確度 |
| 人間確認 | 不要 |
| 分類 | モバイル不具合 |
| 対象ファイル | InputHintSetting/InputHintSetting/contents/js/mobile.js |
| 行 | 80 |
| 影響 | モバイルでサブテーブル行追加後、追加行に入力ヒントが付与されない。 |
| 詳細 | mobile.js内のテーブル変更イベント登録が `app.record.*` になっている。 |
| 推奨対応 | `mobile.app.record.*` のテーブル変更イベントへ置換する。 |
| ステータス | 修正済み |
| 関連ファイル解析状況 | 解析済み |
| 原因候補 | コード上で確認済み: mobile.js内のテーブル変更イベント登録が `app.record.*` になっている。<br>コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。<br>コード上で確認済み: サブテーブルの行存在確認前に value[0] を参照している。 |
| 修正準備状況 | 準備完了 |
| 修正日 | 2026-26-06 |
| 修正内容 | モバイルのサブテーブル行追加イベントを `mobile.app.record.*` に修正しました。 |
| 修正ファイル | plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js |
| 確認結果 | node --check 成功。モバイルイベント名の静的確認済み。kintone実機確認は未実施。 |

---

## 2026-06-26 Medium潜在バグ修正

| ID | 重大度 | 分類 | 不具合内容 | 対象ファイル | ステータス | 修正日 | 修正内容 | 確認結果 |
|---|---|---|---|---|---|---|---|---|
| PB-0040 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/入力ヒント設定/InputHintSetting/contents/js/config.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0041 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
| PB-0042 | Medium | REST API | kintone REST API呼び出しのエラー処理が近傍で確認できない | plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js | 修正済み・要確認 | 2026-06-26 | kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。 | 対象元ソースJSのnode --check成功。kintone実機/Playwright未実施。 |
