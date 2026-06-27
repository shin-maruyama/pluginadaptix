# DoubleCheck バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-003: No.1 2026-24-06 BUG-003 モバイル編集保存時に自レコード除外判定が効かない（重大度: High、対象: plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:81）

## 2. 解析対象ファイル一覧

- plugins/DoubleCheck/BUG.md
- plugins/DoubleCheck/DoubleCheck/PUBKEY
- plugins/DoubleCheck/DoubleCheck/SIGNATURE
- plugins/DoubleCheck/DoubleCheck/contents/css/51-modern-default.css
- plugins/DoubleCheck/DoubleCheck/contents/css/config.css
- plugins/DoubleCheck/DoubleCheck/contents/css/desktop.css
- plugins/DoubleCheck/DoubleCheck/contents/css/mobile.css
- plugins/DoubleCheck/DoubleCheck/contents/html/config.html
- plugins/DoubleCheck/DoubleCheck/contents/image/icon.png
- plugins/DoubleCheck/DoubleCheck/contents/js/certification.js
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js
- plugins/DoubleCheck/DoubleCheck/contents/manifest.json
- plugins/DoubleCheck/DoubleChecke/PUBKEY
- plugins/DoubleCheck/DoubleChecke/SIGNATURE
- plugins/DoubleCheck/DoubleChecke/contents/css/51-modern-default.css
- plugins/DoubleCheck/DoubleChecke/contents/css/config.css
- plugins/DoubleCheck/DoubleChecke/contents/css/desktop.css
- plugins/DoubleCheck/DoubleChecke/contents/css/mobile.css
- plugins/DoubleCheck/DoubleChecke/contents/html/config.html
- plugins/DoubleCheck/DoubleChecke/contents/image/icon.png
- plugins/DoubleCheck/DoubleChecke/contents/js/certification.js.obfuscated.js
- plugins/DoubleCheck/DoubleChecke/contents/js/config.js.obfuscated.js
- plugins/DoubleCheck/DoubleChecke/contents/js/desktop.js.obfuscated.js
- plugins/DoubleCheck/DoubleChecke/contents/js/mobile.js.obfuscated.js
- plugins/DoubleCheck/DoubleChecke/contents/manifest.json
- plugins/DoubleCheck/Manual.md
- plugins/DoubleCheck/codex/handover-2026-06-23.md
- plugins/DoubleCheck/codex/next-tasks.md
- plugins/DoubleCheck/codex/test-plan.md
- plugins/DoubleCheck/codex/troubleshooting.md
- plugins/DoubleCheck/codex/work-instructions.md
- plugins/DoubleCheck/decisions/README.md
- plugins/DoubleCheck/specification.md

## 3. manifest.json解析

- ファイル: plugins/DoubleCheck/DoubleCheck/contents/manifest.json
- name: フィールド重複チェックプラグイン
- version: 2.0.7
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/DoubleCheck/DoubleCheck
- 難読化版場所: plugins/DoubleCheck/DoubleChecke（参考扱い）
- plugins/DoubleCheck/DoubleCheck/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js: events=0, api=1, dom=0, config=6, subtable=4, console=1
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js: events=3, api=3, dom=0, config=3, subtable=4, console=2
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js: events=4, api=3, dom=0, config=3, subtable=4, console=2

## 5. HTML解析

- plugins/DoubleCheck/DoubleCheck/contents/html/config.html

## 6. CSS解析

- plugins/DoubleCheck/DoubleCheck/contents/css/51-modern-default.css
- plugins/DoubleCheck/DoubleCheck/contents/css/config.css
- plugins/DoubleCheck/DoubleCheck/contents/css/desktop.css
- plugins/DoubleCheck/DoubleCheck/contents/css/mobile.css

## 7. 設定値解析

- plugins/DoubleCheck/DoubleCheck/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:15: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:94: config.field = JSON.parse(config.field);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:95: config.condition = JSON.parse(config.condition);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:494: value.field = JSON.stringify(value.field);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:495: value.condition = JSON.stringify(value.condition);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:497: kintone.plugin.app.setConfig(value);
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:15: config.field = JSON.parse(config.field);
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:16: config.condition = JSON.parse(config.condition);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:15: config.field = JSON.parse(config.field);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:16: config.condition = JSON.parse(config.condition);

## 8. kintoneイベント解析

- app.record.create.submit
- app.record.edit.submit
- app.record.index.show
- mobile.app.record.create.submit
- mobile.app.record.edit.submit
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:123: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:51: const cursor = await kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'POST', body);
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:56: const resp = await kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'GET', { id: cursor.id });
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:236: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:51: const cursor = await kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'POST', body);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:56: const resp = await kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'GET', { id: cursor.id });
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:236: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

## 10. DOM操作解析

- 該当処理は確認できなかった

## 11. サブテーブル関連解析

- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:128: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:135: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:142: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/DoubleCheck/DoubleCheck/contents/js/config.js:183: } else if (row.type === 'SUBTABLE') {
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:241: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:248: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:255: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/DoubleCheck/DoubleCheck/contents/js/desktop.js:277: } else if (row.type === 'SUBTABLE') {
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:241: else if (row.type === 'SUBTABLE') fieldList.push(row);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:248: fieldList2 = [...fieldList2, ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable)];
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:255: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:277: } else if (row.type === 'SUBTABLE') {

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-003

#### 該当する可能性が高いファイル

- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js

#### 該当する可能性が高い関数

- obj.eventStart（30行付近）

#### 関連するkintoneイベント

- app.record.edit.submit
- mobile.app.record.create.submit
- mobile.app.record.edit.submit
- mobile.app.record.index.show

#### 関連する設定値

- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:15: config.field = JSON.parse(config.field);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:16: config.condition = JSON.parse(config.condition);

#### 関連するAPI

- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:51: const cursor = await kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'POST', body);
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:56: const resp = await kintone.api(kintone.api.url('/k/v1/records/cursor', true), 'GET', { id: cursor.id });
- plugins/DoubleCheck/DoubleCheck/contents/js/mobile.js:236: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: mobile submitイベント内でdesktopイベント名 `app.record.edit.submit` を比較している。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。

#### 影響範囲

- コード上で確認済み: モバイル編集時、自レコードが重複チェック対象から除外されず、既存値のまま保存しても重複エラーになる可能性がある。
- 画面影響: app.record.edit.submit, mobile.app.record.create.submit, mobile.app.record.edit.submit, mobile.app.record.index.show

#### 修正時の注意点

- `mobile.app.record.edit.submit` を判定する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
77:           let str = [];
78:           let recordStr = [];
79:           //if (item.$id.value !== record.$id.value) {
80:           //debugger;
81:           if (event.type === 'app.record.edit.submit') {
82:             if (item.$id.value === record.$id.value) {
83:               continue;
84:             }
85:           }
86: 
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
