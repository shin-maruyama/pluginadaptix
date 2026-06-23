# CharacterLimit 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: 文字制限プラグイン_test
- バージョン: 2.0.4
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.4 指定した文字列1行フィールドに入力できる文字を制限することが出来るプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/CharacterLimit`
- 調査した元ソース: `plugins/CharacterLimit/CharacterLimit`
- 難読化済み版: `plugins/CharacterLimit/CharacterLimite`
- manifest: `plugins/CharacterLimit/CharacterLimit/contents/manifest.json`
- 設定HTML: `plugins/CharacterLimit/CharacterLimit/contents/html/config.html`
- JS:
- `plugins/CharacterLimit/CharacterLimit/contents/js/certification.js`
- `plugins/CharacterLimit/CharacterLimit/contents/js/config.js`
- `plugins/CharacterLimit/CharacterLimit/contents/js/desktop.js`
- `plugins/CharacterLimit/CharacterLimit/contents/js/mobile.js`
- CSS:
- `plugins/CharacterLimit/CharacterLimit/contents/css/51-modern-default.css`
- `plugins/CharacterLimit/CharacterLimit/contents/css/config.css`
- `plugins/CharacterLimit/CharacterLimit/contents/css/desktop.css`
- `plugins/CharacterLimit/CharacterLimit/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.4
- type: APP
- icon: image/icon.png
- required_params: elements
- desktop.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/desktop.js
- desktop.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/51-modern-default.css
  - css/desktop.css
- config.html: html/config.html
- config.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/config.js
- config.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/51-modern-default.css
  - https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
  - css/config.css
- mobile.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/mobile.js
- mobile.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/mobile.css

## 4. 設定画面仕様

コード上で確認できた設定画面項目は以下です。

- 制限フィールド
- 制限文字（許可）
- ひらがな
- カタカナ
- 数字
- 英字
- 記号
- 記号の種類
- 全角/半角変換（カナ・数字・英字）
- 全角
- 半角
- しない
- 大文字/小文字変換（英字）
- 大文字
- 小文字
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. プラグイン設定値

- elements: limitField, permitSymbol, limitChara, raziokaku, raziomoji を含む配列をJSON文字列で保存

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

設定済みフィールドの存在確認を行い、削除/変更されたフィールドがあれば警告する。

### 6.2 レコード詳細画面

該当イベントは確認できなかった。

### 6.3 レコード追加画面

追加画面の対象文字列1行フィールド変更時と保存時に、許可文字種、許可記号、全角/半角変換、大文字/小文字変換を適用する。入力できない文字にはフィールドエラーを設定する。

### 6.4 レコード編集画面

編集画面でも追加画面と同じ文字制限、変換、保存時チェックを行う。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

モバイル追加/編集画面でも同等の変更時・保存時チェックを行う。

## 7. 使用kintone REST API

- /k/v1/app/form/layout.json

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.change.<設定フィールド>
- app.record.create.submit
- app.record.edit.change.<設定フィールド>
- app.record.edit.submit
- app.record.index.show
- mobile.app.record.create.change.<設定フィールド>
- mobile.app.record.create.submit
- mobile.app.record.edit.change.<設定フィールド>
- mobile.app.record.edit.submit
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- 対象はSINGLE_LINE_TEXT。サブテーブル内フィールドは `テーブルコード　フィールドコード` 形式で扱う処理を確認した。

コード上で確認したフィールド抽出処理:

- filterField(fieldList, flg, ...limitFieldType) {
- filterField(fieldList, true, 'SINGLE_LINE_TEXT')

## 10. 添付ファイル関連仕様

該当処理は確認できなかった。

## 11. サブテーブル関連仕様

サブテーブル内の文字列1行フィールドにも入力制限を適用する処理を確認した。

## 12. 外部ライブラリ

- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js
- js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP436810certification`
- 製品番号: `KNTP436810`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

`elements` をJSON文字列として保存し、実行画面で `kintone.plugin.app.getConfig` から読み込む。

## 16. UI仕様

設定画面で制限フィールド、許可文字種、許可記号、全角/半角変換、英字大小文字変換を設定する。

## 17. 既知の制約

- 許可記号の正規表現エスケープはコード上で処理しているが、全記号パターンの実機確認は未確認。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- 許可文字種ごとのテストケースを追加する。
