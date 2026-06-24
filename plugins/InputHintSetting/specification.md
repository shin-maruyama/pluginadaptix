# InputHintSetting 詳細仕様書

## 1. プラグイン概要

- 解析日: 2026-06-24
- 対象プラグイン: InputHintSetting
- プラグイン名: 入力ヒント設定プラグイン
- バージョン: 2.0.6
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.6 各フィールドにマウスオーバーした時、プラグインで設定したヒントが表示されます。
- 解析方針: 元ソースを優先し、難読化済みファイルは生成物・参照確認として扱った。

### コード上で確認できた概要
下記の画面別動作、設定値、API利用内容を参照。

## 2. ファイル構成

- 対象パス: `plugins/InputHintSetting`
- 元ソース: `plugins/InputHintSetting/InputHintSetting`
- 難読化済み版: `plugins/InputHintSetting/InputHintSettinge`
- 解析対象ファイル数: 33
- ファイル種別集計: CSS: 8, HTML: 2, JS: 8, JSON: 2, MD: 7, PNG: 2, PUBKEY: 2, SIGNATURE: 2

### 元ソース主要ファイル
- `plugins/InputHintSetting/InputHintSetting/contents/css/51-modern-default.css`
- `plugins/InputHintSetting/InputHintSetting/contents/css/config.css`
- `plugins/InputHintSetting/InputHintSetting/contents/css/desktop.css`
- `plugins/InputHintSetting/InputHintSetting/contents/css/mobile.css`
- `plugins/InputHintSetting/InputHintSetting/contents/html/config.html`
- `plugins/InputHintSetting/InputHintSetting/contents/image/icon.png`
- `plugins/InputHintSetting/InputHintSetting/contents/js/certification.js`
- `plugins/InputHintSetting/InputHintSetting/contents/js/config.js`
- `plugins/InputHintSetting/InputHintSetting/contents/js/desktop.js`
- `plugins/InputHintSetting/InputHintSetting/contents/js/mobile.js`
- `plugins/InputHintSetting/InputHintSetting/contents/manifest.json`
- `plugins/InputHintSetting/InputHintSetting/PUBKEY`
- `plugins/InputHintSetting/InputHintSetting/SIGNATURE`

### 難読化済み・生成物として扱うファイル
- `plugins/InputHintSetting/InputHintSettinge/contents/css/51-modern-default.css`
- `plugins/InputHintSetting/InputHintSettinge/contents/css/config.css`
- `plugins/InputHintSetting/InputHintSettinge/contents/css/desktop.css`
- `plugins/InputHintSetting/InputHintSettinge/contents/css/mobile.css`
- `plugins/InputHintSetting/InputHintSettinge/contents/html/config.html`
- `plugins/InputHintSetting/InputHintSettinge/contents/image/icon.png`
- `plugins/InputHintSetting/InputHintSettinge/contents/js/certification.js.obfuscated.js`
- `plugins/InputHintSetting/InputHintSettinge/contents/js/config.js.obfuscated.js`
- `plugins/InputHintSetting/InputHintSettinge/contents/js/desktop.js.obfuscated.js`
- `plugins/InputHintSetting/InputHintSettinge/contents/js/mobile.js.obfuscated.js`
- `plugins/InputHintSetting/InputHintSettinge/contents/manifest.json`
- `plugins/InputHintSetting/InputHintSettinge/PUBKEY`
- `plugins/InputHintSetting/InputHintSettinge/SIGNATURE`

### 保守資料・その他
- `plugins/InputHintSetting/codex/handover-2026-06-23.md`
- `plugins/InputHintSetting/codex/next-tasks.md`
- `plugins/InputHintSetting/codex/test-plan.md`
- `plugins/InputHintSetting/codex/troubleshooting.md`
- `plugins/InputHintSetting/codex/work-instructions.md`
- `plugins/InputHintSetting/decisions/README.md`
- `plugins/InputHintSetting/specification.md`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.6
- type: APP
- name.ja: 入力ヒント設定プラグイン
- name.en: Input hint setting plug-in
- description.ja: [PluginAdaptiX] v2.0.6 各フィールドにマウスオーバーした時、プラグインで設定したヒントが表示されます。
- icon: image/icon.png
- required_params: settings

### desktop
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://unpkg.com/@popperjs/core@2`
- `js: https://unpkg.com/tippy.js@6`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/desktop.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: css/desktop.css`

### config
- html: `html/config.html`
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js`
- `js: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js`
- `js: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: js/certification.js`
- `js: js/config.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css`
- `css: css/config.css`

### mobile
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: https://unpkg.com/@popperjs/core@2`
- `js: https://unpkg.com/tippy.js@6`
- `js: js/certification.js`
- `js: js/mobile.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: css/mobile.css`

### 必要権限
- manifest.json上では個別権限定義は確認できなかった。実行時は利用するkintone REST API、対象アプリ、対象フィールド、対象レコードの権限に依存する。

## 4. 設定画面仕様

コード上で確認できた設定画面構成は以下です。

### 表示項目・ボタン
- ヒント設定フィールド
- ヒント文字列
- キャンセル
- 保存

### HTML/JS連携
- `querySelector`
- `querySelectorAll`
- `show`
- `select2`
- `sortable`
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`

### 既存仕様書からの補足
コード上で確認できた設定画面項目は以下です。

- ヒント設定フィールド
- ヒント文字列
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. 保存設定値

### 保存キー・保存値
- settings: tipSettingField(code/id), tipString の配列

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

### 静的解析で確認した設定キー候補
- `settings`

### 保存方式
- `kintone.plugin.app.getConfig()` による取得を確認した。
- `kintone.plugin.app.setConfig()` による保存を確認した。
- 配列や複数行設定はJSON文字列として保存される実装が多い。詳細な値構造は上記保存キー・保存値を参照。

## 6. PC画面動作仕様

### 6.1 レコード一覧画面
設定済みフィールドの存在確認を行う。

### 6.2 レコード詳細画面
該当イベントは確認できなかった。

### 6.3 レコード追加画面
追加画面で対象フィールドにtippy.jsのヒントを設定する。サブテーブル行変更時にも再設定する処理を確認した。

### 6.4 レコード編集画面
編集画面でも同等のヒント表示を行う。

### 6.5 印刷画面
該当イベントは確認できなかった。

## 7. モバイル画面動作仕様

モバイル追加/編集画面でも同等のヒント設定イベントが実装されている。

## 8. 使用kintoneイベント

### イベント

- `app.record.create.change.<設定フィールド>`
- `app.record.create.show`
- `app.record.edit.change.<設定フィールド>`
- `app.record.edit.show`
- `app.record.index.show`
- `mobile.app.record.create.show`
- `mobile.app.record.edit.show`
- `mobile.app.record.index.show`

### 使用関数
- `KNTP433610certification`
- `inTarget`
- `newOptions`
- `result`
- `target`

### 定数
- `$clone`
- `$mainContent`
- `$noneOption`
- `$option`

### 使用kintone JavaScript API
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`
- `kintone.api`
- `kintone.api.url`
- `kintone.proxy`
- `kintone.events.on`
- `kintone.app.getId`

補足:
- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. 使用kintone REST API

- `/k/v1/app/form/layout.json`

### kintone.proxy / 外部通信
- `https://aio-ec.jp/kintoneapi/check_plugin_auth.php?${query}`

補足:
- 上記は元ソースの `kintone.api()` / `kintone.proxy()` 利用箇所から静的に確認した。
- 実行時の権限、レコード件数、ネットワーク状態による挙動は未確認です。

## 10. 使用フィールド

- フィールドIDとフィールドコードを保存し、DOMセレクタ `.field-<id>` / `.value-<id>` に対してヒントを設定する。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

### 設定画面で選択する主な項目
- ヒント設定フィールド
- ヒント文字列

## 11. サブテーブル仕様

サブテーブル内フィールドにもヒントを設定する処理を確認した。

## 12. 添付ファイル仕様

該当処理は確認できなかった。

## 13. UI仕様

設定画面で対象フィールドとヒント文字列を設定する。実行画面ではマウスオーバー等でツールチップを表示する。

### DOM操作・UI生成処理
- `querySelector`
- `querySelectorAll`
- `show`
- `select2`
- `sortable`

### 入力チェック
- 設定画面では必須入力、対象フィールドの存在、重複設定などの検証処理があるものを確認した。詳細は各プラグインの設定値とエラー処理を参照。

## 14. CSS仕様

### CSSファイル
- `plugins/InputHintSetting/InputHintSetting/contents/css/51-modern-default.css`
- `plugins/InputHintSetting/InputHintSetting/contents/css/config.css`
- `plugins/InputHintSetting/InputHintSetting/contents/css/desktop.css`
- `plugins/InputHintSetting/InputHintSetting/contents/css/mobile.css`

### 主なクラス名
- `add-row`
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
- `my-popup-class`
- `plugin-space-heading`
- `plugin-space-message`
- `remove-row`
- `select2`
- `settings`
- `settings-heading`
- `tip-container`
- `tip-setting-field`
- `tip-string`
- `title`

### レイアウト・kintone標準UIとの関係
- `51-modern-default.css` と `kintoneplugin-*` 系クラスを利用する構成を確認した。
- 設定画面CSS、PC画面CSS、モバイルCSSはmanifestの読み込み定義に従って分かれている。
- 視覚確認は未実施のため、実際の表示崩れ有無は未確認です。

## 15. 外部ライブラリ

- `https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `https://unpkg.com/@popperjs/core@2`
- `https://unpkg.com/tippy.js@6`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js`
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

- 認証関数: `KNTP433610certification`
- 製品番号: `KNTP433610`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybo

### 認証関連ファイル
- `contents/js/certification.js` を確認した。

### 権限
- kintone REST APIを利用する機能では、対象アプリ、フォーム、レコード、フィールドへの権限が必要です。
- コード内にAPIキー、トークン、Cookieなどの実値は記載しない運用です。本解析ではファイル内容の引用は行わず、秘密情報の転載を避けています。

## 18. データ保存・取得仕様

`settings` をJSON文字列として保存する。

## 19. 既知の制約

- 表示はtippy.jsとkintone DOM構造に依存する。

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
- 元ソース優先: plugins/InputHintSetting/InputHintSetting
- 難読化済みファイル: plugins/InputHintSetting/InputHintSettinge（参考情報として扱い、直接修正対象外）
- 未確認事項: 実機操作、外部通信の現在の応答、画像の視覚内容、kintone権限差
