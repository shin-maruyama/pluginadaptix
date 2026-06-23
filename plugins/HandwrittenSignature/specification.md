# HandwrittenSignature 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: 手書きサインプラグイン_test
- バージョン: 2.0.11
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.11 編集画面で手書きでサインをした内容を画像ファイルとして添付ファイルフィールドに保存することが出来るプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/HandwrittenSignature`
- 調査した元ソース: `plugins/HandwrittenSignature/HandwrittenSignature`
- 難読化済み版: `plugins/HandwrittenSignature/HandwrittenSignaturee`
- manifest: `plugins/HandwrittenSignature/HandwrittenSignature/contents/manifest.json`
- 設定HTML: `plugins/HandwrittenSignature/HandwrittenSignature/contents/html/config.html`
- JS:
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/js/certification.js`
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/js/config.js`
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/js/desktop.js`
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/js/mobile.js`
- CSS:
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/css/51-modern-default.css`
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/css/config.css`
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/css/desktop.css`
- `plugins/HandwrittenSignature/HandwrittenSignature/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.11
- type: APP
- icon: image/icon.png
- required_params: settings
- desktop.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://code.createjs.com/1.0.0/createjs.min.js
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
  - https://code.createjs.com/1.0.0/createjs.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/mobile.js
- mobile.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/mobile.css

## 4. 設定画面仕様

コード上で確認できた設定画面項目は以下です。

- 手書きサインを表示するスペース
- サインを保存する添付ファイル
- サインをした日時を格納するフィールド
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. プラグイン設定値

- settings: space, file, date の配列

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

設定済みフィールドの存在確認を行う。

### 6.2 レコード詳細画面

詳細画面でスペースにサイン表示領域を生成する処理が確認された。

### 6.3 レコード追加画面

追加画面で指定スペースにCreateJSキャンバスを表示し、手書き入力とリセットボタンを提供する。保存成功後に画像をファイルアップロードし添付ファイルへ保存する。

### 6.4 レコード編集画面

編集画面でもキャンバス表示と保存成功後の添付ファイル更新を行う。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

mobile.jsにも同等処理があるが、イベント名がPC版と同じ箇所があり、モバイル実機動作は未確認。

## 7. 使用kintone REST API

- /k/v1/app/form/layout.json
- /k/v1/file.json
- /k/v1/record

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.show
- app.record.create.submit.success
- app.record.detail.show
- app.record.edit.show
- app.record.edit.submit.success
- app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- SPACERを表示場所、FILEを保存先、DATETIMEをサイン日時格納先として利用する。

コード上で確認したフィールド抽出処理:

- filterField(that.fieldList, true, that.fieldTypeDatetime)
- filterField(that.fieldList, true, that.fieldTypeSpace)
- filterField(that.fieldList, true, this.fieldTypeFile)

## 10. 添付ファイル関連仕様

キャンバス画像を `/k/v1/file.json` へアップロードし、返却されたfileKeyを添付ファイルフィールドへ設定する処理を確認した。

## 11. サブテーブル関連仕様

該当処理は確認できなかった。

## 12. 外部ライブラリ

- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
- code.createjs.com/1.0.0/createjs.min.js
- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP341410certification`
- 製品番号: `KNTP341410`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

`settings` をJSON文字列として保存する。保存成功後に `/k/v1/record` PUT で添付ファイル/日時を更新する。

## 16. UI仕様

指定スペースに手書きキャンバスと操作ボタンを生成する。

## 17. 既知の制約

- ファイルアップロードにセッション認証が必要。
- モバイル実機でのイベント発火は未確認。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- キャンバスサイズ、画像形式、保存失敗時の挙動を追記する。
