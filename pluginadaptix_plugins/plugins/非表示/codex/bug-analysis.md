# FieldHidden バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-011: No.1 2026-24-06 BUG-011 DOM取得失敗時にnullへhasAttributeを呼ぶ（重大度: High、対象: plugins/非表示/FieldHidden/contents/js/desktop.js:61）
- BUG-012: No.2 2026-24-06 BUG-012 関連属性の該当設定がない場合にfields参照で落ちる（重大度: High、対象: plugins/非表示/FieldHidden/contents/js/desktop.js:66）
- BUG-022: No.3 2026-24-06 BUG-022 設定未保存/破損時にJSON.parseでロード失敗する（重大度: Medium、対象: plugins/非表示/FieldHidden/contents/js/desktop.js:9）

## 2. 解析対象ファイル一覧

- plugins/非表示/BUG.md
- plugins/非表示/FieldHidden/PUBKEY
- plugins/非表示/FieldHidden/SIGNATURE
- plugins/非表示/FieldHidden/contents/css/51-modern-default.css
- plugins/非表示/FieldHidden/contents/css/config.css
- plugins/非表示/FieldHidden/contents/css/desktop.css
- plugins/非表示/FieldHidden/contents/css/mobile.css
- plugins/非表示/FieldHidden/contents/html/config.html
- plugins/非表示/FieldHidden/contents/image/icon.png
- plugins/非表示/FieldHidden/contents/js/certification.js
- plugins/非表示/FieldHidden/contents/js/config.js
- plugins/非表示/FieldHidden/contents/js/desktop.js
- plugins/非表示/FieldHidden/contents/js/mobile.js
- plugins/非表示/FieldHidden/contents/manifest.json
- plugins/非表示/FieldHiddene/PUBKEY
- plugins/非表示/FieldHiddene/SIGNATURE
- plugins/非表示/FieldHiddene/contents/css/51-modern-default.css
- plugins/非表示/FieldHiddene/contents/css/config.css
- plugins/非表示/FieldHiddene/contents/css/desktop.css
- plugins/非表示/FieldHiddene/contents/css/mobile.css
- plugins/非表示/FieldHiddene/contents/html/config.html
- plugins/非表示/FieldHiddene/contents/image/icon.png
- plugins/非表示/FieldHiddene/contents/js/certification.js.obfuscated.js
- plugins/非表示/FieldHiddene/contents/js/config.js.obfuscated.js
- plugins/非表示/FieldHiddene/contents/js/desktop.js.obfuscated.js
- plugins/非表示/FieldHiddene/contents/js/mobile.js.obfuscated.js
- plugins/非表示/FieldHiddene/contents/manifest.json
- plugins/非表示/Manual.md
- plugins/非表示/codex/handover-2026-06-23.md
- plugins/非表示/codex/next-tasks.md
- plugins/非表示/codex/test-plan.md
- plugins/非表示/codex/troubleshooting.md
- plugins/非表示/codex/work-instructions.md
- plugins/非表示/decisions/README.md
- plugins/非表示/specification.md

## 3. manifest.json解析

- ファイル: plugins/非表示/FieldHidden/contents/manifest.json
- name: 非表示プラグイン
- version: 2.0.10
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/非表示/FieldHidden
- 難読化版場所: plugins/非表示/FieldHiddene（参考扱い）
- plugins/非表示/FieldHidden/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/非表示/FieldHidden/contents/js/config.js: events=0, api=1, dom=0, config=4, subtable=4, console=2
- plugins/非表示/FieldHidden/contents/js/desktop.js: events=6, api=2, dom=12, config=4, subtable=6, console=0
- plugins/非表示/FieldHidden/contents/js/mobile.js: events=5, api=1, dom=2, config=2, subtable=4, console=1

## 5. HTML解析

- plugins/非表示/FieldHidden/contents/html/config.html

## 6. CSS解析

- plugins/非表示/FieldHidden/contents/css/51-modern-default.css
- plugins/非表示/FieldHidden/contents/css/config.css
- plugins/非表示/FieldHidden/contents/css/desktop.css
- plugins/非表示/FieldHidden/contents/css/mobile.css

## 7. 設定値解析

- plugins/非表示/FieldHidden/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/非表示/FieldHidden/contents/js/config.js:20: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/非表示/FieldHidden/contents/js/config.js:32: const dropList = JSON.parse(config.elementArray);
- plugins/非表示/FieldHidden/contents/js/config.js:179: const config = { elementArray: JSON.stringify(elementArray), width: width };
- plugins/非表示/FieldHidden/contents/js/config.js:180: kintone.plugin.app.setConfig(config);
- plugins/非表示/FieldHidden/contents/js/desktop.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/非表示/FieldHidden/contents/js/desktop.js:9: const select = JSON.parse(config.elementArray);
- plugins/非表示/FieldHidden/contents/js/desktop.js:63: const getAttributeParse = JSON.parse(getAttribute)
- plugins/非表示/FieldHidden/contents/js/desktop.js:70: const getAttributeParse = JSON.parse(getAttribute)
- plugins/非表示/FieldHidden/contents/js/mobile.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/非表示/FieldHidden/contents/js/mobile.js:9: const select = JSON.parse(config.elementArray);

## 8. kintoneイベント解析

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.edit.show
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/非表示/FieldHidden/contents/js/config.js:210: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/非表示/FieldHidden/contents/js/desktop.js:19: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/非表示/FieldHidden/contents/js/desktop.js:165: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/非表示/FieldHidden/contents/js/mobile.js:101: const resp = await kintone.api(

## 10. DOM操作解析

- plugins/非表示/FieldHidden/contents/js/desktop.js:32: kintone.app.record.setFieldShown(fieldCode, false);
- plugins/非表示/FieldHidden/contents/js/desktop.js:56: fieldWrap2 = document.querySelector(`.field-${target.id}`);
- plugins/非表示/FieldHidden/contents/js/desktop.js:58: fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`)
- plugins/非表示/FieldHidden/contents/js/desktop.js:64: const option = fieldWrap2.querySelector('.control-value-gaia span').textContent;
- plugins/非表示/FieldHidden/contents/js/desktop.js:66: getAttributeTarget.fields.forEach((split) => kintone.app.record.setFieldShown(split, true))
- plugins/非表示/FieldHidden/contents/js/desktop.js:71: const querySelector = kintone.app.record.getFieldElement(target.var)
- plugins/非表示/FieldHidden/contents/js/desktop.js:73: if(querySelector != null){
- plugins/非表示/FieldHidden/contents/js/desktop.js:74: option = querySelector.textContent;
- plugins/非表示/FieldHidden/contents/js/desktop.js:76: option = fieldWrap2.querySelector('input[type="radio"]:checked').value
- plugins/非表示/FieldHidden/contents/js/desktop.js:79: getAttributeTarget.fields.forEach((split) => kintone.app.record.setFieldShown(split, true))
- plugins/非表示/FieldHidden/contents/js/desktop.js:97: const fieldWrap2 = document.querySelector(`.field-${target.id}`);
- plugins/非表示/FieldHidden/contents/js/desktop.js:100: const fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`);
- plugins/非表示/FieldHidden/contents/js/mobile.js:22: kintone.mobile.app.record.setFieldShown(val, false);
- plugins/非表示/FieldHidden/contents/js/mobile.js:28: kintone.mobile.app.record.setFieldShown(fieldName, false);

## 11. サブテーブル関連解析

- plugins/非表示/FieldHidden/contents/js/config.js:215: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/非表示/FieldHidden/contents/js/config.js:222: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/非表示/FieldHidden/contents/js/config.js:229: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/非表示/FieldHidden/contents/js/config.js:271: } else if (row.type === 'SUBTABLE') {
- plugins/非表示/FieldHidden/contents/js/desktop.js:45: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
- plugins/非表示/FieldHidden/contents/js/desktop.js:92: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/非表示/FieldHidden/contents/js/desktop.js:170: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/非表示/FieldHidden/contents/js/desktop.js:176: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/非表示/FieldHidden/contents/js/desktop.js:183: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/非表示/FieldHidden/contents/js/desktop.js:206: } else if (row.type === 'SUBTABLE') {
- plugins/非表示/FieldHidden/contents/js/mobile.js:114: } else if (row.type === 'SUBTABLE') {
- plugins/非表示/FieldHidden/contents/js/mobile.js:132: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)
- plugins/非表示/FieldHidden/contents/js/mobile.js:145: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/非表示/FieldHidden/contents/js/mobile.js:189: } else if (row.type === 'SUBTABLE') {

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-011

#### 該当する可能性が高いファイル

- plugins/非表示/FieldHidden/contents/js/desktop.js

#### 該当する可能性が高い関数

- relatedFieldsGet（41行付近）

#### 関連するkintoneイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.index.show

#### 関連する設定値

- plugins/非表示/FieldHidden/contents/js/desktop.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/非表示/FieldHidden/contents/js/desktop.js:9: const select = JSON.parse(config.elementArray);
- plugins/非表示/FieldHidden/contents/js/desktop.js:63: const getAttributeParse = JSON.parse(getAttribute)
- plugins/非表示/FieldHidden/contents/js/desktop.js:70: const getAttributeParse = JSON.parse(getAttribute)

#### 関連するAPI

- plugins/非表示/FieldHidden/contents/js/desktop.js:19: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/非表示/FieldHidden/contents/js/desktop.js:165: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: `document.querySelector` の結果がnullでも `hasAttribute` を呼ぶ。
- コード上で確認済み: DOM取得結果のnullチェック不足が対象行周辺にある。

#### 影響範囲

- コード上で確認済み: 対象フィールドのDOMが存在しない、折りたたみ、削除、他プラグイン非表示などの条件で実行時エラーになる。
- 画面影響: app.record.create.show, app.record.detail.show, app.record.edit.show, app.record.index.show

#### 修正時の注意点

- `if (!fieldWrap2) return;` を追加し、関連属性の存在確認を行う。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
57:           }else{
58:             fieldWrap2 = document.querySelector(`.subtable-row-${target.id}`)
59:           }
60: 
61:         if(fieldWrap2.hasAttribute('dropdownplugin')){
62:           const getAttribute = fieldWrap2.getAttribute('dropdownplugin')
63:           const getAttributeParse = JSON.parse(getAttribute)
64:           const option = fieldWrap2.querySelector('.control-value-gaia span').textContent;
65:           const getAttributeTarget = getAttributeParse.find((x) => x.categoryName == option)
66:           getAttributeTarget.fields.forEach((split) => kintone.app.record.setFieldShown(split, true))
```

### BUG ID: BUG-012

#### 該当する可能性が高いファイル

- plugins/非表示/FieldHidden/contents/js/desktop.js

#### 該当する可能性が高い関数

- relatedFieldsGet（41行付近）

#### 関連するkintoneイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.index.show

#### 関連する設定値

- plugins/非表示/FieldHidden/contents/js/desktop.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/非表示/FieldHidden/contents/js/desktop.js:9: const select = JSON.parse(config.elementArray);
- plugins/非表示/FieldHidden/contents/js/desktop.js:63: const getAttributeParse = JSON.parse(getAttribute)
- plugins/非表示/FieldHidden/contents/js/desktop.js:70: const getAttributeParse = JSON.parse(getAttribute)

#### 関連するAPI

- plugins/非表示/FieldHidden/contents/js/desktop.js:19: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/非表示/FieldHidden/contents/js/desktop.js:165: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: `find()` の戻り値を確認せず `getAttributeTarget.fields` を参照している。

#### 影響範囲

- コード上で確認済み: ドロップダウン/ラジオ連動属性の選択肢名が一致しない場合に画面表示処理が停止する。
- 画面影響: app.record.create.show, app.record.detail.show, app.record.edit.show, app.record.index.show

#### 修正時の注意点

- `getAttributeTarget` と `fields` の存在確認を追加する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
62:           const getAttribute = fieldWrap2.getAttribute('dropdownplugin')
63:           const getAttributeParse = JSON.parse(getAttribute)
64:           const option = fieldWrap2.querySelector('.control-value-gaia span').textContent;
65:           const getAttributeTarget = getAttributeParse.find((x) => x.categoryName == option)
66:           getAttributeTarget.fields.forEach((split) => kintone.app.record.setFieldShown(split, true))
67:         }
68:         if(fieldWrap2.hasAttribute('radioButtonPlugin')){
69:           const getAttribute = fieldWrap2.getAttribute('radioButtonPlugin')
70:           const getAttributeParse = JSON.parse(getAttribute)
71:           const querySelector = kintone.app.record.getFieldElement(target.var)
```

### BUG ID: BUG-022

#### 該当する可能性が高いファイル

- plugins/非表示/FieldHidden/contents/js/desktop.js
- plugins/非表示/FieldHidden/contents/js/mobile.js（推測: 同種の設定読込がある場合の確認対象）

#### 該当する可能性が高い関数

- 無名イベントハンドラまたはトップレベル処理

#### 関連するkintoneイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.index.show

#### 関連する設定値

- plugins/非表示/FieldHidden/contents/js/desktop.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/非表示/FieldHidden/contents/js/desktop.js:9: const select = JSON.parse(config.elementArray);
- plugins/非表示/FieldHidden/contents/js/desktop.js:63: const getAttributeParse = JSON.parse(getAttribute)
- plugins/非表示/FieldHidden/contents/js/desktop.js:70: const getAttributeParse = JSON.parse(getAttribute)

#### 関連するAPI

- plugins/非表示/FieldHidden/contents/js/desktop.js:19: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/非表示/FieldHidden/contents/js/desktop.js:165: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: 設定値存在確認やtry/catchなしで `config.elementArray` をJSON.parseしている。
- コード上で確認済み: 設定値の存在確認またはtry/catch前にJSON.parseが実行される可能性がある。

#### 影響範囲

- コード上で確認済み: 設定未保存、設定破損、旧設定形式の場合にプラグイン全体がロード時点で停止する。
- 画面影響: app.record.create.show, app.record.detail.show, app.record.edit.show, app.record.index.show

#### 修正時の注意点

- 設定存在チェックとJSON parse失敗時の安全なreturnを追加する。mobile.jsも同様確認。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
5: (async function ($, PLUGIN_ID) {
6:   'use strict';
7: 
8:   const config = kintone.plugin.app.getConfig(PLUGIN_ID);
9:   const select = JSON.parse(config.elementArray);
10: 
11:   kintone.events.on(
12:     ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'],
13: 
14:     async function (event) {
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
