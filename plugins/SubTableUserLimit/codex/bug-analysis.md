# SubTableUserLimit バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-028: No.1 2026-24-06 BUG-028 設定画面にデバッグログが残っている（重大度: Low、対象: plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:426）

## 2. 解析対象ファイル一覧

- plugins/SubTableUserLimit/BUG.md
- plugins/SubTableUserLimit/Manual.md
- plugins/SubTableUserLimit/SubTableUserLimit/PUBKEY
- plugins/SubTableUserLimit/SubTableUserLimit/SIGNATURE
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/51-modern-default.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/config.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/desktop.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/mobile.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/html/config.html
- plugins/SubTableUserLimit/SubTableUserLimit/contents/image/icon.png
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/certification.js
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js
- plugins/SubTableUserLimit/SubTableUserLimit/contents/manifest.json
- plugins/SubTableUserLimit/SubTableUserLimite/PUBKEY
- plugins/SubTableUserLimit/SubTableUserLimite/SIGNATURE
- plugins/SubTableUserLimit/SubTableUserLimite/contents/css/51-modern-default.css
- plugins/SubTableUserLimit/SubTableUserLimite/contents/css/config.css
- plugins/SubTableUserLimit/SubTableUserLimite/contents/css/desktop.css
- plugins/SubTableUserLimit/SubTableUserLimite/contents/css/mobile.css
- plugins/SubTableUserLimit/SubTableUserLimite/contents/html/config.html
- plugins/SubTableUserLimit/SubTableUserLimite/contents/image/icon.png
- plugins/SubTableUserLimit/SubTableUserLimite/contents/js/certification.js.obfuscated.js
- plugins/SubTableUserLimit/SubTableUserLimite/contents/js/config.js.obfuscated.js
- plugins/SubTableUserLimit/SubTableUserLimite/contents/js/desktop.js.obfuscated.js
- plugins/SubTableUserLimit/SubTableUserLimite/contents/js/mobile.js.obfuscated.js
- plugins/SubTableUserLimit/SubTableUserLimite/contents/manifest.json
- plugins/SubTableUserLimit/codex/handover-2026-06-23.md
- plugins/SubTableUserLimit/codex/next-tasks.md
- plugins/SubTableUserLimit/codex/test-plan.md
- plugins/SubTableUserLimit/codex/troubleshooting.md
- plugins/SubTableUserLimit/codex/work-instructions.md
- plugins/SubTableUserLimit/decisions/README.md
- plugins/SubTableUserLimit/specification.md

## 3. manifest.json解析

- ファイル: plugins/SubTableUserLimit/SubTableUserLimit/contents/manifest.json
- name: サブテーブル内ユーザー選択人数制限プラグイン
- version: 2.0.4
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/SubTableUserLimit/SubTableUserLimit
- 難読化版場所: plugins/SubTableUserLimit/SubTableUserLimite（参考扱い）
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js: events=0, api=0, dom=0, config=8, subtable=4, console=1
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js: events=6, api=0, dom=0, config=4, subtable=12, console=1
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js: events=6, api=0, dom=0, config=4, subtable=12, console=1

## 5. HTML解析

- plugins/SubTableUserLimit/SubTableUserLimit/contents/html/config.html

## 6. CSS解析

- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/51-modern-default.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/config.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/desktop.css
- plugins/SubTableUserLimit/SubTableUserLimit/contents/css/mobile.css

## 7. 設定値解析

- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:16: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:76: config.table = JSON.parse(config.table);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:90: config.field = JSON.parse(config.field);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:91: config.limitNumber = JSON.parse(config.limitNumber);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:475: value.table = JSON.stringify(value.table);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:476: value.field = JSON.stringify(value.field);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:477: value.limitNumber = JSON.stringify(value.limitNumber);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:479: kintone.plugin.app.setConfig(value);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:15: config.table = JSON.parse(config.table);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:16: config.field = JSON.parse(config.field);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:17: config.limitNumber = JSON.parse(config.limitNumber);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:12: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:15: config.table = JSON.parse(config.table);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:16: config.field = JSON.parse(config.field);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:17: config.limitNumber = JSON.parse(config.limitNumber);

## 8. kintoneイベント解析

- app.record.create.change.
- app.record.create.submit
- app.record.edit.change.
- app.record.edit.submit
- app.record.index.edit.change.
- app.record.index.show
- mobile.app.record.create.change.
- mobile.app.record.create.submit
- mobile.app.record.edit.change.
- mobile.app.record.edit.submit
- mobile.app.record.index.edit.change.
- mobile.app.record.index.show

## 9. kintone REST API解析

- 該当処理は確認できなかった

## 10. DOM操作解析

- 該当処理は確認できなかった

## 11. サブテーブル関連解析

- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:73: const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:162: const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:165: array.push($(this).find('.field-select').val().split('　')[1]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:175: if (currentValue && currentValue !== 'none') c = currentValue.split('　')[1];
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:36: record[config.table[i]].value.forEach((row) => {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:38: if (row.value[config.field[i].split('　')[1]].value.length > config.limitNumber[i]) {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:39: row.value[config.field[i].split('　')[1]].error = `ユーザーは${config.limitNumber[i]}人しか選択できません。`;
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:41: row.value[config.field[i].split('　')[1]].error = null;
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:57: record[config.table[i]].value.forEach((row) => {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:59: if (row.value[config.field[i].split('　')[1]].value.length > config.limitNumber[i]) {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:60: row.value[config.field[i].split('　')[1]].error = `ユーザーは${config.limitNumber[i]}人しか選択できません。`;
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:73: const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:87: const fieldCode = config.field[i].split('　')[1];
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:132: events.push('app.record.edit.change.' + config.field[i].split('　')[1]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:133: events.push('app.record.create.change.' + config.field[i].split('　')[1]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/desktop.js:134: events.push('app.record.index.edit.change.' + config.field[i].split('　')[1]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:36: record[config.table[i]].value.forEach((row) => {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:38: if (row.value[config.field[i].split('　')[1]].value.length > config.limitNumber[i]) {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:39: row.value[config.field[i].split('　')[1]].error = `ユーザーは${config.limitNumber[i]}人しか選択できません。`;
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:41: row.value[config.field[i].split('　')[1]].error = null;
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:58: record[config.table[i]].value.forEach((row) => {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:60: if (row.value[config.field[i].split('　')[1]].value.length > config.limitNumber[i]) {
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:61: row.value[config.field[i].split('　')[1]].error = `ユーザーは${config.limitNumber[i]}人しか選択できません。`;
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:74: const tableFieldList = Object.values(cybozu.data.page.FORM_DATA.schema.subTable);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:88: const fieldCode = config.field[i].split('　')[1];
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:133: events.push('mobile.app.record.edit.change.' + config.field[i].split('　')[1]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:134: events.push('mobile.app.record.create.change.' + config.field[i].split('　')[1]);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/mobile.js:135: events.push('mobile.app.record.index.edit.change.' + config.field[i].split('　')[1]);

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-028

#### 該当する可能性が高いファイル

- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js

#### 該当する可能性が高い関数

- limit.numberFieldValueCheck（423行付近）

#### 関連するkintoneイベント

- 該当処理は確認できなかった

#### 関連する設定値

- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:16: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:76: config.table = JSON.parse(config.table);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:90: config.field = JSON.parse(config.field);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:91: config.limitNumber = JSON.parse(config.limitNumber);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:475: value.table = JSON.stringify(value.table);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:476: value.field = JSON.stringify(value.field);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:477: value.limitNumber = JSON.stringify(value.limitNumber);
- plugins/SubTableUserLimit/SubTableUserLimit/contents/js/config.js:479: kintone.plugin.app.setConfig(value);

#### 関連するAPI

- 対象ファイル内のREST API処理は確認できなかった

#### 原因候補

- コード上で確認済み: 設定画面にデバッグ用と思われるログが残っている。

#### 影響範囲

- コード上で確認済み: 機能影響は小さいが、運用時のコンソールノイズになる。
- 画面影響: 未確認

#### 修正時の注意点

- 修正フェーズで削除する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
422: 
423:   limit.numberFieldValueCheck = function (){
424:     const that = this;
425:     $(document).on('blur', "[id ^='limitNumber']", function() {
426:       console.log("エラー")
427:       const reg = /^[1-9][0-9]*$/;
428:       if($(this).val() && !reg.test($(this).val())){$(this).val("1");that.displayAlert('エラー', '１以上の整数を入力してください。', 'error', 'OK');}
429:     })
430:   }
431: 
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
