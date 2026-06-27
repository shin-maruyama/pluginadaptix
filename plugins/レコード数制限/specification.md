# RecordLimit 詳細仕様書

## 1. プラグイン概要

- 解析日: 2026-06-24
- 対象プラグイン: RecordLimit
- プラグイン名: レコード数制限プラグイン
- バージョン: 2.0.4
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.4 データの登録件数を制御することが出来るプラグインです。
- 解析方針: 元ソースを優先し、難読化済みファイルは生成物・参照確認として扱った。

### コード上で確認できた概要
下記の画面別動作、設定値、API利用内容を参照。

## 2. ファイル構成

- 対象パス: `plugins/レコード数制限`
- 元ソース: `plugins/レコード数制限/RecordLimit`
- 難読化済み版: `plugins/レコード数制限/RecordLimite`
- 解析対象ファイル数: 33
- ファイル種別集計: CSS: 8, HTML: 2, JS: 8, JSON: 2, MD: 7, PNG: 2, PUBKEY: 2, SIGNATURE: 2

### 元ソース主要ファイル
- `plugins/レコード数制限/RecordLimit/contents/css/51-modern-default.css`
- `plugins/レコード数制限/RecordLimit/contents/css/config.css`
- `plugins/レコード数制限/RecordLimit/contents/css/desktop.css`
- `plugins/レコード数制限/RecordLimit/contents/css/mobile.css`
- `plugins/レコード数制限/RecordLimit/contents/html/config.html`
- `plugins/レコード数制限/RecordLimit/contents/image/icon.png`
- `plugins/レコード数制限/RecordLimit/contents/js/certification.js`
- `plugins/レコード数制限/RecordLimit/contents/js/config.js`
- `plugins/レコード数制限/RecordLimit/contents/js/desktop.js`
- `plugins/レコード数制限/RecordLimit/contents/js/mobile.js`
- `plugins/レコード数制限/RecordLimit/contents/manifest.json`
- `plugins/レコード数制限/RecordLimit/PUBKEY`
- `plugins/レコード数制限/RecordLimit/SIGNATURE`

### 難読化済み・生成物として扱うファイル
- `plugins/レコード数制限/RecordLimite/contents/css/51-modern-default.css`
- `plugins/レコード数制限/RecordLimite/contents/css/config.css`
- `plugins/レコード数制限/RecordLimite/contents/css/desktop.css`
- `plugins/レコード数制限/RecordLimite/contents/css/mobile.css`
- `plugins/レコード数制限/RecordLimite/contents/html/config.html`
- `plugins/レコード数制限/RecordLimite/contents/image/icon.png`
- `plugins/レコード数制限/RecordLimite/contents/js/certification.obfuscated.js`
- `plugins/レコード数制限/RecordLimite/contents/js/config.obfuscated.js`
- `plugins/レコード数制限/RecordLimite/contents/js/desktop.obfuscated.js`
- `plugins/レコード数制限/RecordLimite/contents/js/mobile.obfuscated.js`
- `plugins/レコード数制限/RecordLimite/contents/manifest.json`
- `plugins/レコード数制限/RecordLimite/PUBKEY`
- `plugins/レコード数制限/RecordLimite/SIGNATURE`

### 保守資料・その他
- `plugins/レコード数制限/codex/handover-2026-06-23.md`
- `plugins/レコード数制限/codex/next-tasks.md`
- `plugins/レコード数制限/codex/test-plan.md`
- `plugins/レコード数制限/codex/troubleshooting.md`
- `plugins/レコード数制限/codex/work-instructions.md`
- `plugins/レコード数制限/decisions/README.md`
- `plugins/レコード数制限/specification.md`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.4
- type: APP
- name.ja: レコード数制限プラグイン
- name.en: Plug-in to limit the number of records
- description.ja: [PluginAdaptiX] v2.0.4 データの登録件数を制御することが出来るプラグインです。
- icon: image/icon.png
- required_params: limitNumber

### desktop
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
- `js: https://unpkg.com/popper.js@1`
- `js: https://unpkg.com/tippy.js@5`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/desktop.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: css/desktop.css`

### config
- html: `html/config.html`
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/config.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: css/config.css`

### mobile
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
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
- レコード制限数(半角数字)
- キャンセル
- 保存

### HTML/JS連携
- `hide`
- `show`
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`

### 既存仕様書からの補足
コード上で確認できた設定画面項目は以下です。

- レコード制限数(半角数字)
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. 保存設定値

### 保存キー・保存値
- limitNumber: レコード制限数

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

### 静的解析で確認した設定キー候補
- `limitNumber`

### 保存方式
- `kintone.plugin.app.getConfig()` による取得を確認した。
- `kintone.plugin.app.setConfig()` による保存を確認した。
- 配列や複数行設定はJSON文字列として保存される実装が多い。詳細な値構造は上記保存キー・保存値を参照。

## 6. PC画面動作仕様

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

## 7. モバイル画面動作仕様

モバイル一覧/詳細/追加画面でも件数確認を行う。

## 8. 使用kintoneイベント

### イベント

- `app.record.create.show`
- `app.record.detail.show`
- `app.record.index.delete.submit`
- `app.record.index.show`
- `mobile.app.record.create.show`
- `mobile.app.record.detail.show`
- `mobile.app.record.index.show`

### 使用関数
- `KNTP921310certification`

### 定数
- 定数名を静的抽出できなかった

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

- kintoneフィールドは直接利用しない。レコード件数のみを参照する。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

### 設定画面で選択する主な項目
- レコード制限数(半角数字)

## 11. サブテーブル仕様

該当処理は確認できなかった。

## 12. 添付ファイル仕様

該当処理は確認できなかった。

## 13. UI仕様

設定画面でレコード制限数を入力する。PCでは追加/コピー系メニューにtippyで警告を表示する。

### DOM操作・UI生成処理
- `hide`
- `show`

### 入力チェック
- 設定画面では必須入力、対象フィールドの存在、重複設定などの検証処理があるものを確認した。詳細は各プラグインの設定値とエラー処理を参照。

## 14. CSS仕様

### CSSファイル
- `plugins/レコード数制限/RecordLimit/contents/css/51-modern-default.css`
- `plugins/レコード数制限/RecordLimit/contents/css/config.css`
- `plugins/レコード数制限/RecordLimit/contents/css/desktop.css`
- `plugins/レコード数制限/RecordLimit/contents/css/mobile.css`

### 主なクラス名
- `css`
- `js-cancel-button`
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
- `plugin-space-heading`
- `plugin-space-message`
- `settings`
- `settings-heading`
- `tippy-tooltip`
- `title`

### レイアウト・kintone標準UIとの関係
- `51-modern-default.css` と `kintoneplugin-*` 系クラスを利用する構成を確認した。
- 設定画面CSS、PC画面CSS、モバイルCSSはmanifestの読み込み定義に従って分かれている。
- 視覚確認は未実施のため、実際の表示崩れ有無は未確認です。

## 15. 外部ライブラリ

- `https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
- `https://unpkg.com/popper.js@1`
- `https://unpkg.com/tippy.js@5`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`

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

- 認証関数: `KNTP921310certification`
- 製品番号: `KNTP921310`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybo

### 認証関連ファイル
- `contents/js/certification.js` を確認した。

### 権限
- kintone REST APIを利用する機能では、対象アプリ、フォーム、レコード、フィールドへの権限が必要です。
- コード内にAPIキー、トークン、Cookieなどの実値は記載しない運用です。本解析ではファイル内容の引用は行わず、秘密情報の転載を避けています。

## 18. データ保存・取得仕様

`limitNumber` を文字列化した数値として保存する。実行時はKintoneRestAPIClientで全レコードを取得する。

## 19. 既知の制約

- 全レコード取得に依存するため大量件数では性能に注意。

## 20. 注意事項

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 21. 未確認事項

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
- 元ソース優先: plugins/レコード数制限/RecordLimit
- 難読化済みファイル: plugins/レコード数制限/RecordLimite（参考情報として扱い、直接修正対象外）
- 未確認事項: 実機操作、外部通信の現在の応答、画像の視覚内容、kintone権限差
