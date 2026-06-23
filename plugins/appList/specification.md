# appList 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: アプリ一覧プラグイン（カスタム版）
- バージョン: 1.0.27
- 種別: APP
- manifest説明: [PluginAdaptiX] v1.0.27-custom アプリの一覧を表示することができます。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/appList`
- 調査した元ソース: `plugins/appList/appList`
- 難読化済み版: `plugins/appList/appListe`
- manifest: `plugins/appList/appList/contents/manifest.json`
- 設定HTML: `plugins/appList/appList/contents/html/config.html`
- JS:
- `plugins/appList/appList/contents/js/certification.js`
- `plugins/appList/appList/contents/js/config.js`
- `plugins/appList/appList/contents/js/desktop.js`
- `plugins/appList/appList/contents/js/mobile.js`
- CSS:
- `plugins/appList/appList/contents/css/51-modern-default.css`
- `plugins/appList/appList/contents/css/config.css`
- `plugins/appList/appList/contents/css/desktop.css`
- `plugins/appList/appList/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 1.0.27
- type: APP
- icon: image/icon.jpg
- required_params: element
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
  - https://js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - js/certification.js
  - js/config.js
- config.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
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

## 5. プラグイン設定値

- element: カテゴリー、サブカテゴリー、アプリID、アプリ名、アイコン、色、表示スタイルをJSON文字列で保存
- listId: カスタム一覧「アプリ一覧」の一覧ID
- radioValue: ボタン型、ツリー型、ポータル型
- treeName / menuColor / treeColor / appSize / appSizeMobile
- designTheme / frameStyle / buttonStyle
- portalColumnCount / portalMobileColumnCount / portalDescriptionLines / portalTitleFontSize / portalDescriptionFontSize / portalAppFontSize / portalSubcategoryFontSize
- iconMode

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

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

### 6.6 モバイル画面

モバイル一覧画面でPC版と同系統のアプリ一覧を描画する。ポータル型ではモバイル列数とモバイル向けフォント調整を行う。

## 7. 使用kintone REST API

- /k/v1/app/views
- /k/v1/apps
- /k/v1/preview/app/views

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.index.show
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- kintoneフィールド値は直接参照しない。アプリID、ビューID、カテゴリー構成をプラグイン設定として利用する。

コード上で確認したフィールド抽出処理:

- フィールド型フィルターは確認できなかった

## 10. 添付ファイル関連仕様

該当処理は確認できなかった。

## 11. サブテーブル関連仕様

該当処理は確認できなかった。

## 12. 外部ライブラリ

- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP708010certification`
- 製品番号: `KNTP708010`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

保存時にカスタム一覧「アプリ一覧」を作成/更新し、表示設定を `kintone.plugin.app.setConfig` に保存する。

## 16. UI仕様

設定画面でメニュー形式、デザインテーマ、枠/ボタンスタイル、ポータル表示、カテゴリー、サブカテゴリー、アプリ、アイコン、色を設定する。実行画面では一覧内の `#applist-container` にリンクUIを生成する。

## 17. 既知の制約

- 保存時にkintoneシステム管理者権限が必要になる可能性がある。
- 設定済みアプリIDが存在しない場合の表示結果は実機未確認。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- 設定値のスキーマを仕様書へ追加する。
- ポータル型/ツリー型/ボタン型の表示サンプルをPlaywrightで記録する。
