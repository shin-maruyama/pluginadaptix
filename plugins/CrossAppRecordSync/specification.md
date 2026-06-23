# CrossAppRecordSync 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: アプリ間レコード同期プラグイン_test
- バージョン: 2.1.0
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.1.0 同期元アプリのフィールドデータを、同期先アプリのフィールドデータに同期します。レコード単位で同期することが出来ます。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/CrossAppRecordSync`
- 調査した元ソース: `plugins/CrossAppRecordSync/CrossAppRecordSync`
- 難読化済み版: `plugins/CrossAppRecordSync/CrossAppRecordSynce`
- manifest: `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/manifest.json`
- 設定HTML: `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/html/config.html`
- JS:
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/certification.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/config.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/desktop.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/mobile.js`
- CSS:
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/51-modern-default.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/config.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/desktop.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.1.0
- type: APP
- icon: image/icon.png
- required_params: copyDestinationAppId
- desktop.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://js.cybozu.com/spinjs/2.3.2/spin.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.30/encoding.min.js
  - js/certification.js
  - js/desktop.js
- desktop.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/51-modern-default.css
  - css/desktop.css
- config.html: html/config.html
- config.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
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
  - https://js.cybozu.com/spinjs/2.3.2/spin.min.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.30/encoding.min.js
  - js/certification.js
  - js/mobile.js
- mobile.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/mobile.css

## 4. 設定画面仕様

コード上で確認できた設定画面項目は以下です。

- コピー元アプリ
- レコード番号のコピー先フィールド
- 採番する
- 同期タイミング
- 採番フィールド
- 桁数設定
- 一覧画面表示時
- 一覧ボタンクリック時
- 同期条件フィールド
- 同期フィールド
- 上書き許可
- コピー先
- コピー元
- ←
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. プラグイン設定値

- copyDestinationAppId: コピー元アプリ
- recordIdCopyField: レコード番号コピー先フィールド
- timing: 一覧表示時または一覧ボタンクリック時
- isNumberCheck / numberSelect / digit: 採番設定
- conditionField: 同期条件フィールド、条件、比較値
- copyField: コピー先/コピー元フィールド対応
- rewriteField: 上書き許可フィールド

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

一覧画面で設定に応じて自動同期、または「同期」ボタンをヘッダーへ追加して同期する。同期時にコピー元/コピー先レコードを取得し、追加・更新を行う処理を確認した。

### 6.2 レコード詳細画面

該当イベントは確認できなかった。

### 6.3 レコード追加画面

追加画面表示時・変更時に同期関連フィールドの制御やコピー処理を行うイベントが確認された。

### 6.4 レコード編集画面

編集画面表示時・変更時に追加画面と同系統の処理を行う。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

モバイルでも同等のイベント名と同期処理が実装されている。

## 7. 使用kintone REST API

- /k/v1/app/form/fields
- /k/v1/app/form/layout.json
- /k/v1/apps
- KintoneRestAPIClient.record.addAllRecords
- KintoneRestAPIClient.record.getAllRecords
- KintoneRestAPIClient.record.updateAllRecords

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.change.<設定フィールド>
- app.record.create.show
- app.record.edit.change.<設定フィールド>
- app.record.edit.show
- app.record.index.show
- mobile.app.record.create.change.<設定フィールド>
- mobile.app.record.create.show
- mobile.app.record.edit.change.<設定フィールド>
- mobile.app.record.edit.show
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- コピー先/コピー元フィールド、条件フィールド、レコード番号コピー先、採番フィールド、上書き許可フィールドを扱う。フォームフィールドとレイアウトをAPIで取得する。

コード上で確認したフィールド抽出処理:

- filterField(newOption, true, type)
- filterField(obj.filterFieldList, true, sourceFieldType)
- filterField(obj.thatFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE')
- filterField(obj.thatFieldList, true, 'SUBTABLE')
- filterField(obj.thisFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE')

## 10. 添付ファイル関連仕様

ファイル再取得を示す `getNewFileKey` 関数名は確認したが、添付ファイルコピー仕様の詳細は未確認。

## 11. サブテーブル関連仕様

SUBTABLEを含むフィールドリスト取得とサブテーブル行の判定処理を確認した。サブテーブル同期の詳細条件は未確認。

## 12. 外部ライブラリ

- cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.30/encoding.min.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
- js.cybozu.com/spinjs/2.3.2/spin.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP496810certification`
- 製品番号: `KNTP496810`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

同期設定を複数キーで保存し、copyField / conditionField / isNumberCheck はJSON文字列化する。

## 16. UI仕様

設定画面でコピー元アプリ、レコード番号コピー先、採番、同期タイミング、同期条件、上書き許可、コピー先/コピー元対応を設定する。一覧画面に同期ボタンを追加する場合がある。

## 17. 既知の制約

- アプリ一覧とフォーム情報の取得権限が必要。
- 大量レコード同期時の件数・処理時間上限は未確認。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- 同期タイミング別のシーケンス図を作成する。
