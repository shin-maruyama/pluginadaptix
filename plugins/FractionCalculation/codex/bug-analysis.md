# FractionCalculation バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-009: No.1 2026-24-06 BUG-009 mobile.jsの設定済みフィールド確認でdesktop APIのgetIdを使用している（重大度: Medium、対象: plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:324）

## 2. 解析対象ファイル一覧

- plugins/FractionCalculation/BUG.md
- plugins/FractionCalculation/FractionCalculation/PUBKEY
- plugins/FractionCalculation/FractionCalculation/SIGNATURE
- plugins/FractionCalculation/FractionCalculation/contents/css/51-modern-default.css
- plugins/FractionCalculation/FractionCalculation/contents/css/config.css
- plugins/FractionCalculation/FractionCalculation/contents/css/desktop.css
- plugins/FractionCalculation/FractionCalculation/contents/css/mobile.css
- plugins/FractionCalculation/FractionCalculation/contents/html/config.html
- plugins/FractionCalculation/FractionCalculation/contents/image/icon.png
- plugins/FractionCalculation/FractionCalculation/contents/js/certification.js
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js
- plugins/FractionCalculation/FractionCalculation/contents/manifest.json
- plugins/FractionCalculation/FractionCalculatione/PUBKEY
- plugins/FractionCalculation/FractionCalculatione/SIGNATURE
- plugins/FractionCalculation/FractionCalculatione/contents/css/51-modern-default.css
- plugins/FractionCalculation/FractionCalculatione/contents/css/config.css
- plugins/FractionCalculation/FractionCalculatione/contents/css/desktop.css
- plugins/FractionCalculation/FractionCalculatione/contents/css/mobile.css
- plugins/FractionCalculation/FractionCalculatione/contents/html/config.html
- plugins/FractionCalculation/FractionCalculatione/contents/image/icon.png
- plugins/FractionCalculation/FractionCalculatione/contents/js/certification.js.obfuscated.js
- plugins/FractionCalculation/FractionCalculatione/contents/js/config.js.obfuscated.js
- plugins/FractionCalculation/FractionCalculatione/contents/js/desktop.js.obfuscated.js
- plugins/FractionCalculation/FractionCalculatione/contents/js/mobile.js.obfuscated.js
- plugins/FractionCalculation/FractionCalculatione/contents/manifest.json
- plugins/FractionCalculation/Manual.md
- plugins/FractionCalculation/codex/handover-2026-06-23.md
- plugins/FractionCalculation/codex/next-tasks.md
- plugins/FractionCalculation/codex/test-plan.md
- plugins/FractionCalculation/codex/troubleshooting.md
- plugins/FractionCalculation/codex/work-instructions.md
- plugins/FractionCalculation/decisions/README.md
- plugins/FractionCalculation/specification.md

## 3. manifest.json解析

- ファイル: plugins/FractionCalculation/FractionCalculation/contents/manifest.json
- name: 端数計算プラグイン
- version: 1.0.2
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/FractionCalculation/FractionCalculation
- 難読化版場所: plugins/FractionCalculation/FractionCalculatione（参考扱い）
- plugins/FractionCalculation/FractionCalculation/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js: events=0, api=2, dom=0, config=4, subtable=14, console=0
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js: events=7, api=1, dom=0, config=2, subtable=20, console=1
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js: events=9, api=1, dom=0, config=2, subtable=20, console=1

## 5. HTML解析

- plugins/FractionCalculation/FractionCalculation/contents/html/config.html

## 6. CSS解析

- plugins/FractionCalculation/FractionCalculation/contents/css/51-modern-default.css
- plugins/FractionCalculation/FractionCalculation/contents/css/config.css
- plugins/FractionCalculation/FractionCalculation/contents/css/desktop.css
- plugins/FractionCalculation/FractionCalculation/contents/css/mobile.css

## 7. 設定値解析

- plugins/FractionCalculation/FractionCalculation/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:20: config  : kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:90: config.settings  = JSON.parse(config.settings);
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:594: value.settings = JSON.stringify(value.settings);
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:596: kintone.plugin.app.setConfig(value);
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:10: config  : kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:141: obj.config.settings = JSON.parse(obj.config.settings);
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:10: config  : kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:141: obj.config.settings = JSON.parse(obj.config.settings);

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

- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:148: resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', { app: kintone.app.getId() });
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:567: await kintone.api(kintone.api.url('/k/v1/app/form/fields', true),'GET',{ app: kintone.app.getId()})
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:323: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:323: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

## 10. DOM操作解析

- 該当処理は確認できなかった

## 11. サブテーブル関連解析

- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:140: * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合false]
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:143: getFieldList : async function(subTable = false) {
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:155: else if(row.type === 'SUBTABLE') {
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:157: if(!subTable) return;
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:181: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:185: if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:186: var code = field.code.split('　')[1];
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:187: var tableCode = field.code.split('　')[0];
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:479: let split = item.method.split("　")
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:481: if(field.type == 'SUBTABLE'){
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:504: let split = item.location.split("　")
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:506: if(field.type == 'SUBTABLE'){
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:530: if (row.type === 'SUBTABLE') tableList.push(row.code);
- plugins/FractionCalculation/FractionCalculation/contents/js/config.js:548: const s = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:162: const s = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:172: const s = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:178: const targetSplit = setting.target.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:180: const methodSplit = setting.method.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:182: const locationSplit = setting.location.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:184: const destinationSplit = setting.destination.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:213: const targetFieldValue   = row.value[targetName].value;
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:214: const methodFieldValue   = outMethodField ? outMethodField.value : row.value[methodName].value;
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:215: const locationFieldValue = outLocationField ? outLocationField.value : row.value[locationName].value;
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:216: const destinationField   = row.value[destinationName];
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:277: const codeSplit = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:293: tableField.value.forEach(row => {
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:294: if(row.value[codeName] === undefined) return;
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:295: const field = row.value[codeName];
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:304: const settingsUsingTable = obj.config.settings.filter(setting => setting.target.split('　').length === 2);
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:307: const tableCode = setting.target.split('　')[0];
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:319: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:328: else if (row.type === 'SUBTABLE') {
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:330: //if (!subTable) return;
- plugins/FractionCalculation/FractionCalculation/contents/js/desktop.js:364: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:162: const s = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:172: const s = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:178: const targetSplit = setting.target.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:180: const methodSplit = setting.method.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:182: const locationSplit = setting.location.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:184: const destinationSplit = setting.destination.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:213: const targetFieldValue   = row.value[targetName].value;
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:214: const methodFieldValue   = outMethodField ? outMethodField.value : row.value[methodName].value;
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:215: const locationFieldValue = outLocationField ? outLocationField.value : row.value[locationName].value;
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:216: const destinationField   = row.value[destinationName];
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:277: const codeSplit = code.split('　');
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:293: tableField.value.forEach(row => {
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:294: if(row.value[codeName] === undefined) return;
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:295: const field = row.value[codeName];
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:304: const settingsUsingTable = obj.config.settings.filter(setting => setting.target.split('　').length === 2);
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:307: const tableCode = setting.target.split('　')[0];
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:319: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:328: else if (row.type === 'SUBTABLE') {
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:330: //if (!subTable) return;
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:364: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-009

#### 該当する可能性が高いファイル

- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js

#### 該当する可能性が高い関数

- getFieldList（315行付近）

#### 関連するkintoneイベント

- app.record.create.show
- app.record.edit.show
- mobile.app.record.create.change.
- mobile.app.record.create.change.${tableCode}
- mobile.app.record.create.show
- mobile.app.record.edit.change.
- mobile.app.record.edit.change.${tableCode}
- mobile.app.record.edit.show
- mobile.app.record.index.show

#### 関連する設定値

- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:10: config  : kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:141: obj.config.settings = JSON.parse(obj.config.settings);

#### 関連するAPI

- plugins/FractionCalculation/FractionCalculation/contents/js/mobile.js:323: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: mobile.jsのフォームレイアウト取得で `kintone.app.getId()` を使用している。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。

#### 影響範囲

- コード上で確認済み: モバイル一覧で設定済みフィールドの存在チェックが失敗し、警告表示が機能しない可能性がある。
- 画面影響: app.record.create.show, app.record.edit.show, mobile.app.record.create.change., mobile.app.record.create.change.${tableCode}, mobile.app.record.create.show, mobile.app.record.edit.change., mobile.app.record.edit.change.${tableCode}, mobile.app.record.edit.show, mobile.app.record.index.show

#### 修正時の注意点

- `kintone.mobile.app.getId()` を利用する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
320:      ];
321: 
322:      try {
323:       const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
324:         app: kintone.app.getId(),
325:       });
326:       resp.layout.forEach((row) => {
327:         if (row.type === 'ROW') row.fields.forEach((field) => fieldList.push(field));
328:         else if (row.type === 'SUBTABLE') {
329:           fieldList.push(row);
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
