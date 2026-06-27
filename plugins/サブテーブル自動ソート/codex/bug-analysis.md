# SubTableAutosorte バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-008: No.1 2026-24-06 BUG-008 mobile.jsの保存後ソート処理でdesktop APIのgetIdを使用している（重大度: High、対象: plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:184）

## 2. 解析対象ファイル一覧

- plugins/サブテーブル自動ソート/BUG.md
- plugins/サブテーブル自動ソート/Manual.md
- plugins/サブテーブル自動ソート/SubTableAutosort/PUBKEY
- plugins/サブテーブル自動ソート/SubTableAutosort/SIGNATURE
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/51-modern-default.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/config.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/desktop.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/mobile.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/html/config.html
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/image/icon.png
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/certification.js
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/manifest.json
- plugins/サブテーブル自動ソート/SubTableAutosorte/PUBKEY
- plugins/サブテーブル自動ソート/SubTableAutosorte/SIGNATURE
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/css/51-modern-default.css
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/css/config.css
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/css/desktop.css
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/css/mobile.css
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/html/config.html
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/image/icon.png
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/js/certification.js.obfuscated.js
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/js/config.js.obfuscated.js
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/js/desktop.js.obfuscated.js
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/js/mobile.js.obfuscated.js
- plugins/サブテーブル自動ソート/SubTableAutosorte/contents/manifest.json
- plugins/サブテーブル自動ソート/codex/handover-2026-06-23.md
- plugins/サブテーブル自動ソート/codex/next-tasks.md
- plugins/サブテーブル自動ソート/codex/test-plan.md
- plugins/サブテーブル自動ソート/codex/troubleshooting.md
- plugins/サブテーブル自動ソート/codex/work-instructions.md
- plugins/サブテーブル自動ソート/decisions/README.md
- plugins/サブテーブル自動ソート/specification.md

## 3. manifest.json解析

- ファイル: plugins/サブテーブル自動ソート/SubTableAutosort/contents/manifest.json
- name: サブテーブル自動ソートプラグイン
- version: 2.0.0
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/jqueryui/1.13.1/jquery-ui.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.min.js, https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/i18n/ja.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/サブテーブル自動ソート/SubTableAutosort
- 難読化版場所: plugins/サブテーブル自動ソート/SubTableAutosorte（参考扱い）
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js: events=0, api=2, dom=0, config=4, subtable=1, console=1
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js: events=5, api=4, dom=0, config=2, subtable=2, console=2
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js: events=4, api=4, dom=0, config=2, subtable=2, console=2

## 5. HTML解析

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/html/config.html

## 6. CSS解析

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/51-modern-default.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/config.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/desktop.css
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/css/mobile.css

## 7. 設定値解析

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:12: var config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:78: _config.conf = JSON.parse(_config.conf);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:381: conf: JSON.stringify(value),
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:384: kintone.plugin.app.setConfig(setConfig);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:59: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:61: try { return JSON.parse(config.conf) || []; } catch { return []; }
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:56: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:58: try { return JSON.parse(config.conf) || []; } catch { return []; }

## 8. kintoneイベント解析

- app.record.create.submit.success
- app.record.detail.show
- app.record.edit.submit.success
- app.record.getId
- app.record.index.show
- mobile.app.record.create.submit.success
- mobile.app.record.detail.show
- mobile.app.record.edit.submit.success
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:48: self.fieldList = await kintone.api(kintone.api.url('/k/v1/form', true), 'GET', body);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:49: self.data2 = await kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', body);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:21: __FIELDS_DEF_CACHE = await kintone.api(
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:72: fieldsDef = await kintone.api(
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:204: const res = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', {
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:244: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:21: __FIELDS_DEF_CACHE = await kintone.api(
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:73: fieldsDef = await kintone.api(
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:202: const res = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', {
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:240: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {

## 10. DOM操作解析

- 該当処理は確認できなかった

## 11. サブテーブル関連解析

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:16: sortCon.fieldType = 'SUBTABLE';
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:49: Object.keys(row.value || {}).forEach((code) => {
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:51: newRow.value[code] = row.value[code];
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:46: Object.keys(row.value || {}).forEach((code) => {
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:48: newRow.value[code] = row.value[code];

## 12. 添付ファイル関連解析

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/config.js:523: const targetFieldTypes = ['SINGLE_LINE_TEXT', 'NUMBER', 'DATE', 'TIME', 'DATETIME', 'DROP_DOWN', 'CHECK_BOX', 'FILE'];//選択肢にするフィールドタイプ(文字列１行、数値、日付、時刻、日時、添付ファイル)
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/desktop.js:128: // FILE / CHECK_BOX など配列になる値の比較不能回避

## 13. 権限関連解析

- 該当処理は確認できなかった

## 14. 各バグとの関連性

### BUG ID: BUG-008

#### 該当する可能性が高いファイル

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js

#### 該当する可能性が高い関数

- applySortByPut（183行付近）

#### 関連するkintoneイベント

- mobile.app.record.create.submit.success
- mobile.app.record.detail.show
- mobile.app.record.edit.submit.success
- mobile.app.record.index.show

#### 関連する設定値

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:56: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:58: try { return JSON.parse(config.conf) || []; } catch { return []; }

#### 関連するAPI

- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:21: __FIELDS_DEF_CACHE = await kintone.api(
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:73: fieldsDef = await kintone.api(
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:202: const res = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', {
- plugins/サブテーブル自動ソート/SubTableAutosort/contents/js/mobile.js:240: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {

#### 原因候補

- コード上で確認済み: mobile.jsの保存成功・詳細表示・PUTソート処理で `kintone.app.getId()` を使用している。
- コード上で確認済み: mobile.js 内に desktop 用APIまたは desktop イベント名の利用候補がある。

#### 影響範囲

- コード上で確認済み: モバイル保存後のサブテーブル自動ソートが失敗する可能性がある。
- 画面影響: mobile.app.record.create.submit.success, mobile.app.record.detail.show, mobile.app.record.edit.submit.success, mobile.app.record.index.show

#### 修正時の注意点

- mobile用のappId取得関数を共通化し、全箇所で利用する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
180:     location.replace(`${location.origin}/k/m/${appId}/show?__autosort=${bust}#record=${recordId}`);
181:   }
182: 
183:   async function applySortByPut(recordId) {
184:     const appId = kintone.app.getId();
185:     const lockKey = RUNKEY(appId, recordId);
186: 
187:     const now = Date.now();
188:     const lockVal = sessionStorage.getItem(lockKey);
189:     if (lockVal && (now - Number(lockVal) < REENTRY_BLOCK_MS)) return;
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
