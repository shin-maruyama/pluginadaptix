# 入力可 詳細仕様書

## 1. プラグイン概要

設定したフィールドを、レコード追加・編集画面で入力可能にするkintoneプラグイン。

## 2. ファイル構成

- `InputAllowed/contents/manifest.json`
- `InputAllowed/contents/html/config.html`
- `InputAllowed/contents/js/config.js`
- `InputAllowed/contents/js/desktop.js`
- `InputAllowed/contents/js/mobile.js`
- `InputAllowed/contents/js/certification.js`
- `InputAllowed/contents/css/config.css`
- `InputAllowed/contents/css/desktop.css`
- `InputAllowed/contents/css/mobile.css`
- `InputAllowed/contents/image/icon.jpg`
- `InputAllowed/PUBKEY`
- `InputAllowed/SIGNATURE`
- `InputAllowede/` 難読化済み生成物

解析対象外:

- `.DS_Store`
- `*.zip`
- `node_modules/`
- `dist/`
- `coverage/`
- `playwright-report/`
- `test-results/`

## 3. manifest.json仕様

| 項目 | 内容 |
|---|---|
| manifest_version | 1 |
| version | 1 |
| type | APP |
| name.ja | 入力可プラグイン |
| icon | `image/icon.jpg` |
| 設定画面HTML | `html/config.html` |
| 設定画面JS | jQuery、Select2、SweetAlert2、`js/certification.js`、`js/config.js` |
| PC用JS | jQuery、SweetAlert2、`js/certification.js`、`js/desktop.js` |
| モバイル用JS | jQuery、SweetAlert2、`js/certification.js`、`js/mobile.js` |
| required_params | `elementArray` |

## 4. 設定画面仕様

入力可能にしたいフィールドをドロップダウンで選択する。
行追加・行削除により複数フィールドを設定できる。

## 5. 保存設定値

| キー | 内容 |
|---|---|
| `elementArray` | 選択フィールドコードのJSON文字列。サブテーブル内フィールドは `テーブルコード　フィールドコード` 形式 |

## 6. PC画面動作仕様

レコード追加・編集画面で、設定済みフィールドの `disabled` を `false` にする。
設定値がサブテーブルの場合、サブテーブル内フィールドも入力可能にする。
一覧画面では、設定済みフィールドの存在チェックを行い、不足があれば警告を表示する。

## 7. モバイル画面動作仕様

PCと同様に、モバイル追加・編集画面で設定済みフィールドを入力可能にする。
モバイル一覧画面でもフィールド存在チェック警告を表示する。

## 8. 使用kintoneイベント

| 画面 | イベント |
|---|---|
| PC一覧 | `app.record.index.show` |
| PC追加 | `app.record.create.show` |
| PC編集 | `app.record.edit.show` |
| PCサブテーブル変更 | `app.record.create.change.<table>`、`app.record.edit.change.<table>` |
| モバイル一覧 | `mobile.app.record.index.show` |
| モバイル追加 | `mobile.app.record.create.show` |
| モバイル編集 | `mobile.app.record.edit.show` |
| モバイルサブテーブル変更 | `mobile.app.record.create.change.<table>`、`mobile.app.record.edit.change.<table>` |

## 9. 使用kintone REST API

| API | 用途 |
|---|---|
| `/k/v1/app/form/layout.json` | 設定画面の選択肢作成、一覧画面のフィールド存在チェック |

## 10. 使用フィールド

- 設定画面で選択した通常フィールド
- 設定画面で選択したサブテーブル
- 設定画面で選択したサブテーブル内フィールド

## 11. フィールド存在チェック仕様

一覧画面表示時に、`elementArray` に保存されたフィールドコードが現在のフォームレイアウトに存在するか確認する。
サブテーブル内フィールドは、サブテーブル本体と内部フィールドの両方を確認する。

## 12. 警告表示仕様

SweetAlert2で警告を表示する。
表示済み制御は使用しないため、不足がある間は一覧画面を開くたびに表示される。

表示する情報:

- 対象機能
- 設定番号
- 設定項目
- 保存されているフィールドコード
- 保存されているフィールド名
- 現在の状態

保存時のフィールド名は設定値に保存されていないため、警告では `未保存（設定値にフィールド名は保存されていません）` と表示する。

## 13. UI仕様

設定画面はSelect2を利用する。
実行画面では対象フィールドの `disabled` を変更する。

## 14. エラー処理

フォームレイアウト取得に失敗した場合、警告処理は行わず既存画面表示を継続する。

## 15. 既知の制約

- 保存設定にはフィールド名が保存されない。
- 難読化済みファイルは今回変更していない。

## 16. 注意事項

フィールドコード変更や削除後は、プラグイン設定を再保存する必要がある。

## 17. 未確認事項

- kintone実機でのPC警告表示
- kintone実機でのモバイル警告表示

## 解析状況

- 解析日: 2026-06-27
- 解析対象ファイル: `manifest.json`, `config.html`, `config.js`, `desktop.js`, `mobile.js`, CSS, image, `PUBKEY`, `SIGNATURE`
- 解析対象外ファイル: `.DS_Store`, `InputAllowede/` は難読化済み生成物として直接修正対象外
- 未確認事項: kintone実機での表示確認
