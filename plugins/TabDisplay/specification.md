# TabDisplay 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: TAB表示プラグイン
- バージョン: 2.0.7
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.7 プラグインで指定したフィールド、グループ、サブテーブルに対してグループ化したものをTABで表示して切り替えることが出来るプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/TabDisplay`
- 調査した元ソース: `plugins/TabDisplay/TabDisplay`
- 難読化済み版: `plugins/TabDisplay/TabDisplaye`
- manifest: `plugins/TabDisplay/TabDisplay/contents/manifest.json`
- 設定HTML: `plugins/TabDisplay/TabDisplay/contents/html/config.html`
- JS:
- `plugins/TabDisplay/TabDisplay/contents/js/certification.js`
- `plugins/TabDisplay/TabDisplay/contents/js/config.js`
- `plugins/TabDisplay/TabDisplay/contents/js/desktop.js`
- `plugins/TabDisplay/TabDisplay/contents/js/mobile.js`
- CSS:
- `plugins/TabDisplay/TabDisplay/contents/css/51-modern-default.css`
- `plugins/TabDisplay/TabDisplay/contents/css/config.css`
- `plugins/TabDisplay/TabDisplay/contents/css/desktop.css`
- `plugins/TabDisplay/TabDisplay/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.7
- type: APP
- icon: image/icon.png
- required_params: settings, spaceFieldId, titleColor, tabWidth
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
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/mobile.js
- mobile.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/mobile.css

## 4. 設定画面仕様

コード上で確認できた設定画面項目は以下です。

- TABタイトル表示スペース選択
- TABタイトル配色
- 白
- 青
- 青 白系
- 黄
- 黄 白系
- 赤
- 赤 白系
- 緑
- 緑 白系
- 橙
- 橙 白系
- TAB表示幅（px）
- 全表示TABタイトルを表示しない
- グループフィールド名を表示しない
- TABタイトル
- グループまたはサブテーブル設定
- フィールド選択
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. プラグイン設定値

- settings: tabName と fields(code/type/id) の配列
- buttonHideChecked: 全表示TABタイトルを表示しない
- fieldNameHideChecked: グループフィールド名を表示しない
- spaceFieldId
- titleColor
- tabWidth

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

### 6.1 レコード一覧画面

設定済みフィールドの存在確認を行う。

### 6.2 レコード詳細画面

詳細画面で指定スペースにTAB UIを生成し、グループ/サブテーブル等をタブ切替表示する。

### 6.3 レコード追加画面

追加画面でもTAB UIを生成し、対象フィールドの表示/非表示を切り替える。

### 6.4 レコード編集画面

編集画面でも同等のTAB表示を行う。

### 6.5 印刷画面

該当イベントは確認できなかった。

### 6.6 モバイル画面

モバイル追加/詳細/編集画面でもTAB UI生成処理が実装されている。

## 7. 使用kintone REST API

- /k/v1/app/form/layout.json

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.edit.show
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- SPACERをTABタイトル表示スペースとして利用し、SPACER/HR/LABEL以外のフィールド、グループ、サブテーブルをタブ対象にする。

コード上で確認したフィールド抽出処理:

- filterField(obj.fieldList, false, 'SPACER', 'HR', 'LABEL')
- filterField(that.fieldList, false, 'SPACER', 'HR', 'LABEL')
- filterField(that.fieldList, true, 'SPACER')

## 10. 添付ファイル関連仕様

添付ファイルフィールドをタブ対象に含められる可能性はあるが、専用処理は確認できなかった。

## 11. サブテーブル関連仕様

サブテーブルをタブ対象にできる。

## 12. 外部ライブラリ

- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
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

- 認証関数: `KNTP930310certification`
- 製品番号: `KNTP930310`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

共通設定と `settings` をJSON文字列として保存する。

## 16. UI仕様

指定スペースへTABタイトルを表示し、クリックで対象フィールド群を切り替える。配色、幅、全表示タブ、フィールド名表示有無を設定する。

## 17. 既知の制約

- kintone DOM構造とフィールド表示APIに依存する。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- グループ内フィールド、関連レコード、モバイルでの表示差分を確認する。
