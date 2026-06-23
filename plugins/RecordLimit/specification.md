# RecordLimit 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: レコード数制限プラグイン
- バージョン: 2.0.4
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.4 データの登録件数を制御することが出来るプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/RecordLimit`
- 調査した元ソース: `plugins/RecordLimit/RecordLimit`
- 難読化済み版: `plugins/RecordLimit/RecordLimite`
- manifest: `plugins/RecordLimit/RecordLimit/contents/manifest.json`
- 設定HTML: `plugins/RecordLimit/RecordLimit/contents/html/config.html`
- JS:
- `plugins/RecordLimit/RecordLimit/contents/js/certification.js`
- `plugins/RecordLimit/RecordLimit/contents/js/config.js`
- `plugins/RecordLimit/RecordLimit/contents/js/desktop.js`
- `plugins/RecordLimit/RecordLimit/contents/js/mobile.js`
- CSS:
- `plugins/RecordLimit/RecordLimit/contents/css/51-modern-default.css`
- `plugins/RecordLimit/RecordLimit/contents/css/config.css`
- `plugins/RecordLimit/RecordLimit/contents/css/desktop.css`
- `plugins/RecordLimit/RecordLimit/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.4
- type: APP
- icon: image/icon.png
- required_params: limitNumber
- desktop.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://unpkg.com/popper.js@1
  - https://unpkg.com/tippy.js@5
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
  - https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/config.js
- config.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/51-modern-default.css
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

- レコード制限数(半角数字)
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. プラグイン設定値

- limitNumber: レコード制限数

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

一覧/詳細/追加画面表示時に全レコード数を取得し、上限到達時は追加/再利用導線にツールチップ警告を表示する。一覧削除送信イベントも登録されている。

### 6.2 レコード詳細画面

詳細画面表示時に件数確認を行う。

### 6.3 レコード追加画面

追加画面表示時に上限到達済みならエラーを表示して追加を抑止する。

### 6.4 レコード編集画面

該当イベントは確認できなかった。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

モバイル一覧/詳細/追加画面でも件数確認を行う。

## 7. 使用kintone REST API

- KintoneRestAPIClient.record.getAllRecords

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.show
- app.record.detail.show
- app.record.index.delete.submit
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- kintoneフィールドは直接利用しない。レコード件数のみを参照する。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

## 10. 添付ファイル関連仕様

該当処理は確認できなかった。

## 11. サブテーブル関連仕様

該当処理は確認できなかった。

## 12. 外部ライブラリ

- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
- unpkg.com/popper.js@1
- unpkg.com/tippy.js@5

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP921310certification`
- 製品番号: `KNTP921310`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

`limitNumber` を文字列化した数値として保存する。実行時はKintoneRestAPIClientで全レコードを取得する。

## 16. UI仕様

設定画面でレコード制限数を入力する。PCでは追加/コピー系メニューにtippyで警告を表示する。

## 17. 既知の制約

- 全レコード取得に依存するため大量件数では性能に注意。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- 削除直後の再判定タイミングを実機確認する。
