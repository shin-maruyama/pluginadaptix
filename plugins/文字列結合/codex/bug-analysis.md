# StringConcatenation バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-021: No.1 2026-24-06 BUG-021 undefined除外のfilter条件が常にtrueになる（重大度: Medium、対象: plugins/文字列結合/StringConcatenation/contents/js/desktop.js:107）

## 2. 解析対象ファイル一覧

- plugins/文字列結合/BUG.md
- plugins/文字列結合/Manual.md
- plugins/文字列結合/StringConcatenation/PUBKEY
- plugins/文字列結合/StringConcatenation/SIGNATURE
- plugins/文字列結合/StringConcatenation/contents/css/51-modern-default.css
- plugins/文字列結合/StringConcatenation/contents/css/config.css
- plugins/文字列結合/StringConcatenation/contents/css/desktop.css
- plugins/文字列結合/StringConcatenation/contents/css/mobile.css
- plugins/文字列結合/StringConcatenation/contents/html/config.html
- plugins/文字列結合/StringConcatenation/contents/image/icon.png
- plugins/文字列結合/StringConcatenation/contents/js/certification.js
- plugins/文字列結合/StringConcatenation/contents/js/config.js
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js
- plugins/文字列結合/StringConcatenation/contents/manifest.json
- plugins/文字列結合/StringConcatenatione/PUBKEY
- plugins/文字列結合/StringConcatenatione/SIGNATURE
- plugins/文字列結合/StringConcatenatione/contents/css/51-modern-default.css
- plugins/文字列結合/StringConcatenatione/contents/css/config.css
- plugins/文字列結合/StringConcatenatione/contents/css/desktop.css
- plugins/文字列結合/StringConcatenatione/contents/css/mobile.css
- plugins/文字列結合/StringConcatenatione/contents/html/config.html
- plugins/文字列結合/StringConcatenatione/contents/image/icon.png
- plugins/文字列結合/StringConcatenatione/contents/js/certification.js.obfuscated.js
- plugins/文字列結合/StringConcatenatione/contents/js/config.js.obfuscated.js
- plugins/文字列結合/StringConcatenatione/contents/js/desktop.js.obfuscated.js
- plugins/文字列結合/StringConcatenatione/contents/js/mobile.js.obfuscated.js
- plugins/文字列結合/StringConcatenatione/contents/manifest.json
- plugins/文字列結合/codex/handover-2026-06-23.md
- plugins/文字列結合/codex/next-tasks.md
- plugins/文字列結合/codex/test-plan.md
- plugins/文字列結合/codex/troubleshooting.md
- plugins/文字列結合/codex/work-instructions.md
- plugins/文字列結合/decisions/README.md
- plugins/文字列結合/specification.md

## 3. manifest.json解析

- ファイル: plugins/文字列結合/StringConcatenation/contents/manifest.json
- name: 文字列結合プラグイン
- version: 2.0.9
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/文字列結合/StringConcatenation
- 難読化版場所: plugins/文字列結合/StringConcatenatione（参考扱い）
- plugins/文字列結合/StringConcatenation/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/文字列結合/StringConcatenation/contents/js/config.js: events=0, api=1, dom=3, config=12, subtable=6, console=2
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js: events=3, api=1, dom=0, config=6, subtable=20, console=2
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js: events=3, api=1, dom=0, config=6, subtable=20, console=2

## 5. HTML解析

- plugins/文字列結合/StringConcatenation/contents/html/config.html

## 6. CSS解析

- plugins/文字列結合/StringConcatenation/contents/css/51-modern-default.css
- plugins/文字列結合/StringConcatenation/contents/css/config.css
- plugins/文字列結合/StringConcatenation/contents/css/desktop.css
- plugins/文字列結合/StringConcatenation/contents/css/mobile.css

## 7. 設定値解析

- plugins/文字列結合/StringConcatenation/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:15: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:101: config.delimiter = JSON.parse(config.delimiter);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:102: config.field = JSON.parse(config.field);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:103: config.paddingSelect = JSON.parse(config.paddingSelect);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:104: config.digit = JSON.parse(config.digit);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:105: config.connectionField = JSON.parse(config.connectionField);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:727: value.delimiter = JSON.stringify(value.delimiter);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:728: value.field = JSON.stringify(value.field);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:729: value.paddingSelect = JSON.stringify(value.paddingSelect);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:730: value.digit = JSON.stringify(value.digit);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:731: value.connectionField = JSON.stringify(value.connectionField);
- plugins/文字列結合/StringConcatenation/contents/js/config.js:733: kintone.plugin.app.setConfig(value);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:15: config.delimiter = JSON.parse(config.delimiter);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:16: config.field = JSON.parse(config.field);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:17: config.paddingSelect = JSON.parse(config.paddingSelect);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:18: config.digit = JSON.parse(config.digit);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:19: config.connectionField = JSON.parse(config.connectionField);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:15: config.delimiter = JSON.parse(config.delimiter);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:16: config.field = JSON.parse(config.field);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:17: config.paddingSelect = JSON.parse(config.paddingSelect);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:18: config.digit = JSON.parse(config.digit);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:19: config.connectionField = JSON.parse(config.connectionField);

## 8. kintoneイベント解析

- app.record.create.change.
- app.record.edit.change.
- app.record.index.show
- mobile.app.record.create.change.
- mobile.app.record.edit.change.
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/文字列結合/StringConcatenation/contents/js/config.js:163: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:189: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:189: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

## 10. DOM操作解析

- plugins/文字列結合/StringConcatenation/contents/js/config.js:110: const parent = document.querySelector('#parent');
- plugins/文字列結合/StringConcatenation/contents/js/config.js:322: const parent = document.querySelector('#parent');
- plugins/文字列結合/StringConcatenation/contents/js/config.js:342: const parent = document.querySelector('#parent');

## 11. サブテーブル関連解析

- plugins/文字列結合/StringConcatenation/contents/js/config.js:159: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/文字列結合/StringConcatenation/contents/js/config.js:168: else if (row.type === 'SUBTABLE') {
- plugins/文字列結合/StringConcatenation/contents/js/config.js:170: //if (!subTable) return;
- plugins/文字列結合/StringConcatenation/contents/js/config.js:206: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/文字列結合/StringConcatenation/contents/js/config.js:541: const parts = value.connectionField[i].split('　');
- plugins/文字列結合/StringConcatenation/contents/js/config.js:547: const parts2 = item.split('　');
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:58: if (field.split('　').length === 1) {
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:73: const tableCode = field.split('　')[0];
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:74: const fieldCode = field.split('　')[1];
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:90: if (!event.changes.row || !event.changes.row.value) return event;
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:91: if (!event.changes.row.value[fieldCode]) return;
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:92: if (event.changes.row.value[fieldCode].type === 'NUMBER') {
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:93: if (event.changes.row.value[fieldCode].value) {
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:95: ? fieldValueList.push(that.zeroPadding(event.changes.row.value[fieldCode].value, config.digit[i]))
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:96: : fieldValueList.push(event.changes.row.value[fieldCode].value);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:98: } else if (event.changes.row.value[fieldCode].type === 'SINGLE_LINE_TEXT') fieldValueList.push(event.changes.row.value[fieldCode].value);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:104: if (config.connectionField[i].split('　').length === 1) {
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:110: const tableCode2 = config.connectionField[i].split('　')[0];
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:111: const fieldCode2 = config.connectionField[i].split('　')[1];
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:119: if (!event.changes.row || !event.changes.row.value) return event;
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:121: event.changes.row.value[fieldCode2].value = fieldValueList
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:185: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:194: else if (row.type === 'SUBTABLE') {
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:196: //if (!subTable) return;
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:232: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:261: const parts = code.split('　');
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:58: if (field.split('　').length === 1) {
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:73: const tableCode = field.split('　')[0];
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:74: const fieldCode = field.split('　')[1];
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:90: if (!event.changes.row || !event.changes.row.value) return event;
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:91: if (!event.changes.row.value[fieldCode]) return;
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:92: if (event.changes.row.value[fieldCode].type === 'NUMBER') {
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:93: if (event.changes.row.value[fieldCode].value) {
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:95: ? fieldValueList.push(that.zeroPadding(event.changes.row.value[fieldCode].value, config.digit[i]))
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:96: : fieldValueList.push(event.changes.row.value[fieldCode].value);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:98: } else if (event.changes.row.value[fieldCode].type === 'SINGLE_LINE_TEXT') fieldValueList.push(event.changes.row.value[fieldCode].value);
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:104: if (config.connectionField[i].split('　').length === 1) {
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:110: const tableCode2 = config.connectionField[i].split('　')[0];
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:111: const fieldCode2 = config.connectionField[i].split('　')[1];
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:119: if (!event.changes.row || !event.changes.row.value) return event;
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:121: event.changes.row.value[fieldCode2].value = fieldValueList
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:185: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:194: else if (row.type === 'SUBTABLE') {
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:196: //if (!subTable) return;
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:232: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/文字列結合/StringConcatenation/contents/js/mobile.js:261: const parts = code.split('　');

## 12. 添付ファイル関連解析

- plugins/文字列結合/StringConcatenation/contents/js/config.js:87: * @param {Array} numTextFiledList [数値と文字列1行に絞ったリスト]
- plugins/文字列結合/StringConcatenation/contents/js/config.js:91: const numTextFiledList = that.filterField(that.fieldList, true, 'NUMBER', 'SINGLE_LINE_TEXT');
- plugins/文字列結合/StringConcatenation/contents/js/config.js:94: that.createOption(numTextFiledList, $('.field'));
- plugins/文字列結合/StringConcatenation/contents/js/config.js:625: const numTextFiledList = that.filterField(
- plugins/文字列結合/StringConcatenation/contents/js/config.js:656: newOptions1 = numTextFiledList.filter(option => !array1.includes(option.code) || option.code === currentValue1);

## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-021

#### 該当する可能性が高いファイル

- plugins/文字列結合/StringConcatenation/contents/js/desktop.js

#### 該当する可能性が高い関数

- connection.eventStart（35行付近）

#### 関連するkintoneイベント

- app.record.create.change.
- app.record.edit.change.
- app.record.index.show

#### 関連する設定値

- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:15: config.delimiter = JSON.parse(config.delimiter);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:16: config.field = JSON.parse(config.field);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:17: config.paddingSelect = JSON.parse(config.paddingSelect);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:18: config.digit = JSON.parse(config.digit);
- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:19: config.connectionField = JSON.parse(config.connectionField);

#### 関連するAPI

- plugins/文字列結合/StringConcatenation/contents/js/desktop.js:189: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: OR条件により undefined 除外条件が常にtrueになる可能性がある。

#### 影響範囲

- コード上で確認済み: 未入力フィールドを含む結合時に、余分な区切りや想定外の値が混入する可能性がある。
- 画面影響: app.record.create.change., app.record.edit.change., app.record.index.show

#### 修正時の注意点

- `&&` 条件にし、文字列 `undefined` も含めて除外条件を整理する。mobile.jsも同様確認。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
103:         //[連結先フィールドがある場合代入]
104:         if (config.connectionField[i].split('　').length === 1) {
105:           if (record[config.connectionField[i]])
106:             record[config.connectionField[i]].value = fieldValueList
107:               .filter((x) => x !== undefined || x !== 'ndefined')
108:               .join(config.delimiter[i]);
109:         } else {
110:           const tableCode2 = config.connectionField[i].split('　')[0];
111:           const fieldCode2 = config.connectionField[i].split('　')[1];
112:           if (!record[tableCode2]) {
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
