# LookupLinkage バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-004: No.1 2026-24-06 BUG-004 mobile.jsでアプリID取得にdesktop APIを使用している（重大度: High、対象: plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:92）
- BUG-005: No.2 2026-24-06 BUG-005 mobile.jsでdesktop用record.getを使用している（重大度: High、対象: plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:107）

## 2. 解析対象ファイル一覧

- plugins/ルックアップ連動/BUG.md
- plugins/ルックアップ連動/LookupLinkage/PUBKEY
- plugins/ルックアップ連動/LookupLinkage/SIGNATURE
- plugins/ルックアップ連動/LookupLinkage/contents/css/51-modern-default.css
- plugins/ルックアップ連動/LookupLinkage/contents/css/config.css
- plugins/ルックアップ連動/LookupLinkage/contents/css/desktop.css
- plugins/ルックアップ連動/LookupLinkage/contents/css/mobile.css
- plugins/ルックアップ連動/LookupLinkage/contents/html/config.html
- plugins/ルックアップ連動/LookupLinkage/contents/image/icon.png
- plugins/ルックアップ連動/LookupLinkage/contents/js/certification.js
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js
- plugins/ルックアップ連動/LookupLinkage/contents/manifest.json
- plugins/ルックアップ連動/LookupLinkagee/PUBKEY
- plugins/ルックアップ連動/LookupLinkagee/SIGNATURE
- plugins/ルックアップ連動/LookupLinkagee/contents/css/51-modern-default.css
- plugins/ルックアップ連動/LookupLinkagee/contents/css/config.css
- plugins/ルックアップ連動/LookupLinkagee/contents/css/desktop.css
- plugins/ルックアップ連動/LookupLinkagee/contents/css/mobile.css
- plugins/ルックアップ連動/LookupLinkagee/contents/html/config.html
- plugins/ルックアップ連動/LookupLinkagee/contents/image/icon.png
- plugins/ルックアップ連動/LookupLinkagee/contents/js/certification.js.obfuscated.js
- plugins/ルックアップ連動/LookupLinkagee/contents/js/config.js.obfuscated.js
- plugins/ルックアップ連動/LookupLinkagee/contents/js/desktop.js.obfuscated.js
- plugins/ルックアップ連動/LookupLinkagee/contents/js/mobile.js.obfuscated.js
- plugins/ルックアップ連動/LookupLinkagee/contents/manifest.json
- plugins/ルックアップ連動/Manual.md
- plugins/ルックアップ連動/codex/handover-2026-06-23.md
- plugins/ルックアップ連動/codex/next-tasks.md
- plugins/ルックアップ連動/codex/test-plan.md
- plugins/ルックアップ連動/codex/troubleshooting.md
- plugins/ルックアップ連動/codex/work-instructions.md
- plugins/ルックアップ連動/decisions/README.md
- plugins/ルックアップ連動/specification.md

## 3. manifest.json解析

- ファイル: plugins/ルックアップ連動/LookupLinkage/contents/manifest.json
- name: ルックアップ連動プラグイン
- version: 1.0.5
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, https://js.cybozu.com/kintone-rest-api-client/2.0.37/KintoneRestAPIClient.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/ルックアップ連動/LookupLinkage
- 難読化版場所: plugins/ルックアップ連動/LookupLinkagee（参考扱い）
- plugins/ルックアップ連動/LookupLinkage/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js: events=0, api=2, dom=0, config=8, subtable=22, console=1
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js: events=6, api=2, dom=0, config=4, subtable=18, console=2
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js: events=6, api=2, dom=0, config=4, subtable=18, console=2

## 5. HTML解析

- plugins/ルックアップ連動/LookupLinkage/contents/html/config.html

## 6. CSS解析

- plugins/ルックアップ連動/LookupLinkage/contents/css/51-modern-default.css
- plugins/ルックアップ連動/LookupLinkage/contents/css/config.css
- plugins/ルックアップ連動/LookupLinkage/contents/css/desktop.css
- plugins/ルックアップ連動/LookupLinkage/contents/css/mobile.css

## 7. 設定値解析

- plugins/ルックアップ連動/LookupLinkage/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:11: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:79: config.lookupField = JSON.parse(config.lookupField);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:80: config.fields = JSON.parse(config.fields);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:81: config.isTable = JSON.parse(config.isTable);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:841: value.lookupField = JSON.stringify(value.lookupField);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:842: value.fields = JSON.stringify(value.fields);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:843: value.isTable = JSON.stringify(value.isTable);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:845: kintone.plugin.app.setConfig(value);
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:14: config.lookupField = JSON.parse(config.lookupField);
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:15: config.fields = JSON.parse(config.fields);
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:16: config.isTable = JSON.parse(config.isTable);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:14: config.lookupField = JSON.parse(config.lookupField);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:15: config.fields = JSON.parse(config.fields);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:16: config.isTable = JSON.parse(config.isTable);

## 8. kintoneイベント解析

- app.record.create.change.
- app.record.create.show
- app.record.edit.change.
- app.record.edit.show
- app.record.get
- app.record.index.show
- mobile.app.record.create.change.
- mobile.app.record.create.show
- mobile.app.record.edit.change.
- mobile.app.record.edit.show
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:547: const { properties } = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', { app: appId });
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:610: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:92: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:267: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:92: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:268: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

## 10. DOM操作解析

- 該当処理は確認できなかった

## 11. サブテーブル関連解析

- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:109: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:138: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:179: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:208: if (lookupField.split('　').length === 2) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:209: lookupField = lookupField.split('　')[1];
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:229: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:267: if (lookupField.split('　').length === 2) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:268: lookupField = lookupField.split('　')[1];
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:281: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:310: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:360: 'SUBTABLE',
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:555: if (property.type === 'SUBTABLE') {
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:597: * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合は実引数を入力しない]
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:604: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:637: } else if (row.type === 'SUBTABLE') {
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:687: //   if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:688: //     var code = field.code.split('　')[1];
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:699: //   if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:762: if(field.type == "SUBTABLE") sTableList.push(field.code);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:766: if(field.type == "SUBTABLE") dTableList.push(field.code);
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:771: const parts = item.sourceField.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/config.js:772: const partd = item.destinationField.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:112: if (!event.changes.row.value[code] || !event.changes.row.value[code].value) return;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:113: var lookupText = event.changes.row.value[code].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:128: const destinationFieldSplit = field.destinationField.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:136: const sourceFieldSplit = field.sourceField.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:160: const sourceRows = sourceRecord[sourceTable].value.length;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:161: const destinationRows = event.record[destinationTable].value.length;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:166: if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:167: event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:196: if (newRow.value.hasOwnProperty(destinationField) && row.value[sourceField]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:197: newRow.value[destinationField].value = row.value[sourceField].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:198: newRow.value[destinationField].type = row.value[sourceField].type || newRow.value[destinationField].type;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:207: if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:208: event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:230: if (code.split('　').length === 2) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:231: if (record[code.split('　')[0]]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:242: const parts = code.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:263: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/ルックアップ連動/LookupLinkage/contents/js/desktop.js:272: else if (row.type === 'SUBTABLE') {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:113: if (!event.changes.row.value[code] || !event.changes.row.value[code].value) return;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:114: var lookupText = event.changes.row.value[code].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:129: const destinationFieldSplit = field.destinationField.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:137: const sourceFieldSplit = field.sourceField.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:161: const sourceRows = sourceRecord[sourceTable].value.length;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:162: const destinationRows = event.record[destinationTable].value.length;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:167: if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:168: event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:197: if (newRow.value.hasOwnProperty(destinationField) && row.value[sourceField]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:198: newRow.value[destinationField].value = row.value[sourceField].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:199: newRow.value[destinationField].type = row.value[sourceField].type || newRow.value[destinationField].type;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:208: if (event.record[destinationTable].value[j].value.hasOwnProperty(destinationField) && row.value[sourceField]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:209: event.record[destinationTable].value[j].value[destinationField].value = row.value[sourceField].value;
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:231: if (code.split('　').length === 2) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:232: if (record[code.split('　')[0]]) {
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:243: const parts = code.split('　');
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:264: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:273: else if (row.type === 'SUBTABLE') {

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-004

#### 該当する可能性が高いファイル

- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js

#### 該当する可能性が高い関数

- obj.eventStart（34行付近）

#### 関連するkintoneイベント

- app.record.get
- mobile.app.record.create.change.
- mobile.app.record.create.show
- mobile.app.record.edit.change.
- mobile.app.record.edit.show
- mobile.app.record.index.show

#### 関連する設定値

- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:14: config.lookupField = JSON.parse(config.lookupField);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:15: config.fields = JSON.parse(config.fields);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:16: config.isTable = JSON.parse(config.isTable);

#### 関連するAPI

- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:92: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:268: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: mobile.js内で `kintone.app.getId()` を使用している。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。

#### 影響範囲

- コード上で確認済み: モバイルでルックアップ設定確認処理が失敗し、以降の連動処理にも影響する可能性がある。
- 画面影響: app.record.get, mobile.app.record.create.change., mobile.app.record.create.show, mobile.app.record.edit.change., mobile.app.record.edit.show, mobile.app.record.index.show

#### 修正時の注意点

- `kintone.mobile.app.getId()` に置換する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
88:       }
89:     });
90:     //対象ルックアップフィールドの、「ほかのフィールドのコピー」に設定がないときにエラーを表示する。
91:     kintone.events.on(['mobile.app.record.create.show','mobile.app.record.edit.show'],async function (event) {
92:        const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
93:       const fields = resp.properties;
94:       const arr = fields[config.lookupField.code].lookup.fieldMappings.filter(x => x.field == config.lookupField.copyField)
95:     
96:       if(!config.lookupField.copyField || config.lookupField.copyField === '' || arr.length == 0){
97:      
```

### BUG ID: BUG-005

#### 該当する可能性が高いファイル

- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js

#### 該当する可能性が高い関数

- obj.eventStart（34行付近）

#### 関連するkintoneイベント

- app.record.get
- mobile.app.record.create.change.
- mobile.app.record.create.show
- mobile.app.record.edit.change.
- mobile.app.record.edit.show
- mobile.app.record.index.show

#### 関連する設定値

- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:14: config.lookupField = JSON.parse(config.lookupField);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:15: config.fields = JSON.parse(config.fields);
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:16: config.isTable = JSON.parse(config.isTable);

#### 関連するAPI

- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:92: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
- plugins/ルックアップ連動/LookupLinkage/contents/js/mobile.js:268: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: mobile.js内で `kintone.app.record.get()` を使用している。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。

#### 影響範囲

- コード上で確認済み: モバイルのchangeイベントで実行時エラーになり、値連動が止まる可能性が高い。
- 画面影響: app.record.get, mobile.app.record.create.change., mobile.app.record.create.show, mobile.app.record.edit.change., mobile.app.record.edit.show, mobile.app.record.index.show

#### 修正時の注意点

- event.recordを使用するか、mobile用APIへ置換する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
103: 
104:     kintone.events.on(that.events, function (event) {
105: 
106:       setTimeout(function () {
107:         const value = kintone.app.record.get().record[config.lookupField.code].value;
108:         const allRecords = that.getAllRecords(config.lookupField.appId);
109:       }, 500);
110: 
111:       if (that.isInTable(event.record, config.lookupField.code)) {
112:         const code = that.getCodePart(config.lookupField.code);
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
