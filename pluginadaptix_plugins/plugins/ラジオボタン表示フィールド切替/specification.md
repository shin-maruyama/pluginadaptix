# ラジオボタン表示フィールド切替 詳細仕様書

## 1. プラグイン概要

ラジオボタンフィールドの選択値に応じて、設定したフィールド、グループ、サブテーブルの表示・非表示を切り替えるkintoneプラグイン。

## 2. ファイル構成

- `RadioButtonDisplaySwitching/contents/manifest.json`
- `RadioButtonDisplaySwitching/contents/html/config.html`
- `RadioButtonDisplaySwitching/contents/js/config.js`
- `RadioButtonDisplaySwitching/contents/js/desktop.js`
- `RadioButtonDisplaySwitching/contents/js/mobile.js`
- `RadioButtonDisplaySwitching/contents/js/certification.js`
- `RadioButtonDisplaySwitching/contents/css/config.css`
- `RadioButtonDisplaySwitching/contents/css/desktop.css`
- `RadioButtonDisplaySwitching/contents/css/mobile.css`
- `RadioButtonDisplaySwitching/contents/image/icon.png`
- `PUBKEY`
- `SIGNATURE`

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
| version | 2.0.9 |
| type | APP |
| name.ja | ラジオボタン表示フィールド切替プラグイン |
| icon | `image/icon.png` |
| 設定画面HTML | `html/config.html` |
| 設定画面JS | jQuery、jQuery UI、SweetAlert2、Select2、`js/certification.js`、`js/config.js` |
| PC用JS | jQuery、SweetAlert2、`js/certification.js`、`js/desktop.js` |
| モバイル用JS | jQuery、SweetAlert2、`js/certification.js`、`js/mobile.js` |
| required_params | `settings` |

## 4. 設定画面仕様

設定画面では、切替用ラジオボタンを選択し、ラジオボタンの各選択肢ごとに表示対象フィールドを設定する。
`グループ名・枠線を表示しない` のチェック項目がある。

## 5. 保存設定値

| キー | 内容 |
|---|---|
| `settings` | 設定行のJSON文字列。`radioSelect` と `categories` を保持する |
| `groupNameHideCheck` | グループ名・枠線を非表示にするかのJSON文字列 |

`settings` の主な構造:

```json
[
  {
    "radioSelect": "切替用ラジオボタンのフィールドコード",
    "categories": [
      {
        "categoryName": "ラジオボタン選択肢名",
        "fields": ["表示対象フィールドコード"]
      }
    ]
  }
]
```

## 6. PC画面動作仕様

レコード追加・編集・詳細画面で、切替用ラジオボタンの値に応じて対象フィールドを表示・非表示にする。
レコード一覧画面では、設定済みフィールドの存在チェックを行い、不足がある場合は警告を表示する。

## 7. モバイル画面動作仕様

PCと同様に、モバイルの追加・編集・詳細画面で表示切替を行う。
モバイル一覧画面でも設定済みフィールドの存在チェックを行う。

## 8. 使用kintoneイベント

| 画面 | イベント |
|---|---|
| PC一覧 | `app.record.index.show` |
| PC追加 | `app.record.create.show`、`app.record.create.change.<radioSelect>` |
| PC編集 | `app.record.edit.show`、`app.record.edit.change.<radioSelect>` |
| PC詳細 | `app.record.detail.show` |
| モバイル一覧 | `mobile.app.record.index.show` |
| モバイル追加 | `mobile.app.record.create.show`、`mobile.app.record.create.change.<radioSelect>` |
| モバイル編集 | `mobile.app.record.edit.show`、`mobile.app.record.edit.change.<radioSelect>` |
| モバイル詳細 | `mobile.app.record.detail.show` |

## 9. 使用kintone REST API

| API | 用途 |
|---|---|
| `/k/v1/app/form/layout.json` | フォームレイアウト取得、設定済みフィールド存在チェック |
| `/k/v1/app/form/fields.json` | フォームフィールド情報取得 |

## 10. 使用フィールド

- 切替用ラジオボタンフィールド
- 表示対象フィールド
- グループ
- サブテーブル

## 11. フィールド存在チェック仕様

一覧画面表示時に、保存済みの `radioSelect` と `categories[].fields[]` が現在のフォームレイアウト内に存在するか確認する。
存在しない場合、設定番号、設定項目、対象カテゴリ、保存済みフィールドコード、保存済みフィールド名の扱い、現在状態を警告に表示する。

## 12. 警告表示仕様

警告はSweetAlert2で表示する。
表示済み制御は使用しないため、フィールド不足が解消されるまで一覧画面を開くたびに表示される。

表示する情報:

- 対象機能
- 設定番号
- 設定項目
- 対象カテゴリ
- 保存されているフィールドコード
- 保存されているフィールド名
- 現在の状態

保存時のフィールド名は設定値に保存されていないため、警告では `未保存（設定値にフィールド名は保存されていません）` と表示する。

## 13. UI仕様

設定画面はSelect2を利用したドロップダウンで構成される。
実行画面では、kintone標準のフィールド表示状態を `kintone.app.record.setFieldShown()` で切り替える。

## 14. エラー処理

フォームレイアウト取得処理は `try-catch` で囲まれている。
警告表示はSweetAlert2を前提とする。

## 15. 既知の制約

- 保存設定にはフィールド名が保存されない。
- フィールドコード変更と削除のどちらが原因かはコード上では判別できない。
- 難読化済みファイルは今回変更していない。

## 16. 注意事項

フィールドコードを変更または削除した場合は、プラグイン設定を再保存する必要がある。

## 17. 未確認事項

- kintone実機での警告表示レイアウト
- モバイル実機での警告表示レイアウト

## 解析状況

- 解析日: 2026-06-27
- 解析対象ファイル: `manifest.json`, `config.html`, `config.js`, `desktop.js`, `mobile.js`, CSS, image, `PUBKEY`, `SIGNATURE`
- 解析対象外ファイル: `.DS_Store`, `*.zip`, `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`
- 未確認事項: kintone実機での表示確認
