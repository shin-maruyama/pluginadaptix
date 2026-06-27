# FieldHidden 障害対応記録

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

## 2026-26-06 BUG ID: BUG-011

### 発生事象

DOM取得失敗時にnullへhasAttributeを呼ぶ

### 原因

`document.querySelector` の結果がnullでも `hasAttribute` を呼んでいた。

### 修正内容

DOM取得結果がnullの場合は関連属性判定をスキップするガードを追加しました。

### 修正ファイル

- plugins/非表示/FieldHidden/contents/js/desktop.js

### 確認結果

node --check 成功。DOM nullガードの静的確認済み。kintone実機確認は未実施。

### 再発防止策

- mobile.jsでは mobile.app.record 系イベントと kintone.mobile.app 系APIを優先して確認する。
- DOM、サブテーブル、設定値、API呼び出しは存在確認を行ってから参照する。
- リリース前に対象ファイルの console 残置と構文エラーを確認する。

## 2026-26-06 BUG ID: BUG-012

### 発生事象

関連属性の該当設定がない場合にfields参照で落ちる

### 原因

`find()` の戻り値を確認せず `getAttributeTarget.fields` を参照していた。

### 修正内容

関連属性の該当設定がない場合に `fields` 参照を行わない存在確認を追加しました。

### 修正ファイル

- plugins/非表示/FieldHidden/contents/js/desktop.js

### 確認結果

node --check 成功。`getAttributeTarget` と `fields` の存在確認を静的確認済み。kintone実機確認は未実施。

### 再発防止策

- mobile.jsでは mobile.app.record 系イベントと kintone.mobile.app 系APIを優先して確認する。
- DOM、サブテーブル、設定値、API呼び出しは存在確認を行ってから参照する。
- リリース前に対象ファイルの console 残置と構文エラーを確認する。

## 2026-26-06 BUG ID: BUG-022

### 発生事象

設定未保存/破損時にJSON.parseでロード失敗する

### 原因

設定値存在確認やtry/catchなしで `config.elementArray` をJSON.parseしていた。

### 修正内容

設定値 `elementArray` の存在確認とJSON.parse失敗時の安全な空配列フォールバックを追加しました。

### 修正ファイル

- plugins/非表示/FieldHidden/contents/js/desktop.js
- plugins/非表示/FieldHidden/contents/js/mobile.js

### 確認結果

node --check 成功。設定未保存/破損時のロード停止回避を静的確認済み。kintone実機確認は未実施。

### 再発防止策

- mobile.jsでは mobile.app.record 系イベントと kintone.mobile.app 系APIを優先して確認する。
- DOM、サブテーブル、設定値、API呼び出しは存在確認を行ってから参照する。
- リリース前に対象ファイルの console 残置と構文エラーを確認する。

## 現在の記録

- 2026-06-23: 初期テンプレート作成。障害対応記録はまだありません。

## 2026-06-26 Medium BUG ID: PB-0027

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/非表示/FieldHidden/contents/js/config.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0028

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/非表示/FieldHidden/contents/js/desktop.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。

## 2026-06-26 Medium BUG ID: PB-0029

### 発生事象

kintone REST API呼び出しのエラー処理が近傍で確認できない

### 原因

kintone.api呼び出しでAPI失敗時のcatch処理が不足していた。

### 修正内容

kintone REST API呼び出しをローカルのcallKintoneApiラッパー経由に変更し、API失敗時にエラー通知して再throwするようにした。

### 修正ファイル

plugins/非表示/FieldHidden/contents/js/mobile.js

### 確認結果

対象元ソースJSのnode --check成功。kintone実機/Playwright確認は未実施。

### 再発防止策

REST API、DOM、添付ファイルを扱う箇所では、エラー処理と存在確認を追加してからリリース前確認を行う。
