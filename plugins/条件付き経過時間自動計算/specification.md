# ConditionalElapsedTimeAutomaticCalculation 詳細仕様書

## 1. プラグイン概要

- 解析日: 2026-06-24
- 対象プラグイン: ConditionalElapsedTimeAutomaticCalculation
- プラグイン名: 条件付き経過時間自動計算プラグイン
- バージョン: 2.0.5
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.5 開始日から終了日までの時間を計算し、その時間を工数（１０進数）で数値フィールドに格納するプラグインです。
- 解析方針: 元ソースを優先し、難読化済みファイルは生成物・参照確認として扱った。

### コード上で確認できた概要
下記の画面別動作、設定値、API利用内容を参照。

## 2. ファイル構成

- 対象パス: `plugins/条件付き経過時間自動計算`
- 元ソース: `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation`
- 難読化済み版: `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione`
- 解析対象ファイル数: 33
- ファイル種別集計: CSS: 8, HTML: 2, JS: 8, JSON: 2, MD: 7, PNG: 2, PUBKEY: 2, SIGNATURE: 2

### 元ソース主要ファイル
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/51-modern-default.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/config.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/desktop.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/mobile.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/html/config.html`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/image/icon.png`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/certification.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/config.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/desktop.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/js/mobile.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/manifest.json`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/PUBKEY`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/SIGNATURE`

### 難読化済み・生成物として扱うファイル
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/css/51-modern-default.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/css/config.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/css/desktop.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/css/mobile.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/html/config.html`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/image/icon.png`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/js/certification.js.obfuscated.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/js/config.js.obfuscated.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/js/desktop.js.obfuscated.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/js/mobile.js.obfuscated.js`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/contents/manifest.json`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/PUBKEY`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione/SIGNATURE`

### 保守資料・その他
- `plugins/条件付き経過時間自動計算/codex/handover-2026-06-23.md`
- `plugins/条件付き経過時間自動計算/codex/next-tasks.md`
- `plugins/条件付き経過時間自動計算/codex/test-plan.md`
- `plugins/条件付き経過時間自動計算/codex/troubleshooting.md`
- `plugins/条件付き経過時間自動計算/codex/work-instructions.md`
- `plugins/条件付き経過時間自動計算/decisions/README.md`
- `plugins/条件付き経過時間自動計算/specification.md`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.5
- type: APP
- name.ja: 条件付き経過時間自動計算プラグイン
- name.en: Time Decimal Calculation Plug-in
- description.ja: [PluginAdaptiX] v2.0.5 開始日から終了日までの時間を計算し、その時間を工数（１０進数）で数値フィールドに格納するプラグインです。
- icon: image/icon.png
- required_params: startDate

### desktop
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: https://cdn.jsdelivr.net/gh/osamutake/japanese-holidays-js@v1.0.10/lib/japanese-holidays.min.js`
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
- `css: css/51-modern-default.css`
- `css: https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css`
- `css: css/config.css`

### mobile
- `js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `js: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `js: https://cdn.jsdelivr.net/gh/osamutake/japanese-holidays-js@v1.0.10/lib/japanese-holidays.min.js`
- `js: js/certification.js`
- `js: js/mobile.js`
- `css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css`
- `css: css/mobile.css`

### 必要権限
- manifest.json上では個別権限定義は確認できなかった。実行時は利用するkintone REST API、対象アプリ、対象フィールド、対象レコードの権限に依存する。

## 4. 設定画面仕様

コード上で確認できた設定画面構成は以下です。

### 表示項目・ボタン
- 計算対象設定
- 開始日フィールド
- 終了日フィールド
- 時間格納フィールド
- 休日設定
- 月
- 火
- 水
- 木
- 金
- 土
- 日
- 国民の休日
- 対象外とする
- 計算除外時間設定
- 除外時間開始
- 除外時間終了(24:00は0:00)
- ~
- キャンセル
- 保存

### HTML/JS連携
- `querySelector`
- `appendChild`
- `insertBefore`
- `show`
- `select2`
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`

### 既存仕様書からの補足
コード上で確認できた設定画面項目は以下です。

- 計算対象設定
- 開始日フィールド
- 終了日フィールド
- 時間格納フィールド
- 休日設定
- 月
- 火
- 水
- 木
- 金
- 土
- 日
- 国民の休日
- 対象外とする
- 計算除外時間設定
- 除外時間開始
- 除外時間終了(24:00は0:00)
- ~
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. 保存設定値

### 保存キー・保存値
- startDate / endDate / resultValue
- mondayCheck から sundayCheck: 曜日ごとの除外設定
- holidayCheck: 国民の休日を対象外にする設定
- settings: startTime / endTime の除外時間帯配列

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

### 静的解析で確認した設定キー候補
- `startDate`

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
開始日/終了日変更時に、休日設定と除外時間帯を考慮して経過時間を計算し、数値フィールドへ格納する処理を確認した。

### 6.4 レコード編集画面
編集画面でも追加画面と同等の計算処理を行う。

### 6.5 印刷画面
該当イベントは確認できなかった。

## 7. モバイル画面動作仕様

モバイルでも一覧確認と追加/編集時の計算イベントを登録する。

## 8. 使用kintoneイベント

### イベント

- `app.record.create.change.<設定フィールド>`
- `app.record.edit.change.<設定フィールド>`
- `app.record.index.show`
- `mobile.app.record.create.change.<設定フィールド>`
- `mobile.app.record.edit.change.<設定フィールド>`
- `mobile.app.record.index.show`

### 使用関数
- `KNTP214410certification`
- `count`
- `exists`
- `inTarget`
- `re`
- `target`

### 定数
- `$cancelButton`
- `$mainContent`
- `$submit`

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

- DATEフィールドを開始日/終了日、NUMBERフィールドを結果格納先として利用する。

コード上で確認したフィールド抽出処理:

- filterField(that.fieldList, true, 'DATE')
- filterField(that.fieldList, true, 'NUMBER')

### 設定画面で選択する主な項目
- 計算対象設定
- 開始日フィールド
- 終了日フィールド
- 時間格納フィールド
- 休日設定
- 月
- 火
- 水
- 木
- 金
- 土
- 日
- 国民の休日
- 対象外とする
- 計算除外時間設定
- 除外時間開始
- 除外時間終了(24:00は0:00)
- ~

## 11. サブテーブル仕様

サブテーブル専用処理は明確には確認できなかった。フィールドレイアウト取得ではサブテーブル内フィールドも走査している。

## 12. 添付ファイル仕様

該当処理は確認できなかった。

## 13. UI仕様

設定画面で開始日、終了日、時間格納フィールド、休日設定、計算除外時間を設定する。

### DOM操作・UI生成処理
- `querySelector`
- `appendChild`
- `insertBefore`
- `show`
- `select2`

### 入力チェック
- 設定画面では必須入力、対象フィールドの存在、重複設定などの検証処理があるものを確認した。詳細は各プラグインの設定値とエラー処理を参照。

## 14. CSS仕様

### CSSファイル
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/51-modern-default.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/config.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/desktop.css`
- `plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation/contents/css/mobile.css`

### 主なクラス名
- `add-field`
- `add-row`
- `check-contents`
- `checkll`
- `css`
- `end-date`
- `end-time`
- `friday-check`
- `holiday-check`
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
- `left-colunm`
- `lt-ie9`
- `main-contents`
- `monday-check`
- `plugin-space-heading`
- `plugin-space-message`
- `remove-field`
- `remove-row`
- `result-value`
- `saturday-check`
- `select2`
- `settings`
- `settings-heading`
- `start-date`
- `start-time`
- `sunday-check`
- `thursday-check`
- `time-area`
- `time-select`
- `tip-container`
- `title`
- `tuesday-check`
- `wednesday-check`

### レイアウト・kintone標準UIとの関係
- `51-modern-default.css` と `kintoneplugin-*` 系クラスを利用する構成を確認した。
- 設定画面CSS、PC画面CSS、モバイルCSSはmanifestの読み込み定義に従って分かれている。
- 視覚確認は未実施のため、実際の表示崩れ有無は未確認です。

## 15. 外部ライブラリ

- `https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `https://cdn.jsdelivr.net/gh/osamutake/japanese-holidays-js@v1.0.10/lib/japanese-holidays.min.js`
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

- 認証関数: `KNTP214410certification`
- 製品番号: `KNTP214410`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybo

### 認証関連ファイル
- `contents/js/certification.js` を確認した。

### 権限
- kintone REST APIを利用する機能では、対象アプリ、フォーム、レコード、フィールドへの権限が必要です。
- コード内にAPIキー、トークン、Cookieなどの実値は記載しない運用です。本解析ではファイル内容の引用は行わず、秘密情報の転載を避けています。

## 18. データ保存・取得仕様

各設定値をJSON文字列化して保存する。

## 19. 既知の制約

- 祝日判定は外部ライブラリ japanese-holidays-js に依存する。

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
- 元ソース優先: plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculation
- 難読化済みファイル: plugins/条件付き経過時間自動計算/ConditionalElapsedTimeAutomaticCalculatione（参考情報として扱い、直接修正対象外）
- 未確認事項: 実機操作、外部通信の現在の応答、画像の視覚内容、kintone権限差
