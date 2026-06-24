# CrossAppRecordSync 詳細仕様書

## 1. プラグイン概要

- 解析日: 2026-06-24
- 対象プラグイン: CrossAppRecordSync
- プラグイン名: アプリ間レコード同期プラグイン_test
- バージョン: 2.1.0
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.1.0 同期元アプリのフィールドデータを、同期先アプリのフィールドデータに同期します。レコード単位で同期することが出来ます。
- 解析方針: 元ソースを優先し、難読化済みファイルは生成物・参照確認として扱った。

### コード上で確認できた概要
下記の画面別動作、設定値、API利用内容を参照。

## 2. ファイル構成

- 対象パス: `plugins/CrossAppRecordSync`
- 元ソース: `plugins/CrossAppRecordSync/CrossAppRecordSync`
- 難読化済み版: `plugins/CrossAppRecordSync/CrossAppRecordSynce`
- 解析対象ファイル数: 33
- ファイル種別集計: CSS: 8, HTML: 2, JS: 8, JSON: 2, MD: 7, PNG: 2, PUBKEY: 2, SIGNATURE: 2

### 元ソース主要ファイル
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/51-modern-default.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/config.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/desktop.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/mobile.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/html/config.html`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/image/icon.png`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/certification.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/config.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/desktop.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/js/mobile.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/manifest.json`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/PUBKEY`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/SIGNATURE`

### 難読化済み・生成物として扱うファイル
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/css/51-modern-default.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/css/config.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/css/desktop.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/css/mobile.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/html/config.html`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/image/icon.png`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/js/certification.js.obfuscated.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/js/config.js.obfuscated.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/js/desktop.js.obfuscated.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/js/mobile.js.obfuscated.js`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/contents/manifest.json`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/PUBKEY`
- `plugins/CrossAppRecordSync/CrossAppRecordSynce/SIGNATURE`

### 保守資料・その他
- `plugins/CrossAppRecordSync/codex/handover-2026-06-23.md`
- `plugins/CrossAppRecordSync/codex/next-tasks.md`
- `plugins/CrossAppRecordSync/codex/test-plan.md`
- `plugins/CrossAppRecordSync/codex/troubleshooting.md`
- `plugins/CrossAppRecordSync/codex/work-instructions.md`
- `plugins/CrossAppRecordSync/decisions/README.md`
- `plugins/CrossAppRecordSync/specification.md`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.1.0
- type: APP
- name.ja: アプリ間レコード同期プラグイン_test
- name.en: CrossAppRecordSync
- description.ja: [PluginAdaptiX] v2.1.0 同期元アプリのフィールドデータを、同期先アプリのフィールドデータに同期します。レコード単位で同期することが出来ます。
- icon: image/icon.png
- required_params: copyDestinationAppId

### desktop
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
- `js: https://js.cybozu.com/spinjs/2.3.2/spin.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.30/encoding.min.js`
- `js: js/certification.js`
- `js: js/desktop.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/51-modern-default.css`
- `css: css/desktop.css`

### config
- html: `html/config.html`
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
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
- `js: https://js.cybozu.com/spinjs/2.3.2/spin.min.js`
- `js: https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.30/encoding.min.js`
- `js: js/certification.js`
- `js: js/mobile.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/mobile.css`

### 必要権限
- manifest.json上では個別権限定義は確認できなかった。実行時は利用するkintone REST API、対象アプリ、対象フィールド、対象レコードの権限に依存する。

## 4. 設定画面仕様

コード上で確認できた設定画面構成は以下です。

### 表示項目・ボタン
- 採番する
- 一覧画面表示時
- 一覧ボタンクリック時
- =
- ←
- キャンセル
- 保存

### HTML/JS連携
- `querySelector`
- `getElementById`
- `createElement`
- `appendChild`
- `hide`
- `show`
- `select2`
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`

### 既存仕様書からの補足
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

## 5. 保存設定値

### 保存キー・保存値
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

### 静的解析で確認した設定キー候補
- `copyDestinationAppId`

### 保存方式
- `kintone.plugin.app.getConfig()` による取得を確認した。
- `kintone.plugin.app.setConfig()` による保存を確認した。
- 配列や複数行設定はJSON文字列として保存される実装が多い。詳細な値構造は上記保存キー・保存値を参照。

## 6. PC画面動作仕様

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

## 7. モバイル画面動作仕様

モバイルでも同等のイベント名と同期処理が実装されている。

## 8. 使用kintoneイベント

### イベント

- `app.record.create.change.<設定フィールド>`
- `app.record.create.show`
- `app.record.edit.change.<設定フィールド>`
- `app.record.edit.show`
- `app.record.index.show`
- `mobile.app.record.create.change.<設定フィールド>`
- `mobile.app.record.create.show`
- `mobile.app.record.edit.change.<設定フィールド>`
- `mobile.app.record.edit.show`
- `mobile.app.record.index.show`

### 使用関数
- `KNTP496810certification`
- `app`
- `array`
- `createDataUriFromString`
- `destination`
- `displayAlert`
- `exists`
- `fieldList`
- `getAppList`
- `getFieldList`
- `getNewFileKey`
- `inTarget`
- `newOption`
- `newOptions1`
- `newOptions2`
- `newOptions3`
- `options`
- `outputCSV`
- `r`
- `rewriteField`
- `source`
- `target`
- `targetRecord`
- `userNames`

### 定数
- `$area`
- `$cSelect`
- `$clone`
- `$cond`
- `$dselect`
- `$mainContent`
- `$option`

### 使用kintone JavaScript API
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`
- `kintone.api`
- `kintone.api.url`
- `kintone.proxy`
- `kintone.events.on`
- `kintone.app.getId`
- `kintone.app.getHeaderMenuSpaceElement`

補足:
- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. 使用kintone REST API

- `/k/v1/app/form/fields`
- `/k/v1/app/form/layout.json`
- `/k/v1/apps`

### kintone.proxy / 外部通信
- `https://aio-ec.jp/kintoneapi/check_plugin_auth.php?${query}`

補足:
- 上記は元ソースの `kintone.api()` / `kintone.proxy()` 利用箇所から静的に確認した。
- 実行時の権限、レコード件数、ネットワーク状態による挙動は未確認です。

## 10. 使用フィールド

- コピー先/コピー元フィールド、条件フィールド、レコード番号コピー先、採番フィールド、上書き許可フィールドを扱う。フォームフィールドとレイアウトをAPIで取得する。

コード上で確認したフィールド抽出処理:

- filterField(newOption, true, type)
- filterField(obj.filterFieldList, true, sourceFieldType)
- filterField(obj.thatFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE')
- filterField(obj.thatFieldList, true, 'SUBTABLE')
- filterField(obj.thisFieldList, false, 'HR', 'LABEL', 'SPACER', 'REFERENCE_TABLE', 'GROUP', 'SUBTABLE')

### 設定画面で選択する主な項目
- 採番する
- 一覧画面表示時
- 一覧ボタンクリック時
- =
- ←

## 11. サブテーブル仕様

SUBTABLEを含むフィールドリスト取得とサブテーブル行の判定処理を確認した。サブテーブル同期の詳細条件は未確認。

## 12. 添付ファイル仕様

ファイル再取得を示す `getNewFileKey` 関数名は確認したが、添付ファイルコピー仕様の詳細は未確認。

## 13. UI仕様

設定画面でコピー元アプリ、レコード番号コピー先、採番、同期タイミング、同期条件、上書き許可、コピー先/コピー元対応を設定する。一覧画面に同期ボタンを追加する場合がある。

### DOM操作・UI生成処理
- `querySelector`
- `getElementById`
- `createElement`
- `appendChild`
- `hide`
- `show`
- `select2`

### 入力チェック
- 設定画面では必須入力、対象フィールドの存在、重複設定などの検証処理があるものを確認した。詳細は各プラグインの設定値とエラー処理を参照。

## 14. CSS仕様

### CSSファイル
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/51-modern-default.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/config.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/desktop.css`
- `plugins/CrossAppRecordSync/CrossAppRecordSync/contents/css/mobile.css`

### 主なクラス名
- `add-condition-row`
- `add-field-row`
- `add-row`
- `app-select`
- `arrow`
- `blank-area`
- `cond-container`
- `copy-cond`
- `copy-condition-contents`
- `copy-condition-contents-row`
- `copy-condition-destination-field`
- `copy-condition-source-field`
- `copy-container`
- `copy-contents`
- `copy-contents-row`
- `copy-destination-field`
- `copy-source-field`
- `css`
- `digit`
- `equal`
- `inline-container`
- `isNumber`
- `item-name`
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
- `left-container`
- `left-label`
- `lt-ie9`
- `main-contents`
- `my-popup-class`
- `number-select`
- `plugin-space-heading`
- `plugin-space-message`
- `recordId-copy-field`
- `remove-condition-row`
- `remove-field-row`
- `remove-row`
- `rewrite-select`
- `right-container`
- `right-label`
- `select2`
- `settings`
- `settings-heading`
- `timing-select`
- `title`

### レイアウト・kintone標準UIとの関係
- `51-modern-default.css` と `kintoneplugin-*` 系クラスを利用する構成を確認した。
- 設定画面CSS、PC画面CSS、モバイルCSSはmanifestの読み込み定義に従って分かれている。
- 視覚確認は未実施のため、実際の表示崩れ有無は未確認です。

## 15. 外部ライブラリ

- `https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js`
- `https://js.cybozu.com/spinjs/2.3.2/spin.min.js`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.30/encoding.min.js`
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

- 認証関数: `KNTP496810certification`
- 製品番号: `KNTP496810`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybo

### 認証関連ファイル
- `contents/js/certification.js` を確認した。

### 権限
- kintone REST APIを利用する機能では、対象アプリ、フォーム、レコード、フィールドへの権限が必要です。
- コード内にAPIキー、トークン、Cookieなどの実値は記載しない運用です。本解析ではファイル内容の引用は行わず、秘密情報の転載を避けています。

## 18. データ保存・取得仕様

同期設定を複数キーで保存し、copyField / conditionField / isNumberCheck はJSON文字列化する。

## 19. 既知の制約

- アプリ一覧とフォーム情報の取得権限が必要。
- 大量レコード同期時の件数・処理時間上限は未確認。

## 20. 注意事項

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 21. 未確認事項

- - 実機での発火順序は未確認です。
- ファイル再取得を示す `getNewFileKey` 関数名は確認したが、添付ファイルコピー仕様の詳細は未確認。
- SUBTABLEを含むフィールドリスト取得とサブテーブル行の判定処理を確認した。サブテーブル同期の詳細条件は未確認。
- - 詳細なメッセージ一覧は未確認。
- - 大量レコード同期時の件数・処理時間上限は未確認。
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
- 元ソース優先: plugins/CrossAppRecordSync/CrossAppRecordSync
- 難読化済みファイル: plugins/CrossAppRecordSync/CrossAppRecordSynce（参考情報として扱い、直接修正対象外）
- 未確認事項: 実機操作、外部通信の現在の応答、画像の視覚内容、kintone権限差
