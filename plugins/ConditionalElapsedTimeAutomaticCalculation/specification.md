# ConditionalElapsedTimeAutomaticCalculation 詳細仕様書

## 1. プラグイン概要

- 調査日: 2026-06-23
- プラグイン名: 条件付き経過時間自動計算プラグイン
- バージョン: 2.0.5
- 種別: APP
- manifest説明: [PluginAdaptiX] v2.0.5 開始日から終了日までの時間を計算し、その時間を工数（１０進数）で数値フィールドに格納するプラグインです。
- コード上で確認できた概要: 下記の画面別動作、設定値、API利用内容を参照。

## 2. 対象ファイル構成

- 対象プラグイン: `plugins/ConditionalElapsedTimeAutomaticCalculation`
- 調査した元ソース: `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation`
- 難読化済み版: `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculatione`
- manifest: `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/manifest.json`
- 設定HTML: `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/html/config.html`
- JS:
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/certification.js`
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/config.js`
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/desktop.js`
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/js/mobile.js`
- CSS:
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/css/51-modern-default.css`
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/css/config.css`
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/css/desktop.css`
- `plugins/ConditionalElapsedTimeAutomaticCalculation/ConditionalElapsedTimeAutomaticCalculation/contents/css/mobile.css`

## 3. manifest.json仕様

- manifest_version: 1
- version: 2.0.5
- type: APP
- icon: image/icon.png
- required_params: startDate
- desktop.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js
  - https://cdn.jsdelivr.net/gh/osamutake/japanese-holidays-js@v1.0.10/lib/japanese-holidays.min.js
  - js/certification.js
  - js/desktop.js
- desktop.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/51-modern-default.css
  - css/desktop.css
- config.html: html/config.html
- config.js:
  - https://js.cybozu.com/jquery/3.3.1/jquery.min.js
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
  - https://cdn.jsdelivr.net/gh/osamutake/japanese-holidays-js@v1.0.10/lib/japanese-holidays.min.js
  - js/certification.js
  - js/mobile.js
- mobile.css:
  - https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
  - css/mobile.css

## 4. 設定画面仕様

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

## 5. プラグイン設定値

- startDate / endDate / resultValue
- mondayCheck から sundayCheck: 曜日ごとの除外設定
- holidayCheck: 国民の休日を対象外にする設定
- settings: startTime / endTime の除外時間帯配列

保存方式:

- `kintone.plugin.app.getConfig` による取得を確認した。
- `kintone.plugin.app.setConfig` による保存を確認した。
- 配列/オブジェクトはJSON文字列として保存されるものが多い。

## 6. kintone画面別動作

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

### 6.6 モバイル画面

モバイルでも一覧確認と追加/編集時の計算イベントを登録する。

## 7. 使用kintone REST API

- /k/v1/app/form/layout.json

補足:

- 上記は `config.js`、`desktop.js`、`mobile.js`、`certification.js` から確認できたAPIです。
- 認証確認ではkintone REST APIではなく `kintone.proxy` を利用する。

## 8. 使用kintone JavaScript APIイベント

- app.record.create.change.<設定フィールド>
- app.record.edit.change.<設定フィールド>
- app.record.index.show
- mobile.app.record.create.change.<設定フィールド>
- mobile.app.record.edit.change.<設定フィールド>
- mobile.app.record.index.show

補足:

- `*.change.<設定フィールド>` は設定値から動的に生成されるフィールド変更イベントです。
- 実機での発火順序は未確認です。

## 9. フィールド関連仕様

- DATEフィールドを開始日/終了日、NUMBERフィールドを結果格納先として利用する。

コード上で確認したフィールド抽出処理:

- filterField(that.fieldList, true, 'DATE')
- filterField(that.fieldList, true, 'NUMBER')

## 10. 添付ファイル関連仕様

該当処理は確認できなかった。

## 11. サブテーブル関連仕様

サブテーブル専用処理は明確には確認できなかった。フィールドレイアウト取得ではサブテーブル内フィールドも走査している。

## 12. 外部ライブラリ

- cdn.jsdelivr.net/gh/osamutake/japanese-holidays-js@v1.0.10/lib/japanese-holidays.min.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js
- cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js
- js.cybozu.com/jquery/3.3.1/jquery.min.js
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css
- js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js

## 13. エラー処理

- SweetAlert2または `swal.fire` / `displayAlert` によるエラー表示を確認した。
- 設定画面では必須入力、重複、対象フィールド存在確認を行うものがある。
- 実行画面では設定済みフィールドが削除・変更された場合の警告/エラー表示を持つものがある。
- 詳細なメッセージ一覧は未確認。

## 14. 権限・認証関連

- 認証関数: `KNTP214410certification`
- 製品番号: `KNTP214410`
- 認証エンドポイント: `https://aio-ec.jp/kintoneapi/check_plugin_auth.php`
- `location.hostname` からcybozuドメインを取得し、`kintone.proxy` で認証確認を行う処理を確認した。
- APIキーや秘密情報のコード内直書きは確認していない。
- REST APIを利用する機能では、対象アプリ/レコード/フォームへのkintone権限が必要です。

## 15. データ保存・取得仕様

各設定値をJSON文字列化して保存する。

## 16. UI仕様

設定画面で開始日、終了日、時間格納フィールド、休日設定、計算除外時間を設定する。

## 17. 既知の制約

- 祝日判定は外部ライブラリ japanese-holidays-js に依存する。

## 18. 注意点

- 難読化済みファイルは直接修正しない。
- 本仕様書は静的コード調査に基づく。実機でのみ確認できる表示崩れ、権限差、イベント発火順序は未確認。
- 不明な仕様は断定せず、追加調査時に更新する。

## 19. 今後の改善候補

- 勤務時間帯・休日条件ごとの期待値表を追加する。
