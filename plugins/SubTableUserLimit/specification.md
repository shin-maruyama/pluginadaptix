# SubTableUserLimit 詳細仕様書

## 1. プラグイン概要

- 解析日: 2026-06-24
- 対象プラグイン: SubTableUserLimit
- プラグイン名: サブテーブル内ユーザー選択人数制限プラグイン
- バージョン: 2.0.4
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.4 サブテーブル内のユーザー選択フィールドの人数を制限することが出来るプラグインです。
- 解析方針: 元ソースを優先し、難読化済みファイルは生成物・参照確認として扱った。

### コード上で確認できた概要
下記の画面別動作、設定値、API利用内容を参照。

## 2. ファイル構成

- 対象パス: `plugins/SubTableUserLimit`
- 元ソース: `plugins/SubTableUserLimit/SubTableUserLimit`
- 難読化済み版: `plugins/SubTableUserLimit/SubTableUserLimite`
- 解析対象ファイル数: 33
- ファイル種別集計: CSS: 8, HTML: 2, JS: 8, JSON: 2, MD: 7, PNG: 2, PUBKEY: 2, SIGNATURE: 2

### 元ソース主要ファイル
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/51-modern-default.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/config.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/desktop.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/mobile.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/html/config.html`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/image/icon.png`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/js/certification.js`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/manifest.json`
- `plugins/SubTableUserLimit/SubTableUserLimit/PUBKEY`
- `plugins/SubTableUserLimit/SubTableUserLimit/SIGNATURE`

### 難読化済み・生成物として扱うファイル
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/css/51-modern-default.css`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/css/config.css`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/css/desktop.css`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/css/mobile.css`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/html/config.html`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/image/icon.png`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/js/certification.js.obfuscated.js`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/js/config.js.obfuscated.js`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/js/desktop.js.obfuscated.js`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/js/mobile.js.obfuscated.js`
- `plugins/SubTableUserLimit/SubTableUserLimite/contents/manifest.json`
- `plugins/SubTableUserLimit/SubTableUserLimite/PUBKEY`
- `plugins/SubTableUserLimit/SubTableUserLimite/SIGNATURE`

### 保守資料・その他
- `plugins/SubTableUserLimit/codex/handover-2026-06-23.md`
- `plugins/SubTableUserLimit/codex/next-tasks.md`
- `plugins/SubTableUserLimit/codex/test-plan.md`
- `plugins/SubTableUserLimit/codex/troubleshooting.md`
- `plugins/SubTableUserLimit/codex/work-instructions.md`
- `plugins/SubTableUserLimit/decisions/README.md`
- `plugins/SubTableUserLimit/specification.md`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.4
- type: APP
- name.ja: サブテーブル内ユーザー選択人数制限プラグイン
- name.en: User selection limit plugin in subtable
- description.ja: [PluginAdaptiX] v2.0.4 サブテーブル内のユーザー選択フィールドの人数を制限することが出来るプラグインです。
- icon: image/icon.png
- required_params: table, field, limitNumber

### desktop
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/desktop.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: css/desktop.css`

### config
- html: `html/config.html`
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js`
- `js: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/config.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css`
- `css: css/51-modern-default.css`
- `css: css/config.css`

### mobile
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/mobile.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/mobile.css`

### 必要権限
- manifest.json上では個別権限定義は確認できなかった。実行時は利用するkintone REST API、対象アプリ、対象フィールド、対象レコードの権限に依存する。

## 4. 設定画面仕様

コード上で確認できた設定画面構成は以下です。

### 表示項目・ボタン
- テーブルフィールド
- ユーザー選択フィールド
- 制限人数(半角数字)
- キャンセル
- 保存
- placeholder: 制限人数(半角数字)

### HTML/JS連携
- `show`
- `select2`
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`

### 既存仕様書からの補足
コード上で確認できた設定画面項目は以下です。

- テーブルフィールド
- ユーザー選択フィールド
- 制限人数(半角数字)
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. 保存設定値

### 保存キー・保存値
- table: 対象サブテーブル配列
- field: ユーザー選択フィールド配列
- limitNumber: 制限人数配列

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

### 静的解析で確認した設定キー候補
- `field`
- `limitNumber`
- `table`

### 保存方式
- `kintone.plugin.app.getConfig()` による取得を確認した。
- `kintone.plugin.app.setConfig()` による保存を確認した。
- 配列や複数行設定はJSON文字列として保存される実装が多い。詳細な値構造は上記保存キー・保存値を参照。

## 6. PC画面動作仕様

### 6.1 レコード一覧画面
一覧画面表示イベントで初期処理が登録されている。詳細は未確認。

### 6.2 レコード詳細画面
該当イベントは確認できなかった。

### 6.3 レコード追加画面
追加画面の対象ユーザー選択フィールド変更時と保存時に、選択人数が制限を超えないか確認する。

### 6.4 レコード編集画面
編集画面と一覧編集変更時/保存時にも同等の人数制限を行う。

### 6.5 印刷画面
該当イベントは確認できなかった。

## 7. モバイル画面動作仕様

モバイル追加/編集/一覧編集でも同等のイベントが実装されている。

## 8. 使用kintoneイベント

### イベント

- `app.record.create.change.<設定フィールド>`
- `app.record.create.submit`
- `app.record.edit.change.<設定フィールド>`
- `app.record.edit.submit`
- `app.record.index.edit.change.<設定フィールド>`
- `app.record.index.show`
- `mobile.app.record.create.change.<設定フィールド>`
- `mobile.app.record.create.submit`
- `mobile.app.record.edit.change.<設定フィールド>`
- `mobile.app.record.edit.submit`
- `mobile.app.record.index.edit.change.<設定フィールド>`
- `mobile.app.record.index.show`

### 使用関数
- `KNTP800710certification`
- `field`
- `newOptions`
- `table`
- `tableExistingMap`
- `userSelectFieldList`

### 定数
- `$cancelButton`
- `$submit`

### 使用kintone JavaScript API
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`
- `kintone.proxy`
- `kintone.events.on`
- `kintone.app.getId`

補足:
- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. 使用kintone REST API

- 該当なし

### kintone.proxy / 外部通信
- `https://aio-ec.jp/kintoneapi/check_plugin_auth.php?${query}`

補足:
- 上記は元ソースの `kintone.api()` / `kintone.proxy()` 利用箇所から静的に確認した。
- 実行時の権限、レコード件数、ネットワーク状態による挙動は未確認です。

## 10. 使用フィールド

- サブテーブル内USER_SELECTフィールドを対象にする。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

### 設定画面で選択する主な項目
- テーブルフィールド
- ユーザー選択フィールド
- 制限人数(半角数字)
- placeholder: 制限人数(半角数字)

## 11. サブテーブル仕様

サブテーブル内ユーザー選択フィールドの人数制限が主機能。

## 12. 添付ファイル仕様

該当処理は確認できなかった。

## 13. UI仕様

設定画面でテーブルフィールド、ユーザー選択フィールド、制限人数を設定する。

### DOM操作・UI生成処理
- `show`
- `select2`

### 入力チェック
- 設定画面では必須入力、対象フィールドの存在、重複設定などの検証処理があるものを確認した。詳細は各プラグインの設定値とエラー処理を参照。

## 14. CSS仕様

### CSSファイル
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/51-modern-default.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/config.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/desktop.css`
- `plugins/SubTableUserLimit/SubTableUserLimit/contents/css/mobile.css`

### 主なクラス名
- `css`
- `field-container`
- `field-label`
- `field-select`
- `js-cancel-button`
- `js-submit-settings`
- `kintoneplugin-alert`
- `kintoneplugin-button-add-row-image`
- `kintoneplugin-button-dialog-cancel`
- `kintoneplugin-button-dialog-ok`
- `kintoneplugin-button-disabled`
- `kintoneplugin-button-normal`
- `kintoneplugin-button-remove-row-image`
- `kintoneplugin-desc`
- `kintoneplugin-dropdown`
- `kintoneplugin-dropdown-list`
- `kintoneplugin-dropdown-list-item`
- `kintoneplugin-dropdown-list-item-name`
- `kintoneplugin-dropdown-list-item-selected`
- `kintoneplugin-dropdown-outer`
- `kintoneplugin-dropdown-selected`
- `kintoneplugin-dropdown-selected-name`
- `kintoneplugin-input-checkbox-item`
- `kintoneplugin-input-checkbox-item-block`
- `kintoneplugin-input-checkbox-item-inline`
- `kintoneplugin-input-outer`
- `kintoneplugin-input-radio-item`
- `kintoneplugin-input-text`
- `kintoneplugin-label`
- `kintoneplugin-require`
- `kintoneplugin-row`
- `kintoneplugin-select`
- `kintoneplugin-select-outer`
- `kintoneplugin-table`
- `kintoneplugin-table-td-control`
- `kintoneplugin-table-td-control-value`
- `kintoneplugin-table-td-operation`
- `kintoneplugin-table-th`
- `kintoneplugin-table-th-blankspace`
- `kintoneplugin-title`
- `lt-ie9`
- `main-contents`
- `my-popup-class`
- `plugin-space-heading`
- `plugin-space-message`
- `select2`
- `settings`
- `settings-heading`
- `table-container`
- `table-label`
- `table-select`
- `title`

### レイアウト・kintone標準UIとの関係
- `51-modern-default.css` と `kintoneplugin-*` 系クラスを利用する構成を確認した。
- 設定画面CSS、PC画面CSS、モバイルCSSはmanifestの読み込み定義に従って分かれている。
- 視覚確認は未実施のため、実際の表示崩れ有無は未確認です。

## 15. 外部ライブラリ

- `https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css`

### ローカルJS/CSS
- `js/certification.js`
- `js/desktop.js`
- `js/config.js`
- `js/mobile.js`
- `css/51-modern-default.css`
- `css/desktop.css`
- `css/config.css`
- `css/mobile.css`

## 16. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

### エラー表示
- SweetAlert2による通知・警告表示を確認した。
- `event.error` による保存抑止はコード上では確認できなかった。

## 17. 権限・認証仕様

- 認証関数: `KNTP800710certification`
- 製品番号: `KNTP800710`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybo

### 認証関連ファイル
- `contents/js/certification.js` を確認した。

### 権限
- kintone REST APIを利用する機能では、対象アプリ、フォーム、レコード、フィールドへの権限が必要です。
- コード内にAPIキー、トークン、Cookieなどの実値は記載しない運用です。本解析ではファイル内容の引用は行わず、秘密情報の転載を避けています。

## 18. データ保存・取得仕様

`table`、`field`、`limitNumber` をJSON文字列として保存する。

## 19. 既知の制約

- 制限人数は半角数字入力を前提とする。

## 20. 注意事項

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 21. 未確認事項

- 一覧画面表示イベントで初期処理が登録されている。詳細は未確認。
- - 実機での発火順序は未確認です。
- - 詳細なメッセージ一覧は未確認。
- - 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- kintone実機での画面表示、権限差、イベント発火順序は未確認。
- 画像ファイルの視覚的な内容確認は未実施。
- 外部認証APIや外部CDNの現在の応答は未確認。

## 22. 今後の改善候補

- 実機確認結果、権限差、エラー文言一覧を追記する。

## 解析状況

- 解析日: 2026-06-24
- 解析対象ファイル: 33件
- 解析対象外ファイル: node_modules/, dist/, coverage/, playwright-report/, test-results/, .git/, .DS_Store, Thumbs.db
- 元ソース優先: plugins/SubTableUserLimit/SubTableUserLimit
- 難読化済みファイル: plugins/SubTableUserLimit/SubTableUserLimite（参考情報として扱い、直接修正対象外）
- 未確認事項: 実機操作、外部通信の現在の応答、画像の視覚内容、kintone権限差
