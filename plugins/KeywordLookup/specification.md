# KeywordLookup 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: キーワードルックアッププラグイン
- バージョン: 2.0.8
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.8 プラグインで指定した条件に当てはまったデータがある場合、プラグインで指定したフィールドのデータをコピーするプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/KeywordLookup`
- 調査した元ソース: `plugins/KeywordLookup/KeywordLookup`
- 難読化済み版: `plugins/KeywordLookup/KeywordLookupe`
- manifest: `plugins/KeywordLookup/KeywordLookup/contents/manifest.json`
- 設定HTML: `plugins/KeywordLookup/KeywordLookup/contents/html/config.html`
- JS:
- `plugins/KeywordLookup/KeywordLookup/contents/js/certification.js`
- `plugins/KeywordLookup/KeywordLookup/contents/js/config.js`
- `plugins/KeywordLookup/KeywordLookup/contents/js/desktop.js`
- `plugins/KeywordLookup/KeywordLookup/contents/js/mobile.js`
- CSS:
- `plugins/KeywordLookup/KeywordLookup/contents/css/51-modern-default.css`
- `plugins/KeywordLookup/KeywordLookup/contents/css/config.css`
- `plugins/KeywordLookup/KeywordLookup/contents/css/desktop.css`
- `plugins/KeywordLookup/KeywordLookup/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.8
- type: APP
- icon: image/icon.png
- required_params: settings
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

- 関連付けるアプリ
- ※検索ワードは1つでも可、複数の場合、AND検索
- 入力フィールド
- 検索先フィールド
- =
- フィールドのコピー
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

- settings: appId, inputFieldCode1-3, searchFieldCode1-3, copyFieldList(destinationField/sourceField) の配列

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

設定済みフィールドの存在確認を行う。

### 6.2 レコード詳細画面

該当イベントは確認できなかった。

### 6.3 レコード追加画面

追加画面表示時および入力フィールド変更時に、関連アプリのレコードを検索し、条件に一致したレコードのフィールド値をコピー先へ反映する。

### 6.4 レコード編集画面

編集画面でも同等の検索/コピー処理を行う。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

モバイルでも同等のイベントと検索/コピー処理が実装されている。

## 7. 使用kintone REST API

- /k/v1/app/form/layout.json
- KintoneRestAPIClient.app.getApps
- KintoneRestAPIClient.app.getFormLayout
- KintoneRestAPIClient.record.getAllRecords

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

- 最大3組の入力フィールド/検索先フィールドをAND条件として扱う。コピー先/コピー元フィールド対応を複数設定する。USER_SELECT同士の比較処理を確認した。

コード上で確認したフィールド抽出処理:

- filterField(fieldList, false, ...obj.copyFieldTypeList)
- filterField(fieldList, true, ...obj.searchFieldTypeList)
- filterField(ilist, false, ...obj.copyFieldTypeList)
- filterField(ilist, true, ...obj.searchFieldTypeList)
- filterField(list4, true, type1)
- filterField(list5, true, type2)
- filterField(list6, true, type3)
- filterField(newOptions, true, type)

## 10. 添付ファイル関連仕様

コピー対象に添付ファイルを含められるかは未確認。専用のファイルAPI処理は確認できなかった。

## 11. サブテーブル関連仕様

入力側またはコピー先/コピー元がサブテーブル内の場合の分岐処理を確認した。

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

- 認証関数: `KNTP679310certification`
- 製品番号: `KNTP679310`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

`settings` をJSON文字列として保存する。関連アプリ一覧とフォームレイアウト、全レコードを取得して利用する。

## 16. UI仕様

設定画面で関連付けるアプリ、最大3つの検索条件、コピー先/コピー元フィールドを設定する。

## 17. 既知の制約

- 関連アプリの閲覧権限が必要。
- 関連アプリ全レコード取得のため件数が多い場合の性能に注意。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- 検索条件と複数一致時の扱いを実機で確認する。
