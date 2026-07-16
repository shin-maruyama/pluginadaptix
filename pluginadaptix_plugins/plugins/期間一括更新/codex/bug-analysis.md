# PeriodBulkUpdate バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-024: No.1 2026-24-06 BUG-024 旧バージョン設定移行で固定プラグインIDを参照している（重大度: Medium、対象: plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:29）

## 2. 解析対象ファイル一覧

- plugins/期間一括更新/BUG.md
- plugins/期間一括更新/Manual.md
- plugins/期間一括更新/PeriodBulkUpdate/PUBKEY
- plugins/期間一括更新/PeriodBulkUpdate/SIGNATURE
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/51-modern-default.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/config.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/desktop.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/mobile.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/html/config.html
- plugins/期間一括更新/PeriodBulkUpdate/contents/image/icon.png
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/certification.js
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js
- plugins/期間一括更新/PeriodBulkUpdate/contents/manifest.json
- plugins/期間一括更新/PeriodBulkUpdatee/PUBKEY
- plugins/期間一括更新/PeriodBulkUpdatee/SIGNATURE
- plugins/期間一括更新/PeriodBulkUpdatee/contents/css/51-modern-default.css
- plugins/期間一括更新/PeriodBulkUpdatee/contents/css/config.css
- plugins/期間一括更新/PeriodBulkUpdatee/contents/css/desktop.css
- plugins/期間一括更新/PeriodBulkUpdatee/contents/css/mobile.css
- plugins/期間一括更新/PeriodBulkUpdatee/contents/html/config.html
- plugins/期間一括更新/PeriodBulkUpdatee/contents/image/icon.png
- plugins/期間一括更新/PeriodBulkUpdatee/contents/js/certification.js.obfuscated.js
- plugins/期間一括更新/PeriodBulkUpdatee/contents/js/config.js.obfuscated.js
- plugins/期間一括更新/PeriodBulkUpdatee/contents/js/desktop.js.obfuscated.js
- plugins/期間一括更新/PeriodBulkUpdatee/contents/js/mobile.js.obfuscated.js
- plugins/期間一括更新/PeriodBulkUpdatee/contents/manifest.json
- plugins/期間一括更新/codex/handover-2026-06-23.md
- plugins/期間一括更新/codex/next-tasks.md
- plugins/期間一括更新/codex/test-plan.md
- plugins/期間一括更新/codex/troubleshooting.md
- plugins/期間一括更新/codex/work-instructions.md
- plugins/期間一括更新/decisions/README.md
- plugins/期間一括更新/specification.md

## 3. manifest.json解析

- ファイル: plugins/期間一括更新/PeriodBulkUpdate/contents/manifest.json
- name: 期間一括更新プラグイン
- version: 2.0.5
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/luxon/2.3.0/luxon.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/luxon/2.3.0/luxon.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/期間一括更新/PeriodBulkUpdate
- 難読化版場所: plugins/期間一括更新/PeriodBulkUpdatee（参考扱い）
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js: events=0, api=1, dom=3, config=5, subtable=6, console=0
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js: events=7, api=2, dom=2, config=2, subtable=20, console=2
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js: events=7, api=2, dom=1, config=2, subtable=20, console=2

## 5. HTML解析

- plugins/期間一括更新/PeriodBulkUpdate/contents/html/config.html

## 6. CSS解析

- plugins/期間一括更新/PeriodBulkUpdate/contents/css/51-modern-default.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/config.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/desktop.css
- plugins/期間一括更新/PeriodBulkUpdate/contents/css/mobile.css

## 7. 設定値解析

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:21: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:25: config.settings = JSON.parse(config.settings);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:29: const config2 = kintone.plugin.app.getConfig('acgdhcpcojijcmkcgkldmmelakjmlpno');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:100: value.settings = JSON.stringify(value.settings);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:101: kintone.plugin.app.setConfig(value);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:132: var config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:137: config.settings = JSON.parse(config.settings);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:132: var config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:137: config.settings = JSON.parse(config.settings);

## 8. kintoneイベント解析

- app.record.create.change.
- app.record.create.change.${tableCode}
- app.record.create.show
- app.record.edit.change.
- app.record.edit.change.${tableCode}
- app.record.edit.show
- app.record.index.show
- mobile.app.record.create.change.
- mobile.app.record.create.change.${tableCode}
- mobile.app.record.create.show
- mobile.app.record.edit.change.
- mobile.app.record.edit.change.${tableCode}
- mobile.app.record.edit.show
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:272: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:78: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:297: kintone.api(
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:78: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:297: kintone.api(

## 10. DOM操作解析

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:58: const parent = document.querySelector('#parent');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:114: const parent = document.querySelector('#parent');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:125: const parent = document.querySelector('#parent');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:251: const headerMenuSpace = kintone.app.getHeaderMenuSpaceElement(); // レコード一覧画面のヘッダーメニュー部分の要素取得
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:253: const button = document.createElement('button'); // ボタンタグ作成
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:253: const button = document.createElement('button'); // ボタンタグ作成

## 11. サブテーブル関連解析

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:203: const parts = fieldName.split('　');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:206: if (parent.type === 'SUBTABLE') return parts[0];
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:268: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:277: else if (row.type === 'SUBTABLE') {
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:279: //if (!subTable) return;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:313: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:61: if (!e.changes.row || !e.changes.row.value) return e;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:62: e.changes.row.value[fieldCode]['disabled'] = true;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:63: let date = e.changes.row.value[dateField].value; // 指定した日付フィールドの値
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:65: e.changes.row.value[fieldCode].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:74: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:83: else if (row.type === 'SUBTABLE') {
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:85: //if (!subTable) return;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:119: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:139: const partsd = config.settings[i].dateField.split('　');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:146: const partso = config.settings[i].outputField.split('　');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:160: if (!e.changes.row || !e.changes.row.value) continue;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:161: if (!e.changes.row.value[outputFields[i]] || !e.changes.row.value[dateFields[i]]) continue;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:162: e.changes.row.value[outputFields[i]]['disable'] = true;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:163: let date = e.changes.row.value[dateFields[i]].value; // 指定した日付フィールドの値
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:165: e.changes.row.value[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:191: row.value[outputFields[i]]['disabled'] = true;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:192: let date = row.value[dateFields[i]].value; // 指定した日付フィールドの値
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:194: row.value[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:276: if (!e.records[i][tableFields[j]].value || !e.records[i][tableFields[j]].value.length) continue;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/desktop.js:282: let date = row.value[dateFields[j]].value;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:61: if (!e.changes.row || !e.changes.row.value) return e;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:62: e.changes.row.value[fieldCode]['disabled'] = true;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:63: let date = e.changes.row.value[dateField].value; // 指定した日付フィールドの値
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:65: e.changes.row.value[fieldCode].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:74: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:83: else if (row.type === 'SUBTABLE') {
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:85: //if (!subTable) return;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:119: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:139: const partsd = config.settings[i].dateField.split('　');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:146: const partso = config.settings[i].outputField.split('　');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:160: if (!e.changes.row || !e.changes.row.value) continue;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:161: if (!e.changes.row.value[outputFields[i]] || !e.changes.row.value[dateFields[i]]) continue;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:162: e.changes.row.value[outputFields[i]]['disable'] = true;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:163: let date = e.changes.row.value[dateFields[i]].value; // 指定した日付フィールドの値
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:165: e.changes.row.value[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:191: row.value[outputFields[i]]['disabled'] = true;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:192: let date = row.value[dateFields[i]].value; // 指定した日付フィールドの値
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:194: row.value[outputFields[i]].value = kinzokuYear; // 指定した出力フィールドの値を求めた期間に変更
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:276: if (!e.records[i][tableFields[j]].value || !e.records[i][tableFields[j]].value.length) continue;
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/mobile.js:282: let date = row.value[dateFields[j]].value;

## 12. 添付ファイル関連解析

- 該当処理は確認できなかった

## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-024

#### 該当する可能性が高いファイル

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js

#### 該当する可能性が高い関数

- 無名イベントハンドラまたはトップレベル処理

#### 関連するkintoneイベント

- 該当処理は確認できなかった

#### 関連する設定値

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:21: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:25: config.settings = JSON.parse(config.settings);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:29: const config2 = kintone.plugin.app.getConfig('acgdhcpcojijcmkcgkldmmelakjmlpno');
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:100: value.settings = JSON.stringify(value.settings);
- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:101: kintone.plugin.app.setConfig(value);

#### 関連するAPI

- plugins/期間一括更新/PeriodBulkUpdate/contents/js/config.js:272: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: 旧バージョン設定の取り込みで固定プラグインIDを参照している。
- コード上で確認済み: 旧設定移行処理に固定PLUGIN_ID文字列がある。

#### 影響範囲

- コード上で確認済み: 環境や再パッケージによりプラグインIDが異なる場合、旧設定移行が機能しない。
- 画面影響: 未確認

#### 修正時の注意点

- 正式な旧プラグインID管理方針を確認し、設定移行仕様として妥当か判断する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
25:     config.settings = JSON.parse(config.settings);
26:   } else {
27:     // 旧バージョンの設定を取り込む
28:     try {
29:       const config2 = kintone.plugin.app.getConfig('acgdhcpcojijcmkcgkldmmelakjmlpno');
30:       if(config2.dateField) {
31:         // 変換処理
32:         config.settings = [];
33:         const item = {
34:           dateField : config2.dateField,
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
