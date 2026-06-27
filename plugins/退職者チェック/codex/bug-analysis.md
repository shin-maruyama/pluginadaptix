# RetirementConversion バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-014: No.1 2026-24-06 BUG-014 ユーザー一覧100件超過時の再帰呼び出しが未定義関数になっている（重大度: High、対象: plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:183）
- BUG-019: No.2 2026-24-06 BUG-019 空のサブテーブルで存在チェックがTypeErrorになる（重大度: High、対象: plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:151）

## 2. 解析対象ファイル一覧

- plugins/退職者チェック/BUG.md
- plugins/退職者チェック/Manual.md
- plugins/退職者チェック/RetirementConversion/PUBKEY
- plugins/退職者チェック/RetirementConversion/SIGNATURE
- plugins/退職者チェック/RetirementConversion/contents/css/51-modern-default.css
- plugins/退職者チェック/RetirementConversion/contents/css/config.css
- plugins/退職者チェック/RetirementConversion/contents/css/desktop.css
- plugins/退職者チェック/RetirementConversion/contents/css/mobile.css
- plugins/退職者チェック/RetirementConversion/contents/html/config.html
- plugins/退職者チェック/RetirementConversion/contents/image/icon.png
- plugins/退職者チェック/RetirementConversion/contents/js/certification.js
- plugins/退職者チェック/RetirementConversion/contents/js/config.js
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js
- plugins/退職者チェック/RetirementConversion/contents/manifest.json
- plugins/退職者チェック/RetirementConversione/PUBKEY
- plugins/退職者チェック/RetirementConversione/SIGNATURE
- plugins/退職者チェック/RetirementConversione/contents/css/51-modern-default.css
- plugins/退職者チェック/RetirementConversione/contents/css/config.css
- plugins/退職者チェック/RetirementConversione/contents/css/desktop.css
- plugins/退職者チェック/RetirementConversione/contents/css/mobile.css
- plugins/退職者チェック/RetirementConversione/contents/html/config.html
- plugins/退職者チェック/RetirementConversione/contents/image/icon.png
- plugins/退職者チェック/RetirementConversione/contents/js/certification.js.obfuscated.js
- plugins/退職者チェック/RetirementConversione/contents/js/config.js.obfuscated.js
- plugins/退職者チェック/RetirementConversione/contents/js/desktop.js.obfuscated.js
- plugins/退職者チェック/RetirementConversione/contents/js/mobile.js.obfuscated.js
- plugins/退職者チェック/RetirementConversione/contents/manifest.json
- plugins/退職者チェック/codex/handover-2026-06-23.md
- plugins/退職者チェック/codex/next-tasks.md
- plugins/退職者チェック/codex/test-plan.md
- plugins/退職者チェック/codex/troubleshooting.md
- plugins/退職者チェック/codex/work-instructions.md
- plugins/退職者チェック/decisions/README.md
- plugins/退職者チェック/specification.md

## 3. manifest.json解析

- ファイル: plugins/退職者チェック/RetirementConversion/contents/manifest.json
- name: 退職者チェックプラグイン
- version: 1.0.5
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/退職者チェック/RetirementConversion
- 難読化版場所: plugins/退職者チェック/RetirementConversione（参考扱い）
- plugins/退職者チェック/RetirementConversion/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/退職者チェック/RetirementConversion/contents/js/config.js: events=0, api=1, dom=0, config=4, subtable=6, console=0
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js: events=1, api=3, dom=3, config=2, subtable=17, console=0
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js: events=1, api=3, dom=2, config=2, subtable=17, console=0

## 5. HTML解析

- plugins/退職者チェック/RetirementConversion/contents/html/config.html

## 6. CSS解析

- plugins/退職者チェック/RetirementConversion/contents/css/51-modern-default.css
- plugins/退職者チェック/RetirementConversion/contents/css/config.css
- plugins/退職者チェック/RetirementConversion/contents/css/desktop.css
- plugins/退職者チェック/RetirementConversion/contents/css/mobile.css

## 7. 設定値解析

- plugins/退職者チェック/RetirementConversion/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:17: config: kintone.plugin.app.getConfig(PLUGIN_ID),
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:78: config.settings = JSON.parse(config.settings);
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:457: value.settings = JSON.stringify(value.settings);
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:459: kintone.plugin.app.setConfig(value);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:15: config.settings = JSON.parse(config.settings);
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:15: config.settings = JSON.parse(config.settings);

## 8. kintoneイベント解析

- app.record.index.show
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/退職者チェック/RetirementConversion/contents/js/config.js:222: resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:126: await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:180: const resp = await kintone.api(kintone.api.url('/v1/users.json'), 'GET', { offset });
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:256: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:126: await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:180: const resp = await kintone.api(kintone.api.url('/v1/users.json'), 'GET', { offset });
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:256: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

## 10. DOM操作解析

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:28: const button = document.createElement('button');
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:33: if (!document.getElementById('user_update_button')) {
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:34: var space = kintone.app.getHeaderMenuSpaceElement();
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:28: const button = document.createElement('button');
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:33: if (!document.getElementById('user_update_button')) {

## 11. サブテーブル関連解析

- plugins/退職者チェック/RetirementConversion/contents/js/config.js:207: * @param {boolean} subTable [サブテーブル内も取得する場合true しない場合false]
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:210: getFieldList: async function (subTable = false) {
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:214: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:230: else if (row.type === 'SUBTABLE') {
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:232: if (!subTable) return;
- plugins/退職者チェック/RetirementConversion/contents/js/config.js:269: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:60: const staffCode = setting.staffSelect.split('　').length === 1 ? setting.staffSelect : setting.staffSelect.split('　')[1];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:65: if (setting.userSelect.split('　').length === 1) {
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:78: const tableCode = setting.userSelect.split('　')[0];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:79: const userCode = setting.userSelect.split('　')[1];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:98: if (!record[tableCode].value || !record[tableCode].value.length) continue;
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:138: const isOutsideTheTable = setting.userSelect.split('　').length === 1;
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:145: const tableField = record[setting.userSelect.split('　')[0]];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:147: const field = record[setting.userSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:151: const field = tableField.value[0].value[setting.userSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:156: const isOutsideTheTable2 = setting.staffSelect.split('　').length === 1;
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:162: const tableField = record[setting.staffSelect.split('　')[0]];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:164: const field2 = record[setting.staffSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:168: const field2 = tableField.value[0].value[setting.staffSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:252: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:261: else if (row.type === 'SUBTABLE') {
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:263: //if (!subTable) return;
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:300: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:60: const staffCode = setting.staffSelect.split('　').length === 1 ? setting.staffSelect : setting.staffSelect.split('　')[1];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:65: if (setting.userSelect.split('　').length === 1) {
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:78: const tableCode = setting.userSelect.split('　')[0];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:79: const userCode = setting.userSelect.split('　')[1];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:98: if (!record[tableCode].value || !record[tableCode].value.length) continue;
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:138: const isOutsideTheTable = setting.userSelect.split('　').length === 1;
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:145: const tableField = record[setting.userSelect.split('　')[0]];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:147: const field = record[setting.userSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:151: const field = tableField.value[0].value[setting.userSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:156: const isOutsideTheTable2 = setting.staffSelect.split('　').length === 1;
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:162: const tableField = record[setting.staffSelect.split('　')[0]];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:164: const field2 = record[setting.staffSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:168: const field2 = tableField.value[0].value[setting.staffSelect.split('　')[1]];
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:252: ...Object.values(cybozu.data.page.FORM_DATA.schema.subTable),
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:261: else if (row.type === 'SUBTABLE') {
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:263: //if (!subTable) return;
- plugins/退職者チェック/RetirementConversion/contents/js/mobile.js:300: if (!(field.type === 'SUBTABLE' && field.id === target.id)) return;

## 12. 添付ファイル関連解析

- 該当処理は確認できなかった

## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-014

#### 該当する可能性が高いファイル

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js

#### 該当する可能性が高い関数

- total.getAllUsers（178行付近）

#### 関連するkintoneイベント

- app.record.index.show

#### 関連する設定値

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:15: config.settings = JSON.parse(config.settings);

#### 関連するAPI

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:126: await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:180: const resp = await kintone.api(kintone.api.url('/v1/users.json'), 'GET', { offset });
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:256: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: メソッド内で `getAllUsers` を直接呼んでいるが、関数スコープに定義されていない。
- コード上で確認済み: メソッド内再帰でオブジェクト修飾なしの関数名を呼び出している。

#### 影響範囲

- コード上で確認済み: ユーザー数が100件を超える環境で退職者チェックが途中で失敗する。
- 画面影響: app.record.index.show

#### 修正時の注意点

- `return total.getAllUsers(offset + 100, users);` のようにメソッド経由で呼ぶ。mobile.jsも同様確認。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
179:     try {
180:       const resp = await kintone.api(kintone.api.url('/v1/users.json'), 'GET', { offset });
181:       users = users.concat(resp.users);
182:       if (resp.users.length === 100) {
183:         return getAllUsers(offset + 100, users);
184:       }
185:     } catch { }
186: 
187:     return users;
188:   };
```

### BUG ID: BUG-019

#### 該当する可能性が高いファイル

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js

#### 該当する可能性が高い関数

- total.existenceCheck（137行付近）

#### 関連するkintoneイベント

- app.record.index.show

#### 関連する設定値

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:15: config.settings = JSON.parse(config.settings);

#### 関連するAPI

- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:126: await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:180: const resp = await kintone.api(kintone.api.url('/v1/users.json'), 'GET', { offset });
- plugins/退職者チェック/RetirementConversion/contents/js/desktop.js:256: const resp = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {

#### 原因候補

- コード上で確認済み: サブテーブルの先頭行 `value[0]` が存在する前提でユーザー選択フィールドを確認している。
- コード上で確認済み: サブテーブルの行存在確認前に value[0] を参照している。

#### 影響範囲

- コード上で確認済み: 空のサブテーブルを含む一覧で退職者チェック処理が落ちる可能性がある。
- 画面影響: app.record.index.show

#### 修正時の注意点

- 空行時の分岐を追加する。mobile.jsも同様確認。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
147:         const field = record[setting.userSelect.split('　')[1]];
148:         if (!field) return true;
149: 
150:       } else {
151:         const field = tableField.value[0].value[setting.userSelect.split('　')[1]];
152:         if (!field) return true;
153:       }
154:     }
155: 
156:     const isOutsideTheTable2 = setting.staffSelect.split('　').length === 1;
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
