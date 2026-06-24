# appList 詳細仕様書

## 1. プラグイン概要

- 解析日: 2026-06-24
- 対象プラグイン: appList
- プラグイン名: アプリ一覧プラグイン（カスタム版）
- バージョン: 1.0.27
- 種別: APP
- manifest説明: [PluginAdaptiX] v1.0.27-custom アプリの一覧を表示することができます。
- 解析方針: 元ソースを優先し、難読化済みファイルは生成物・参照確認として扱った。

### コード上で確認できた概要
下記の画面別動作、設定値、API利用内容を参照。

## 2. ファイル構成

- 対象パス: `plugins/appList`
- 元ソース: `plugins/appList/appList`
- 難読化済み版: `plugins/appList/appListe`
- 解析対象ファイル数: 34
- ファイル種別集計: CSS: 8, HTML: 2, JPG: 2, JS: 8, JSON: 2, MD: 8, PUBKEY: 2, SIGNATURE: 2

### 元ソース主要ファイル
- `plugins/appList/appList/contents/css/51-modern-default.css`
- `plugins/appList/appList/contents/css/config.css`
- `plugins/appList/appList/contents/css/desktop.css`
- `plugins/appList/appList/contents/css/mobile.css`
- `plugins/appList/appList/contents/html/config.html`
- `plugins/appList/appList/contents/image/icon.jpg`
- `plugins/appList/appList/contents/js/certification.js`
- `plugins/appList/appList/contents/js/config.js`
- `plugins/appList/appList/contents/js/desktop.js`
- `plugins/appList/appList/contents/js/mobile.js`
- `plugins/appList/appList/contents/manifest.json`
- `plugins/appList/appList/contents/README.md`
- `plugins/appList/appList/PUBKEY`
- `plugins/appList/appList/SIGNATURE`

### 難読化済み・生成物として扱うファイル
- `plugins/appList/appListe/contents/css/51-modern-default.css`
- `plugins/appList/appListe/contents/css/config.css`
- `plugins/appList/appListe/contents/css/desktop.css`
- `plugins/appList/appListe/contents/css/mobile.css`
- `plugins/appList/appListe/contents/html/config.html`
- `plugins/appList/appListe/contents/image/icon.jpg`
- `plugins/appList/appListe/contents/js/certification.obfuscated.js`
- `plugins/appList/appListe/contents/js/config.obfuscated.js`
- `plugins/appList/appListe/contents/js/desktop.obfuscated.js`
- `plugins/appList/appListe/contents/js/mobile.obfuscated.js`
- `plugins/appList/appListe/contents/manifest.json`
- `plugins/appList/appListe/PUBKEY`
- `plugins/appList/appListe/SIGNATURE`

### 保守資料・その他
- `plugins/appList/codex/handover-2026-06-23.md`
- `plugins/appList/codex/next-tasks.md`
- `plugins/appList/codex/test-plan.md`
- `plugins/appList/codex/troubleshooting.md`
- `plugins/appList/codex/work-instructions.md`
- `plugins/appList/decisions/README.md`
- `plugins/appList/specification.md`

## 3. manifest.json仕様

- manifest_version: 1
- version: 1.0.27
- type: APP
- name.ja: アプリ一覧プラグイン（カスタム版）
- name.en: applist custom
- description.ja: [PluginAdaptiX] v1.0.27-custom アプリの一覧を表示することができます。
- icon: image/icon.jpg
- required_params: element

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
- `js: https://js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js`
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
- メニュー形式
- ボタン型
- ツリー型
- ポータル型
- デザインテーマ
- modern
- simple
- classic
- iconic
- 全体枠デザイン
- card
- shadow
- leftBorder
- outline
- none
- 全体ボタンデザイン
- solid
- soft
- pill
- square
- underline
- ポータル型 列数（PC）
- 4列
- 5列
- 6列
- ポータル型 列数（モバイル）
- 1列
- 2列
- ポータル型 説明文行数
- 1行
- 2行
- 3行
- 4行
- 5行
- ポータル型 カテゴリー名サイズ
- 24px
- 26px
- 28px
- 30px
- 32px
- ポータル型 説明文サイズ
- 14px
- 16px
- 18px
- 20px
- ポータル型 アプリ名サイズ
- 15px
- 17px
- 19px
- ポータル型 サブカテゴリ名サイズ
- 22px
- ツリーの名前(ツリー型選択時)
- 色（ツリー型）
- デフォルト
- 青藤色
- 赤色
- 小豆色
- 甚三紅
- 緑色
- 萌葱色
- 青緑
- 黄色
- 黄朽葉色
- 菜種油色
- 紫色
- 紅藤色
- 紫鳶
- 橙色
- 朱色
- 灰色
- 黒色
- 抽出色
- 色（ボタン/ポータル型）
- 全カテゴリーへ適用
- アプリ名の大きさ(PC)
- 大
- 中
- 小
- アプリ名の大きさ(モバイル版)
- カテゴリー説明文（ポータル型）

### HTML/JS連携
- `querySelector`
- `querySelectorAll`
- `getElementById`
- `getElementsByClassName`
- `createElement`
- `appendChild`
- `show`
- `select2`
- `sortable`
- `kintone.plugin.app.getConfig`
- `kintone.plugin.app.setConfig`

### 既存仕様書からの補足
コード上で確認できた設定画面項目は以下です。

- メニュー形式
- ボタン型
- ツリー型
- ポータル型
- デザインテーマ
- modern
- simple
- classic
- iconic
- 全体枠デザイン
- card
- shadow
- leftBorder
- outline
- none
- 全体ボタンデザイン
- solid
- soft
- pill
- square
- underline
- ポータル型 列数（PC）
- 4列
- 5列
- 6列
- ポータル型 列数（モバイル）
- 1列
- 2列
- ポータル型 説明文行数
- 1行
- 2行
- 3行
- 4行
- 5行
- ポータル型 カテゴリー名サイズ
- 24px
- 26px
- 28px
- 30px
- 32px
- ポータル型 説明文サイズ
- 14px
- 16px
- 18px
- 20px
- ポータル型 アプリ名サイズ
- 15px
- 17px
- 19px
- ポータル型 サブカテゴリ名サイズ
- 22px
- ツリーの名前(ツリー型選択時)
- 色（ツリー型）
- デフォルト
- 青藤色
- 赤色
- 小豆色
- 甚三紅
- 緑色
- 萌葱色
- 青緑
- 黄色
- 黄朽葉色
- 菜種油色
- 紫色
- 紅藤色
- 紫鳶
- 橙色
- 朱色
- 灰色
- 黒色
- 抽出色
- 色（ボタン/ポータル型）
- 全カテゴリーへ適用
- アプリ名の大きさ(PC)
- 大
- 中
- 小
- アプリ名の大きさ(モバイル版)
- サブカテゴリ
- カテゴリー説明文（ポータル型）
- カテゴリーアイコン
- clock
- calendar
- money
- people
- document
- chart
- gear
- app
- phone
- train
- home
- suitcase
- bank
- transfer
- warning
- lock
- chat
- gift
- checklist
- idCard
- shield
- heart
- lightbulb
- yen
- stamp
- umbrella
- bus
- カテゴリー色
- 全体色を使用
- 個別色を使用
- 全体色
- カテゴリー枠デザイン
- 全体設定を使用
- カテゴリーボタンデザイン
- icon: category
- ポータル型プレビュー
- プレビュー更新
- キャンセル
- 保存

補足:

- 保存ボタンとキャンセルボタンを持つ。
- select2を利用するプラグインでは検索可能なドロップダウンを使用する。
- 複数設定行を持つプラグインでは追加/削除ボタンまたはsortableによる並べ替え処理が確認できる。

## 5. 保存設定値

### 保存キー・保存値
- element: カテゴリー、サブカテゴリー、アプリID、アプリ名、アイコン、色、表示スタイルをJSON文字列で保存
- listId: カスタム一覧「アプリ一覧」の一覧ID
- radioValue: ボタン型、ツリー型、ポータル型
- treeName / menuColor / treeColor / appSi

### 静的解析で確認した設定キー候補
- `element`

### 保存方式
- `kintone.plugin.app.getConfig()` による取得を確認した。
- `kintone.plugin.app.setConfig()` による保存を確認した。
- 配列や複数行設定はJSON文字列として保存される実装が多い。詳細な値構造は上記保存キー・保存値を参照。

## 6. PC画面動作仕様

### 6.1 レコード一覧画面
一覧画面表示時に設定済みのアプリ一覧を `#applist-container` へ描画する。ボタン型、ツリー型、ポータル型の分岐、カテゴリー/サブカテゴリー、アイコン、色、フォントサイズ、列数の反映をコード上で確認した。

### 6.2 レコード詳細画面
該当イベントは確認できなかった。

### 6.3 レコード追加画面
該当イベントは確認できなかった。

### 6.4 レコード編集画面
該当イベントは確認できなかった。

### 6.5 印刷画面
該当イベントは確認できなかった。

## 7. モバイル画面動作仕様

モバイル一覧画面でPC版と同系統のアプリ一覧を描画する。ポータル型ではモバイル列数とモバイル向けフォント調整を行う。

## 8. 使用kintoneイベント

### イベント

- `app.record.index.show`
- `mobile.app.record.index.show`

### 使用関数
- `KNTP708010certification`
- `appendPortalPreviewApp`
- `applyAppConfig`
- `applyCategoryConfig`
- `backgroundColorChange`
- `buildPortalPreviewTree`
- `compositeColor`
- `createCategoryIcon`
- `createHoverColor`
- `createNewOption`
- `createPortalPreviewIcon`
- `displayAlert`
- `divDisplayforButton`
- `divDisplayforPortal`
- `divDisplayforTree`
- `getAppList`
- `getCategorySelectedColor`
- `getCurrentMenuColor`
- `getDisplayAppName`
- `getPortalFontSizes`
- `getPortalFontSizesFromConfig`
- `getPortalFontSizesFromForm`
- `getPortalHeaderHeight`
- `getPortalPreviewHeaderHeight`
- `getPortalPreviewIconLabel`
- `getPresetNameByColor`
- `invertColor`
- `menuColorFunc`
- `newOption`
- `normalizeButtonStyle`
- `normalizeCategoryIcon`
- `normalizeDesignTheme`
- `normalizeElements`
- `normalizeFrameStyle`
- `normalizePortalColumnCount`
- `normalizePortalDescriptionLines`
- `normalizePortalFontSize`
- `normalizePortalMobileColumnCount`
- `parsePluginConfig`
- `readPortalPreviewCategory`
- `renderPortalPreview`
- `resolveColor`
- `search`
- `updateAllCategoryColorControls`
- `updateCategoryColorControl`

### 定数
- `$cancelButton`
- `$form`
- `$noneOption`
- `BUTTON_STYLES`
- `CATEGORY_ICONS`
- `COLOR_PRESETS`
- `DEFAULT_BUTTON_STYLE`
- `DEFAULT_CATEGORY_FRAME_STYLE`
- `DEFAULT_CATEGORY_ICON`
- `DEFAULT_COLOR`
- `DEFAULT_DESIGN_THEME`
- `DEFAULT_PORTAL_APP_FONT_SIZE`
- `DEFAULT_PORTAL_COLUMN_COUNT`
- `DEFAULT_PORTAL_DESCRIPTION_FONT_SIZE`
- `DEFAULT_PORTAL_DESCRIPTION_LINES`
- `DEFAULT_PORTAL_MOBILE_COLUMN_COUNT`
- `DEFAULT_PORTAL_SUBCATEGORY_FONT_SIZE`
- `DEFAULT_PORTAL_TITLE_FONT_SIZE`
- `DESIGN_THEMES`
- `FRAME_STYLES`
- `ICON_SVG`
- `PORTAL_APP_FONT_SIZES`
- `PORTAL_COLUMN_COUNTS`
- `PORTAL_DESCRIPTION_FONT_SIZES`
- `PORTAL_DESCRIPTION_LINES`
- `PORTAL_MOBILE_COLUMN_COUNTS`
- `PORTAL_SUBCATEGORY_FONT_SIZES`
- `PORTAL_TITLE_FONT_SIZES`

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

- `/k/v1/app/views`
- `/k/v1/apps`
- `/k/v1/preview/app/views`

### kintone.proxy / 外部通信
- `https://aio-ec.jp/kintoneapi/check_plugin_auth.php?${query}`

補足:
- 上記は元ソースの `kintone.api()` / `kintone.proxy()` 利用箇所から静的に確認した。
- 実行時の権限、レコード件数、ネットワーク状態による挙動は未確認です。

## 10. 使用フィールド

- kintoneフィールド値は直接参照しない。アプリID、ビューID、カテゴリー構成をプラグイン設定として利用する。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

### 設定画面で選択する主な項目
- メニュー形式
- ボタン型
- ツリー型
- ポータル型
- デザインテーマ
- modern
- simple
- classic
- iconic
- 全体枠デザイン
- card
- shadow
- leftBorder
- outline
- none
- 全体ボタンデザイン
- solid
- soft
- pill
- square
- underline
- ポータル型 列数（PC）
- 4列
- 5列
- 6列
- ポータル型 列数（モバイル）
- 1列
- 2列
- ポータル型 説明文行数
- 1行
- 2行
- 3行
- 4行
- 5行
- ポータル型 カテゴリー名サイズ
- 24px
- 26px
- 28px
- 30px
- 32px
- ポータル型 説明文サイズ
- 14px
- 16px
- 18px
- 20px
- ポータル型 アプリ名サイズ
- 15px
- 17px
- 19px
- ポータル型 サブカテゴリ名サイズ
- 22px
- ツリーの名前(ツリー型選択時)
- 色（ツリー型）
- デフォルト
- 青藤色
- 赤色
- 小豆色
- 甚三紅
- 緑色
- 萌葱色
- 青緑
- 黄色
- 黄朽葉色
- 菜種油色
- 紫色
- 紅藤色
- 紫鳶
- 橙色
- 朱色
- 灰色
- 黒色
- 抽出色
- 色（ボタン/ポータル型）
- 全カテゴリーへ適用
- アプリ名の大きさ(PC)
- 大
- 中
- 小
- アプリ名の大きさ(モバイル版)
- カテゴリー説明文（ポータル型）

## 11. サブテーブル仕様

該当処理は確認できなかった。

## 12. 添付ファイル仕様

該当処理は確認できなかった。

## 13. UI仕様

設定画面でメニュー形式、デザインテーマ、枠/ボタンスタイル、ポータル表示、カテゴリー、サブカテゴリー、アプリ、アイコン、色を設定する。実行画面では一覧内の `#applist-container` にリンクUIを生成する。

### DOM操作・UI生成処理
- `querySelector`
- `querySelectorAll`
- `getElementById`
- `getElementsByClassName`
- `createElement`
- `appendChild`
- `show`
- `select2`
- `sortable`

### 入力チェック
- 設定画面では必須入力、対象フィールドの存在、重複設定などの検証処理があるものを確認した。詳細は各プラグインの設定値とエラー処理を参照。

## 14. CSS仕様

### CSSファイル
- `plugins/appList/appList/contents/css/51-modern-default.css`
- `plugins/appList/appList/contents/css/config.css`
- `plugins/appList/appList/contents/css/desktop.css`
- `plugins/appList/appList/contents/css/mobile.css`

### 主なクラス名
- `a-tag`
- `aohuzi-option`
- `aomidori-option`
- `app-icon-select`
- `app-list`
- `app-name`
- `app-row-controls`
- `applist-button-outline`
- `applist-button-pill`
- `applist-button-soft`
- `applist-button-solid`
- `applist-button-square`
- `applist-button-underline`
- `applist-category-label`
- `applist-frame-card`
- `applist-frame-leftBorder`
- `applist-frame-none`
- `applist-frame-outline`
- `applist-frame-shadow`
- `applist-icon`
- `applist-portal-app-name`
- `applist-portal-card`
- `applist-portal-description`
- `applist-portal-grid`
- `applist-portal-header`
- `applist-portal-link`
- `applist-portal-list`
- `applist-portal-number`
- `applist-portal-subcategory`
- `applist-portal-subcategory-title`
- `applist-portal-title`
- `applist-portal-title-wrap`
- `applist-theme-classic`
- `applist-theme-iconic`
- `applist-theme-modern`
- `applist-theme-simple`
- `apply-category-color-button`
- `azuki-option`
- `benihuzi-option`
- `black-option`
- `category`
- `category-button-style-select`
- `category-color-input`
- `category-color-mode`
- `category-color-palette`
- `category-color-preview`
- `category-color-select`
- `category-color-swatch`
- `category-description-input`
- `category-frame-style-select`
- `category-icon-select`
- `category-name`
- `category-name-input`
- `category-style-settings`
- `css`
- `default-option`
- `drag-handle-image`
- `green-option`
- `hai-option`
- `is-active`
- `is-disabled`
- `js-cancel-button`
- `js-submit-settings`
- `kikuchiba-option`
- `kintoneplugin-alert`
- `kintoneplugin-button-add-category-image`
- `kintoneplugin-button-add-row-image`
- `kintoneplugin-button-dialog-cancel`
- `kintoneplugin-button-dialog-ok`
- `kintoneplugin-button-disabled`
- `kintoneplugin-button-normal`
- `kintoneplugin-button-remove-category-image`
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
- `kintoneplugin-input-radio`
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
- `l-tag`
- `li-main`
- `li-parent`
- `li-sub`
- `lt-ie9`
- `moegi-option`
- `murasakitobi-option`
- `nataneyu-option`
- `orange-option`
- `otherSelect`
- `picker-option`
- `portal-preview-app-name`
- `portal-preview-card`
- `portal-preview-category-title`
- `portal-preview-description`
- `portal-preview-empty`
- `portal-preview-grid`
- `portal-preview-header`
- `portal-preview-icon`

### レイアウト・kintone標準UIとの関係
- `51-modern-default.css` と `kintoneplugin-*` 系クラスを利用する構成を確認した。
- 設定画面CSS、PC画面CSS、モバイルCSSはmanifestの読み込み定義に従って分かれている。
- 視覚確認は未実施のため、実際の表示崩れ有無は未確認です。

## 15. 外部ライブラリ

- `https://js.cybozu.com/jquery/3.3.1/jquery.min.js`
- `https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js`
- `https://js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js`
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

- 認証関数: `KNTP708010certification`
- 製品番号: `KNTP708010`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybo

### 認証関連ファイル
- `contents/js/certification.js` を確認した。

### 権限
- kintone REST APIを利用する機能では、対象アプリ、フォーム、レコード、フィールドへの権限が必要です。
- コード内にAPIキー、トークン、Cookieなどの実値は記載しない運用です。本解析ではファイル内容の引用は行わず、秘密情報の転載を避けています。

## 18. データ保存・取得仕様

保存時にカスタム一覧「アプリ一覧」を作成/更新し、表示設定を `kintone.plugin.app.setConfig` に保存する。

## 19. 既知の制約

- 保存時にkintoneシステム管理者権限が必要になる可能性がある。
- 設定済みアプリIDが存在しない場合の表示結果は実機未確認。

## 20. 注意事項

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 21. 未確認事項

- - 実機での発火順序は未確認です。
- - 詳細なメッセージ一覧は未確認。
- - 設定済みアプリIDが存在しない場合の表示結果は実機未確認。
- - 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- kintone実機での画面表示、権限差、イベント発火順序は未確認。
- 画像ファイルの視覚的な内容確認は未実施。
- 外部認証APIや外部CDNの現在の応答は未確認。

## 22. 今後の改善候補

- 実機確認結果、権限差、エラー文言一覧を追記する。

## 解析状況

- 解析日: 2026-06-24
- 解析対象ファイル: 34件
- 解析対象外ファイル: node_modules/, dist/, coverage/, playwright-report/, test-results/, .git/, .DS_Store, Thumbs.db
- 元ソース優先: plugins/appList/appList
- 難読化済みファイル: plugins/appList/appListe（参考情報として扱い、直接修正対象外）
- 未確認事項: 実機操作、外部通信の現在の応答、画像の視覚内容、kintone権限差
