# InputHintSetting バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-016: No.1 2026-24-06 BUG-016 空のサブテーブルで存在チェックがTypeErrorになる（重大度: High、対象: plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:64）
- BUG-006: No.2 2026-24-06 BUG-006 mobile.jsのサブテーブル行追加イベントがdesktopイベント名になっている（重大度: Medium、対象: plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:80）

## 2. 解析対象ファイル一覧

- plugins/入力ヒント設定/BUG.md
- plugins/入力ヒント設定/InputHintSetting/PUBKEY
- plugins/入力ヒント設定/InputHintSetting/SIGNATURE
- plugins/入力ヒント設定/InputHintSetting/contents/css/51-modern-default.css
- plugins/入力ヒント設定/InputHintSetting/contents/css/config.css
- plugins/入力ヒント設定/InputHintSetting/contents/css/desktop.css
- plugins/入力ヒント設定/InputHintSetting/contents/css/mobile.css
- plugins/入力ヒント設定/InputHintSetting/contents/html/config.html
- plugins/入力ヒント設定/InputHintSetting/contents/image/icon.png
- plugins/入力ヒント設定/InputHintSetting/contents/js/certification.js
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js
- plugins/入力ヒント設定/InputHintSetting/contents/manifest.json
- plugins/入力ヒント設定/InputHintSettinge/PUBKEY
- plugins/入力ヒント設定/InputHintSettinge/SIGNATURE
- plugins/入力ヒント設定/InputHintSettinge/contents/css/51-modern-default.css
- plugins/入力ヒント設定/InputHintSettinge/contents/css/config.css
- plugins/入力ヒント設定/InputHintSettinge/contents/css/desktop.css
- plugins/入力ヒント設定/InputHintSettinge/contents/css/mobile.css
- plugins/入力ヒント設定/InputHintSettinge/contents/html/config.html
- plugins/入力ヒント設定/InputHintSettinge/contents/image/icon.png
- plugins/入力ヒント設定/InputHintSettinge/contents/js/certification.js.obfuscated.js
- plugins/入力ヒント設定/InputHintSettinge/contents/js/config.js.obfuscated.js
- plugins/入力ヒント設定/InputHintSettinge/contents/js/desktop.js.obfuscated.js
- plugins/入力ヒント設定/InputHintSettinge/contents/js/mobile.js.obfuscated.js
- plugins/入力ヒント設定/InputHintSettinge/contents/manifest.json
- plugins/入力ヒント設定/Manual.md
- plugins/入力ヒント設定/codex/handover-2026-06-23.md
- plugins/入力ヒント設定/codex/next-tasks.md
- plugins/入力ヒント設定/codex/test-plan.md
- plugins/入力ヒント設定/codex/troubleshooting.md
- plugins/入力ヒント設定/codex/work-instructions.md
- plugins/入力ヒント設定/decisions/README.md
- plugins/入力ヒント設定/specification.md

## 3. manifest.json解析

- ファイル: plugins/入力ヒント設定/InputHintSetting/contents/manifest.json
- name: 入力ヒント設定プラグイン
- version: 2.0.6
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://unpkg.com/@popperjs/core@2, https://unpkg.com/tippy.js@6, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, https://unpkg.com/@popperjs/core@2, https://unpkg.com/tippy.js@6, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/入力ヒント設定/InputHintSetting
- 難読化版場所: plugins/入力ヒント設定/InputHintSettinge（参考扱い）
- plugins/入力ヒント設定/InputHintSetting/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js: events=0, api=1, dom=0, config=4, subtable=7, console=1
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js: events=5, api=1, dom=1, config=2, subtable=14, console=1
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js: events=5, api=1, dom=2, config=2, subtable=13, console=1

## 5. HTML解析

- plugins/入力ヒント設定/InputHintSetting/contents/html/config.html

## 6. CSS解析

- plugins/入力ヒント設定/InputHintSetting/contents/css/51-modern-default.css
- plugins/入力ヒント設定/InputHintSetting/contents/css/config.css
- plugins/入力ヒント設定/InputHintSetting/contents/css/desktop.css
- plugins/入力ヒント設定/InputHintSetting/contents/css/mobile.css

## 7. 設定値解析

- plugins/入力ヒント設定/InputHintSetting/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:17: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:106: config.settings = JSON.parse(config.settings);
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:481: value.settings = JSON.stringify(value.settings);
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:483: kintone.plugin.app.setConfig(value);
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:36: obj.config.settings = JSON.parse(obj.config.settings);
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:36: obj.config.settings = JSON.parse(obj.config.settings);

## 8. kintoneイベント解析

- app.record.create.change.${tableCode}
- app.record.create.show
- app.record.edit.change.${tableCode}
- app.record.edit.show
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.edit.show
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:255: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:174: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:174: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

## 10. DOM操作解析

- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:108: tippy(row.querySelector(`.value-${setting.tipSettingField.id.split('　')[1]}`), {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:107: for (const row of document.querySelectorAll(`.subtable-${setting.tipSettingField.id.split('　')[0]} .subtable-row-gaia`)) {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:108: tippy(row.querySelector(`.value-${setting.tipSettingField.id.split('　')[1]}`), {

## 11. サブテーブル関連解析

- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:92: 'SUBTABLE',
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:209: 'SUBTABLE',
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:244: * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合false]
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:247: getFieldList: async function (subTable = false) {
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:251: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:264: else if (row.type === 'SUBTABLE') {
- plugins/入力ヒント設定/InputHintSetting/contents/js/config.js:266: if (!subTable) return;
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:49: const settingTipSettingFieldCodeSplit = setting.tipSettingField.code.split('　')
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:73: (setting) => setting.tipSettingField.code.split('　').length === 2
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:77: const tableCode = setting.tipSettingField.code.split('　')[0];
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:91: const tipSettingFieldCodeSplit = setting.tipSettingField.code.split('　')
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:92: const tipSettingFieldIdSplit = setting.tipSettingField.id.split('　')
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:107: for (const row of $(`.subtable-${setting.tipSettingField.id.split('　')[0]} tbody tr`)) {
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:108: tippy(row.querySelector(`.value-${setting.tipSettingField.id.split('　')[1]}`), {
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:167: getFieldList: async function (subTable = false) {
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:171: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:179: else if (row.type === 'SUBTABLE') {
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:181: //if (!subTable) return;
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:206: if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:207: var code = field.code.split('　')[1];
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:217: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:49: const settingTipSettingFieldCodeSplit = setting.tipSettingField.code.split('　')
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:73: (setting) => setting.tipSettingField.code.split('　').length === 2
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:77: const tableCode = setting.tipSettingField.code.split('　')[0];
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:91: const tipSettingFieldCodeSplit = setting.tipSettingField.code.split('　')
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:92: const tipSettingFieldIdSplit = setting.tipSettingField.id.split('　')
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:107: for (const row of document.querySelectorAll(`.subtable-${setting.tipSettingField.id.split('　')[0]} .subtable-row-gaia`)) {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:108: tippy(row.querySelector(`.value-${setting.tipSettingField.id.split('　')[1]}`), {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:171: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:179: else if (row.type === 'SUBTABLE') {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:181: //if (!subTable) return;
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:206: if (field.code.split('　').length === 2 && field.type !== 'SUBTABLE') {
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:207: var code = field.code.split('　')[1];
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:217: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-016

#### 該当する可能性が高いファイル

- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js

#### 該当する可能性が高い関数

- existenceCheck（47行付近）

#### 関連するkintoneイベント

- app.record.create.change.${tableCode}
- app.record.create.show
- app.record.edit.change.${tableCode}
- app.record.edit.show
- app.record.index.show

#### 関連する設定値

- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:36: obj.config.settings = JSON.parse(obj.config.settings);

#### 関連するAPI

- plugins/入力ヒント設定/InputHintSetting/contents/js/desktop.js:174: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: サブテーブルの先頭行 `value[0]` が存在する前提で存在チェックしている。
- コード上で確認済み: サブテーブルの行存在確認前に value[0] を参照している。

#### 影響範囲

- コード上で確認済み: 空のサブテーブルで入力ヒント設定処理が落ちる可能性がある。
- 画面影響: app.record.create.change.${tableCode}, app.record.create.show, app.record.edit.change.${tableCode}, app.record.edit.show, app.record.index.show

#### 修正時の注意点

- 空行時はDOM/フィールド定義ベースで判定する。mobile.jsも同様確認。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
60:         return false;
61:       } else {
62:         const tableField = record[tableCode];
63:         const field = settingTipSettingFieldCodeName;
64:           const tipSettingField = tableField.value[0].value[field];
65:           if (!tipSettingField) return true;
66:           return false;
67:         }
68:     },
69: 
```

### BUG ID: BUG-006

#### 該当する可能性が高いファイル

- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js

#### 該当する可能性が高い関数

- tableChangeEventCreate（70行付近）

#### 関連するkintoneイベント

- app.record.create.change.${tableCode}
- app.record.edit.change.${tableCode}
- mobile.app.record.create.show
- mobile.app.record.edit.show
- mobile.app.record.index.show

#### 関連する設定値

- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:36: obj.config.settings = JSON.parse(obj.config.settings);

#### 関連するAPI

- plugins/入力ヒント設定/InputHintSetting/contents/js/mobile.js:174: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: mobile.js内のテーブル変更イベント登録が `app.record.*` になっている。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。
- コード上で確認済み: サブテーブルの行存在確認前に value[0] を参照している。

#### 影響範囲

- コード上で確認済み: モバイルでサブテーブル行追加後、追加行に入力ヒントが付与されない。
- 画面影響: app.record.create.change.${tableCode}, app.record.edit.change.${tableCode}, mobile.app.record.create.show, mobile.app.record.edit.show, mobile.app.record.index.show

#### 修正時の注意点

- `mobile.app.record.*` のテーブル変更イベントへ置換する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
76:             for (const setting of settingsUsingTable) {
77:                 const tableCode = setting.tipSettingField.code.split('　')[0];
78:                 if (event.record[tableCode]) {
79:                     kintone.events.on(
80:                         [`app.record.create.change.${tableCode}`, `app.record.edit.change.${tableCode}`],
81:                         function (e) {
82:                             obj.tipSetting(setting, e);
83:                             return e;
84:                         }
85:                     );
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
