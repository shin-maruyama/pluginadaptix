# CrossAppRecordSync 障害対応記録

## 記録ルール

障害対応を行った場合は、最新の記録を上に追加します。
APIキー、トークン、Cookie、秘密鍵などの実値は記載しません。

## バグ修正時の必須記録

バグ修正時は以下を必ず記録します。

```md
## 発生条件

## 再現手順

## 原因

## 修正内容

## 再発防止策
```

## 調査・解析ルール

障害調査では、現象を整理してから対象画面、イベント、関数を絞り込みます。
全JS、全CSS、全HTMLの読込や、無関係プラグインの調査は行いません。

調査順序:

1. 現象、発生画面、発生条件、エラーメッセージ、再現手順を記録する。
2. 影響範囲として、一覧画面、詳細画面、編集画面、モバイル、設定画面を確認する。
3. 関連イベントを特定する。
4. 関連関数のみ確認する。
5. 原因仮説を作成する。
6. 必要箇所のみ確認して仮説を検証する。
7. 原因確定後、修正前に原因、修正方針、変更対象を報告する。

原因仮説の例:

```text
値取得失敗
権限不足
APIエラー
フィールドコード変更
DOM変更
```

## 調査結果報告テンプレート

```md
## 調査結果

### 現象

### 原因

### 対象ファイル

### 対象関数

### 修正方針

### 影響範囲
```

## 障害記録テンプレート

### 発生日

YYYY-MM-DD

### 発生事象

- 要記録

### 発生条件

- 要記録

### 再現手順

- 要記録

### 原因

- 要記録

### 調査内容

- 要記録

### 修正内容

- 要記録

### 再発防止策

- 要記録

### 関連ファイル

- 要記録

## 現在の記録

- 2026-06-23: 初期テンプレート作成。障害対応記録はまだありません。

## 2026-06-26 Medium BUG ID: PB-0012

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0013

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0014

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/config.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0015

### 発生事象

添付ファイル存在確認漏れの可能性

### 原因

添付ファイル配列が空または未設定の場合のガードが不足していた。

### 修正内容

添付ファイル配列の存在確認を追加し、空配列または未設定時は空配列を返すようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0016

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0017

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/desktop.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0018

### 発生事象

添付ファイル存在確認漏れの可能性

### 原因

添付ファイル配列が空または未設定の場合のガードが不足していた。

### 修正内容

添付ファイル配列の存在確認を追加し、空配列または未設定時は空配列を返すようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0019

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0020

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/アプリ間レコード同期/CrossAppRecordSync/contents/js/mobile.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。
