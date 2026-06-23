# RecordRockb 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: レコードロック確認プラグイン_テスト
- バージョン: 2.0.2
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.2 別のユーザーが編集中のレコードに対して、エラーを表示して編集が出来ないようにするプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/RecordRockb`
- 調査した元ソース: `plugins/RecordRockb/RecordRockb`
- 難読化済み版: `plugins/RecordRockb/RecordRockbe`
- manifest: `plugins/RecordRockb/RecordRockb/contents/manifest.json`
- 設定HTML: `plugins/RecordRockb/RecordRockb/contents/html/config.html`
- JS:
- `plugins/RecordRockb/RecordRockb/contents/js/certification.js`
- `plugins/RecordRockb/RecordRockb/contents/js/config.js`
- `plugins/RecordRockb/RecordRockb/contents/js/desktop.js`
- `plugins/RecordRockb/RecordRockb/contents/js/mobile.js`
- CSS:
- `plugins/RecordRockb/RecordRockb/contents/css/51-modern-default.css`
- `plugins/RecordRockb/RecordRockb/contents/css/config.css`
- `plugins/RecordRockb/RecordRockb/contents/css/desktop.css`
- `plugins/RecordRockb/RecordRockb/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.2
- type: APP
- icon: image/icon.png
- required_params: fieldCode
- desktop.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
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
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/config.js
- config.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/51-modern-default.css
  - css/config.css
- mobile.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/mobile.js
- mobile.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/mobile.css

## 4. 設定画面仕様

コード上で確認できた設定画面項目は以下です。

- 保存ボタンをクリックするとプラグインが適用されます。
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. プラグイン設定値

- fieldCode: 固定値 `recordLockUserSelect0001`

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

一覧画面表示イベントは登録されているが、主処理は詳細/編集画面側。詳細な一覧処理は未確認。

### 6.2 レコード詳細画面

詳細画面でロック用ユーザー選択フィールドを非表示にする。

### 6.3 レコード追加画面

追加画面でロック用ユーザー選択フィールドを非表示にする。

### 6.4 レコード編集画面

編集画面表示時にレコードを取得し、他ユーザーが編集中の場合はエラー表示して編集を抑止する。編集開始/終了に合わせてロック用フィールドを更新する処理を確認した。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

モバイル詳細/追加/編集画面でも同等のロック処理を行う。

## 7. 使用kintone REST API

- /k/v1/app/form/fields.json
- /k/v1/preview/app/form/fields.json
- /k/v1/record.json

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.edit.submit
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.edit.show
- mobile.app.record.edit.submit
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- `recordLockUserSelect0001` というUSER_SELECTフィールドを利用する。設定画面で存在しない場合はプレビュー環境へフィールド作成APIを呼ぶ。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

## 10. 添付ファイル関連仕様

該当処理は確認できなかった。

## 11. サブテーブル関連仕様

該当処理は確認できなかった。

## 12. 外部ライブラリ

- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP177310certification`
- 製品番号: `KNTP177310`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

ロック状態をレコード内のユーザー選択フィールドへ保存し、`/k/v1/record.json` GET/PUTで確認・更新する。

## 16. UI仕様

設定画面は保存ボタンのみ。実行画面ではロック用フィールドを非表示にする。

## 17. 既知の制約

- フォーム設定反映が必要な可能性がある。
- 同時編集時の競合解決は実機確認が必要。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- ロック解除条件と異常終了時の復旧手順を追記する。
