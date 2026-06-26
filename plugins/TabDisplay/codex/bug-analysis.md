# TabDisplay バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-007: No.1 2026-24-06 BUG-007 mobile.jsでdesktop用グループ開閉APIを使用している（重大度: High、対象: plugins/TabDisplay/TabDisplay/contents/js/mobile.js:66）
- BUG-013: No.2 2026-24-06 BUG-013 desktop.jsでDOM取得結果のnullチェックが不足している（重大度: High、対象: plugins/TabDisplay/TabDisplay/contents/js/desktop.js:82）

## 2. 解析対象ファイル一覧

- plugins/TabDisplay/BUG.md
- plugins/TabDisplay/Manual.md
- plugins/TabDisplay/TabDisplay.ppk
- plugins/TabDisplay/TabDisplay/PUBKEY
- plugins/TabDisplay/TabDisplay/SIGNATURE
- plugins/TabDisplay/TabDisplay/contents/css/51-modern-default.css
- plugins/TabDisplay/TabDisplay/contents/css/config.css
- plugins/TabDisplay/TabDisplay/contents/css/desktop.css
- plugins/TabDisplay/TabDisplay/contents/css/mobile.css
- plugins/TabDisplay/TabDisplay/contents/html/config.html
- plugins/TabDisplay/TabDisplay/contents/image/icon.png
- plugins/TabDisplay/TabDisplay/contents/js/certification.js
- plugins/TabDisplay/TabDisplay/contents/js/config.js
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js
- plugins/TabDisplay/TabDisplay/contents/manifest.json
- plugins/TabDisplay/TabDisplaye/PUBKEY
- plugins/TabDisplay/TabDisplaye/SIGNATURE
- plugins/TabDisplay/TabDisplaye/contents/css/51-modern-default.css
- plugins/TabDisplay/TabDisplaye/contents/css/config.css
- plugins/TabDisplay/TabDisplaye/contents/css/desktop.css
- plugins/TabDisplay/TabDisplaye/contents/css/mobile.css
- plugins/TabDisplay/TabDisplaye/contents/html/config.html
- plugins/TabDisplay/TabDisplaye/contents/image/icon.png
- plugins/TabDisplay/TabDisplaye/contents/js/certification.js.obfuscated.js
- plugins/TabDisplay/TabDisplaye/contents/js/config.js.obfuscated.js
- plugins/TabDisplay/TabDisplaye/contents/js/desktop.js.obfuscated.js
- plugins/TabDisplay/TabDisplaye/contents/js/mobile.js.obfuscated.js
- plugins/TabDisplay/TabDisplaye/contents/manifest.json
- plugins/TabDisplay/codex/handover-2026-06-23.md
- plugins/TabDisplay/codex/next-tasks.md
- plugins/TabDisplay/codex/test-plan.md
- plugins/TabDisplay/codex/troubleshooting.md
- plugins/TabDisplay/codex/work-instructions.md
- plugins/TabDisplay/decisions/README.md
- plugins/TabDisplay/specification.md

## 3. manifest.json解析

- ファイル: plugins/TabDisplay/TabDisplay/contents/manifest.json
- name: TAB表示プラグイン
- version: 2.0.7
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/TabDisplay/TabDisplay
- 難読化版場所: plugins/TabDisplay/TabDisplaye（参考扱い）
- plugins/TabDisplay/TabDisplay/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/TabDisplay/TabDisplay/contents/js/config.js: events=0, api=1, dom=0, config=8, subtable=3, console=2
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js: events=8, api=1, dom=18, config=8, subtable=6, console=0
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js: events=7, api=1, dom=5, config=4, subtable=3, console=0

## 5. HTML解析

- plugins/TabDisplay/TabDisplay/contents/html/config.html

## 6. CSS解析

- plugins/TabDisplay/TabDisplay/contents/css/51-modern-default.css
- plugins/TabDisplay/TabDisplay/contents/css/config.css
- plugins/TabDisplay/TabDisplay/contents/css/desktop.css
- plugins/TabDisplay/TabDisplay/contents/css/mobile.css

## 7. 設定値解析

- plugins/TabDisplay/TabDisplay/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:17: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:129: config.settings = JSON.parse(config.settings);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:130: config.buttonHideChecked = JSON.parse(config.buttonHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:131: config.fieldNameHideChecked = JSON.parse(config.fieldNameHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:631: value.settings = JSON.stringify(value.settings);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:632: value.buttonHideChecked = JSON.stringify(value.buttonHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:633: value.fieldNameHideChecked = JSON.stringify(value.fieldNameHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:635: kintone.plugin.app.setConfig(value);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:26: obj.config.settings = JSON.parse(obj.config.settings);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:27: obj.config.buttonHideChecked = JSON.parse(obj.config.buttonHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:28: obj.config.fieldNameHideChecked = JSON.parse(obj.config.fieldNameHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:84: const hiddenFieldParse = JSON.parse(hiddenField)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:93: const hiddenFieldParse = JSON.parse(hiddenField)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:221: const getAttributeParse = JSON.parse(getAttribute)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:232: const getAttributeParse = JSON.parse(getAttribute)
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:26: obj.config.settings = JSON.parse(obj.config.settings);
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:27: obj.config.buttonHideChecked = JSON.parse(obj.config.buttonHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:28: obj.config.fieldNameHideChecked = JSON.parse(obj.config.fieldNameHideChecked);

## 8. kintoneイベント解析

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.getSpaceElement
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.edit.show
- mobile.app.record.getSpaceElement
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/TabDisplay/TabDisplay/contents/js/config.js:341: const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:265: const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:178: const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.mobile.app.getId() });

## 10. DOM操作解析

- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:66: kintone.app.record.setGroupFieldOpen(field.code, true);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:75: fieldList.forEach((field) => {kintone.app.record.setFieldShown(field.code, false);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:78: fieldWrap2 = document.querySelector(`.field-${field.id}`);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:80: fieldWrap2 = document.querySelector(`.subtable-row-${field.id}`)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:87: kintone.app.record.setFieldShown(y, false)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:96: kintone.app.record.setFieldShown(y, false)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:213: fieldWrap2 = document.querySelector(`.field-${field.id}`);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:215: fieldWrap2 = document.querySelector(`.subtable-row-${field.id}`)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:218: kintone.app.record.setFieldShown(field.code, true)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:222: const option = fieldWrap2.querySelector('.control-value-gaia span').textContent;
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:226: kintone.app.record.setFieldShown(split, true)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:233: const querySelector = kintone.app.record.getFieldElement(field.code)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:235: if(querySelector != null){
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:236: option = querySelector.textContent;
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:238: option = fieldWrap2.querySelector('input[type="radio"]:checked').value
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:243: kintone.app.record.setFieldShown(split, true)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:255: fieldWrap2 = document.querySelector(`.field-${target.id}`)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:257: fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`)
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:66: kintone.app.record.setGroupFieldOpen(field.code, true);
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:75: fieldList.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, false));
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:81: fieldList.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, true));
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:87: fieldList.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, true));
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:145: setting.fields.forEach((field) => kintone.mobile.app.record.setFieldShown(field.code, true));

## 11. サブテーブル関連解析

- plugins/TabDisplay/TabDisplay/contents/js/config.js:351: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/TabDisplay/TabDisplay/contents/js/config.js:378: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/TabDisplay/TabDisplay/contents/js/config.js:387: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:77: if(field.type != "SUBTABLE"){
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:212: if(field.type != "SUBTABLE"){
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:251: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:275: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:302: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:311: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:188: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:215: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:224: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-007

#### 該当する可能性が高いファイル

- plugins/TabDisplay/TabDisplay/contents/js/mobile.js

#### 該当する可能性が高い関数

- groupNameHide（58行付近）

#### 関連するkintoneイベント

- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.edit.show
- mobile.app.record.getSpaceElement
- mobile.app.record.index.show

#### 関連する設定値

- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:26: obj.config.settings = JSON.parse(obj.config.settings);
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:27: obj.config.buttonHideChecked = JSON.parse(obj.config.buttonHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:28: obj.config.fieldNameHideChecked = JSON.parse(obj.config.fieldNameHideChecked);

#### 関連するAPI

- plugins/TabDisplay/TabDisplay/contents/js/mobile.js:178: const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.mobile.app.getId() });

#### 原因候補

- コード上で確認済み: mobile.js内で `kintone.app.record.setGroupFieldOpen` を使用している。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。

#### 影響範囲

- コード上で確認済み: モバイルでグループを含む設定時に実行時エラーとなり、タブ表示全体が止まる可能性がある。
- 画面影響: mobile.app.record.create.show, mobile.app.record.detail.show, mobile.app.record.edit.show, mobile.app.record.getSpaceElement, mobile.app.record.index.show

#### 修正時の注意点

- mobileでサポートされるAPIの有無を確認し、未対応ならモバイルでは該当処理をスキップする。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
62:       const fieldList2 = await obj.getFieldList2();
63:       const type = ['GROUP'];
64:       const filterFieldList = fieldList2.filter((x) => type.includes(x.type));
65:       for (const field of filterFieldList) {
66:         kintone.app.record.setGroupFieldOpen(field.code, true);
67:       }
68:       // 非表示にする
69:       $('.group-label-gaia').hide();
70:     },
71: 
```

### BUG ID: BUG-013

#### 該当する可能性が高いファイル

- plugins/TabDisplay/TabDisplay/contents/js/desktop.js

#### 該当する可能性が高い関数

- allFieldHide（73行付近）

#### 関連するkintoneイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.getSpaceElement
- app.record.index.show

#### 関連する設定値

- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:9: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:26: obj.config.settings = JSON.parse(obj.config.settings);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:27: obj.config.buttonHideChecked = JSON.parse(obj.config.buttonHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:28: obj.config.fieldNameHideChecked = JSON.parse(obj.config.fieldNameHideChecked);
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:84: const hiddenFieldParse = JSON.parse(hiddenField)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:93: const hiddenFieldParse = JSON.parse(hiddenField)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:221: const getAttributeParse = JSON.parse(getAttribute)
- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:232: const getAttributeParse = JSON.parse(getAttribute)

#### 関連するAPI

- plugins/TabDisplay/TabDisplay/contents/js/desktop.js:265: const resp = await kintone.api('/k/v1/app/form/layout.json', 'GET', { app: kintone.app.getId() });

#### 原因候補

- コード上で確認済み: `fieldWrap2` がnullの可能性があるまま `hasAttribute` を呼んでいる。
- コード上で確認済み: DOM取得結果のnullチェック不足が対象行周辺にある。

#### 影響範囲

- コード上で確認済み: 対象フィールドDOMが存在しない条件でタブ表示処理が停止する。
- 画面影響: app.record.create.show, app.record.detail.show, app.record.edit.show, app.record.getSpaceElement, app.record.index.show

#### 修正時の注意点

- DOM取得結果のnullチェックを追加する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
78:             fieldWrap2 = document.querySelector(`.field-${field.id}`);
79:           }else{
80:             fieldWrap2 = document.querySelector(`.subtable-row-${field.id}`)
81:           }
82:           if(fieldWrap2.hasAttribute('dropdownplugin')){
83:             const hiddenField = fieldWrap2.getAttribute('dropdownplugin')
84:             const hiddenFieldParse = JSON.parse(hiddenField)
85:             hiddenFieldParse.forEach((x) => {
86:               x.fields.forEach((y) => {
87:                 kintone.app.record.setFieldShown(y, false)
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
