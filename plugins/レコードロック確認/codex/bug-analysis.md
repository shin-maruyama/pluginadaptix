# RecordRockb バグ関連性解析

作業日: 2026-06-26

前提: `bug-management-list.csv` はワークスペース内で未確認のため、既存 `BUG.md` のバグ情報を起点に解析しました。
コード変更は行っていません。難読化済みファイルは参考扱いとし、修正候補は元ソース側に限定します。

## 1. 解析対象バグ一覧

- BUG-025: No.1 2026-24-06 BUG-025 ブラウザ終了/戻る操作時にロック解除されない可能性がある（重大度: Medium、対象: plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:68）

## 2. 解析対象ファイル一覧

- plugins/レコードロック確認/BUG.md
- plugins/レコードロック確認/Manual.md
- plugins/レコードロック確認/RecordRockb/PUBKEY
- plugins/レコードロック確認/RecordRockb/SIGNATURE
- plugins/レコードロック確認/RecordRockb/contents/css/51-modern-default.css
- plugins/レコードロック確認/RecordRockb/contents/css/config.css
- plugins/レコードロック確認/RecordRockb/contents/css/desktop.css
- plugins/レコードロック確認/RecordRockb/contents/css/mobile.css
- plugins/レコードロック確認/RecordRockb/contents/html/config.html
- plugins/レコードロック確認/RecordRockb/contents/image/icon.png
- plugins/レコードロック確認/RecordRockb/contents/js/certification.js
- plugins/レコードロック確認/RecordRockb/contents/js/config.js
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js
- plugins/レコードロック確認/RecordRockb/contents/manifest.json
- plugins/レコードロック確認/RecordRockbe/PUBKEY
- plugins/レコードロック確認/RecordRockbe/SIGNATURE
- plugins/レコードロック確認/RecordRockbe/contents/css/51-modern-default.css
- plugins/レコードロック確認/RecordRockbe/contents/css/config.css
- plugins/レコードロック確認/RecordRockbe/contents/css/desktop.css
- plugins/レコードロック確認/RecordRockbe/contents/css/mobile.css
- plugins/レコードロック確認/RecordRockbe/contents/html/config.html
- plugins/レコードロック確認/RecordRockbe/contents/image/icon.png
- plugins/レコードロック確認/RecordRockbe/contents/js/certification.js.obfuscated.js
- plugins/レコードロック確認/RecordRockbe/contents/js/config.js.obfuscated.js
- plugins/レコードロック確認/RecordRockbe/contents/js/desktop.js.obfuscated.js
- plugins/レコードロック確認/RecordRockbe/contents/js/mobile.js.obfuscated.js
- plugins/レコードロック確認/RecordRockbe/contents/manifest.json
- plugins/レコードロック確認/codex/handover-2026-06-23.md
- plugins/レコードロック確認/codex/next-tasks.md
- plugins/レコードロック確認/codex/test-plan.md
- plugins/レコードロック確認/codex/troubleshooting.md
- plugins/レコードロック確認/codex/work-instructions.md
- plugins/レコードロック確認/decisions/README.md
- plugins/レコードロック確認/specification.md

## 3. manifest.json解析

- ファイル: plugins/レコードロック確認/RecordRockb/contents/manifest.json
- name: レコードロック確認プラグイン_テスト
- version: 2.0.2
- desktop.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/desktop.js
- mobile.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/mobile.js
- config.js: https://js.cybozu.com/jquery/3.3.1/jquery.min.js, https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.js, js/certification.js, js/config.js
- desktop.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/51-modern-default.css, css/desktop.css
- mobile.css: https://js.cybozu.com/sweetalert2/v11.6.14/sweetalert2.min.css, css/mobile.css
- icon: image/icon.png

## 4. JavaScript解析

- 元ソースJS: 4件
- 元ソース場所: plugins/レコードロック確認/RecordRockb
- 難読化版場所: plugins/レコードロック確認/RecordRockbe（参考扱い）
- plugins/レコードロック確認/RecordRockb/contents/js/certification.js: events=0, api=0, dom=0, config=1, subtable=0, console=0
- plugins/レコードロック確認/RecordRockb/contents/js/config.js: events=0, api=1, dom=0, config=2, subtable=0, console=1
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js: events=6, api=4, dom=1, config=1, subtable=1, console=1
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js: events=6, api=4, dom=1, config=1, subtable=1, console=1

## 5. HTML解析

- plugins/レコードロック確認/RecordRockb/contents/html/config.html

## 6. CSS解析

- plugins/レコードロック確認/RecordRockb/contents/css/51-modern-default.css
- plugins/レコードロック確認/RecordRockb/contents/css/config.css
- plugins/レコードロック確認/RecordRockb/contents/css/desktop.css
- plugins/レコードロック確認/RecordRockb/contents/css/mobile.css

## 7. 設定値解析

- plugins/レコードロック確認/RecordRockb/contents/js/certification.js:15: const { status, message } = JSON.parse(resp[0]);
- plugins/レコードロック確認/RecordRockb/contents/js/config.js:11: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/レコードロック確認/RecordRockb/contents/js/config.js:111: kintone.plugin.app.setConfig(value);
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:6: const config = kintone.plugin.app.getConfig(PLUGIN_ID);

## 8. kintoneイベント解析

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.edit.submit
- app.record.index.show
- mobile.app.record.create.show
- mobile.app.record.detail.show
- mobile.app.record.edit.show
- mobile.app.record.edit.submit
- mobile.app.record.index.show

## 9. kintone REST API解析

- plugins/レコードロック確認/RecordRockb/contents/js/config.js:79: return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields.json', true), 'POST', body);
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:36: const r = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', { app: e.appId, id: e.recordId });
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:59: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body).then(function () {
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:78: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:89: const fieldList = await kintone.api(
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:36: const r = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', {
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:62: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body).then(function () {
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:81: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:93: const fieldList = await kintone.api(

## 10. DOM操作解析

- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:29: kintone.app.record.setFieldShown(config.fieldCode, false);
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:29: kintone.mobile.app.record.setFieldShown(config.fieldCode, false);

## 11. サブテーブル関連解析

- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:39: if (r.record[config.fieldCode].value.length) {
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:42: if (r.record[config.fieldCode].value.length) {

## 12. 添付ファイル関連解析


## 13. 権限関連解析

- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:32: const { code, name } = kintone.getLoginUser();
- plugins/レコードロック確認/RecordRockb/contents/js/mobile.js:32: const { code, name } = kintone.getLoginUser();

## 14. 各バグとの関連性

### BUG ID: BUG-025

#### 該当する可能性が高いファイル

- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js

#### 該当する可能性が高い関数

- recordLock.eventStart（20行付近）

#### 関連するkintoneイベント

- app.record.create.show
- app.record.detail.show
- app.record.edit.show
- app.record.edit.submit
- app.record.index.show

#### 関連する設定値

- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:8: const config = kintone.plugin.app.getConfig(PLUGIN_ID);

#### 関連するAPI

- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:36: const r = await kintone.api(kintone.api.url('/k/v1/record.json', true), 'GET', { app: e.appId, id: e.recordId });
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:59: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body).then(function () {
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:78: await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);
- plugins/レコードロック確認/RecordRockb/contents/js/desktop.js:89: const fieldList = await kintone.api(

#### 原因候補

- コード上で確認済み: ロック解除はキャンセルボタン押下と編集保存時が中心で、ブラウザ終了、タブクローズ、通信失敗時の解除保証が見えない。
- 推測: cancelクリック以外の画面離脱では解除APIが呼ばれない可能性がある。

#### 影響範囲

- コード上で確認済み: ロック用ユーザー選択フィールドに値が残り、他ユーザーが編集できない状態になる可能性がある。
- 画面影響: app.record.create.show, app.record.detail.show, app.record.edit.show, app.record.edit.submit, app.record.index.show

#### 修正時の注意点

- 仕様として許容するか、人間判断が必要。解除期限や強制解除運用を検討する。
- 修正時は元ソースのみを対象にし、難読化済みファイルは生成物として扱う。
- 修正後はPC/モバイル、設定保存、権限、サブテーブル、添付ファイルへの影響を必要範囲で確認する。

#### 対象行周辺

```javascript
64: 
65:       }
66: 
67:       //[キャンセルボタンクリック時にレコード編集者フィールドの値リセット]
68:       $('.gaia-ui-actionmenu-cancel').on('click', async function () {
69:         const body = {
70:           app: e.appId,
71:           id: e.recordId,
72:           record: {
73:             [config.fieldCode]: {
```

## 15. 未確認事項

- `bug-management-list.csv` はワークスペース内で未確認。
- kintone実機、Playwright、REST APIの実行確認は未実施。
- 難読化済みファイルは存在確認のみで、内容解析は参考扱い。
- 実際の修正は未実施。
